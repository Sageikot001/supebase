'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Icons } from '@/components/icons';
import { useSubscription } from '@/hooks/useSubscription';

const SidebarWrapper = styled.aside`
  width: 240px;
  background: #1C1C1C;
  border-right: 1px solid #2E2E2E;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoSection = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #2E2E2E;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #3ECF8E;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const ProjectSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #2E2E2E;
`;

const ProjectSelector = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  color: #EDEDED;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3E3E3E;
    background: #2A2A2A;
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProjectIcon = styled.div`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #3ECF8E, #3B82F6);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #171717;
`;

const ProjectName = styled.span`
  font-weight: 500;
`;

const NavSection = styled.div`
  padding: 16px 0;
  flex: 1;
`;

const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #5E5E5E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 20px;
  margin: 16px 0 8px 0;

  &:first-child {
    margin-top: 0;
  }
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? '#EDEDED' : '#8F8F8F')};
  text-decoration: none;
  background: ${({ $active }) => ($active ? 'rgba(62, 207, 142, 0.1)' : 'transparent')};
  border-left: 2px solid ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #EDEDED;
  }

  svg {
    width: 18px;
    height: 18px;
    opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  }
`;

const NavIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlanBadge = styled.div`
  margin: 16px;
  padding: 16px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
`;

const PlanLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #5E5E5E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 4px 0;
`;

const PlanName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlanBadgeTag = styled.span<{ $plan: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $plan }) =>
    $plan === 'free' ? 'rgba(142, 142, 142, 0.2)' :
    $plan === 'pro' ? 'rgba(62, 207, 142, 0.2)' :
    $plan === 'team' ? 'rgba(59, 130, 246, 0.2)' :
    'rgba(245, 166, 35, 0.2)'
  };
  color: ${({ $plan }) =>
    $plan === 'free' ? '#8F8F8F' :
    $plan === 'pro' ? '#3ECF8E' :
    $plan === 'team' ? '#3B82F6' :
    '#F5A623'
  };
`;

const UpgradeButton = styled(Link)`
  display: block;
  text-align: center;
  padding: 8px 16px;
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

const UserSection = styled.div`
  padding: 16px;
  border-top: 1px solid #2E2E2E;
`;

const UserButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #8F8F8F;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #2E2E2E;
    color: #EDEDED;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #8B5CF6, #3B82F6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SignOutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #8F8F8F;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    background: rgba(245, 101, 101, 0.1);
    color: #F56565;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const productNav = [
  { href: '/dashboard', icon: Icons.home, label: 'Home' },
  { href: '/dashboard/table-editor', icon: Icons.table, label: 'Table Editor' },
  { href: '/dashboard/sql-editor', icon: Icons.sql, label: 'SQL Editor' },
];

const buildNav = [
  { href: '/dashboard/database', icon: Icons.database, label: 'Database' },
  { href: '/dashboard/auth', icon: Icons.users, label: 'Authentication' },
  { href: '/dashboard/storage', icon: Icons.storage, label: 'Storage' },
  { href: '/dashboard/functions', icon: Icons.function, label: 'Edge Functions' },
  { href: '/dashboard/realtime', icon: Icons.realtime, label: 'Realtime' },
];

const manageNav = [
  { href: '/dashboard/reports', icon: Icons.chart, label: 'Reports' },
  { href: '/dashboard/logs', icon: Icons.terminal, label: 'Logs' },
  { href: '/dashboard/api', icon: Icons.api, label: 'API Docs' },
];

const marketplaceNav = [
  { href: '/dashboard/marketplace', icon: Icons.overview, label: 'API Marketplace' },
];

const configNav = [
  { href: '/dashboard/settings', icon: Icons.settings, label: 'Project Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { subscription } = useSubscription();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const currentPlan = subscription?.plan || 'free';

  return (
    <SidebarWrapper>
      <LogoSection>
        <LogoLink href="/">
          {Icons.logo}
          <LogoText>Supebase</LogoText>
        </LogoLink>
      </LogoSection>

      <ProjectSection>
        <ProjectSelector>
          <ProjectInfo>
            <ProjectIcon>P</ProjectIcon>
            <ProjectName>My Project</ProjectName>
          </ProjectInfo>
          {Icons.chevronDown}
        </ProjectSelector>
      </ProjectSection>

      <NavSection>
        {productNav.map((item) => (
          <NavItem key={item.href} href={item.href} $active={isActive(item.href)}>
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}

        <SectionLabel>Build</SectionLabel>
        {buildNav.map((item) => (
          <NavItem key={item.href} href={item.href} $active={isActive(item.href)}>
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}

        <SectionLabel>Manage</SectionLabel>
        {manageNav.map((item) => (
          <NavItem key={item.href} href={item.href} $active={isActive(item.href)}>
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}

        <SectionLabel>Marketplace</SectionLabel>
        {marketplaceNav.map((item) => (
          <NavItem key={item.href} href={item.href} $active={isActive(item.href)}>
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}

        <SectionLabel>Configuration</SectionLabel>
        {configNav.map((item) => (
          <NavItem key={item.href} href={item.href} $active={isActive(item.href)}>
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}
      </NavSection>

      <PlanBadge>
        <PlanLabel>Plan</PlanLabel>
        <PlanName>
          {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
          <PlanBadgeTag $plan={currentPlan}>{currentPlan}</PlanBadgeTag>
        </PlanName>
        {currentPlan === 'free' && (
          <UpgradeButton href="/pricing">Upgrade to Pro</UpgradeButton>
        )}
      </PlanBadge>

      <UserSection>
        <UserButton>
          <UserAvatar>{getInitials(session?.user?.name)}</UserAvatar>
          <UserInfo>
            <UserName>{session?.user?.name || 'User'}</UserName>
            <UserEmail>{session?.user?.email || ''}</UserEmail>
          </UserInfo>
        </UserButton>
        <SignOutButton onClick={() => signOut({ callbackUrl: '/' })}>
          {Icons.arrowLeft}
          Sign out
        </SignOutButton>
      </UserSection>
    </SidebarWrapper>
  );
}
