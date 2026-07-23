'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';
import { useSubscription } from '@/hooks/useSubscription';

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Greeting = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0;
`;

const QuickStartSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 16px 0;
`;

const QuickStartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const QuickStartCard = styled(Link)`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  align-items: flex-start;
  gap: 16px;

  &:hover {
    border-color: #3ECF8E;
    transform: translateY(-2px);
  }
`;

const QuickStartIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(62, 207, 142, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3ECF8E;
  flex-shrink: 0;
`;

const QuickStartContent = styled.div``;

const QuickStartTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const QuickStartDescription = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 0;
  line-height: 1.5;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2E2E2E;
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

const EmptySection = styled.div`
  padding: 40px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #5E5E5E;
  margin: 0;
`;

const ResourceCard = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  text-decoration: none;
  border-bottom: 1px solid #2E2E2E;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const ResourceIcon = styled.div`
  width: 36px;
  height: 36px;
  background: #232323;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8F8F8F;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ResourceContent = styled.div`
  flex: 1;
`;

const ResourceTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin: 0 0 2px 0;
`;

const ResourceDescription = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 0;
`;

const ResourceArrow = styled.span`
  color: #3E3E3E;
`;

const PlanBanner = styled.div<{ $plan: string }>`
  background: ${({ $plan }) =>
    $plan === 'free' ? '#232323' :
    $plan === 'pro' ? 'rgba(62, 207, 142, 0.1)' :
    'rgba(59, 130, 246, 0.1)'
  };
  border: 1px solid ${({ $plan }) =>
    $plan === 'free' ? '#2E2E2E' :
    $plan === 'pro' ? 'rgba(62, 207, 142, 0.3)' :
    'rgba(59, 130, 246, 0.3)'
  };
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlanInfo = styled.div``;

const PlanLabel = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PlanName = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0;
`;

const UpgradeButton = styled(Link)`
  padding: 10px 20px;
  background: #3ECF8E;
  color: #171717;
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #4FF5A8;
  }
`;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { subscription } = useSubscription();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  const firstName = session.user?.name?.split(' ')[0] || 'there';
  const currentPlan = subscription?.plan || 'free';

  return (
    <DashboardLayout>
      <PageHeader>
        <Greeting>Welcome back, {firstName}</Greeting>
        <Subtitle>Manage your Supebase project</Subtitle>
      </PageHeader>

      {currentPlan === 'free' && (
        <PlanBanner $plan={currentPlan}>
          <PlanInfo>
            <PlanLabel>Current Plan</PlanLabel>
            <PlanName>Free Tier</PlanName>
          </PlanInfo>
          <UpgradeButton href="/pricing">Upgrade to Pro</UpgradeButton>
        </PlanBanner>
      )}

      <QuickStartSection>
        <SectionTitle>Quick Start</SectionTitle>
        <QuickStartGrid>
          <QuickStartCard href="/dashboard/table-editor">
            <QuickStartIcon>{Icons.table}</QuickStartIcon>
            <QuickStartContent>
              <QuickStartTitle>Create a table</QuickStartTitle>
              <QuickStartDescription>
                Start with a new database table using the Table Editor
              </QuickStartDescription>
            </QuickStartContent>
          </QuickStartCard>
          <QuickStartCard href="/dashboard/sql-editor">
            <QuickStartIcon>{Icons.sql}</QuickStartIcon>
            <QuickStartContent>
              <QuickStartTitle>Write SQL</QuickStartTitle>
              <QuickStartDescription>
                Execute SQL queries directly in the SQL Editor
              </QuickStartDescription>
            </QuickStartContent>
          </QuickStartCard>
          <QuickStartCard href="/dashboard/marketplace">
            <QuickStartIcon>{Icons.overview}</QuickStartIcon>
            <QuickStartContent>
              <QuickStartTitle>Browse APIs</QuickStartTitle>
              <QuickStartDescription>
                Discover APIs in the marketplace to enhance your app
              </QuickStartDescription>
            </QuickStartContent>
          </QuickStartCard>
          <QuickStartCard href="/dashboard/api">
            <QuickStartIcon>{Icons.api}</QuickStartIcon>
            <QuickStartContent>
              <QuickStartTitle>View API Docs</QuickStartTitle>
              <QuickStartDescription>
                Explore your auto-generated API documentation
              </QuickStartDescription>
            </QuickStartContent>
          </QuickStartCard>
        </QuickStartGrid>
      </QuickStartSection>

      <ContentGrid>
        <Section>
          <SectionHeader>
            <SectionTitle style={{ margin: 0 }}>Recent Activity</SectionTitle>
            <SectionLink href="/dashboard/logs">
              View all {Icons.arrowRight}
            </SectionLink>
          </SectionHeader>
          <EmptySection>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>No recent activity yet. Start by creating a table or running a query.</EmptyText>
          </EmptySection>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle style={{ margin: 0 }}>Resources</SectionTitle>
          </SectionHeader>
          <ResourceCard href="#">
            <ResourceIcon>{Icons.book}</ResourceIcon>
            <ResourceContent>
              <ResourceTitle>Documentation</ResourceTitle>
              <ResourceDescription>Learn how to use Supebase</ResourceDescription>
            </ResourceContent>
            <ResourceArrow>{Icons.external}</ResourceArrow>
          </ResourceCard>
          <ResourceCard href="#">
            <ResourceIcon>{Icons.github}</ResourceIcon>
            <ResourceContent>
              <ResourceTitle>GitHub</ResourceTitle>
              <ResourceDescription>View source code</ResourceDescription>
            </ResourceContent>
            <ResourceArrow>{Icons.external}</ResourceArrow>
          </ResourceCard>
        </Section>
      </ContentGrid>
    </DashboardLayout>
  );
}
