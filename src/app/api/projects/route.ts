import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateApiKey, generateProjectRef } from '@/lib/utils/crypto';

const REGIONS = ['us-east-1', 'us-west-1', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'];

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
      return NextResponse.json({ projects: [] });
    }

    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', profile.id);

    if (!memberships?.length) {
      return NextResponse.json({ projects: [] });
    }

    const orgIds = memberships.map((m) => m.organization_id);

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id,
        organization_id,
        name,
        region,
        status,
        postgres_version,
        created_at,
        updated_at,
        organization:organizations (
          name,
          slug
        )
      `)
      .in('organization_id', orgIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json({ projects: projects || [] });
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
    const { name, organizationId, region, databasePassword } = body;

    if (!name || !organizationId) {
      return NextResponse.json({ error: 'Name and organization are required' }, { status: 400 });
    }

    if (!databasePassword || databasePassword.length < 8) {
      return NextResponse.json({ error: 'Database password must be at least 8 characters' }, { status: 400 });
    }

    const selectedRegion = REGIONS.includes(region) ? region : 'us-east-1';

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', profile.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const projectRef = generateProjectRef();
    const anonKey = generateApiKey('anon');
    const serviceKey = generateApiKey('service');

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        organization_id: organizationId,
        name,
        region: selectedRegion,
        database_host: `db.${projectRef}.supabase.co`,
        database_port: 5432,
        database_name: 'postgres',
        api_url: `https://${projectRef}.supabase.co`,
        anon_key: anonKey,
        service_key: serviceKey,
        status: 'active',
        postgres_version: '15.1',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
