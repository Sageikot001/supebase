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

    const { data: functions, error } = await supabase
      .from('edge_functions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching functions:', error);
      return NextResponse.json({ error: 'Failed to fetch functions' }, { status: 500 });
    }

    return NextResponse.json({ functions: functions || [] });
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
    const { name, verifyJwt = true, importMap = false } = body;

    if (!name) {
      return NextResponse.json({ error: 'Function name is required' }, { status: 400 });
    }

    if (!/^[a-z][a-z0-9-]*$/.test(name)) {
      return NextResponse.json({
        error: 'Function name must start with a letter and contain only lowercase letters, numbers, and hyphens'
      }, { status: 400 });
    }

    const slug = name.toLowerCase();

    const supabase = createAdminClient();

    const { data: func, error } = await supabase
      .from('edge_functions')
      .insert({
        project_id: projectId,
        name,
        slug,
        status: 'active',
        verify_jwt: verifyJwt,
        import_map: importMap,
        entrypoint_path: `supabase/functions/${slug}/index.ts`,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Function with this name already exists' }, { status: 400 });
      }
      console.error('Error creating function:', error);
      return NextResponse.json({ error: 'Failed to create function' }, { status: 500 });
    }

    return NextResponse.json({ function: func });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
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
    const { functionId, status, verifyJwt, importMap } = body;

    if (!functionId) {
      return NextResponse.json({ error: 'Function ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status !== undefined) updateData.status = status;
    if (verifyJwt !== undefined) updateData.verify_jwt = verifyJwt;
    if (importMap !== undefined) updateData.import_map = importMap;

    const { data: func, error } = await supabase
      .from('edge_functions')
      .update(updateData)
      .eq('id', functionId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating function:', error);
      return NextResponse.json({ error: 'Failed to update function' }, { status: 500 });
    }

    return NextResponse.json({ function: func });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    if (access.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can delete functions' }, { status: 403 });
    }

    const body = await request.json();
    const { functionId } = body;

    if (!functionId) {
      return NextResponse.json({ error: 'Function ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('edge_functions')
      .delete()
      .eq('id', functionId)
      .eq('project_id', projectId);

    if (error) {
      console.error('Error deleting function:', error);
      return NextResponse.json({ error: 'Failed to delete function' }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
