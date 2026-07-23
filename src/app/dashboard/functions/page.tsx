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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ $primary }) => ($primary ? '#3ECF8E' : '#232323')};
  color: ${({ $primary }) => ($primary ? '#171717' : '#EDEDED')};
  border: 1px solid ${({ $primary }) => ($primary ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#4FF5A8' : '#2A2A2A')};
  }

  svg {
    width: 16px;
    height: 16px;
  }
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

const ContentSection = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2E2E2E;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0;
`;

const FunctionList = styled.div``;

const FunctionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #2E2E2E;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const FunctionIcon = styled.div`
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

const FunctionInfo = styled.div`
  flex: 1;
`;

const FunctionName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const FunctionMeta = styled.p`
  font-size: 13px;
  color: #5E5E5E;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FunctionStats = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const FunctionStat = styled.div`
  text-align: center;
`;

const FunctionStatValue = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0;
`;

const FunctionStatLabel = styled.p`
  font-size: 11px;
  color: #5E5E5E;
  margin: 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === 'active' ? 'rgba(62, 207, 142, 0.2)' :
    $status === 'inactive' ? 'rgba(142, 142, 142, 0.2)' :
    'rgba(245, 101, 101, 0.2)'
  };
  color: ${({ $status }) =>
    $status === 'active' ? '#3ECF8E' :
    $status === 'inactive' ? '#8F8F8F' :
    '#F56565'
  };
`;

const StatusDot = styled.span<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === 'active' ? '#3ECF8E' :
    $status === 'inactive' ? '#8F8F8F' :
    '#F56565'
  };
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  color: #8F8F8F;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2A2A2A;
    border-color: #3E3E3E;
    color: #EDEDED;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const mockFunctions = [
  {
    name: 'send-email',
    slug: 'send-email',
    status: 'active',
    invocations: '12.4K',
    avgDuration: '142ms',
    lastDeployed: '2 hours ago',
    verifyJwt: true,
  },
  {
    name: 'process-payment',
    slug: 'process-payment',
    status: 'active',
    invocations: '8.2K',
    avgDuration: '234ms',
    lastDeployed: '1 day ago',
    verifyJwt: true,
  },
  {
    name: 'generate-pdf',
    slug: 'generate-pdf',
    status: 'active',
    invocations: '3.1K',
    avgDuration: '456ms',
    lastDeployed: '3 days ago',
    verifyJwt: false,
  },
  {
    name: 'resize-image',
    slug: 'resize-image',
    status: 'inactive',
    invocations: '0',
    avgDuration: '—',
    lastDeployed: '1 week ago',
    verifyJwt: false,
  },
  {
    name: 'webhook-handler',
    slug: 'webhook-handler',
    status: 'error',
    invocations: '156',
    avgDuration: '89ms',
    lastDeployed: '2 weeks ago',
    verifyJwt: false,
  },
];

export default function FunctionsPage() {
  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Edge Functions</Title>
        <HeaderActions>
          <Button $primary>
            {Icons.plus} New Function
          </Button>
        </HeaderActions>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatLabel>Total Functions</StatLabel>
          <StatValue>{mockFunctions.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Invocations (30d)</StatLabel>
          <StatValue>23.9K</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Avg. Duration</StatLabel>
          <StatValue>156ms</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Error Rate</StatLabel>
          <StatValue>0.12%</StatValue>
        </StatCard>
      </StatsGrid>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>All Functions</SectionTitle>
        </SectionHeader>
        <FunctionList>
          {mockFunctions.map((fn) => (
            <FunctionItem key={fn.slug}>
              <FunctionIcon>
                {Icons.function}
              </FunctionIcon>
              <FunctionInfo>
                <FunctionName>{fn.name}</FunctionName>
                <FunctionMeta>
                  <MetaItem>
                    {Icons.clock} {fn.lastDeployed}
                  </MetaItem>
                  {fn.verifyJwt && (
                    <MetaItem>
                      {Icons.lock} JWT verified
                    </MetaItem>
                  )}
                </FunctionMeta>
              </FunctionInfo>
              <FunctionStats>
                <FunctionStat>
                  <FunctionStatValue>{fn.invocations}</FunctionStatValue>
                  <FunctionStatLabel>Invocations</FunctionStatLabel>
                </FunctionStat>
                <FunctionStat>
                  <FunctionStatValue>{fn.avgDuration}</FunctionStatValue>
                  <FunctionStatLabel>Avg. Duration</FunctionStatLabel>
                </FunctionStat>
              </FunctionStats>
              <StatusBadge $status={fn.status}>
                <StatusDot $status={fn.status} />
                {fn.status}
              </StatusBadge>
              <ActionButton>
                {Icons.more}
              </ActionButton>
            </FunctionItem>
          ))}
        </FunctionList>
      </ContentSection>
    </DashboardLayout>
  );
}
