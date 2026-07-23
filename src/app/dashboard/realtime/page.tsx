'use client';

import styled from 'styled-components';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  padding: 20px;
`;

const StatLabel = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 0 0 8px 0;
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0;
`;

const Section = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #2E2E2E;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const ChannelList = styled.div``;

const ChannelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #2E2E2E;

  &:last-child {
    border-bottom: none;
  }
`;

const ChannelIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(62, 207, 142, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3ECF8E;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ChannelInfo = styled.div`
  flex: 1;
`;

const ChannelName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
  font-family: 'Source Code Pro', monospace;
`;

const ChannelMeta = styled.p`
  font-size: 13px;
  color: #5E5E5E;
  margin: 0;
`;

const Badge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === 'active' ? 'rgba(62, 207, 142, 0.2)' :
    'rgba(142, 142, 142, 0.2)'
  };
  color: ${({ $status }) =>
    $status === 'active' ? '#3ECF8E' :
    '#8F8F8F'
  };
`;

const StatusDot = styled.span<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === 'active' ? '#3ECF8E' :
    '#8F8F8F'
  };
`;

const mockChannels = [
  { name: 'room:lobby', connections: 24, messagesPerMin: 156, status: 'active' },
  { name: 'realtime:public:messages', connections: 12, messagesPerMin: 89, status: 'active' },
  { name: 'presence:online-users', connections: 45, messagesPerMin: 234, status: 'active' },
  { name: 'broadcast:notifications', connections: 8, messagesPerMin: 12, status: 'active' },
];

export default function RealtimePage() {
  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Realtime</Title>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatLabel>Active Connections</StatLabel>
          <StatValue>89</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Messages / min</StatLabel>
          <StatValue>491</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Channels</StatLabel>
          <StatValue>{mockChannels.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Peak Connections (24h)</StatLabel>
          <StatValue>156</StatValue>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Active Channels</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <ChannelList>
            {mockChannels.map((channel) => (
              <ChannelItem key={channel.name}>
                <ChannelIcon>{Icons.realtime}</ChannelIcon>
                <ChannelInfo>
                  <ChannelName>{channel.name}</ChannelName>
                  <ChannelMeta>
                    {channel.connections} connections • {channel.messagesPerMin} msg/min
                  </ChannelMeta>
                </ChannelInfo>
                <Badge $status={channel.status}>
                  <StatusDot $status={channel.status} />
                  {channel.status}
                </Badge>
              </ChannelItem>
            ))}
          </ChannelList>
        </SectionContent>
      </Section>
    </DashboardLayout>
  );
}
