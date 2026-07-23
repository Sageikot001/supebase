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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  height: calc(100vh - 140px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
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

const TableSection = styled.div`
  padding: 8px 0;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
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

const TableItem = styled.button<{ $active?: boolean }>`
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

const MainContent = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #2E2E2E;
`;

const TableTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const TableDescription = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
  padding: 0 20px;
  border-bottom: 1px solid #2E2E2E;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
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

const CodeSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const CodeBlock = styled.pre`
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  padding: 16px;
  margin: 0 0 16px 0;
  overflow-x: auto;
  font-size: 13px;
  font-family: 'Source Code Pro', monospace;
  line-height: 1.6;
  color: #EDEDED;

  .comment { color: #5E5E5E; }
  .keyword { color: #C792EA; }
  .string { color: #C3E88D; }
  .function { color: #82AAFF; }
  .number { color: #F78C6C; }
`;

const EndpointSection = styled.div`
  margin-bottom: 24px;
`;

const EndpointHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const HttpMethod = styled.span<{ $method: string }>`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $method }) =>
    $method === 'GET' ? 'rgba(62, 207, 142, 0.2)' :
    $method === 'POST' ? 'rgba(59, 130, 246, 0.2)' :
    $method === 'PATCH' ? 'rgba(245, 166, 35, 0.2)' :
    $method === 'DELETE' ? 'rgba(245, 101, 101, 0.2)' :
    'rgba(142, 142, 142, 0.2)'
  };
  color: ${({ $method }) =>
    $method === 'GET' ? '#3ECF8E' :
    $method === 'POST' ? '#3B82F6' :
    $method === 'PATCH' ? '#F5A623' :
    $method === 'DELETE' ? '#F56565' :
    '#8F8F8F'
  };
`;

const EndpointPath = styled.span`
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  color: #EDEDED;
`;

const EndpointDescription = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0 0 12px 0;
`;

const mockTables = [
  'profiles',
  'subscriptions',
  'projects',
  'organizations',
  'storage_objects',
];

export default function APIDocsPage() {
  const [selectedTable, setSelectedTable] = useState('profiles');
  const [activeTab, setActiveTab] = useState('javascript');

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>API Documentation</Title>
      </PageHeader>

      <ContentGrid>
        <Sidebar>
          <SidebarHeader>
            <SearchInput>
              {Icons.search}
              <input type="text" placeholder="Search tables..." />
            </SearchInput>
          </SidebarHeader>
          <TableSection>
            <TableHeader>
              {Icons.chevronDown} Tables
            </TableHeader>
            {mockTables.map((table) => (
              <TableItem
                key={table}
                $active={selectedTable === table}
                onClick={() => setSelectedTable(table)}
              >
                {Icons.table}
                {table}
              </TableItem>
            ))}
          </TableSection>
        </Sidebar>

        <MainContent>
          <ContentHeader>
            <TableTitle>{selectedTable}</TableTitle>
            <TableDescription>
              Auto-generated API for the {selectedTable} table
            </TableDescription>
          </ContentHeader>

          <TabList>
            <Tab $active={activeTab === 'javascript'} onClick={() => setActiveTab('javascript')}>
              JavaScript
            </Tab>
            <Tab $active={activeTab === 'curl'} onClick={() => setActiveTab('curl')}>
              cURL
            </Tab>
          </TabList>

          <CodeSection>
            <EndpointSection>
              <EndpointHeader>
                <HttpMethod $method="GET">GET</HttpMethod>
                <EndpointPath>/rest/v1/{selectedTable}</EndpointPath>
              </EndpointHeader>
              <EndpointDescription>
                Fetch all rows from the {selectedTable} table
              </EndpointDescription>
              <CodeBlock>
                {activeTab === 'javascript' ? (
                  <>
                    <span className="keyword">const</span> {'{ data, error }'} = <span className="keyword">await</span> supabase{'\n'}
                    {'  '}.from(<span className="string">&apos;{selectedTable}&apos;</span>){'\n'}
                    {'  '}.select(<span className="string">&apos;*&apos;</span>)
                  </>
                ) : (
                  <>
                    curl <span className="string">&apos;https://your-project.supabase.co/rest/v1/{selectedTable}&apos;</span> \{'\n'}
                    {'  '}-H <span className="string">&quot;apikey: YOUR_ANON_KEY&quot;</span> \{'\n'}
                    {'  '}-H <span className="string">&quot;Authorization: Bearer YOUR_ANON_KEY&quot;</span>
                  </>
                )}
              </CodeBlock>
            </EndpointSection>

            <EndpointSection>
              <EndpointHeader>
                <HttpMethod $method="POST">POST</HttpMethod>
                <EndpointPath>/rest/v1/{selectedTable}</EndpointPath>
              </EndpointHeader>
              <EndpointDescription>
                Insert a new row into the {selectedTable} table
              </EndpointDescription>
              <CodeBlock>
                {activeTab === 'javascript' ? (
                  <>
                    <span className="keyword">const</span> {'{ data, error }'} = <span className="keyword">await</span> supabase{'\n'}
                    {'  '}.from(<span className="string">&apos;{selectedTable}&apos;</span>){'\n'}
                    {'  '}.insert({'{'} column: <span className="string">&apos;value&apos;</span> {'}'})
                  </>
                ) : (
                  <>
                    curl -X POST <span className="string">&apos;https://your-project.supabase.co/rest/v1/{selectedTable}&apos;</span> \{'\n'}
                    {'  '}-H <span className="string">&quot;apikey: YOUR_ANON_KEY&quot;</span> \{'\n'}
                    {'  '}-H <span className="string">&quot;Content-Type: application/json&quot;</span> \{'\n'}
                    {'  '}-d <span className="string">&apos;{'{"column": "value"}'}&apos;</span>
                  </>
                )}
              </CodeBlock>
            </EndpointSection>

            <EndpointSection>
              <EndpointHeader>
                <HttpMethod $method="PATCH">PATCH</HttpMethod>
                <EndpointPath>/rest/v1/{selectedTable}?id=eq.1</EndpointPath>
              </EndpointHeader>
              <EndpointDescription>
                Update rows in the {selectedTable} table
              </EndpointDescription>
              <CodeBlock>
                {activeTab === 'javascript' ? (
                  <>
                    <span className="keyword">const</span> {'{ data, error }'} = <span className="keyword">await</span> supabase{'\n'}
                    {'  '}.from(<span className="string">&apos;{selectedTable}&apos;</span>){'\n'}
                    {'  '}.update({'{'} column: <span className="string">&apos;new_value&apos;</span> {'}'}){'\n'}
                    {'  '}.eq(<span className="string">&apos;id&apos;</span>, <span className="number">1</span>)
                  </>
                ) : (
                  <>
                    curl -X PATCH <span className="string">&apos;https://your-project.supabase.co/rest/v1/{selectedTable}?id=eq.1&apos;</span> \{'\n'}
                    {'  '}-H <span className="string">&quot;apikey: YOUR_ANON_KEY&quot;</span> \{'\n'}
                    {'  '}-H <span className="string">&quot;Content-Type: application/json&quot;</span> \{'\n'}
                    {'  '}-d <span className="string">&apos;{'{"column": "new_value"}'}&apos;</span>
                  </>
                )}
              </CodeBlock>
            </EndpointSection>

            <EndpointSection>
              <EndpointHeader>
                <HttpMethod $method="DELETE">DELETE</HttpMethod>
                <EndpointPath>/rest/v1/{selectedTable}?id=eq.1</EndpointPath>
              </EndpointHeader>
              <EndpointDescription>
                Delete rows from the {selectedTable} table
              </EndpointDescription>
              <CodeBlock>
                {activeTab === 'javascript' ? (
                  <>
                    <span className="keyword">const</span> {'{ data, error }'} = <span className="keyword">await</span> supabase{'\n'}
                    {'  '}.from(<span className="string">&apos;{selectedTable}&apos;</span>){'\n'}
                    {'  '}.delete(){'\n'}
                    {'  '}.eq(<span className="string">&apos;id&apos;</span>, <span className="number">1</span>)
                  </>
                ) : (
                  <>
                    curl -X DELETE <span className="string">&apos;https://your-project.supabase.co/rest/v1/{selectedTable}?id=eq.1&apos;</span> \{'\n'}
                    {'  '}-H <span className="string">&quot;apikey: YOUR_ANON_KEY&quot;</span>
                  </>
                )}
              </CodeBlock>
            </EndpointSection>
          </CodeSection>
        </MainContent>
      </ContentGrid>
    </DashboardLayout>
  );
}
