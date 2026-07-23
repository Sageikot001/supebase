import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateApiKey } from '@/lib/utils/crypto';

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
    .select('*')
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

    const { project, role } = access;

    const settings = {
      general: {
        name: project.name,
        region: project.region,
        status: project.status,
        postgresVersion: project.postgres_version,
      },
      api: {
        url: project.api_url,
        anonKey: project.anon_key,
        serviceKey: role === 'owner' ? project.service_key : '••••••••••••••••',
      },
      database: {
        host: project.database_host,
        port: project.database_port,
        name: project.database_name,
        connectionString: role === 'owner'
          ? `postgresql://postgres:[YOUR-PASSWORD]@${project.database_host}:${project.database_port}/${project.database_name}`
          : null,
      },
    };

    return NextResponse.json({ settings, role });
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

    if (access.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can modify project settings' }, { status: 403 });
    }

    const body = await request.json();
    const { name, status } = body;

    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name) updateData.name = name;
    if (status && ['active', 'paused'].includes(status)) updateData.status = status;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    return NextResponse.json({ project });
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

    if (access.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can regenerate API keys' }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;

    if (action !== 'regenerate-keys') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const newAnonKey = generateApiKey('anon');
    const newServiceKey = generateApiKey('service');

    const { data: project, error } = await supabase
      .from('projects')
      .update({
        anon_key: newAnonKey,
        service_key: newServiceKey,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error regenerating keys:', error);
      return NextResponse.json({ error: 'Failed to regenerate keys' }, { status: 500 });
    }

    return NextResponse.json({
      api: {
        anonKey: project.anon_key,
        serviceKey: project.service_key,
      },
      message: 'API keys regenerated successfully',
    });
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
      return NextResponse.json({ error: 'Only owners can delete projects' }, { status: 403 });
    }

    const supabase = createAdminClient();

    await supabase.from('edge_functions').delete().eq('project_id', projectId);
    await supabase.from('storage_objects').delete().eq('bucket_id', projectId);
    await supabase.from('storage_buckets').delete().eq('project_id', projectId);
    await supabase.from('database_tables').delete().eq('project_id', projectId);
    await supabase.from('auth_users').delete().eq('project_id', projectId);
    await supabase.from('domains').delete().eq('project_id', projectId);

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
