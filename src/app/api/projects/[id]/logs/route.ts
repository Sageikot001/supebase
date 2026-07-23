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

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogSource = 'api' | 'database' | 'auth' | 'storage' | 'functions' | 'realtime';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  metadata?: Record<string, unknown>;
}

function generateMockLogs(
  count: number,
  filters: { level?: string; source?: string; search?: string }
): LogEntry[] {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  const sources: LogSource[] = ['api', 'database', 'auth', 'storage', 'functions', 'realtime'];

  const messages: Record<LogSource, string[]> = {
    api: [
      'GET /rest/v1/users 200 OK',
      'POST /rest/v1/orders 201 Created',
      'PATCH /rest/v1/products 200 OK',
      'DELETE /rest/v1/sessions 204 No Content',
      'Rate limit exceeded for IP',
    ],
    database: [
      'Query executed successfully',
      'Connection pool at 80% capacity',
      'Slow query detected (>1000ms)',
      'Index scan on users table',
      'Vacuum completed on orders table',
    ],
    auth: [
      'User signed in with email',
      'Password reset requested',
      'JWT token refreshed',
      'Invalid login attempt',
      'MFA verification successful',
    ],
    storage: [
      'File uploaded to avatars bucket',
      'Object deleted from documents',
      'Presigned URL generated',
      'Bucket policy updated',
      'Storage quota warning',
    ],
    functions: [
      'Function invoked: send-email',
      'Cold start: hello-world (245ms)',
      'Function completed successfully',
      'Timeout exceeded for process-image',
      'Memory limit reached',
    ],
    realtime: [
      'Client connected to channel: room-1',
      'Broadcast message sent',
      'Presence state updated',
      'Client disconnected',
      'Channel subscription created',
    ],
  };

  const logs: LogEntry[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const sourceMessages = messages[source];
    const message = sourceMessages[Math.floor(Math.random() * sourceMessages.length)];

    if (filters.level && level !== filters.level) continue;
    if (filters.source && source !== filters.source) continue;
    if (filters.search && !message.toLowerCase().includes(filters.search.toLowerCase())) continue;

    logs.push({
      id: `log_${now}_${i}`,
      timestamp: new Date(now - i * 1000 * Math.random() * 60).toISOString(),
      level,
      source,
      message,
      metadata: {
        duration_ms: Math.floor(Math.random() * 500),
        request_id: `req_${Math.random().toString(36).slice(2, 10)}`,
      },
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
    const level = searchParams.get('level') || '';
    const source = searchParams.get('source') || '';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '100');

    const logs = generateMockLogs(limit * 2, { level, source, search }).slice(0, limit);

    return NextResponse.json({
      logs,
      total: logs.length,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
