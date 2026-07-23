'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { apiProducts, getAllCategories, ApiIconName } from '@/lib/marketplace';
import { Icons } from '@/components/icons';
import { useCart } from '@/contexts/CartContext';
import { useApiSubscriptions } from '@/hooks/useApiSubscriptions';

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderLeft = styled.div``;

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

const CartButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3ECF8E;
  color: #171717;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #4FF5A8;
  }
`;

const CartBadge = styled.span`
  background: #171717;
  color: #3ECF8E;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background: ${({ $active }) => ($active ? '#3ECF8E' : '#232323')};
  color: ${({ $active }) => ($active ? '#171717' : '#EDEDED')};
  border: 1px solid ${({ $active }) => ($active ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ $active }) => ($active ? '#3ECF8E' : '#3ECF8E')};
    background: ${({ $active }) => ($active ? '#3ECF8E' : '#2A2A2A')};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  max-width: 400px;
  padding: 10px 16px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  color: #EDEDED;
  font-size: 14px;

  &::placeholder {
    color: #5E5E5E;
  }

  &:focus {
    outline: none;
    border-color: #3ECF8E;
  }
`;

const FeaturedSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 16px 0;
`;

const ApiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  grid-auto-rows: 1fr;
`;

const ApiCard = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: #3E3E3E;
  }
`;

const ApiHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

const ApiIcon = styled.div<{ $color: string }>`
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

const ApiInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ApiName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 4px 0;
`;

const ApiCategory = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ApiDescription = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0 0 16px 0;
  line-height: 1.5;
  flex: 1;
`;

const ApiFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #2E2E2E;
  margin-top: auto;
`;

const TrialBadge = styled.span`
  display: block;
  padding: 4px 8px;
  background: rgba(62, 207, 142, 0.15);
  color: #3ECF8E;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 4px;
  width: fit-content;
`;

const ApiPrice = styled.div``;

const PriceLabel = styled.span`
  font-size: 12px;
  color: #5E5E5E;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

const ViewButton = styled(Link)`
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #2E2E2E;
  color: #EDEDED;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    border-color: #3ECF8E;
    color: #3ECF8E;
  }
`;

const AddToCartButton = styled.button<{ $inCart?: boolean }>`
  padding: 8px 12px;
  background: ${({ $inCart }) => ($inCart ? '#232323' : 'rgba(62, 207, 142, 0.1)')};
  border: 1px solid ${({ $inCart }) => ($inCart ? '#3ECF8E' : 'transparent')};
  color: #3ECF8E;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $inCart }) => ($inCart ? '#2A2A2A' : 'rgba(62, 207, 142, 0.2)')};
  }
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #3ECF8E, #3B82F6);
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
`;

const CardWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #5E5E5E;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #8F8F8F;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  margin: 0;
`;

const TrialSection = styled.div`
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(251, 191, 36, 0.02));
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  padding: 24px;
`;

const TrialSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const TrialSectionIcon = styled.span`
  font-size: 24px;
`;

const TrialSectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #FBBF24;
  margin: 0;
`;

const TrialSectionSubtitle = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 4px 0 0 0;
`;

const TrialApiCard = styled.div`
  background: #1C1C1C;
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: #FBBF24;
  }
`;

const CountdownBadge = styled.div<{ $urgent?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${({ $urgent }) => $urgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 191, 36, 0.15)'};
  color: ${({ $urgent }) => $urgent ? '#EF4444' : '#FBBF24'};
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 4px;
  width: fit-content;
  margin-bottom: 4px;
`;

export default function MarketplacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToCart, removeFromCart, isInCart, itemCount } = useCart();
  const { subscriptions } = useApiSubscriptions();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/marketplace');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  // Get APIs that are on trial from real subscription data
  const trialApiProducts = apiProducts.filter(api =>
    subscriptions.some(sub => sub.api_id === api.id && sub.status === 'trial')
  );

  // Calculate days remaining for trial
  const getTrialDaysRemaining = (apiId: string): number => {
    const sub = subscriptions.find(s => s.api_id === apiId && s.status === 'trial');
    if (sub?.trial_ends_at) {
      return Math.max(0, Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    }
    return 14;
  };

  const categories = ['All', ...getAllCategories()];

  const filteredApis = apiProducts.filter(api => {
    const matchesCategory = selectedCategory === 'All' || api.category === selectedCategory;
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredApis = filteredApis.filter(api => api.featured);
  const otherApis = filteredApis.filter(api => !api.featured);

  const formatPrice = (api: typeof apiProducts[0]) => {
    if (api.pricing.type === 'tiered') {
      return '$2/language';
    }
    return `$${api.pricing.monthly}`;
  };

  const renderIcon = (iconName: ApiIconName) => {
    return Icons[iconName] || Icons.zap;
  };

  const handleCartToggle = (api: typeof apiProducts[0]) => {
    if (isInCart(api.id)) {
      removeFromCart(api.id);
    } else {
      addToCart({
        api,
        billingPeriod: 'yearly',
        price: api.pricing.yearly,
      });
    }
  };

  const renderTrialApiCard = (api: typeof apiProducts[0]) => {
    const daysRemaining = getTrialDaysRemaining(api.id);
    const isUrgent = daysRemaining <= 3;

    return (
      <CardWrapper key={api.id}>
        <TrialApiCard>
          <ApiHeader>
            <ApiIcon $color={api.color}>{renderIcon(api.icon)}</ApiIcon>
            <ApiInfo>
              <ApiName>{api.name}</ApiName>
              <ApiCategory $color={api.color}>{api.category}</ApiCategory>
            </ApiInfo>
          </ApiHeader>
          <ApiDescription>{api.description}</ApiDescription>
          <ApiFooter>
            <ApiPrice>
              <CountdownBadge $urgent={isUrgent}>
                ⏱ {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
              </CountdownBadge>
              <PriceLabel>Then {formatPrice(api)}/mo</PriceLabel>
            </ApiPrice>
            <ButtonGroup>
              <ViewButton href={`/dashboard/marketplace/${api.slug}`}>
                Details
              </ViewButton>
              <AddToCartButton
                $inCart={isInCart(api.id)}
                onClick={() => handleCartToggle(api)}
              >
                {isInCart(api.id) ? '✓ In Cart' : '+ Add'}
              </AddToCartButton>
            </ButtonGroup>
          </ApiFooter>
        </TrialApiCard>
      </CardWrapper>
    );
  };

  const renderApiCard = (api: typeof apiProducts[0], featured = false) => (
    <CardWrapper key={api.id}>
      {featured && <FeaturedBadge>Featured</FeaturedBadge>}
      <ApiCard>
        <ApiHeader>
          <ApiIcon $color={api.color}>{renderIcon(api.icon)}</ApiIcon>
          <ApiInfo>
            <ApiName>{api.name}</ApiName>
            <ApiCategory $color={api.color}>{api.category}</ApiCategory>
          </ApiInfo>
        </ApiHeader>
        <ApiDescription>{api.description}</ApiDescription>
        <ApiFooter>
          <ApiPrice>
            <TrialBadge>14 days free</TrialBadge>
            <PriceLabel>Then {formatPrice(api)}/mo</PriceLabel>
          </ApiPrice>
          <ButtonGroup>
            <ViewButton href={`/dashboard/marketplace/${api.slug}`}>
              Details
            </ViewButton>
            <AddToCartButton
              $inCart={isInCart(api.id)}
              onClick={() => handleCartToggle(api)}
            >
              {isInCart(api.id) ? '✓ In Cart' : '+ Add'}
            </AddToCartButton>
          </ButtonGroup>
        </ApiFooter>
      </ApiCard>
    </CardWrapper>
  );

  return (
    <DashboardLayout>
      <PageHeader>
        <HeaderLeft>
          <Title>API Marketplace</Title>
          <Subtitle>Discover and integrate powerful APIs into your projects</Subtitle>
        </HeaderLeft>
        {itemCount > 0 && (
          <CartButton href="/dashboard/marketplace/cart">
            🛒 View Cart <CartBadge>{itemCount}</CartBadge>
          </CartButton>
        )}
      </PageHeader>

      <FilterBar>
        {categories.map(category => (
          <FilterButton
            key={category}
            $active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </FilterButton>
        ))}
        <SearchInput
          type="text"
          placeholder="Search APIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </FilterBar>

      {trialApiProducts.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <TrialSection>
          <TrialSectionHeader>
            <TrialSectionIcon>⚡</TrialSectionIcon>
            <div>
              <TrialSectionTitle>Active Free Trials</TrialSectionTitle>
              <TrialSectionSubtitle>
                {trialApiProducts.length} API{trialApiProducts.length !== 1 ? 's' : ''} on trial • Upgrade before they expire
              </TrialSectionSubtitle>
            </div>
          </TrialSectionHeader>
          <ApiGrid>
            {trialApiProducts.map(api => renderTrialApiCard(api))}
          </ApiGrid>
        </TrialSection>
      )}

      {filteredApis.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No APIs found</EmptyTitle>
          <EmptyText>Try adjusting your search or filter criteria</EmptyText>
        </EmptyState>
      ) : (
        <>
          {featuredApis.length > 0 && selectedCategory === 'All' && !searchQuery && (
            <FeaturedSection>
              <SectionTitle>Featured APIs</SectionTitle>
              <ApiGrid>
                {featuredApis.map(api => renderApiCard(api, true))}
              </ApiGrid>
            </FeaturedSection>
          )}

          <SectionTitle>
            {selectedCategory === 'All' && !searchQuery ? 'All APIs' : `${filteredApis.length} API${filteredApis.length !== 1 ? 's' : ''}`}
          </SectionTitle>
          <ApiGrid>
            {(selectedCategory === 'All' && !searchQuery ? otherApis : filteredApis).map(api => renderApiCard(api))}
          </ApiGrid>
        </>
      )}
    </DashboardLayout>
  );
}
