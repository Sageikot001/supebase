'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCart } from '@/contexts/CartContext';
import { useApiSubscriptions } from '@/hooks/useApiSubscriptions';
import { calculateLocalizationPrice, ApiIconName } from '@/lib/marketplace';
import { Icons } from '@/components/icons';

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8F8F8F;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;

  &:hover {
    color: #EDEDED;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartItem = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
`;

const ItemIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background: ${({ $color }) => `${$color}20`};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color }) => $color};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const ItemDescription = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 0 0 12px 0;
`;

const BillingToggle = styled.div`
  display: flex;
  gap: 8px;
`;

const BillingOption = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  background: ${({ $active }) => ($active ? '#3ECF8E' : '#232323')};
  color: ${({ $active }) => ($active ? '#171717' : '#8F8F8F')};
  border: 1px solid ${({ $active }) => ($active ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const ItemPrice = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const PriceAmount = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0;
`;

const PricePeriod = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 4px 0 12px 0;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #F56565;
  color: #F56565;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(245, 101, 101, 0.1);
  }
`;

const OrderSummary = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 24px;
`;

const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 20px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #2E2E2E;

  &:last-of-type {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #8F8F8F;
`;

const SummaryValue = styled.span`
  font-size: 14px;
  color: #EDEDED;
  font-weight: 500;
`;

const TotalRow = styled(SummaryRow)`
  margin-top: 12px;
  padding-top: 16px;
  border-top: 2px solid #2E2E2E;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
`;

const TotalValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #3ECF8E;
`;

const TrialBanner = styled.div`
  background: linear-gradient(135deg, rgba(62, 207, 142, 0.15), rgba(59, 130, 246, 0.15));
  border: 1px solid rgba(62, 207, 142, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  text-align: center;
  margin: 20px 0;
`;

const TrialText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #3ECF8E;
  margin: 0;
`;

const TrialSubtext = styled.p`
  font-size: 12px;
  color: #8F8F8F;
  margin: 4px 0 0 0;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  background: #3ECF8E;
  color: #171717;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;

  &:hover {
    background: #4FF5A8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TrialButton = styled(CheckoutButton)`
  background: transparent;
  border: 2px solid #3ECF8E;
  color: #3ECF8E;

  &:hover {
    background: rgba(62, 207, 142, 0.1);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0 0 24px 0;
`;

const BrowseButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: #3ECF8E;
  color: #171717;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
`;

const LanguageInfo = styled.p`
  font-size: 12px;
  color: #3ECF8E;
  margin: 8px 0 0 0;
`;

const OnTrialBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  margin-left: 8px;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #8F8F8F;
  font-size: 14px;
`;

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, removeFromCart, addToCart, clearCart } = useCart();
  const { hasApi, getApiSubscription, loading: subsLoading } = useApiSubscriptions();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/marketplace/cart');
    }
  }, [status, router]);

  // Check which items are already on trial
  const isOnTrial = useCallback((apiId: string) => {
    return hasApi(apiId);
  }, [hasApi]);

  // Get items that are NOT on trial (eligible for new trial)
  const newItems = items.filter(item => !isOnTrial(item.api.id));
  const hasNewItems = newItems.length > 0;

  // Get the actual price for an item (considering saved languages for i18n APIs)
  const getItemPrice = useCallback((item: typeof items[0]) => {
    const isLanguageBased = item.api.id === 'localization' || item.api.id === 'internationalization';

    if (isLanguageBased) {
      // Check if this API is on trial and has saved languages
      const subscription = getApiSubscription(item.api.id);
      const languages = subscription?.selected_languages || item.selectedLanguages || [];
      const prices = calculateLocalizationPrice(languages);
      return item.billingPeriod === 'monthly' ? prices.monthly : prices.yearly;
    }

    return item.price;
  }, [getApiSubscription]);

  // Calculate total with correct prices
  const calculateTotal = useCallback(() => {
    return items.reduce((total, item) => total + getItemPrice(item), 0);
  }, [items, getItemPrice]);

  if (status === 'loading' || !session || subsLoading) {
    return (
      <DashboardLayout>
        <PageHeader>
          <BackLink href="/dashboard/marketplace">← Back to Marketplace</BackLink>
          <Title>Your Cart</Title>
        </PageHeader>
        <LoadingState>Loading cart...</LoadingState>
      </DashboardLayout>
    );
  }

  const handleBillingChange = (apiId: string, period: 'monthly' | 'yearly') => {
    const item = items.find(i => i.api.id === apiId);
    if (item) {
      const isLanguageBased = item.api.id === 'localization' || item.api.id === 'internationalization';
      let price;

      if (isLanguageBased) {
        const subscription = getApiSubscription(item.api.id);
        const languages = subscription?.selected_languages || item.selectedLanguages || [];
        const prices = calculateLocalizationPrice(languages);
        price = period === 'monthly' ? prices.monthly : prices.yearly;
      } else {
        price = period === 'monthly' ? item.api.pricing.monthly : item.api.pricing.yearly;
      }

      addToCart({
        ...item,
        billingPeriod: period,
        price,
      });
    }
  };

  const handleStartTrial = async () => {
    if (!hasNewItems) return;

    setLoading(true);
    try {
      const response = await fetch('/api/marketplace/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: newItems.map(item => ({
            apiId: item.api.id,
            apiName: item.api.name,
            billingPeriod: item.billingPeriod,
            price: getItemPrice(item),
            selectedLanguages: item.selectedLanguages,
          })),
          startTrial: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Reload page to refresh subscription data
        window.location.reload();
      } else {
        alert(data.error || 'Failed to start trial');
      }
    } catch (error) {
      console.error('Trial error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/marketplace/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            apiId: item.api.id,
            apiName: item.api.name,
            billingPeriod: item.billingPeriod,
            price: getItemPrice(item),
            selectedLanguages: item.selectedLanguages || getApiSubscription(item.api.id)?.selected_languages,
          })),
        }),
      });

      const data = await response.json();
      if (data.authorization_url) {
        clearCart();
        window.location.href = data.authorization_url;
      } else {
        alert(data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName: ApiIconName) => {
    return Icons[iconName] || Icons.zap;
  };

  // Get selected languages display for an item
  const getLanguagesDisplay = (item: typeof items[0]) => {
    const isLanguageBased = item.api.id === 'localization' || item.api.id === 'internationalization';
    if (!isLanguageBased) return null;

    const subscription = getApiSubscription(item.api.id);
    const languages = subscription?.selected_languages || item.selectedLanguages || [];
    if (languages.length === 0) return null;

    const langNames: Record<string, string> = {
      fr: 'French', de: 'German', es: 'Spanish', it: 'Italian',
      pt: 'Portuguese', nl: 'Dutch', pl: 'Polish', ru: 'Russian',
      ja: 'Japanese', ko: 'Korean', zh: 'Chinese', ar: 'Arabic'
    };

    return languages.map(code => langNames[code] || code).join(', ');
  };

  if (items.length === 0) {
    return (
      <DashboardLayout>
        <PageHeader>
          <BackLink href="/dashboard/marketplace">← Back to Marketplace</BackLink>
          <Title>Your Cart</Title>
        </PageHeader>

        <EmptyCart>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyTitle>Your cart is empty</EmptyTitle>
          <EmptyText>Browse our marketplace to find APIs for your project</EmptyText>
          <BrowseButton href="/dashboard/marketplace">Browse APIs</BrowseButton>
        </EmptyCart>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader>
        <BackLink href="/dashboard/marketplace">← Back to Marketplace</BackLink>
        <Title>Your Cart</Title>
        <Subtitle>{items.length} API{items.length !== 1 ? 's' : ''} selected</Subtitle>
      </PageHeader>

      <ContentGrid>
        <CartItems>
          {items.map(item => {
            const itemOnTrial = isOnTrial(item.api.id);
            const languagesDisplay = getLanguagesDisplay(item);
            const itemPrice = getItemPrice(item);

            return (
              <CartItem key={item.api.id}>
                <ItemIcon $color={item.api.color}>{renderIcon(item.api.icon)}</ItemIcon>
                <ItemDetails>
                  <ItemName>
                    {item.api.name}
                    {itemOnTrial && <OnTrialBadge>On Trial</OnTrialBadge>}
                  </ItemName>
                  <ItemDescription>{item.api.description}</ItemDescription>
                  {languagesDisplay && (
                    <LanguageInfo>Languages: {languagesDisplay}</LanguageInfo>
                  )}
                  <BillingToggle>
                    <BillingOption
                      $active={item.billingPeriod === 'monthly'}
                      onClick={() => handleBillingChange(item.api.id, 'monthly')}
                    >
                      Monthly
                    </BillingOption>
                    <BillingOption
                      $active={item.billingPeriod === 'yearly'}
                      onClick={() => handleBillingChange(item.api.id, 'yearly')}
                    >
                      Yearly (Save {item.api.pricing.yearlyDiscount || 15}%)
                    </BillingOption>
                  </BillingToggle>
                </ItemDetails>
                <ItemPrice>
                  <PriceAmount>${itemPrice}</PriceAmount>
                  <PricePeriod>/{item.billingPeriod === 'monthly' ? 'mo' : 'yr'}</PricePeriod>
                  <RemoveButton onClick={() => removeFromCart(item.api.id)}>
                    Remove
                  </RemoveButton>
                </ItemPrice>
              </CartItem>
            );
          })}
        </CartItems>

        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>

          {items.map(item => (
            <SummaryRow key={item.api.id}>
              <SummaryLabel>
                {item.api.name}
                {isOnTrial(item.api.id) && ' (on trial)'}
              </SummaryLabel>
              <SummaryValue>${getItemPrice(item)}</SummaryValue>
            </SummaryRow>
          ))}

          <TotalRow>
            <TotalLabel>Total</TotalLabel>
            <TotalValue>${calculateTotal()}</TotalValue>
          </TotalRow>

          {hasNewItems && (
            <>
              <TrialBanner>
                <TrialText>🎉 14-Day Free Trial</TrialText>
                <TrialSubtext>
                  {newItems.length === items.length
                    ? 'Try all APIs free, pay later'
                    : `Start trial for ${newItems.length} new API${newItems.length !== 1 ? 's' : ''}`
                  }
                </TrialSubtext>
              </TrialBanner>

              <TrialButton onClick={handleStartTrial} disabled={loading}>
                {loading ? 'Processing...' : 'Start Free Trial'}
              </TrialButton>
            </>
          )}

          <CheckoutButton onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : `Pay $${calculateTotal()} Now`}
          </CheckoutButton>
        </OrderSummary>
      </ContentGrid>
    </DashboardLayout>
  );
}
