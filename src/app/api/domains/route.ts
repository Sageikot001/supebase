import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlanLimits } from '@/lib/plans';
import crypto from 'crypto';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ domains: [], canAddDomains: false });
    }

    // Get user's organization memberships
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', profile.id);

    if (!memberships?.length) {
      return NextResponse.json({ domains: [], canAddDomains: false });
    }

    const orgIds = memberships.map((m) => m.organization_id);

    // Check subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, plan, status, expires_at')
      .in('organization_id', orgIds)
      .eq('status', 'active')
      .order('plan', { ascending: false })
      .limit(1)
      .single();

    const hasActiveSubscription = subscription &&
      new Date(subscription.expires_at) > new Date() &&
      subscription.plan !== 'free';

    // Get projects for user's organizations
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .in('organization_id', orgIds);

    const projectIds = projects?.map((p) => p.id) || [];

    if (projectIds.length === 0) {
      return NextResponse.json({ domains: [], canAddDomains: hasActiveSubscription });
    }

    const { data: domains, error } = await supabase
      .from('domains')
      .select(`
        *,
        project:projects (
          id,
          name
        )
      `)
      .in('project_id', projectIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching domains:', error);
      return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 });
    }

    return NextResponse.json({ domains, canAddDomains: hasActiveSubscription });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { domain, projectId, isPrimary } = body;

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Basic domain validation
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's organization memberships
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', profile.id);

    if (!memberships?.length) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 });
    }

    const orgIds = memberships.map((m) => m.organization_id);

    // Check for active paid subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, plan, status, expires_at')
      .in('organization_id', orgIds)
      .eq('status', 'active')
      .order('plan', { ascending: false })
      .limit(1)
      .single();

    if (!subscription || subscription.plan === 'free') {
      return NextResponse.json(
        { error: 'Paid subscription required to add custom domains' },
        { status: 403 }
      );
    }

    // Check if subscription is expired
    if (new Date(subscription.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Your subscription has expired. Please renew to add domains.' },
        { status: 403 }
      );
    }

    // Enforce the plan's custom domain limit
    const limits = getPlanLimits(subscription.plan);
    if (limits) {
      // Get projects for counting domains
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .in('organization_id', orgIds);

      const projectIds = projects?.map((p) => p.id) || [];

      if (projectIds.length > 0) {
        const { count: domainCount, error: countError } = await supabase
          .from('domains')
          .select('*', { count: 'exact', head: true })
          .in('project_id', projectIds);

        if (countError) {
          console.error('Error counting domains:', countError);
          return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
        }

        if ((domainCount || 0) >= limits.customDomains) {
          return NextResponse.json(
            { error: `Your plan allows up to ${limits.customDomains} custom domain${limits.customDomains > 1 ? 's' : ''}. Upgrade to add more.` },
            { status: 403 }
          );
        }
      }
    }

    // If project specified, verify ownership
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('id, organization_id')
        .eq('id', projectId)
        .in('organization_id', orgIds)
        .single();

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      // If setting as primary, unset other primary domains for this project
      if (isPrimary) {
        await supabase
          .from('domains')
          .update({ is_primary: false })
          .eq('project_id', projectId);
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const { data: newDomain, error } = await supabase
      .from('domains')
      .insert({
        project_id: projectId || null,
        domain: domain.toLowerCase(),
        is_primary: projectId ? (isPrimary || false) : false,
        verified: false,
        ssl_status: 'pending',
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Domain already exists' }, { status: 400 });
      }
      console.error('Error creating domain:', error);
      return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
    }

    return NextResponse.json({
      domain: newDomain,
      verification: {
        type: 'TXT',
        name: `_supebase-verification.${domain}`,
        value: verificationToken,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
