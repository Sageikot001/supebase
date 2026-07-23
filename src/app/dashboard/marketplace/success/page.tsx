'use client';

import { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 60px 20px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(62, 207, 142, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 12px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #8F8F8F;
  margin: 0 0 32px 0;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
`;

const InfoTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #3ECF8E;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #A0A0A0;
  margin: 0;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PrimaryButton = styled(Link)`
  display: block;
  padding: 14px 24px;
  background: #3ECF8E;
  color: #171717;
  text-decoration: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #4FF5A8;
  }
`;

const SecondaryButton = styled(Link)`
  display: block;
  padding: 14px 24px;
  background: transparent;
  border: 1px solid #2E2E2E;
  color: #EDEDED;
  text-decoration: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #3E3E3E;
    background: #232323;
  }
`;

function SuccessContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTrial = searchParams.get('trial') === 'true';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <DashboardLayout>
      <Container>
        <SuccessIcon>✓</SuccessIcon>
        <Title>
          {isTrial ? 'Free Trial Started!' : 'Payment Successful!'}
        </Title>
        <Subtitle>
          {isTrial
            ? 'Your 14-day free trial has started. You now have access to all the APIs you selected.'
            : 'Your payment has been processed. Your API subscriptions are now active.'}
        </Subtitle>

        <InfoBox>
          <InfoTitle>What&apos;s Next?</InfoTitle>
          <InfoText>
            {isTrial
              ? 'Your trial gives you full access for 14 days. To continue after the trial, complete payment in your API subscriptions.'
              : 'Your API keys are now active. View them in your API subscriptions page to start integrating.'}
          </InfoText>
        </InfoBox>

        <ButtonGroup>
          <PrimaryButton href="/dashboard/settings">
            View My API Keys
          </PrimaryButton>
          <SecondaryButton href="/dashboard/marketplace">
            Browse More APIs
          </SecondaryButton>
        </ButtonGroup>
      </Container>
    </DashboardLayout>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
