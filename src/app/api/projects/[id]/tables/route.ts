import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

async function verifyProjectAccess(projectId: string, userEmail: string) {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!profile) return null;

  const { data: project } = await supabase
    .from('projects')
    .select('id, organization_id')
    .eq('id', projectId)
    .single();

  if (!project) return null;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', project.organization_id)
    .eq('user_id', profile.id)
    .single();

  if (!membership) return null;

  return { profile, project, role: membership.role };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const access = await verifyProjectAccess(projectId, session.user.email);
    if (!access) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const supabase = createAdminClient();

    const { data: tables, error } = await supabase
      .from('database_tables')
      .select('*')
      .eq('project_id', projectId)
      .order('schema_name')
      .order('table_name');

    if (error) {
      console.error('Error fetching tables:', error);
      return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
    }

    return NextResponse.json({ tables: tables || [] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const access = await verifyProjectAccess(projectId, session.user.email);
    if (!access) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    if (!['owner', 'admin'].includes(access.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { tableName, schemaName = 'public', columns, enableRls = false } = body;

    if (!tableName) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 });
    }

    if (!/^[a-z_][a-z0-9_]*$/i.test(tableName)) {
      return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: table, error } = await supabase
      .from('database_tables')
      .insert({
        project_id: projectId,
        schema_name: schemaName,
        table_name: tableName,
        row_count: 0,
        size_bytes: 0,
        is_rls_enabled: enableRls,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Table already exists' }, { status: 400 });
      }
      console.error('Error creating table:', error);
      return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
    }

    return NextResponse.json({ table, columns });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
