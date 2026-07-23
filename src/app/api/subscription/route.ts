import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile lookup error:', profileError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ subscription: null });
    }

    // Get user's organization memberships
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', profile.id);

    if (!memberships?.length) {
      return NextResponse.json({ subscription: null });
    }

    // Get the best active subscription from user's organizations (prefer owned orgs)
    const orgIds = memberships.map((m) => m.organization_id);
    const ownedOrgIds = memberships.filter((m) => m.role === 'owner').map((m) => m.organization_id);

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*, organization:organizations(name, slug)')
      .in('organization_id', orgIds)
      .eq('status', 'active')
      .order('plan', { ascending: false }); // enterprise > team > pro > free

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subscriptionError);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    if (!subscriptions?.length) {
      return NextResponse.json({ subscription: null });
    }

    // Prefer subscription from owned organization, otherwise best plan
    const ownedSub = subscriptions.find((s) => ownedOrgIds.includes(s.organization_id));
    const subscription = ownedSub || subscriptions[0];

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
