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

    const { data: buckets, error } = await supabase
      .from('storage_buckets')
      .select(`
        *,
        objects:storage_objects(count)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching buckets:', error);
      return NextResponse.json({ error: 'Failed to fetch buckets' }, { status: 500 });
    }

    const bucketsWithStats = buckets?.map((bucket) => ({
      ...bucket,
      object_count: bucket.objects?.[0]?.count || 0,
    })) || [];

    return NextResponse.json({ buckets: bucketsWithStats });
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
    const { name, public: isPublic = false, fileSizeLimit, allowedMimeTypes } = body;

    if (!name) {
      return NextResponse.json({ error: 'Bucket name is required' }, { status: 400 });
    }

    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name) || name.length < 3) {
      return NextResponse.json({
        error: 'Bucket name must be lowercase, start/end with alphanumeric, and be at least 3 characters'
      }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: bucket, error } = await supabase
      .from('storage_buckets')
      .insert({
        project_id: projectId,
        name,
        public: isPublic,
        file_size_limit: fileSizeLimit || null,
        allowed_mime_types: allowedMimeTypes || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Bucket name already exists' }, { status: 400 });
      }
      console.error('Error creating bucket:', error);
      return NextResponse.json({ error: 'Failed to create bucket' }, { status: 500 });
    }

    return NextResponse.json({ bucket });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
