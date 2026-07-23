'use client';

import styled from 'styled-components';
import Link from 'next/link';
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

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
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

const SectionLink = styled(Link)`
  font-size: 13px;
  color: #3ECF8E;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const FeatureCard = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    border-color: #3ECF8E;
    background: rgba(62, 207, 142, 0.05);
  }
`;

const FeatureIcon = styled.div`
  width: 36px;
  height: 36px;
  background: rgba(62, 207, 142, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3ECF8E;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FeatureContent = styled.div``;

const FeatureTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const FeatureDescription = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 0;
  line-height: 1.4;
`;

const TableList = styled.div``;

const TableItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #2E2E2E;

  &:last-child {
    border-bottom: none;
  }
`;

const TableIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #232323;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5E5E5E;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TableInfo = styled.div`
  flex: 1;
`;

const TableName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin: 0;
`;

const TableMeta = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 0;
`;

const ConnectionInfo = styled.div`
  background: #232323;
  border-radius: 8px;
  padding: 16px;
`;

const ConnectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #2E2E2E;

  &:last-child {
    border-bottom: none;
  }
`;

const ConnectionLabel = styled.span`
  font-size: 13px;
  color: #8F8F8F;
`;

const ConnectionValue = styled.span`
  font-size: 13px;
  font-family: 'Source Code Pro', monospace;
  color: #EDEDED;
`;

const CopyButton = styled.button`
  background: transparent;
  border: none;
  color: #5E5E5E;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;

  &:hover {
    color: #3ECF8E;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const mockTables = [
  { name: 'profiles', rows: 1284, schema: 'public' },
  { name: 'subscriptions', rows: 856, schema: 'public' },
  { name: 'projects', rows: 423, schema: 'public' },
  { name: 'organizations', rows: 156, schema: 'public' },
];

export default function DatabasePage() {
  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Database</Title>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatLabel>Database Size</StatLabel>
          <StatValue>1.2 GB</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Tables</StatLabel>
          <StatValue>24</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Connections</StatLabel>
          <StatValue>12 / 60</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Postgres Version</StatLabel>
          <StatValue>15.1</StatValue>
        </StatCard>
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Quick Actions</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FeatureGrid>
              <FeatureCard href="/dashboard/table-editor">
                <FeatureIcon>{Icons.table}</FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>Table Editor</FeatureTitle>
                  <FeatureDescription>View and edit your data</FeatureDescription>
                </FeatureContent>
              </FeatureCard>
              <FeatureCard href="/dashboard/sql-editor">
                <FeatureIcon>{Icons.sql}</FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>SQL Editor</FeatureTitle>
                  <FeatureDescription>Run SQL queries</FeatureDescription>
                </FeatureContent>
              </FeatureCard>
              <FeatureCard href="#">
                <FeatureIcon>{Icons.shield}</FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>RLS Policies</FeatureTitle>
                  <FeatureDescription>Manage row security</FeatureDescription>
                </FeatureContent>
              </FeatureCard>
              <FeatureCard href="#">
                <FeatureIcon>{Icons.zap}</FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>Extensions</FeatureTitle>
                  <FeatureDescription>Enable Postgres extensions</FeatureDescription>
                </FeatureContent>
              </FeatureCard>
            </FeatureGrid>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Recent Tables</SectionTitle>
            <SectionLink href="/dashboard/table-editor">
              View all {Icons.arrowRight}
            </SectionLink>
          </SectionHeader>
          <SectionContent>
            <TableList>
              {mockTables.map((table) => (
                <TableItem key={table.name}>
                  <TableIcon>{Icons.table}</TableIcon>
                  <TableInfo>
                    <TableName>{table.name}</TableName>
                    <TableMeta>{table.rows.toLocaleString()} rows • {table.schema}</TableMeta>
                  </TableInfo>
                </TableItem>
              ))}
            </TableList>
          </SectionContent>
        </Section>
      </SectionGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Connection Info</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <ConnectionInfo>
            <ConnectionRow>
              <ConnectionLabel>Host</ConnectionLabel>
              <div>
                <ConnectionValue>db.abcdefghij.supabase.co</ConnectionValue>
                <CopyButton>{Icons.copy}</CopyButton>
              </div>
            </ConnectionRow>
            <ConnectionRow>
              <ConnectionLabel>Port</ConnectionLabel>
              <div>
                <ConnectionValue>5432</ConnectionValue>
                <CopyButton>{Icons.copy}</CopyButton>
              </div>
            </ConnectionRow>
            <ConnectionRow>
              <ConnectionLabel>Database</ConnectionLabel>
              <div>
                <ConnectionValue>postgres</ConnectionValue>
                <CopyButton>{Icons.copy}</CopyButton>
              </div>
            </ConnectionRow>
            <ConnectionRow>
              <ConnectionLabel>User</ConnectionLabel>
              <div>
                <ConnectionValue>postgres</ConnectionValue>
                <CopyButton>{Icons.copy}</CopyButton>
              </div>
            </ConnectionRow>
          </ConnectionInfo>
        </SectionContent>
      </Section>
    </DashboardLayout>
  );
}
