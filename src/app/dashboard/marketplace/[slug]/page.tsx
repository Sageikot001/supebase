'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getApiBySlug, localizationLanguages, calculateLocalizationPrice, ApiIconName } from '@/lib/marketplace';
import { Icons } from '@/components/icons';
import { useCart } from '@/contexts/CartContext';
import { useApiSubscriptions } from '@/hooks/useApiSubscriptions';

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8F8F8F;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 24px;

  &:hover {
    color: #EDEDED;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ApiIcon = styled.div<{ $color: string }>`
  width: 80px;
  height: 80px;
  background: ${({ $color }) => `${$color}20`};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color }) => $color};

  svg {
    width: 40px;
    height: 40px;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const ApiName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const ApiCategory = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 12px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const ApiDescription = styled.p`
  font-size: 16px;
  color: #8F8F8F;
  margin: 0;
  line-height: 1.6;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 16px 0;
`;

const LongDescription = styled.p`
  font-size: 15px;
  color: #A0A0A0;
  line-height: 1.7;
  margin: 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #EDEDED;
  padding: 12px 16px;
  background: #1C1C1C;
  border-radius: 8px;

  &::before {
    content: '✓';
    color: #3ECF8E;
    font-weight: 600;
    flex-shrink: 0;
  }
`;

const UseCaseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const UseCaseTag = styled.span`
  padding: 8px 14px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 20px;
  font-size: 13px;
  color: #EDEDED;
`;

const PricingCard = styled.div`
  position: sticky;
  top: 24px;
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 16px;
  overflow: hidden;
`;

const PricingHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #2E2E2E;
`;

const PricingTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 16px 0;
`;

const BillingToggle = styled.div`
  display: flex;
  background: #232323;
  border-radius: 8px;
  padding: 4px;
`;

const BillingOption = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  background: ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  color: ${({ $active }) => ($active ? '#171717' : '#8F8F8F')};
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const SaveBadge = styled.span`
  margin-left: 6px;
  padding: 2px 6px;
  background: rgba(62, 207, 142, 0.2);
  color: #3ECF8E;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
`;

const PricingBody = styled.div`
  padding: 24px;
`;

const TrialBanner = styled.div`
  background: linear-gradient(135deg, rgba(62, 207, 142, 0.15), rgba(59, 130, 246, 0.15));
  border: 1px solid rgba(62, 207, 142, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  text-align: center;
  margin-bottom: 20px;
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

const ActiveTrialBanner = styled.div<{ $urgent?: boolean }>`
  background: ${({ $urgent }) => $urgent
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))'
    : 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.08))'
  };
  border: 1px solid ${({ $urgent }) => $urgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(251, 191, 36, 0.3)'};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

const CountdownText = styled.p<{ $urgent?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $urgent }) => $urgent ? '#EF4444' : '#FBBF24'};
  margin: 0;
`;

const CountdownSubtext = styled.p`
  font-size: 12px;
  color: #8F8F8F;
  margin: 4px 0 0 0;
`;

const PriceDisplay = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const PriceAmount = styled.p`
  font-size: 48px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0;
  line-height: 1;

  span {
    font-size: 18px;
    font-weight: 400;
    color: #5E5E5E;
  }
`;

const PriceSubtext = styled.p`
  font-size: 14px;
  color: #5E5E5E;
  margin: 8px 0 0 0;
`;

const AddToCartButton = styled.button<{ $inCart?: boolean }>`
  width: 100%;
  padding: 14px 24px;
  background: ${({ $inCart }) => ($inCart ? '#232323' : '#3ECF8E')};
  color: ${({ $inCart }) => ($inCart ? '#3ECF8E' : '#171717')};
  border: ${({ $inCart }) => ($inCart ? '2px solid #3ECF8E' : 'none')};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;

  &:hover {
    background: ${({ $inCart }) => ($inCart ? '#2A2A2A' : '#4FF5A8')};
  }
`;

const ViewCartButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 14px 24px;
  background: transparent;
  border: 1px solid #2E2E2E;
  color: #EDEDED;
  text-decoration: none;
  text-align: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  margin-bottom: 16px;

  &:hover {
    border-color: #3E3E3E;
    background: #232323;
  }
`;

const PricingNote = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  text-align: center;
  margin: 0;
`;

const LanguageSelector = styled.div`
  margin-bottom: 24px;
`;

const LanguageLabel = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin: 0 0 12px 0;
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3E3E3E;
    border-radius: 2px;
  }
`;

const LanguageOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${({ $selected }) => ($selected ? 'rgba(62, 207, 142, 0.1)' : '#232323')};
  border: 1px solid ${({ $selected }) => ($selected ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? '#3ECF8E' : '#3E3E3E')};
  }
`;

const LanguageCheckbox = styled.input`
  accent-color: #3ECF8E;
`;

const LanguageName = styled.span`
  font-size: 13px;
  color: #EDEDED;
  flex: 1;
`;

const LanguagePrice = styled.span`
  font-size: 12px;
  color: #5E5E5E;
`;

const SaveButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background: #3ECF8E;
  color: #171717;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4FF5A8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 10px 16px;
  background: transparent;
  color: #8F8F8F;
  border: 1px solid #2E2E2E;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3E3E3E;
    color: #EDEDED;
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const NotFoundTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const NotFoundText = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0 0 24px 0;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background: #3ECF8E;
  color: #171717;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;

export default function ApiDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToCart, removeFromCart, isInCart, itemCount } = useCart();
  const { getApiSubscription } = useApiSubscriptions();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [savedLanguages, setSavedLanguages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const api = slug ? getApiBySlug(slug) : undefined;
  const trialSubscription = api ? getApiSubscription(api.id) : undefined;
  const isOnTrial = trialSubscription?.status === 'trial';

  const getTrialDaysRemaining = (): number => {
    if (trialSubscription?.trial_ends_at) {
      return Math.max(0, Math.ceil((new Date(trialSubscription.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  const trialDaysRemaining = isOnTrial ? getTrialDaysRemaining() : 0;
  const isTrialUrgent = trialDaysRemaining <= 3;

  // Initialize languages from subscription data
  useEffect(() => {
    if (trialSubscription?.selected_languages && Array.isArray(trialSubscription.selected_languages)) {
      setSelectedLanguages(trialSubscription.selected_languages);
      setSavedLanguages(trialSubscription.selected_languages);
    }
  }, [trialSubscription?.selected_languages]);

  // Track changes
  useEffect(() => {
    const currentSet = new Set(selectedLanguages);
    const savedSet = new Set(savedLanguages);
    const isDifferent = selectedLanguages.length !== savedLanguages.length ||
      selectedLanguages.some(lang => !savedSet.has(lang)) ||
      savedLanguages.some(lang => !currentSet.has(lang));
    setHasChanges(isDifferent && isOnTrial);
  }, [selectedLanguages, savedLanguages, isOnTrial]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/marketplace');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  if (!api) {
    return (
      <DashboardLayout>
        <NotFound>
          <NotFoundTitle>API Not Found</NotFoundTitle>
          <NotFoundText>The API you&apos;re looking for doesn&apos;t exist.</NotFoundText>
          <BackButton href="/dashboard/marketplace">Back to Marketplace</BackButton>
        </NotFound>
      </DashboardLayout>
    );
  }

  const isLanguageBased = api.id === 'localization' || api.id === 'internationalization';

  const renderIcon = (iconName: ApiIconName) => {
    return Icons[iconName] || Icons.zap;
  };
  const inCart = isInCart(api.id);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const getPrice = () => {
    if (isLanguageBased) {
      const prices = calculateLocalizationPrice(selectedLanguages);
      return billingPeriod === 'monthly' ? prices.monthly : prices.yearly;
    }
    return billingPeriod === 'monthly' ? api.pricing.monthly : api.pricing.yearly;
  };

  const getSavings = () => {
    if (isLanguageBased) {
      const prices = calculateLocalizationPrice(selectedLanguages);
      if (prices.monthly === 0) return 0;
      return Math.round(((prices.monthly * 12 - prices.yearly) / (prices.monthly * 12)) * 100);
    }
    return api.pricing.yearlyDiscount || 0;
  };

  const handleCartAction = () => {
    if (inCart) {
      removeFromCart(api.id);
    } else {
      addToCart({
        api,
        billingPeriod,
        selectedLanguages: isLanguageBased ? selectedLanguages : undefined,
        price: getPrice(),
      });
    }
  };

  const handleSaveLanguages = async () => {
    if (!trialSubscription?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/marketplace/subscriptions/${trialSubscription.id}/languages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_languages: selectedLanguages }),
      });

      if (response.ok) {
        setSavedLanguages(selectedLanguages);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save languages:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    setSelectedLanguages(savedLanguages);
    setHasChanges(false);
  };

  return (
    <DashboardLayout>
      <BackLink href="/dashboard/marketplace">
        ← Back to Marketplace
      </BackLink>

      <PageHeader>
        <ApiIcon $color={api.color}>{renderIcon(api.icon)}</ApiIcon>
        <HeaderInfo>
          <ApiCategory $color={api.color}>{api.category}</ApiCategory>
          <ApiName>{api.name}</ApiName>
          <ApiDescription>{api.description}</ApiDescription>
        </HeaderInfo>
      </PageHeader>

      <ContentGrid>
        <MainContent>
          <Section>
            <SectionTitle>About</SectionTitle>
            <LongDescription>{api.longDescription}</LongDescription>
          </Section>

          <Section>
            <SectionTitle>Features</SectionTitle>
            <FeatureList>
              {api.features.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </FeatureList>
          </Section>

          <Section>
            <SectionTitle>Use Cases</SectionTitle>
            <UseCaseList>
              {api.useCases.map((useCase, index) => (
                <UseCaseTag key={index}>{useCase}</UseCaseTag>
              ))}
            </UseCaseList>
          </Section>
        </MainContent>

        <div>
          <PricingCard>
            <PricingHeader>
              <PricingTitle>Choose your plan</PricingTitle>
              <BillingToggle>
                <BillingOption
                  $active={billingPeriod === 'monthly'}
                  onClick={() => setBillingPeriod('monthly')}
                >
                  Monthly
                </BillingOption>
                <BillingOption
                  $active={billingPeriod === 'yearly'}
                  onClick={() => setBillingPeriod('yearly')}
                >
                  Yearly
                  {getSavings() > 0 && <SaveBadge>Save {getSavings()}%</SaveBadge>}
                </BillingOption>
              </BillingToggle>
            </PricingHeader>

            <PricingBody>
              {isOnTrial ? (
                <ActiveTrialBanner $urgent={isTrialUrgent}>
                  <CountdownText $urgent={isTrialUrgent}>
                    ⏱ {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} left on trial
                  </CountdownText>
                  <CountdownSubtext>Add to cart to continue after trial ends</CountdownSubtext>
                </ActiveTrialBanner>
              ) : (
                <TrialBanner>
                  <TrialText>🎉 First 2 weeks FREE</TrialText>
                  <TrialSubtext>No credit card required to start</TrialSubtext>
                </TrialBanner>
              )}

              {isLanguageBased && (
                <LanguageSelector>
                  <LanguageLabel>
                    Select languages ({selectedLanguages.length} selected)
                    {isOnTrial && savedLanguages.length > 0 && ' • Currently active in trial'}
                  </LanguageLabel>
                  <LanguageGrid>
                    {localizationLanguages.map(lang => (
                      <LanguageOption
                        key={lang.code}
                        $selected={selectedLanguages.includes(lang.code)}
                      >
                        <LanguageCheckbox
                          type="checkbox"
                          checked={selectedLanguages.includes(lang.code)}
                          onChange={() => toggleLanguage(lang.code)}
                        />
                        <LanguageName>{lang.name}</LanguageName>
                        <LanguagePrice>+${lang.pricePerMonth}</LanguagePrice>
                      </LanguageOption>
                    ))}
                  </LanguageGrid>
                  {hasChanges && (
                    <SaveButtonGroup>
                      <SaveButton onClick={handleSaveLanguages} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </SaveButton>
                      <CancelButton onClick={handleCancelChanges}>
                        Cancel
                      </CancelButton>
                    </SaveButtonGroup>
                  )}
                </LanguageSelector>
              )}

              <PriceDisplay>
                <PriceAmount>
                  ${getPrice()}
                  <span>/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                </PriceAmount>
                {billingPeriod === 'yearly' && (
                  <PriceSubtext>
                    Billed annually
                  </PriceSubtext>
                )}
                {isLanguageBased && selectedLanguages.length === 0 && (
                  <PriceSubtext>
                    $2 per language • Select languages to get started
                  </PriceSubtext>
                )}
              </PriceDisplay>

              <AddToCartButton $inCart={inCart} onClick={handleCartAction}>
                {inCart ? '✓ Added to Cart' : 'Add to Cart'}
              </AddToCartButton>

              {itemCount > 0 && (
                <ViewCartButton href="/dashboard/marketplace/cart">
                  View Cart ({itemCount} item{itemCount !== 1 ? 's' : ''})
                </ViewCartButton>
              )}

              <PricingNote>
                {isOnTrial ? 'Cancel anytime' : '14-day free trial • Cancel anytime'}
              </PricingNote>
            </PricingBody>
          </PricingCard>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
}
