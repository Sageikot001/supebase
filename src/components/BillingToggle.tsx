'use client';

import styled from 'styled-components';
import { BillingPeriod, billingPeriods } from '@/lib/plans';

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ToggleContainer = styled.div`
  display: inline-flex;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
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

interface BillingToggleProps {
  billingPeriod: BillingPeriod;
  onToggle: (period: BillingPeriod) => void;
}

export default function BillingToggle({ billingPeriod, onToggle }: BillingToggleProps) {
  return (
    <ToggleWrapper>
      <ToggleContainer>
        {billingPeriods.map((period) => (
          <ToggleButton
            key={period.id}
            $active={billingPeriod === period.id}
            onClick={() => onToggle(period.id)}
          >
            {period.label}
            {period.discount && <SaveBadge>{period.discount}</SaveBadge>}
          </ToggleButton>
        ))}
      </ToggleContainer>
    </ToggleWrapper>
  );
}
