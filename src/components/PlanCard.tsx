'use client';

import styled from 'styled-components';
import { Plan, BillingPeriod, features, calculateTotal, formatPrice } from '@/lib/plans';

const Card = styled.div<{ $tag?: string }>`
  background: #1C1C1C;
  border: 1px solid ${({ $tag }) =>
    $tag === 'popular' ? '#3ECF8E' :
    $tag === 'best-value' ? '#F5A623' : '#2E2E2E'};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

const Tag = styled.span<{ $type: 'popular' | 'best-value' }>`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $type }) => ($type === 'popular' ? '#3ECF8E' : '#F5A623')};
  color: #171717;
`;

const PlanName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 16px 0;
  text-align: center;
`;

const PriceContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const MonthlyPrice = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #EDEDED;
`;

const TotalPrice = styled.div`
  font-size: 14px;
  color: #8F8F8F;
  margin-top: 4px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  flex: 1;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #8F8F8F;
  border-bottom: 1px solid #2E2E2E;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '✓';
    color: #3ECF8E;
    font-weight: 600;
  }
`;

const SelectButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 14px 24px;
  border: 1px solid ${({ $primary }) => ($primary ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $primary }) => ($primary ? '#3ECF8E' : 'transparent')};
  color: ${({ $primary }) => ($primary ? '#171717' : '#EDEDED')};

  &:hover {
    background: ${({ $primary }) => ($primary ? '#4FF5A8' : 'rgba(255, 255, 255, 0.05)')};
  }
`;

interface PlanCardProps {
  plan: Plan;
  planIndex: number;
  billingPeriod: BillingPeriod;
  onSelect: (plan: Plan) => void;
}

export default function PlanCard({ plan, planIndex, billingPeriod, onSelect }: PlanCardProps) {
  const displayFeatures = features.slice(0, 5).map((feature) => ({
    name: feature.name,
    value: feature.values[planIndex],
  }));

  const monthlyPrice = plan.pricing[billingPeriod];
  const totalPrice = calculateTotal(plan, billingPeriod);
  const months = billingPeriod === 'yearly' ? 12 : 1;

  return (
    <Card $tag={plan.tag}>
      {plan.tag && (
        <Tag $type={plan.tag}>
          {plan.tag === 'popular' ? 'Popular' : 'Best Value'}
        </Tag>
      )}
      <PlanName>{plan.name}</PlanName>
      <PriceContainer>
        <MonthlyPrice>{formatPrice(monthlyPrice)}/mo</MonthlyPrice>
        <TotalPrice>{formatPrice(totalPrice)} for {months} month{months > 1 ? 's' : ''}</TotalPrice>
      </PriceContainer>
      <FeatureList>
        {displayFeatures.map((feature) => (
          <FeatureItem key={feature.name}>
            {feature.name}: {typeof feature.value === 'boolean' ? (feature.value ? 'Yes' : 'No') : feature.value}
          </FeatureItem>
        ))}
      </FeatureList>
      <SelectButton $primary={plan.tag === 'popular'} onClick={() => onSelect(plan)}>
        Select Plan
      </SelectButton>
    </Card>
  );
}
