import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlanLimits } from '@/lib/plans';

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
      return NextResponse.json({
        projects: 0,
        databases: 0,
        storage: 0,
        authUsers: 0,
        plan: 'free',
        limits: getPlanLimits('free'),
        recentActivity: [],
      });
    }

    // Get user's organization memberships
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', profile.id);

    if (!memberships?.length) {
      return NextResponse.json({
        projects: 0,
        databases: 0,
        storage: 0,
        authUsers: 0,
        plan: 'free',
        limits: getPlanLimits('free'),
        recentActivity: [],
      });
    }

    const orgIds = memberships.map((m) => m.organization_id);

    // Execute queries in parallel
    const [projectResult, subscriptionResult] = await Promise.all([
      supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .in('organization_id', orgIds)
        .eq('status', 'active'),
      supabase
        .from('subscriptions')
        .select('plan, expires_at')
        .in('organization_id', orgIds)
        .eq('status', 'active')
        .order('plan', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    // Get project IDs for additional stats
    const projectIds = projectResult.data?.map((p) => p.id) || [];

    let databaseCount = 0;
    let storageSize = 0;
    let authUserCount = 0;

    if (projectIds.length > 0) {
      const [tablesResult, bucketsResult, authUsersResult] = await Promise.all([
        supabase
          .from('database_tables')
          .select('id', { count: 'exact', head: true })
          .in('project_id', projectIds),
        supabase
          .from('storage_buckets')
          .select('id', { count: 'exact', head: true })
          .in('project_id', projectIds),
        supabase
          .from('auth_users')
          .select('id', { count: 'exact', head: true })
          .in('project_id', projectIds),
      ]);

      databaseCount = tablesResult.count || 0;
      storageSize = bucketsResult.count || 0;
      authUserCount = authUsersResult.count || 0;
    }

    // Check for errors
    if (projectResult.error) {
      console.error('Stats query errors:', { project: projectResult.error });
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    // A subscription only grants benefits while it has not expired
    const subscription = subscriptionResult.data;
    const activePlan =
      subscription && new Date(subscription.expires_at) > new Date()
        ? subscription.plan
        : 'free';

    return NextResponse.json({
      projects: projectResult.count || 0,
      databases: databaseCount,
      storage: storageSize,
      authUsers: authUserCount,
      plan: activePlan,
      limits: getPlanLimits(activePlan),
      recentActivity: [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
