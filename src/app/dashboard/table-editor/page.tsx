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
    border-color: ${({ $primary }) => ($primary ? '#4FF5A8' : '#3E3E3E')};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 0;
  height: calc(100vh - 140px);
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  overflow: hidden;
`;

const TableList = styled.div`
  width: 260px;
  background: #1C1C1C;
  border-right: 1px solid #2E2E2E;
  display: flex;
  flex-direction: column;
`;

const TableListHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #2E2E2E;
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

const SchemaSection = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const SchemaHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #5E5E5E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: ${({ $active }) => ($active ? 'rgba(62, 207, 142, 0.1)' : 'transparent')};
  border: none;
  border-left: 2px solid ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  color: ${({ $active }) => ($active ? '#EDEDED' : '#8F8F8F')};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #EDEDED;
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;

const TableIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5E5E5E;
`;

const TableContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TableToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #232323;
  border-bottom: 1px solid #2E2E2E;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
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

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #232323;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #8F8F8F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #2E2E2E;
  white-space: nowrap;

  &:first-child {
    padding-left: 20px;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #EDEDED;
  border-bottom: 1px solid #2E2E2E;
  font-family: 'Source Code Pro', monospace;

  &:first-child {
    padding-left: 20px;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const Badge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $type }) =>
    $type === 'int8' || $type === 'int4' ? 'rgba(59, 130, 246, 0.2)' :
    $type === 'text' || $type === 'varchar' ? 'rgba(62, 207, 142, 0.2)' :
    $type === 'bool' ? 'rgba(245, 166, 35, 0.2)' :
    $type === 'timestamp' ? 'rgba(139, 92, 246, 0.2)' :
    'rgba(142, 142, 142, 0.2)'
  };
  color: ${({ $type }) =>
    $type === 'int8' || $type === 'int4' ? '#3B82F6' :
    $type === 'text' || $type === 'varchar' ? '#3ECF8E' :
    $type === 'bool' ? '#F5A623' :
    $type === 'timestamp' ? '#8B5CF6' :
    '#8F8F8F'
  };
`;

const NullValue = styled.span`
  color: #5E5E5E;
  font-style: italic;
`;

const mockTables = [
  { name: 'profiles', schema: 'public', rowCount: 1284 },
  { name: 'subscriptions', schema: 'public', rowCount: 856 },
  { name: 'projects', schema: 'public', rowCount: 423 },
  { name: 'organizations', schema: 'public', rowCount: 156 },
  { name: 'auth_users', schema: 'auth', rowCount: 1284 },
  { name: 'storage_objects', schema: 'storage', rowCount: 2341 },
];

const mockColumns = [
  { name: 'id', type: 'int8', isPrimary: true },
  { name: 'email', type: 'varchar' },
  { name: 'name', type: 'text' },
  { name: 'is_active', type: 'bool' },
  { name: 'created_at', type: 'timestamp' },
];

const mockData = [
  { id: 1, email: 'john@example.com', name: 'John Doe', is_active: true, created_at: '2024-01-15T10:30:00Z' },
  { id: 2, email: 'jane@example.com', name: 'Jane Smith', is_active: true, created_at: '2024-01-16T14:22:00Z' },
  { id: 3, email: 'bob@example.com', name: 'Bob Wilson', is_active: false, created_at: '2024-01-17T09:15:00Z' },
  { id: 4, email: 'alice@example.com', name: null, is_active: true, created_at: '2024-01-18T16:45:00Z' },
  { id: 5, email: 'charlie@example.com', name: 'Charlie Brown', is_active: true, created_at: '2024-01-19T11:00:00Z' },
];

export default function TableEditorPage() {
  const [selectedTable, setSelectedTable] = useState('profiles');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTables = mockTables.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatValue = (value: unknown, type: string) => {
    if (value === null) return <NullValue>NULL</NullValue>;
    if (type === 'bool') return value ? 'true' : 'false';
    if (type === 'timestamp') return new Date(value as string).toLocaleString();
    return String(value);
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Table Editor</Title>
        <HeaderActions>
          <Button>
            {Icons.plus} New Table
          </Button>
        </HeaderActions>
      </PageHeader>

      <ContentWrapper>
        <TableList>
          <TableListHeader>
            <SearchInput>
              {Icons.search}
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInput>
          </TableListHeader>
          <SchemaSection>
            <SchemaHeader>
              <span>public</span>
              <span>{filteredTables.filter(t => t.schema === 'public').length}</span>
            </SchemaHeader>
            {filteredTables
              .filter(t => t.schema === 'public')
              .map((table) => (
                <TableItem
                  key={table.name}
                  $active={selectedTable === table.name}
                  onClick={() => setSelectedTable(table.name)}
                >
                  <TableIcon>{Icons.table}</TableIcon>
                  {table.name}
                </TableItem>
              ))}
            <SchemaHeader>
              <span>auth</span>
              <span>{filteredTables.filter(t => t.schema === 'auth').length}</span>
            </SchemaHeader>
            {filteredTables
              .filter(t => t.schema === 'auth')
              .map((table) => (
                <TableItem
                  key={table.name}
                  $active={selectedTable === table.name}
                  onClick={() => setSelectedTable(table.name)}
                >
                  <TableIcon>{Icons.table}</TableIcon>
                  {table.name}
                </TableItem>
              ))}
            <SchemaHeader>
              <span>storage</span>
              <span>{filteredTables.filter(t => t.schema === 'storage').length}</span>
            </SchemaHeader>
            {filteredTables
              .filter(t => t.schema === 'storage')
              .map((table) => (
                <TableItem
                  key={table.name}
                  $active={selectedTable === table.name}
                  onClick={() => setSelectedTable(table.name)}
                >
                  <TableIcon>{Icons.table}</TableIcon>
                  {table.name}
                </TableItem>
              ))}
          </SchemaSection>
        </TableList>

        <TableContent>
          <TableToolbar>
            <ToolbarLeft>
              <Button $primary>
                {Icons.plus} Insert row
              </Button>
              <Button>
                {Icons.edit} Edit column
              </Button>
            </ToolbarLeft>
            <ToolbarRight>
              <IconButton title="Refresh">
                {Icons.refresh}
              </IconButton>
              <IconButton title="Filter">
                {Icons.search}
              </IconButton>
              <IconButton title="More options">
                {Icons.more}
              </IconButton>
            </ToolbarRight>
          </TableToolbar>

          <TableContainer>
            <DataTable>
              <TableHead>
                <tr>
                  {mockColumns.map((col) => (
                    <Th key={col.name}>
                      {col.name}
                      {' '}
                      <Badge $type={col.type}>{col.type}</Badge>
                    </Th>
                  ))}
                </tr>
              </TableHead>
              <tbody>
                {mockData.map((row) => (
                  <TableRow key={row.id}>
                    {mockColumns.map((col) => (
                      <Td key={col.name}>
                        {formatValue(row[col.name as keyof typeof row], col.type)}
                      </Td>
                    ))}
                  </TableRow>
                ))}
              </tbody>
            </DataTable>
          </TableContainer>
        </TableContent>
      </ContentWrapper>
    </DashboardLayout>
  );
}
