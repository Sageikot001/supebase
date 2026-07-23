'use client';

import { useState } from 'react';
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
  transition: all 0.15s;
  margin-bottom: -1px;

  &:hover {
    color: #EDEDED;
  }
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

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  color: #8F8F8F;
  width: 280px;

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #EDEDED;
    font-size: 13px;

    &::placeholder {
      color: #5E5E5E;
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #8F8F8F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #232323;
  border-bottom: 1px solid #2E2E2E;
`;

const Td = styled.td`
  padding: 14px 20px;
  font-size: 14px;
  color: #EDEDED;
  border-bottom: 1px solid #2E2E2E;
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8B5CF6, #3B82F6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
`;

const UserDetails = styled.div``;

const UserEmail = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin: 0;
`;

const UserId = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 0;
  font-family: 'Source Code Pro', monospace;
`;

const Badge = styled.span<{ $type?: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $type }) =>
    $type === 'confirmed' ? 'rgba(62, 207, 142, 0.2)' :
    $type === 'pending' ? 'rgba(245, 166, 35, 0.2)' :
    $type === 'banned' ? 'rgba(245, 101, 101, 0.2)' :
    'rgba(142, 142, 142, 0.2)'
  };
  color: ${({ $type }) =>
    $type === 'confirmed' ? '#3ECF8E' :
    $type === 'pending' ? '#F5A623' :
    $type === 'banned' ? '#F56565' :
    '#8F8F8F'
  };
`;

const ProviderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #232323;
  border-radius: 4px;
  font-size: 12px;
  color: #8F8F8F;

  svg {
    width: 14px;
    height: 14px;
  }
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

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #2E2E2E;
`;

const PaginationInfo = styled.span`
  font-size: 13px;
  color: #8F8F8F;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const mockUsers = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'john@example.com',
    provider: 'email',
    status: 'confirmed',
    createdAt: '2024-01-15T10:30:00Z',
    lastSignIn: '2024-01-20T14:22:00Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    email: 'jane.smith@gmail.com',
    provider: 'google',
    status: 'confirmed',
    createdAt: '2024-01-16T14:22:00Z',
    lastSignIn: '2024-01-19T09:15:00Z',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    email: 'bob.wilson@github.com',
    provider: 'github',
    status: 'confirmed',
    createdAt: '2024-01-17T09:15:00Z',
    lastSignIn: '2024-01-18T16:45:00Z',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    email: 'alice@company.com',
    provider: 'email',
    status: 'pending',
    createdAt: '2024-01-18T16:45:00Z',
    lastSignIn: null,
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
    email: 'charlie@example.com',
    provider: 'email',
    status: 'banned',
    createdAt: '2024-01-10T11:00:00Z',
    lastSignIn: '2024-01-12T08:30:00Z',
  },
];

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return Icons.globe;
      case 'github': return Icons.github;
      default: return Icons.key;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Authentication</Title>
        <HeaderActions>
          <Button $primary>
            {Icons.plus} Add User
          </Button>
        </HeaderActions>
      </PageHeader>

      <TabList>
        <Tab $active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </Tab>
        <Tab $active={activeTab === 'policies'} onClick={() => setActiveTab('policies')}>
          Policies
        </Tab>
        <Tab $active={activeTab === 'providers'} onClick={() => setActiveTab('providers')}>
          Providers
        </Tab>
        <Tab $active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>
          Email Templates
        </Tab>
        <Tab $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
          Settings
        </Tab>
      </TabList>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>All Users ({mockUsers.length})</SectionTitle>
          <SearchInput>
            {Icons.search}
            <input
              type="text"
              placeholder="Search by email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
        </SectionHeader>

        <TableContainer>
          <DataTable>
            <thead>
              <tr>
                <Th>User</Th>
                <Th>Provider</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Last Sign In</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <Td>
                    <UserInfo>
                      <UserAvatar>{getInitials(user.email)}</UserAvatar>
                      <UserDetails>
                        <UserEmail>{user.email}</UserEmail>
                        <UserId>{user.id.slice(0, 8)}...</UserId>
                      </UserDetails>
                    </UserInfo>
                  </Td>
                  <Td>
                    <ProviderBadge>
                      {getProviderIcon(user.provider)}
                      {user.provider}
                    </ProviderBadge>
                  </Td>
                  <Td>
                    <Badge $type={user.status}>{user.status}</Badge>
                  </Td>
                  <Td>{formatDate(user.createdAt)}</Td>
                  <Td>{formatDate(user.lastSignIn)}</Td>
                  <Td>
                    <ActionButton>
                      {Icons.more}
                    </ActionButton>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        </TableContainer>

        <Pagination>
          <PaginationInfo>Showing 1 to 5 of 1,284 users</PaginationInfo>
          <PaginationButtons>
            <Button>Previous</Button>
            <Button>Next</Button>
          </PaginationButtons>
        </Pagination>
      </ContentSection>
    </DashboardLayout>
  );
}
