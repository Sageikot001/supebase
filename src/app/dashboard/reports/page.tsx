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

const Select = styled.select`
  padding: 8px 12px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  color: #EDEDED;
  font-size: 13px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3ECF8E;
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

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StatIcon = styled.div`
  color: #5E5E5E;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatTrend = styled.span<{ $positive?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $positive }) => ($positive ? '#3ECF8E' : '#F56565')};
`;

const StatValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const StatLabel = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 0;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
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

const SectionContent = styled.div`
  padding: 20px;
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #5E5E5E;
`;

const ChartBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  margin-bottom: 16px;
`;

const ChartBar = styled.div<{ $height: number }>`
  width: 40px;
  height: ${({ $height }) => $height}%;
  background: linear-gradient(180deg, #3ECF8E 0%, rgba(62, 207, 142, 0.3) 100%);
  border-radius: 4px 4px 0 0;
`;

const ChartLabels = styled.div`
  display: flex;
  gap: 12px;
`;

const ChartLabel = styled.span`
  width: 40px;
  text-align: center;
  font-size: 12px;
  color: #5E5E5E;
`;

const BreakdownList = styled.div``;

const BreakdownItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #2E2E2E;

  &:last-child {
    border-bottom: none;
  }
`;

const BreakdownLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BreakdownDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const BreakdownName = styled.span`
  font-size: 14px;
  color: #EDEDED;
`;

const BreakdownValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #EDEDED;
`;

const chartData = [45, 72, 58, 89, 65, 95, 78];
const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const breakdown = [
  { name: 'API Requests', value: '42.1K', color: '#3ECF8E' },
  { name: 'Database Queries', value: '28.4K', color: '#3B82F6' },
  { name: 'Auth Requests', value: '12.8K', color: '#8B5CF6' },
  { name: 'Storage Reads', value: '8.2K', color: '#F5A623' },
  { name: 'Realtime Events', value: '5.6K', color: '#F56565' },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Reports</Title>
        <HeaderActions>
          <Select>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </Select>
        </HeaderActions>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.activity}</StatIcon>
            <StatTrend $positive>+24%</StatTrend>
          </StatHeader>
          <StatValue>97.1K</StatValue>
          <StatLabel>Total Requests</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.database}</StatIcon>
            <StatTrend $positive>+12%</StatTrend>
          </StatHeader>
          <StatValue>1.2 GB</StatValue>
          <StatLabel>Database Size</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.storage}</StatIcon>
            <StatTrend $positive>+8%</StatTrend>
          </StatHeader>
          <StatValue>256 MB</StatValue>
          <StatLabel>Storage Used</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.users}</StatIcon>
            <StatTrend $positive>+18%</StatTrend>
          </StatHeader>
          <StatValue>1,284</StatValue>
          <StatLabel>Auth Users</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>API Requests</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <ChartPlaceholder>
              <ChartBars>
                {chartData.map((height, i) => (
                  <ChartBar key={i} $height={height} />
                ))}
              </ChartBars>
              <ChartLabels>
                {chartLabels.map((label, i) => (
                  <ChartLabel key={i}>{label}</ChartLabel>
                ))}
              </ChartLabels>
            </ChartPlaceholder>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Request Breakdown</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <BreakdownList>
              {breakdown.map((item) => (
                <BreakdownItem key={item.name}>
                  <BreakdownLabel>
                    <BreakdownDot $color={item.color} />
                    <BreakdownName>{item.name}</BreakdownName>
                  </BreakdownLabel>
                  <BreakdownValue>{item.value}</BreakdownValue>
                </BreakdownItem>
              ))}
            </BreakdownList>
          </SectionContent>
        </Section>
      </ChartGrid>
    </DashboardLayout>
  );
}
