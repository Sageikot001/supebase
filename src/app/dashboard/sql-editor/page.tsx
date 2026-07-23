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

const QueryList = styled.div`
  width: 260px;
  background: #1C1C1C;
  border-right: 1px solid #2E2E2E;
  display: flex;
  flex-direction: column;
`;

const QueryListHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #2E2E2E;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QueryListTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #8F8F8F;
  margin: 0;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #8F8F8F;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2A2A2A;
    color: #EDEDED;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const QuerySection = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const QueryGroup = styled.div`
  padding: 8px 0;
`;

const QueryGroupTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #5E5E5E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;

  &:hover {
    color: #8F8F8F;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const QueryItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 32px;
  background: ${({ $active }) => ($active ? 'rgba(62, 207, 142, 0.1)' : 'transparent')};
  border: none;
  border-left: 2px solid ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  color: ${({ $active }) => ($active ? '#EDEDED' : '#8F8F8F')};
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #EDEDED;
  }

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
  }
`;

const EditorSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const EditorToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #232323;
  border-bottom: 1px solid #2E2E2E;
`;

const TabList = styled.div`
  display: flex;
  gap: 4px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ $active }) => ($active ? '#1C1C1C' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? '#2E2E2E' : 'transparent')};
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  color: ${({ $active }) => ($active ? '#EDEDED' : '#8F8F8F')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: #EDEDED;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CloseTab = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CodeEditor = styled.div`
  flex: 1;
  display: flex;
  background: #1C1C1C;
`;

const LineNumbers = styled.div`
  padding: 16px 0;
  background: #171717;
  border-right: 1px solid #2E2E2E;
  min-width: 50px;
  text-align: right;
`;

const LineNumber = styled.div`
  padding: 0 12px;
  font-size: 13px;
  font-family: 'Source Code Pro', monospace;
  color: #5E5E5E;
  line-height: 1.6;
`;

const CodeArea = styled.textarea`
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  font-family: 'Source Code Pro', monospace;
  color: #EDEDED;
  line-height: 1.6;

  &::placeholder {
    color: #5E5E5E;
  }
`;

const Divider = styled.div`
  height: 4px;
  background: #232323;
  cursor: row-resize;
  border-top: 1px solid #2E2E2E;
  border-bottom: 1px solid #2E2E2E;
`;

const ResultsSection = styled.div`
  height: 280px;
  background: #171717;
  border-top: 1px solid #2E2E2E;
  display: flex;
  flex-direction: column;
`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #2E2E2E;
`;

const ResultsTabs = styled.div`
  display: flex;
  gap: 16px;
`;

const ResultTab = styled.button<{ $active?: boolean }>`
  padding: 4px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  color: ${({ $active }) => ($active ? '#EDEDED' : '#8F8F8F')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: #EDEDED;
  }
`;

const ResultStats = styled.span`
  font-size: 12px;
  color: #5E5E5E;
`;

const ResultsContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const ResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ResultTh = styled.th`
  padding: 10px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #8F8F8F;
  background: #1C1C1C;
  border-bottom: 1px solid #2E2E2E;
  position: sticky;
  top: 0;
`;

const ResultTd = styled.td`
  padding: 10px 16px;
  font-size: 13px;
  font-family: 'Source Code Pro', monospace;
  color: #EDEDED;
  border-bottom: 1px solid #232323;
`;

const ResultRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const savedQueries = [
  { id: 1, name: 'Get all users', category: 'Users' },
  { id: 2, name: 'Active subscriptions', category: 'Billing' },
  { id: 3, name: 'Recent signups', category: 'Users' },
  { id: 4, name: 'Storage usage', category: 'Analytics' },
];

const defaultQuery = `-- Select all users with their subscription status
SELECT
  p.id,
  p.email,
  p.name,
  s.plan,
  s.status
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE s.status = 'active'
ORDER BY p.created_at DESC
LIMIT 100;`;

const mockResults = [
  { id: 1, email: 'john@example.com', name: 'John Doe', plan: 'pro', status: 'active' },
  { id: 2, email: 'jane@example.com', name: 'Jane Smith', plan: 'team', status: 'active' },
  { id: 3, email: 'bob@example.com', name: 'Bob Wilson', plan: 'pro', status: 'active' },
  { id: 4, email: 'alice@example.com', name: 'Alice Johnson', plan: 'free', status: 'active' },
  { id: 5, email: 'charlie@example.com', name: 'Charlie Brown', plan: 'pro', status: 'active' },
];

export default function SQLEditorPage() {
  const [query, setQuery] = useState(defaultQuery);
  const [activeTab, setActiveTab] = useState('results');

  const lineCount = query.split('\n').length;

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>SQL Editor</Title>
        <HeaderActions>
          <Button>
            {Icons.plus} New Query
          </Button>
        </HeaderActions>
      </PageHeader>

      <ContentWrapper>
        <QueryList>
          <QueryListHeader>
            <QueryListTitle>Queries</QueryListTitle>
            <IconButton>{Icons.plus}</IconButton>
          </QueryListHeader>
          <QuerySection>
            <QueryGroup>
              <QueryGroupTitle>
                {Icons.chevronDown} Saved Queries
              </QueryGroupTitle>
              {savedQueries.map((q) => (
                <QueryItem key={q.id}>
                  {Icons.file}
                  {q.name}
                </QueryItem>
              ))}
            </QueryGroup>
            <QueryGroup>
              <QueryGroupTitle>
                {Icons.chevronDown} Templates
              </QueryGroupTitle>
              <QueryItem>
                {Icons.file}
                Select all rows
              </QueryItem>
              <QueryItem>
                {Icons.file}
                Insert row
              </QueryItem>
              <QueryItem>
                {Icons.file}
                Update row
              </QueryItem>
              <QueryItem>
                {Icons.file}
                Delete row
              </QueryItem>
            </QueryGroup>
          </QuerySection>
        </QueryList>

        <EditorSection>
          <EditorToolbar>
            <TabList>
              <Tab $active>
                {Icons.file}
                Query 1
                <CloseTab>{Icons.close}</CloseTab>
              </Tab>
            </TabList>
            <ToolbarActions>
              <Button $primary>
                {Icons.play} Run
              </Button>
            </ToolbarActions>
          </EditorToolbar>

          <EditorArea>
            <CodeEditor>
              <LineNumbers>
                {Array.from({ length: lineCount }, (_, i) => (
                  <LineNumber key={i}>{i + 1}</LineNumber>
                ))}
              </LineNumbers>
              <CodeArea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your SQL query..."
                spellCheck={false}
              />
            </CodeEditor>

            <Divider />

            <ResultsSection>
              <ResultsHeader>
                <ResultsTabs>
                  <ResultTab $active={activeTab === 'results'} onClick={() => setActiveTab('results')}>
                    Results
                  </ResultTab>
                  <ResultTab $active={activeTab === 'messages'} onClick={() => setActiveTab('messages')}>
                    Messages
                  </ResultTab>
                </ResultsTabs>
                <ResultStats>5 rows • 12ms</ResultStats>
              </ResultsHeader>
              <ResultsContent>
                <ResultTable>
                  <thead>
                    <tr>
                      <ResultTh>id</ResultTh>
                      <ResultTh>email</ResultTh>
                      <ResultTh>name</ResultTh>
                      <ResultTh>plan</ResultTh>
                      <ResultTh>status</ResultTh>
                    </tr>
                  </thead>
                  <tbody>
                    {mockResults.map((row) => (
                      <ResultRow key={row.id}>
                        <ResultTd>{row.id}</ResultTd>
                        <ResultTd>{row.email}</ResultTd>
                        <ResultTd>{row.name}</ResultTd>
                        <ResultTd>{row.plan}</ResultTd>
                        <ResultTd>{row.status}</ResultTd>
                      </ResultRow>
                    ))}
                  </tbody>
                </ResultTable>
              </ResultsContent>
            </ResultsSection>
          </EditorArea>
        </EditorSection>
      </ContentWrapper>
    </DashboardLayout>
  );
}
