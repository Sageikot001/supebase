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

interface RealtimeChannel {
  id: string;
  name: string;
  type: 'broadcast' | 'presence' | 'postgres_changes';
  subscriberCount: number;
  messagesPerSecond: number;
  status: 'active' | 'idle';
  createdAt: string;
}

function generateMockChannels(): RealtimeChannel[] {
  const channelTypes: Array<'broadcast' | 'presence' | 'postgres_changes'> = [
    'broadcast',
    'presence',
    'postgres_changes',
  ];

  const channelNames = [
    'room:lobby',
    'room:game-123',
    'user:presence',
    'notifications',
    'realtime:public:messages',
    'realtime:public:orders',
    'chat:general',
    'live:dashboard',
  ];

  return channelNames.map((name, i) => ({
    id: `channel_${i}`,
    name,
    type: channelTypes[Math.floor(Math.random() * channelTypes.length)],
    subscriberCount: Math.floor(Math.random() * 100),
    messagesPerSecond: Math.floor(Math.random() * 50),
    status: Math.random() > 0.3 ? 'active' : 'idle',
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
  }));
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

    const channels = generateMockChannels();

    const stats = {
      totalConnections: channels.reduce((sum, c) => sum + c.subscriberCount, 0),
      activeChannels: channels.filter((c) => c.status === 'active').length,
      messagesPerSecond: channels.reduce((sum, c) => sum + c.messagesPerSecond, 0),
      peakConnections: Math.floor(Math.random() * 500) + 100,
    };

    return NextResponse.json({
      channels,
      stats,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
