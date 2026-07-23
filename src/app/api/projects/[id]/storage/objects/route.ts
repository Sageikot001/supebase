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

    const { searchParams } = new URL(request.url);
    const bucketId = searchParams.get('bucketId');
    const path = searchParams.get('path') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!bucketId) {
      return NextResponse.json({ error: 'Bucket ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: bucket } = await supabase
      .from('storage_buckets')
      .select('id')
      .eq('id', bucketId)
      .eq('project_id', projectId)
      .single();

    if (!bucket) {
      return NextResponse.json({ error: 'Bucket not found' }, { status: 404 });
    }

    let query = supabase
      .from('storage_objects')
      .select('*', { count: 'exact' })
      .eq('bucket_id', bucketId)
      .order('name')
      .range(offset, offset + limit - 1);

    if (path) {
      query = query.like('path', `${path}%`);
    }

    const { data: objects, error, count } = await query;

    if (error) {
      console.error('Error fetching objects:', error);
      return NextResponse.json({ error: 'Failed to fetch objects' }, { status: 500 });
    }

    return NextResponse.json({
      objects: objects || [],
      total: count || 0,
      limit,
      offset,
    });
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

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucketId = formData.get('bucketId') as string | null;
    const path = formData.get('path') as string || '';

    if (!file || !bucketId) {
      return NextResponse.json({ error: 'File and bucket ID are required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: bucket } = await supabase
      .from('storage_buckets')
      .select('id, file_size_limit, allowed_mime_types')
      .eq('id', bucketId)
      .eq('project_id', projectId)
      .single();

    if (!bucket) {
      return NextResponse.json({ error: 'Bucket not found' }, { status: 404 });
    }

    if (bucket.file_size_limit && file.size > bucket.file_size_limit) {
      return NextResponse.json({
        error: `File size exceeds limit of ${bucket.file_size_limit} bytes`
      }, { status: 400 });
    }

    if (bucket.allowed_mime_types && !bucket.allowed_mime_types.includes(file.type)) {
      return NextResponse.json({
        error: `File type ${file.type} is not allowed`
      }, { status: 400 });
    }

    const fullPath = path ? `${path}/${file.name}` : file.name;

    const { data: object, error } = await supabase
      .from('storage_objects')
      .insert({
        bucket_id: bucketId,
        name: file.name,
        path: fullPath,
        size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating object record:', error);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    return NextResponse.json({ object });
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

    const body = await request.json();
    const { objectIds } = body;

    if (!objectIds || !Array.isArray(objectIds) || objectIds.length === 0) {
      return NextResponse.json({ error: 'Object IDs are required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('storage_objects')
      .delete()
      .in('id', objectIds);

    if (error) {
      console.error('Error deleting objects:', error);
      return NextResponse.json({ error: 'Failed to delete objects' }, { status: 500 });
    }

    return NextResponse.json({ deleted: objectIds.length });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
