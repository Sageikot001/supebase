'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import Link from 'next/link';
import { getPlanById, getBillingPeriod, calculateTotal, features, Plan, BillingPeriod, formatPrice } from '@/lib/plans';
import { Icons } from '@/components/icons';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #171717;
  display: flex;
  flex-direction: column;
`;

const Nav = styled.nav`
  padding: 24px;
`;

const LogoLink = styled(Link)`
  display: inline-flex;
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

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const CheckoutContainer = styled.div`
  width: 100%;
  max-width: 480px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 32px 0;
  text-align: center;
`;

const CheckoutCard = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  overflow: hidden;
`;

const PlanSummary = styled.div`
  padding: 24px;
  border-bottom: 1px solid #2E2E2E;
`;

const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const PlanIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(62, 207, 142, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3ECF8E;
`;

const PlanDetails = styled.div``;

const PlanName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const BillingInfo = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  color: #8F8F8F;
  border-bottom: 1px solid #232323;

  &:last-child {
    border-bottom: none;
  }

  span:last-child {
    color: #EDEDED;
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #232323;
  border-bottom: 1px solid #2E2E2E;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
`;

const TotalPrice = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #3ECF8E;
`;

const FormSection = styled.div`
  padding: 24px;
`;

const UserInfo = styled.div`
  background: #232323;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const UserLabel = styled.p`
  font-size: 11px;
  color: #5E5E5E;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserEmail = styled.p`
  font-size: 15px;
  color: #EDEDED;
  margin: 0;
  font-weight: 500;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #3ECF8E;
  color: #171717;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #4FF5A8;
  }

  &:disabled {
    background: #2E2E2E;
    color: #5E5E5E;
    cursor: not-allowed;
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 13px;
  color: #5E5E5E;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ErrorMessage = styled.p`
  color: #F56565;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;

const BackLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  color: #8F8F8F;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: #EDEDED;
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  color: #8F8F8F;
  padding: 48px;
`;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const planId = searchParams.get('plan');
  const billingParam = searchParams.get('billing') as BillingPeriod | null;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/pricing')}`);
    }
  }, [status, router]);

  useEffect(() => {
    if (planId) {
      const foundPlan = getPlanById(planId);
      setPlan(foundPlan || null);
    }
    if (billingParam) {
      setBillingPeriod(billingParam);
    }
  }, [planId, billingParam]);

  const planIndex = plan ? (['free', 'pro', 'team', 'enterprise'].indexOf(plan.id)) : 0;
  const planFeatures = plan
    ? features.slice(0, 5).map((f) => ({
        name: f.name,
        value: typeof f.values[planIndex] === 'boolean'
          ? (f.values[planIndex] ? 'Yes' : 'No')
          : f.values[planIndex],
      }))
    : [];

  const period = getBillingPeriod(billingPeriod);
  const totalPrice = plan ? calculateTotal(plan, billingPeriod) : 0;

  const handleSubmit = async () => {
    if (!plan || !session?.user?.email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          planId: plan.id,
          billingPeriod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <PageWrapper>
        <Nav>
          <LogoLink href="/">
            {Icons.logo}
            <LogoText>Supebase</LogoText>
          </LogoLink>
        </Nav>
        <Main>
          <LoadingWrapper>Loading...</LoadingWrapper>
        </Main>
      </PageWrapper>
    );
  }

  if (!session) {
    return null;
  }

  if (!plan) {
    return (
      <PageWrapper>
        <Nav>
          <LogoLink href="/">
            {Icons.logo}
            <LogoText>Supebase</LogoText>
          </LogoLink>
        </Nav>
        <Main>
          <CheckoutContainer>
            <Title>Plan not found</Title>
            <BackLink href="/pricing">← Back to pricing</BackLink>
          </CheckoutContainer>
        </Main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Nav>
        <LogoLink href="/">
          {Icons.logo}
          <LogoText>Supebase</LogoText>
        </LogoLink>
      </Nav>
      <Main>
        <CheckoutContainer>
          <Title>Complete Your Purchase</Title>
          <CheckoutCard>
            <PlanSummary>
              <PlanHeader>
                <PlanIcon>{Icons.zap}</PlanIcon>
                <PlanDetails>
                  <PlanName>{plan.name} Plan</PlanName>
                  <BillingInfo>
                    {period?.label} billing ({formatPrice(plan.pricing[billingPeriod])}/mo)
                  </BillingInfo>
                </PlanDetails>
              </PlanHeader>
              <FeatureList>
                {planFeatures.map((feature) => (
                  <FeatureItem key={feature.name}>
                    <span>{feature.name}</span>
                    <span>{feature.value}</span>
                  </FeatureItem>
                ))}
              </FeatureList>
            </PlanSummary>

            <TotalSection>
              <TotalLabel>
                Total {billingPeriod === 'yearly' ? '(12 months)' : '(1 month)'}
              </TotalLabel>
              <TotalPrice>{formatPrice(totalPrice)}</TotalPrice>
            </TotalSection>

            <FormSection>
              <UserInfo>
                <UserLabel>Paying as</UserLabel>
                <UserEmail>{session.user?.email}</UserEmail>
              </UserInfo>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <PayButton onClick={handleSubmit} disabled={loading}>
                {loading ? 'Redirecting to Paystack...' : 'Pay with Paystack'}
              </PayButton>
              <SecurityBadge>
                {Icons.lock} Secured by Paystack
              </SecurityBadge>
            </FormSection>
          </CheckoutCard>
          <BackLink href="/pricing">← Back to pricing</BackLink>
        </CheckoutContainer>
      </Main>
    </PageWrapper>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ background: '#171717', minHeight: '100vh' }} />}>
      <CheckoutContent />
    </Suspense>
  );
}
