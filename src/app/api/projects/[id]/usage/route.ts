import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyProjectAccess } from '@/lib/utils/project-access';

interface UsageData {
  database: {
    sizeBytes: number;
    rowCount: number;
    connectionCount: number;
    queryCount24h: number;
  };
  storage: {
    sizeBytes: number;
    objectCount: number;
    bandwidth24h: number;
  };
  auth: {
    totalUsers: number;
    activeUsers24h: number;
    signIns24h: number;
  };
  functions: {
    invocations24h: number;
    executionTimeMs: number;
    errors24h: number;
  };
  realtime: {
    peakConnections: number;
    messagesDelivered24h: number;
    channelCount: number;
  };
  api: {
    requests24h: number;
    bandwidth24h: number;
    errorRate: number;
  };
}

function generateMockUsage(): UsageData {
  return {
    database: {
      sizeBytes: Math.floor(Math.random() * 500000000) + 10000000,
      rowCount: Math.floor(Math.random() * 100000) + 1000,
      connectionCount: Math.floor(Math.random() * 20) + 1,
      queryCount24h: Math.floor(Math.random() * 50000) + 1000,
    },
    storage: {
      sizeBytes: Math.floor(Math.random() * 1000000000) + 50000000,
      objectCount: Math.floor(Math.random() * 5000) + 100,
      bandwidth24h: Math.floor(Math.random() * 100000000) + 1000000,
    },
    auth: {
      totalUsers: Math.floor(Math.random() * 10000) + 100,
      activeUsers24h: Math.floor(Math.random() * 500) + 10,
      signIns24h: Math.floor(Math.random() * 1000) + 50,
    },
    functions: {
      invocations24h: Math.floor(Math.random() * 10000) + 100,
      executionTimeMs: Math.floor(Math.random() * 50000) + 1000,
      errors24h: Math.floor(Math.random() * 50),
    },
    realtime: {
      peakConnections: Math.floor(Math.random() * 500) + 10,
      messagesDelivered24h: Math.floor(Math.random() * 100000) + 1000,
      channelCount: Math.floor(Math.random() * 50) + 5,
    },
    api: {
      requests24h: Math.floor(Math.random() * 100000) + 5000,
      bandwidth24h: Math.floor(Math.random() * 500000000) + 10000000,
      errorRate: Math.random() * 5,
    },
  };
}

function generateTimeSeriesData(points: number): Array<{ timestamp: string; value: number }> {
  const data = [];
  const now = Date.now();
  const interval = 3600000;

  for (let i = points - 1; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * interval).toISOString(),
      value: Math.floor(Math.random() * 1000) + 100,
    });
  }

  return data;
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
    const period = searchParams.get('period') || '24h';

    const usage = generateMockUsage();

    const timeSeriesPoints = period === '7d' ? 168 : period === '30d' ? 720 : 24;

    const timeSeries = {
      apiRequests: generateTimeSeriesData(timeSeriesPoints),
      databaseQueries: generateTimeSeriesData(timeSeriesPoints),
      storageOperations: generateTimeSeriesData(timeSeriesPoints),
      realtimeConnections: generateTimeSeriesData(timeSeriesPoints),
    };

    return NextResponse.json({
      usage,
      timeSeries,
      period,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
