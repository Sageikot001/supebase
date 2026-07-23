'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';
import { useSubscription } from '@/hooks/useSubscription';
import { useApiSubscriptions } from '@/hooks/useApiSubscriptions';

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #2E2E2E;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  color: ${({ $active }) => ($active ? '#EDEDED' : '#8F8F8F')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: -1px;

  &:hover {
    color: #EDEDED;
  }
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
  margin: 0 0 4px 0;
`;

const SectionDesc = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  font-size: 14px;
  color: #EDEDED;

  &:disabled {
    background: #1C1C1C;
    color: #5E5E5E;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: #3ECF8E;
  color: #171717;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #4FF5A8;
  }
`;

const ApiKeySection = styled.div`
  background: #232323;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ApiKeyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ApiKeyLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #8F8F8F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'active' ? 'rgba(62, 207, 142, 0.2)' :
    $status === 'trial' ? 'rgba(59, 130, 246, 0.2)' :
    'rgba(245, 166, 35, 0.2)'
  };
  color: ${({ $status }) =>
    $status === 'active' ? '#3ECF8E' :
    $status === 'trial' ? '#3B82F6' :
    '#F5A623'
  };
`;

const ApiKeyValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ApiKeyText = styled.code`
  font-size: 13px;
  font-family: 'Source Code Pro', monospace;
  color: #EDEDED;
  background: #171717;
  padding: 8px 12px;
  border-radius: 4px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyButton = styled.button`
  padding: 8px;
  background: transparent;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  color: #8F8F8F;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #EDEDED;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ApiExpiryText = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 8px 0 0 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #5E5E5E;
  margin: 0 0 16px 0;
`;

const BrowseButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background: #3ECF8E;
  color: #171717;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
`;

const PlanCard = styled.div<{ $plan: string }>`
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const PlanInfo = styled.div``;

const PlanLabel = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 0 0 4px 0;
  text-transform: uppercase;
`;

const PlanName = styled.p`
  font-size: 20px;
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
`;

const DangerZone = styled(Section)`
  border-color: rgba(245, 101, 101, 0.3);
`;

const DangerHeader = styled(SectionHeader)`
  background: rgba(245, 101, 101, 0.1);
  border-color: rgba(245, 101, 101, 0.3);
`;

const DangerTitle = styled(SectionTitle)`
  color: #F56565;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #2E2E2E;

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleInfo = styled.div``;

const ToggleLabel = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const ToggleDesc = styled.p`
  font-size: 13px;
  color: #5E5E5E;
  margin: 0;
`;

const DangerButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: #F56565;
  border: 1px solid #F56565;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #F56565;
    color: #FFFFFF;
  }
`;

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { subscription } = useSubscription();
  const { subscriptions: apiSubs, loading: apiLoading } = useApiSubscriptions();
  const [activeTab, setActiveTab] = useState('general');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/settings');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  const currentPlan = subscription?.plan || 'free';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Project Settings</Title>
        <Subtitle>Manage your project configuration</Subtitle>
      </PageHeader>

      <TabList>
        <Tab $active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
          General
        </Tab>
        <Tab $active={activeTab === 'api'} onClick={() => setActiveTab('api')}>
          Project API
        </Tab>
        <Tab $active={activeTab === 'marketplace'} onClick={() => setActiveTab('marketplace')}>
          Marketplace APIs
        </Tab>
        <Tab $active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}>
          Billing
        </Tab>
      </TabList>

      {activeTab === 'general' && (
        <>
          <Section>
            <SectionHeader>
              <SectionTitle>Project Information</SectionTitle>
              <SectionDesc>Basic project details</SectionDesc>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>Project Name</Label>
                <Input type="text" defaultValue="My Project" placeholder="Project name" />
              </FormGroup>
              <FormGroup>
                <Label>Project Reference</Label>
                <Input type="text" value="ubawvowaojpsuxvgyeqe" disabled />
              </FormGroup>
              <FormGroup>
                <Label>Region</Label>
                <Input type="text" value="East US (Virginia)" disabled />
              </FormGroup>
              <ButtonGroup>
                <SaveButton>Save Changes</SaveButton>
              </ButtonGroup>
            </SectionContent>
          </Section>

          <DangerZone>
            <DangerHeader>
              <DangerTitle>Danger Zone</DangerTitle>
              <SectionDesc>Irreversible actions</SectionDesc>
            </DangerHeader>
            <SectionContent>
              <ToggleRow>
                <ToggleInfo>
                  <ToggleLabel>Pause Project</ToggleLabel>
                  <ToggleDesc>Temporarily pause this project</ToggleDesc>
                </ToggleInfo>
                <DangerButton>Pause Project</DangerButton>
              </ToggleRow>
              <ToggleRow>
                <ToggleInfo>
                  <ToggleLabel>Delete Project</ToggleLabel>
                  <ToggleDesc>Permanently delete this project and all data</ToggleDesc>
                </ToggleInfo>
                <DangerButton>Delete Project</DangerButton>
              </ToggleRow>
            </SectionContent>
          </DangerZone>
        </>
      )}

      {activeTab === 'api' && (
        <Section>
          <SectionHeader>
            <SectionTitle>Project API Keys</SectionTitle>
            <SectionDesc>Credentials for accessing your Supebase project</SectionDesc>
          </SectionHeader>
          <SectionContent>
            <ApiKeySection>
              <ApiKeyHeader>
                <ApiKeyLabel>Project URL</ApiKeyLabel>
              </ApiKeyHeader>
              <ApiKeyValue>
                <ApiKeyText>https://ubawvowaojpsuxvgyeqe.supabase.co</ApiKeyText>
                <CopyButton onClick={() => copyToClipboard('https://ubawvowaojpsuxvgyeqe.supabase.co', 'url')}>
                  {copiedKey === 'url' ? '✓' : Icons.copy}
                </CopyButton>
              </ApiKeyValue>
            </ApiKeySection>
            <ApiKeySection>
              <ApiKeyHeader>
                <ApiKeyLabel>Anon Key (Public)</ApiKeyLabel>
              </ApiKeyHeader>
              <ApiKeyValue>
                <ApiKeyText>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</ApiKeyText>
                <CopyButton onClick={() => copyToClipboard('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'anon')}>
                  {copiedKey === 'anon' ? '✓' : Icons.copy}
                </CopyButton>
              </ApiKeyValue>
            </ApiKeySection>
            <ApiKeySection>
              <ApiKeyHeader>
                <ApiKeyLabel>Service Role Key (Secret)</ApiKeyLabel>
              </ApiKeyHeader>
              <ApiKeyValue>
                <ApiKeyText>••••••••••••••••••••••••••••••••</ApiKeyText>
                <CopyButton>{Icons.copy}</CopyButton>
              </ApiKeyValue>
            </ApiKeySection>
          </SectionContent>
        </Section>
      )}

      {activeTab === 'marketplace' && (
        <Section>
          <SectionHeader>
            <SectionTitle>Marketplace API Subscriptions</SectionTitle>
            <SectionDesc>APIs you&apos;ve subscribed to from the marketplace</SectionDesc>
          </SectionHeader>
          <SectionContent>
            {apiLoading ? (
              <EmptyState>
                <EmptyText>Loading...</EmptyText>
              </EmptyState>
            ) : apiSubs.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🛒</EmptyIcon>
                <EmptyText>No API subscriptions yet</EmptyText>
                <BrowseButton href="/dashboard/marketplace">Browse Marketplace</BrowseButton>
              </EmptyState>
            ) : (
              apiSubs.map(sub => (
                <ApiKeySection key={sub.id}>
                  <ApiKeyHeader>
                    <ApiKeyLabel>{sub.api_name}</ApiKeyLabel>
                    <StatusBadge $status={sub.status}>
                      {sub.status === 'trial' ? 'Free Trial' : sub.status}
                    </StatusBadge>
                  </ApiKeyHeader>
                  <ApiKeyValue>
                    <ApiKeyText>{sub.api_key}</ApiKeyText>
                    <CopyButton onClick={() => copyToClipboard(sub.api_key, sub.id)}>
                      {copiedKey === sub.id ? '✓' : Icons.copy}
                    </CopyButton>
                  </ApiKeyValue>
                  <ApiExpiryText>
                    {sub.status === 'trial'
                      ? `Trial ends: ${formatDate(sub.trial_ends_at || sub.expires_at)}`
                      : `Renews: ${formatDate(sub.expires_at)}`
                    }
                  </ApiExpiryText>
                </ApiKeySection>
              ))
            )}
          </SectionContent>
        </Section>
      )}

      {activeTab === 'billing' && (
        <>
          <Section>
            <SectionHeader>
              <SectionTitle>Current Plan</SectionTitle>
              <SectionDesc>Your Supebase subscription</SectionDesc>
            </SectionHeader>
            <SectionContent>
              <PlanCard $plan={currentPlan}>
                <PlanInfo>
                  <PlanLabel>Current Plan</PlanLabel>
                  <PlanName>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</PlanName>
                </PlanInfo>
                {currentPlan === 'free' ? (
                  <UpgradeButton href="/pricing">Upgrade to Pro</UpgradeButton>
                ) : currentPlan === 'pro' ? (
                  <UpgradeButton href="/pricing">Upgrade to Team</UpgradeButton>
                ) : null}
              </PlanCard>
            </SectionContent>
          </Section>
        </>
      )}
    </DashboardLayout>
  );
}
