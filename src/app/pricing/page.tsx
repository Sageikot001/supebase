'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { plans, features, BillingPeriod, Plan } from '@/lib/plans';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #171717;
  color: #EDEDED;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #2E2E2E;
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #3ECF8E;
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SignInButton = styled(Link)`
  font-size: 14px;
  color: #EDEDED;
  text-decoration: none;
  padding: 8px 16px;
`;

const StartButton = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #171717;
  background: #3ECF8E;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px 80px;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 64px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 16px 0;
  letter-spacing: -1.5px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #8F8F8F;
  margin: 0 0 40px 0;
`;

const BillingToggle = styled.div`
  display: inline-flex;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  padding: 4px;
`;

const ToggleOption = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  background: ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  color: ${({ $active }) => ($active ? '#171717' : '#8F8F8F')};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${({ $active }) => ($active ? '#171717' : '#EDEDED')};
  }
`;

const SaveBadge = styled.span`
  background: rgba(62, 207, 142, 0.2);
  color: #3ECF8E;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 80px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div<{ $featured?: boolean }>`
  background: ${({ $featured }) => ($featured ? 'linear-gradient(135deg, rgba(62, 207, 142, 0.1), rgba(59, 130, 246, 0.1))' : '#1C1C1C')};
  border: 1px solid ${({ $featured }) => ($featured ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 12px;
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const PopularBadge = styled.span`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 16px;
  background: #3ECF8E;
  color: #171717;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
`;

const PlanName = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const PlanDescription = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0 0 24px 0;
  line-height: 1.5;
  flex: 1;
`;

const PriceWrapper = styled.div`
  margin-bottom: 24px;
`;

const Price = styled.span`
  font-size: 48px;
  font-weight: 700;
  color: #EDEDED;
`;

const PricePeriod = styled.span`
  font-size: 16px;
  color: #8F8F8F;
`;

const PlanButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 14px 24px;
  background: ${({ $primary }) => ($primary ? '#3ECF8E' : 'transparent')};
  color: ${({ $primary }) => ($primary ? '#171717' : '#EDEDED')};
  border: 1px solid ${({ $primary }) => ($primary ? '#3ECF8E' : '#3E3E3E')};
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#4FF5A8' : 'rgba(255, 255, 255, 0.05)')};
    border-color: ${({ $primary }) => ($primary ? '#4FF5A8' : '#5E5E5E')};
  }
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #8F8F8F;
  padding: 8px 0;

  svg {
    width: 16px;
    height: 16px;
    color: #3ECF8E;
    flex-shrink: 0;
  }
`;

const TableSection = styled.section`
  margin-top: 80px;
`;

const TableTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #EDEDED;
  text-align: center;
  margin-bottom: 48px;
`;

const ComparisonTable = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  background: #232323;
  border-bottom: 1px solid #2E2E2E;
`;

const TableHeaderCell = styled.div<{ $featured?: boolean }>`
  padding: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  border-left: 1px solid #2E2E2E;
  background: ${({ $featured }) => ($featured ? 'rgba(62, 207, 142, 0.1)' : 'transparent')};

  &:first-child {
    text-align: left;
    border-left: none;
    color: #8F8F8F;
    font-weight: 500;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  border-bottom: 1px solid #2E2E2E;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div<{ $featured?: boolean }>`
  padding: 16px 20px;
  font-size: 14px;
  color: #8F8F8F;
  text-align: center;
  border-left: 1px solid #2E2E2E;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $featured }) => ($featured ? 'rgba(62, 207, 142, 0.05)' : 'transparent')};

  &:first-child {
    text-align: left;
    justify-content: flex-start;
    border-left: none;
    color: #EDEDED;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const CheckIcon = styled.span`
  color: #3ECF8E;
`;

const CrossIcon = styled.span`
  color: #5E5E5E;
`;

const Footer = styled.footer`
  padding: 48px 24px;
  border-top: 1px solid #2E2E2E;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #5E5E5E;
  margin: 0;
`;

const planFeatures: Record<string, string[]> = {
  free: [
    'Unlimited API requests',
    '500 MB database',
    '1 GB storage',
    'Community support',
  ],
  pro: [
    'Everything in Free, plus:',
    '8 GB database',
    '100 GB storage',
    'Daily backups',
    'Email support',
  ],
  team: [
    'Everything in Pro, plus:',
    '16 GB database',
    'Point in time recovery',
    'SOC2 compliance',
    'Priority support',
  ],
  enterprise: [
    'Everything in Team, plus:',
    'Custom database size',
    'Dedicated support',
    'Custom SLA',
    'SSO / SAML',
  ],
};

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'enterprise') {
      return;
    }

    if (plan.id === 'free') {
      if (!session) {
        router.push('/register');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    const checkoutUrl = `/checkout?plan=${plan.id}&billing=${billingPeriod}`;
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(checkoutUrl)}`);
    } else {
      router.push(checkoutUrl);
    }
  };

  const getPrice = (plan: Plan) => {
    if (plan.pricing[billingPeriod] === -1) return 'Custom';
    if (plan.pricing[billingPeriod] === 0) return '$0';
    return `$${plan.pricing[billingPeriod]}`;
  };

  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon>{Icons.check}</CheckIcon>
      ) : (
        <CrossIcon>{Icons.close}</CrossIcon>
      );
    }
    return value;
  };

  return (
    <PageWrapper>
      <Nav>
        <NavContainer>
          <LogoLink href="/">
            {Icons.logo}
            <LogoText>Supebase</LogoText>
          </LogoLink>
          <NavButtons>
            <SignInButton href="/login">Sign in</SignInButton>
            <StartButton href="/register">Start your project</StartButton>
          </NavButtons>
        </NavContainer>
      </Nav>

      <Main>
        <HeroSection>
          <Title>Predictable pricing, no surprises</Title>
          <Subtitle>Start building for free, then add a plan when you&apos;re ready to scale.</Subtitle>
          <BillingToggle>
            <ToggleOption
              $active={billingPeriod === 'monthly'}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </ToggleOption>
            <ToggleOption
              $active={billingPeriod === 'yearly'}
              onClick={() => setBillingPeriod('yearly')}
            >
              Annually
              <SaveBadge>Save 20%</SaveBadge>
            </ToggleOption>
          </BillingToggle>
        </HeroSection>

        <PlansGrid>
          {plans.map((plan) => (
            <PlanCard key={plan.id} $featured={plan.tag === 'popular'}>
              {plan.tag === 'popular' && <PopularBadge>Most Popular</PopularBadge>}
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              <PriceWrapper>
                <Price>{getPrice(plan)}</Price>
                {plan.pricing[billingPeriod] !== -1 && plan.pricing[billingPeriod] !== 0 && (
                  <PricePeriod> / month</PricePeriod>
                )}
              </PriceWrapper>
              <PlanButton
                $primary={plan.tag === 'popular'}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.cta}
              </PlanButton>
              <PlanFeatures>
                {planFeatures[plan.id]?.map((feature, i) => (
                  <PlanFeature key={i}>
                    {Icons.check}
                    {feature}
                  </PlanFeature>
                ))}
              </PlanFeatures>
            </PlanCard>
          ))}
        </PlansGrid>

        <TableSection>
          <TableTitle>Compare Plans</TableTitle>
          <ComparisonTable>
            <TableHeader>
              <TableHeaderCell>Features</TableHeaderCell>
              {plans.map((plan) => (
                <TableHeaderCell key={plan.id} $featured={plan.tag === 'popular'}>
                  {plan.name}
                </TableHeaderCell>
              ))}
            </TableHeader>
            {features.map((feature, featureIndex) => (
              <TableRow key={featureIndex}>
                <TableCell>{feature.name}</TableCell>
                {feature.values.map((value, planIndex) => (
                  <TableCell
                    key={planIndex}
                    $featured={plans[planIndex]?.tag === 'popular'}
                  >
                    {renderFeatureValue(value)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </ComparisonTable>
        </TableSection>
      </Main>

      <Footer>
        <FooterText>© 2024 Supebase Inc. All rights reserved.</FooterText>
      </Footer>
    </PageWrapper>
  );
}
