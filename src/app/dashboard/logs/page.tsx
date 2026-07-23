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

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #232323;
  color: #EDEDED;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2A2A2A;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const FilterSelect = styled.select`
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

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  color: #8F8F8F;
  flex: 1;

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

const LogsContainer = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  overflow: hidden;
`;

const LogsHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: #232323;
  border-bottom: 1px solid #2E2E2E;
  font-size: 12px;
  font-weight: 600;
  color: #8F8F8F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LogsBody = styled.div`
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  max-height: 600px;
  overflow-y: auto;
`;

const LogEntry = styled.div<{ $level: string }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 10px 20px;
  border-bottom: 1px solid #232323;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LogTimestamp = styled.span`
  color: #5E5E5E;
  white-space: nowrap;
`;

const LogLevel = styled.span<{ $level: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  background: ${({ $level }) =>
    $level === 'error' ? 'rgba(245, 101, 101, 0.2)' :
    $level === 'warn' ? 'rgba(245, 166, 35, 0.2)' :
    $level === 'info' ? 'rgba(59, 130, 246, 0.2)' :
    'rgba(142, 142, 142, 0.2)'
  };
  color: ${({ $level }) =>
    $level === 'error' ? '#F56565' :
    $level === 'warn' ? '#F5A623' :
    $level === 'info' ? '#3B82F6' :
    '#8F8F8F'
  };
`;

const LogMessage = styled.span`
  color: #EDEDED;
  flex: 1;
  word-break: break-word;
`;

const LogSource = styled.span`
  color: #3ECF8E;
  white-space: nowrap;
`;

const mockLogs = [
  { timestamp: '2024-01-20 14:32:15.234', level: 'info', message: 'User signed in: john@example.com', source: 'auth' },
  { timestamp: '2024-01-20 14:32:14.891', level: 'info', message: 'SELECT * FROM profiles WHERE id = $1', source: 'postgres' },
  { timestamp: '2024-01-20 14:32:12.456', level: 'warn', message: 'Rate limit approaching for IP 192.168.1.1', source: 'api' },
  { timestamp: '2024-01-20 14:32:10.123', level: 'error', message: 'Failed to send email: SMTP connection timeout', source: 'edge-functions' },
  { timestamp: '2024-01-20 14:32:08.789', level: 'info', message: 'File uploaded: avatar-123.jpg (245KB)', source: 'storage' },
  { timestamp: '2024-01-20 14:32:06.345', level: 'info', message: 'INSERT INTO messages (content, user_id) VALUES ($1, $2)', source: 'postgres' },
  { timestamp: '2024-01-20 14:32:04.012', level: 'debug', message: 'Realtime connection established: client_abc123', source: 'realtime' },
  { timestamp: '2024-01-20 14:32:02.678', level: 'info', message: 'Edge function invoked: send-email', source: 'edge-functions' },
  { timestamp: '2024-01-20 14:32:00.234', level: 'warn', message: 'Slow query detected (456ms): SELECT * FROM large_table', source: 'postgres' },
  { timestamp: '2024-01-20 14:31:58.901', level: 'info', message: 'New user registered: alice@company.com', source: 'auth' },
];

export default function LogsPage() {
  const [filter, setFilter] = useState('all');
  const [source, setSource] = useState('all');

  const filteredLogs = mockLogs.filter(log => {
    if (filter !== 'all' && log.level !== filter) return false;
    if (source !== 'all' && log.source !== source) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Logs Explorer</Title>
        <HeaderActions>
          <Button>
            {Icons.refresh} Refresh
          </Button>
        </HeaderActions>
      </PageHeader>

      <FilterBar>
        <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Levels</option>
          <option value="error">Error</option>
          <option value="warn">Warning</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </FilterSelect>
        <FilterSelect value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="all">All Sources</option>
          <option value="postgres">Postgres</option>
          <option value="auth">Auth</option>
          <option value="storage">Storage</option>
          <option value="edge-functions">Edge Functions</option>
          <option value="realtime">Realtime</option>
          <option value="api">API</option>
        </FilterSelect>
        <SearchInput>
          {Icons.search}
          <input type="text" placeholder="Search logs..." />
        </SearchInput>
      </FilterBar>

      <LogsContainer>
        <LogsHeader>
          Showing {filteredLogs.length} log entries
        </LogsHeader>
        <LogsBody>
          {filteredLogs.map((log, i) => (
            <LogEntry key={i} $level={log.level}>
              <LogTimestamp>{log.timestamp}</LogTimestamp>
              <LogLevel $level={log.level}>{log.level}</LogLevel>
              <LogSource>[{log.source}]</LogSource>
              <LogMessage>{log.message}</LogMessage>
            </LogEntry>
          ))}
        </LogsBody>
      </LogsContainer>
    </DashboardLayout>
  );
}
