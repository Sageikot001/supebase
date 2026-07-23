import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

async function getUserOrgIds(supabase: ReturnType<typeof createAdminClient>, email: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profile) return { profile: null, orgIds: [] };

  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', profile.id);

  return {
    profile,
    orgIds: memberships?.map((m) => m.organization_id) || [],
  };
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

    const { id: domainId } = await params;
    const supabase = createAdminClient();
    const { profile, orgIds } = await getUserOrgIds(supabase, session.user.email);

    if (!profile || orgIds.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get domain with project info, verify access through organization
    const { data: domain, error } = await supabase
      .from('domains')
      .select(`
        *,
        project:projects (
          id,
          name,
          organization_id
        )
      `)
      .eq('id', domainId)
      .single();

    if (error || !domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Verify access through project's organization
    const projectInfo = domain.project as unknown as { organization_id: string } | null;
    if (projectInfo && !orgIds.includes(projectInfo.organization_id)) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    return NextResponse.json({ domain });
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

    const { id: domainId } = await params;
    const body = await request.json();
    const { projectId, isPrimary, verify, disconnect } = body;

    const supabase = createAdminClient();
    const { profile, orgIds } = await getUserOrgIds(supabase, session.user.email);

    if (!profile || orgIds.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get existing domain and verify access
    const { data: existingDomain } = await supabase
      .from('domains')
      .select(`
        *,
        project:projects (
          id,
          organization_id
        )
      `)
      .eq('id', domainId)
      .single();

    if (!existingDomain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Verify access through project's organization
    const existingProjectInfo = existingDomain.project as unknown as { organization_id: string } | null;
    if (existingProjectInfo && !orgIds.includes(existingProjectInfo.organization_id)) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Handle disconnect from project
    if (disconnect) {
      updates.project_id = null;
      updates.is_primary = false;
    }

    // Handle connect to project
    if (projectId !== undefined && !disconnect) {
      if (projectId) {
        // Verify project ownership through organization
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('id', projectId)
          .in('organization_id', orgIds)
          .single();

        if (!project) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
      }
      updates.project_id = projectId || null;
    }

    // Handle set as primary
    if (isPrimary !== undefined) {
      const targetProjectId = projectId || existingDomain.project_id;
      if (isPrimary && targetProjectId) {
        // Unset other primary domains for this project
        await supabase
          .from('domains')
          .update({ is_primary: false })
          .eq('project_id', targetProjectId);
      }
      updates.is_primary = isPrimary;
    }

    // Handle verification request
    if (verify) {
      updates.verified = true;
      updates.ssl_status = 'active';
    }

    const { data: domain, error } = await supabase
      .from('domains')
      .update(updates)
      .eq('id', domainId)
      .select(`
        *,
        project:projects (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating domain:', error);
      return NextResponse.json({ error: 'Failed to update domain' }, { status: 500 });
    }

    return NextResponse.json({ domain });
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

    const { id: domainId } = await params;
    const supabase = createAdminClient();
    const { profile, orgIds } = await getUserOrgIds(supabase, session.user.email);

    if (!profile || orgIds.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get domain and verify access
    const { data: existingDomain } = await supabase
      .from('domains')
      .select('id, project_id')
      .eq('id', domainId)
      .single();

    if (!existingDomain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Verify access through project's organization
    if (existingDomain.project_id) {
      const { data: project } = await supabase
        .from('projects')
        .select('organization_id')
        .eq('id', existingDomain.project_id)
        .single();

      if (project && !orgIds.includes(project.organization_id)) {
        return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
      }
    }

    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId);

    if (error) {
      console.error('Error deleting domain:', error);
      return NextResponse.json({ error: 'Failed to delete domain' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
