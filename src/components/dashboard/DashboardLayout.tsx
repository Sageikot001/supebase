'use client';

import styled from 'styled-components';
import Sidebar from './Sidebar';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #171717;
  display: flex;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  padding: 24px 32px;
  max-width: 1400px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </PageWrapper>
  );
}
