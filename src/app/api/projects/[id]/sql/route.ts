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

const BLOCKED_KEYWORDS = [
  'DROP DATABASE',
  'DROP SCHEMA',
  'TRUNCATE',
  'DROP ROLE',
  'CREATE ROLE',
  'ALTER ROLE',
  'GRANT',
  'REVOKE',
];

function isSafeQuery(query: string): { safe: boolean; reason?: string } {
  const upperQuery = query.toUpperCase();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (upperQuery.includes(keyword)) {
      return { safe: false, reason: `Query contains blocked operation: ${keyword}` };
    }
  }

  return { safe: true };
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

    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return NextResponse.json({ error: 'Query cannot be empty' }, { status: 400 });
    }

    const safetyCheck = isSafeQuery(trimmedQuery);
    if (!safetyCheck.safe) {
      return NextResponse.json({ error: safetyCheck.reason }, { status: 400 });
    }

    const startTime = Date.now();

    const supabase = createAdminClient();

    const upperQuery = trimmedQuery.toUpperCase();
    const isSelect = upperQuery.startsWith('SELECT');
    const isInsert = upperQuery.startsWith('INSERT');
    const isUpdate = upperQuery.startsWith('UPDATE');
    const isDelete = upperQuery.startsWith('DELETE');
    const isCreate = upperQuery.startsWith('CREATE');
    const isAlter = upperQuery.startsWith('ALTER');
    const isDrop = upperQuery.startsWith('DROP');

    let result;
    let rowCount = 0;

    if (isSelect) {
      const { data, error } = await supabase.rpc('execute_sql', { query_text: trimmedQuery });

      if (error) {
        return NextResponse.json({
          error: error.message,
          hint: error.hint || null,
          code: error.code || null,
        }, { status: 400 });
      }

      result = data || [];
      rowCount = Array.isArray(result) ? result.length : 0;
    } else if (isInsert || isUpdate || isDelete) {
      if (access.role === 'member') {
        return NextResponse.json({ error: 'Members cannot execute write operations' }, { status: 403 });
      }

      const { data, error } = await supabase.rpc('execute_sql', { query_text: trimmedQuery });

      if (error) {
        return NextResponse.json({
          error: error.message,
          hint: error.hint || null,
          code: error.code || null,
        }, { status: 400 });
      }

      result = { message: 'Query executed successfully', affected: data };
      rowCount = typeof data === 'number' ? data : 0;
    } else if (isCreate || isAlter || isDrop) {
      if (access.role !== 'owner') {
        return NextResponse.json({ error: 'Only owners can execute DDL operations' }, { status: 403 });
      }

      const { error } = await supabase.rpc('execute_sql', { query_text: trimmedQuery });

      if (error) {
        return NextResponse.json({
          error: error.message,
          hint: error.hint || null,
          code: error.code || null,
        }, { status: 400 });
      }

      result = { message: 'Query executed successfully' };
    } else {
      return NextResponse.json({ error: 'Unsupported query type' }, { status: 400 });
    }

    const executionTime = Date.now() - startTime;

    try {
      await supabase.from('sql_query_history').insert({
        project_id: projectId,
        user_id: access.profile.id,
        query: trimmedQuery,
        execution_time_ms: executionTime,
        row_count: rowCount,
        success: true,
      });
    } catch {
      // Ignore history logging errors
    }

    return NextResponse.json({
      result,
      executionTime,
      rowCount,
    });
  } catch (error) {
    console.error('SQL execution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
