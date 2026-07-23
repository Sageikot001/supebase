'use client';

import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { Icons } from '@/components/icons';

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-size: 14px;
  color: #8F8F8F;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #EDEDED;
  }
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
  transition: color 0.2s;

  &:hover {
    color: #3ECF8E;
  }
`;

const StartButton = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #171717;
  background: #3ECF8E;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #4FF5A8;
  }
`;

const Hero = styled.section`
  padding: 160px 24px 120px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1200px;
    height: 600px;
    background: radial-gradient(ellipse at center top, rgba(62, 207, 142, 0.15) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(62, 207, 142, 0.1);
  border: 1px solid rgba(62, 207, 142, 0.3);
  color: #3ECF8E;
  font-size: 13px;
  font-weight: 500;
  border-radius: 20px;
  margin-bottom: 32px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(40px, 7vw, 72px);
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 24px 0;
  letter-spacing: -2px;
  line-height: 1.05;

  span {
    background: linear-gradient(135deg, #3ECF8E, #3B82F6, #8B5CF6);
    background-size: 200% 200%;
    animation: ${gradientMove} 5s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: #8F8F8F;
  margin: 0 0 48px 0;
  line-height: 1.6;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #3ECF8E;
  color: #171717;
  text-decoration: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #4FF5A8;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(62, 207, 142, 0.3);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: transparent;
  color: #EDEDED;
  text-decoration: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #3E3E3E;
  transition: all 0.2s;

  &:hover {
    border-color: #5E5E5E;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TrustedBy = styled.div`
  color: #5E5E5E;
  font-size: 13px;
  margin-bottom: 24px;
`;

const LogoGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  opacity: 0.4;
`;

const CompanyLogo = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #8F8F8F;
  letter-spacing: 1px;
`;

const FeaturesSection = styled.section`
  padding: 120px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const SectionBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: rgba(62, 207, 142, 0.1);
  color: #3ECF8E;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #8F8F8F;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  padding: 32px;
  transition: all 0.3s;

  &:hover {
    border-color: #3E3E3E;
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(62, 207, 142, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3ECF8E;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 12px 0;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0;
  line-height: 1.6;
`;

const ProductSection = styled.section`
  padding: 120px 24px;
  background: #1C1C1C;
`;

const ProductGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const ProductContent = styled.div``;

const ProductTitle = styled.h3`
  font-size: 32px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
`;

const ProductDescription = styled.p`
  font-size: 16px;
  color: #8F8F8F;
  margin: 0 0 24px 0;
  line-height: 1.7;
`;

const ProductFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
`;

const ProductFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #EDEDED;
  margin-bottom: 12px;

  svg {
    color: #3ECF8E;
    flex-shrink: 0;
  }
`;

const LearnMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #3ECF8E;
  text-decoration: none;
  transition: gap 0.2s;

  &:hover {
    gap: 12px;
  }
`;

const ProductPreview = styled.div`
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  padding: 24px;
  font-family: 'Source Code Pro', monospace;
`;

const CodeBlock = styled.pre`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #8F8F8F;
  overflow-x: auto;

  .keyword { color: #C792EA; }
  .string { color: #C3E88D; }
  .function { color: #82AAFF; }
  .comment { color: #5E5E5E; }
  .number { color: #F78C6C; }
`;

const PricingSection = styled.section`
  padding: 120px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: ${({ $featured }) => $featured ? 'linear-gradient(135deg, rgba(62, 207, 142, 0.1), rgba(59, 130, 246, 0.1))' : '#1C1C1C'};
  border: 1px solid ${({ $featured }) => $featured ? '#3ECF8E' : '#2E2E2E'};
  border-radius: 12px;
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const PricingBadge = styled.span`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  background: #3ECF8E;
  color: #171717;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
`;

const PlanName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 8px 0;
`;

const PlanDescription = styled.p`
  font-size: 13px;
  color: #8F8F8F;
  margin: 0 0 24px 0;
  line-height: 1.5;
  flex: 1;
`;

const PlanPrice = styled.div`
  margin-bottom: 24px;
`;

const PriceValue = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: #EDEDED;
`;

const PricePeriod = styled.span`
  font-size: 14px;
  color: #8F8F8F;
`;

const PlanButton = styled(Link)<{ $primary?: boolean }>`
  display: block;
  text-align: center;
  padding: 12px 24px;
  background: ${({ $primary }) => $primary ? '#3ECF8E' : 'transparent'};
  color: ${({ $primary }) => $primary ? '#171717' : '#EDEDED'};
  border: 1px solid ${({ $primary }) => $primary ? '#3ECF8E' : '#3E3E3E'};
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ $primary }) => $primary ? '#4FF5A8' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${({ $primary }) => $primary ? '#4FF5A8' : '#5E5E5E'};
  }
`;

const CTASection = styled.section`
  padding: 120px 24px;
  background: linear-gradient(135deg, rgba(62, 207, 142, 0.05), rgba(59, 130, 246, 0.05));
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Footer = styled.footer`
  padding: 64px 24px 32px;
  background: #171717;
  border-top: 1px solid #2E2E2E;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: 48px;
  margin-bottom: 48px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FooterBrand = styled.div``;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3ECF8E;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 700;
`;

const FooterTagline = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialLink = styled.a`
  color: #5E5E5E;
  transition: color 0.2s;

  &:hover {
    color: #EDEDED;
  }
`;

const FooterColumn = styled.div``;

const FooterColumnTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 12px;
`;

const FooterLink = styled(Link)`
  font-size: 14px;
  color: #8F8F8F;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #EDEDED;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid #2E2E2E;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Copyright = styled.p`
  font-size: 13px;
  color: #5E5E5E;
  margin: 0;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const FooterBottomLink = styled(Link)`
  font-size: 13px;
  color: #5E5E5E;
  text-decoration: none;

  &:hover {
    color: #8F8F8F;
  }
`;

export default function LandingPage() {
  return (
    <PageWrapper>
      <Nav>
        <NavContainer>
          <LogoLink href="/">
            {Icons.logo}
            <LogoText>Supebase</LogoText>
          </LogoLink>
          <NavLinks>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="#">Docs</NavLink>
            <NavLink href="#">Blog</NavLink>
          </NavLinks>
          <NavButtons>
            <SignInButton href="/login">Sign in</SignInButton>
            <StartButton href="/register">Start your project</StartButton>
          </NavButtons>
        </NavContainer>
      </Nav>

      <Hero>
        <HeroContent>
          <Badge>{Icons.zap} New: Supebase Queues now in Beta</Badge>
          <HeroTitle>
            Build in a weekend.
            <br />
            <span>Scale to millions.</span>
          </HeroTitle>
          <HeroSubtitle>
            Supebase is an open source Firebase alternative. Start your project with a
            Postgres database, Authentication, instant APIs, Edge Functions, Realtime
            subscriptions, Storage, and Vector embeddings.
          </HeroSubtitle>
          <CTAButtons>
            <PrimaryButton href="/register">Start your project</PrimaryButton>
            <SecondaryButton href="#">
              {Icons.book} Documentation
            </SecondaryButton>
          </CTAButtons>
          <TrustedBy>Trusted by fast-growing companies worldwide</TrustedBy>
          <LogoGrid>
            <CompanyLogo>MOZILLA</CompanyLogo>
            <CompanyLogo>GITHUB</CompanyLogo>
            <CompanyLogo>NOTION</CompanyLogo>
            <CompanyLogo>1PASSWORD</CompanyLogo>
            <CompanyLogo>PIKA</CompanyLogo>
          </LogoGrid>
        </HeroContent>
      </Hero>

      <FeaturesSection>
        <SectionHeader>
          <SectionBadge>Features</SectionBadge>
          <SectionTitle>Everything you need to build</SectionTitle>
          <SectionSubtitle>
            Integrate Supebase over a weekend and scale to millions of users.
          </SectionSubtitle>
        </SectionHeader>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>{Icons.database}</FeatureIcon>
            <FeatureTitle>Database</FeatureTitle>
            <FeatureDescription>
              Every project is a full Postgres database with realtime functionality,
              database backups, extensions, and more.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>{Icons.key}</FeatureIcon>
            <FeatureTitle>Authentication</FeatureTitle>
            <FeatureDescription>
              Add user sign ups and logins with Row Level Security. Support for
              email, OAuth, magic links, and more.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>{Icons.storage}</FeatureIcon>
            <FeatureTitle>Storage</FeatureTitle>
            <FeatureDescription>
              Store, organize, and serve large files. Any media, including videos
              and images with built-in CDN.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>{Icons.function}</FeatureIcon>
            <FeatureTitle>Edge Functions</FeatureTitle>
            <FeatureDescription>
              Write custom code without deploying or scaling servers. Run globally
              close to your users.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>{Icons.realtime}</FeatureIcon>
            <FeatureTitle>Realtime</FeatureTitle>
            <FeatureDescription>
              Build multiplayer experiences with Realtime. Listen to database changes
              and sync across clients.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>{Icons.zap}</FeatureIcon>
            <FeatureTitle>Vector / AI</FeatureTitle>
            <FeatureDescription>
              Store vector embeddings in Postgres. Build AI applications with
              pgvector integration.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <ProductSection>
        <ProductGrid>
          <ProductContent>
            <SectionBadge>Database</SectionBadge>
            <ProductTitle>Every project is a full Postgres database</ProductTitle>
            <ProductDescription>
              Supebase is built on top of Postgres, the world&apos;s most loved database.
              Every project gets a dedicated Postgres database with 100% data isolation
              and automatic daily backups.
            </ProductDescription>
            <ProductFeatures>
              <ProductFeature>
                {Icons.check} 100% portable — bring your own database or migrate out anytime
              </ProductFeature>
              <ProductFeature>
                {Icons.check} Built-in Auth with Row Level Security
              </ProductFeature>
              <ProductFeature>
                {Icons.check} Realtime data sync across all clients
              </ProductFeature>
              <ProductFeature>
                {Icons.check} Support for 50+ Postgres extensions
              </ProductFeature>
            </ProductFeatures>
            <LearnMoreLink href="#">
              Learn more about Database {Icons.arrowRight}
            </LearnMoreLink>
          </ProductContent>
          <ProductPreview>
            <CodeBlock>
              <span className="comment">{`// Create a table`}</span>{'\n'}
              <span className="keyword">const</span> {'{ data, error }'} = <span className="keyword">await</span> supabase{'\n'}
              {'  '}.from(<span className="string">&apos;countries&apos;</span>){'\n'}
              {'  '}.select(<span className="string">&apos;*&apos;</span>){'\n'}
              {'  '}.eq(<span className="string">&apos;continent&apos;</span>, <span className="string">&apos;Africa&apos;</span>){'\n'}
              {'\n'}
              <span className="comment">{`// Returns all African countries`}</span>{'\n'}
              console.<span className="function">log</span>(data)
            </CodeBlock>
          </ProductPreview>
        </ProductGrid>
      </ProductSection>

      <PricingSection>
        <SectionHeader>
          <SectionBadge>Pricing</SectionBadge>
          <SectionTitle>Predictable pricing, no surprises</SectionTitle>
          <SectionSubtitle>
            Start for free, then scale as you grow. Transparent pricing with no hidden fees.
          </SectionSubtitle>
        </SectionHeader>

        <PricingGrid>
          <PricingCard>
            <PlanName>Free</PlanName>
            <PlanDescription>
              Perfect for passion projects & simple websites.
            </PlanDescription>
            <PlanPrice>
              <PriceValue>$0</PriceValue>
              <PricePeriod> / month</PricePeriod>
            </PlanPrice>
            <PlanButton href="/register">Start for free</PlanButton>
          </PricingCard>

          <PricingCard $featured>
            <PricingBadge>Most Popular</PricingBadge>
            <PlanName>Pro</PlanName>
            <PlanDescription>
              For production applications with the power to scale.
            </PlanDescription>
            <PlanPrice>
              <PriceValue>$25</PriceValue>
              <PricePeriod> / month</PricePeriod>
            </PlanPrice>
            <PlanButton href="/pricing" $primary>Get started</PlanButton>
          </PricingCard>

          <PricingCard>
            <PlanName>Team</PlanName>
            <PlanDescription>
              For teams with additional security and compliance needs.
            </PlanDescription>
            <PlanPrice>
              <PriceValue>$599</PriceValue>
              <PricePeriod> / month</PricePeriod>
            </PlanPrice>
            <PlanButton href="/pricing">Get started</PlanButton>
          </PricingCard>

          <PricingCard>
            <PlanName>Enterprise</PlanName>
            <PlanDescription>
              For large-scale applications with custom needs.
            </PlanDescription>
            <PlanPrice>
              <PriceValue>Custom</PriceValue>
            </PlanPrice>
            <PlanButton href="#">Contact sales</PlanButton>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      <CTASection>
        <CTAContent>
          <SectionTitle>Start building today</SectionTitle>
          <SectionSubtitle style={{ marginBottom: '32px' }}>
            The fastest way to build your next project. Start with a free account,
            no credit card required.
          </SectionSubtitle>
          <PrimaryButton href="/register">Start your project</PrimaryButton>
        </CTAContent>
      </CTASection>

      <Footer>
        <FooterContainer>
          <FooterGrid>
            <FooterBrand>
              <FooterLogo>
                {Icons.logo}
                Supebase
              </FooterLogo>
              <FooterTagline>
                Build in a weekend, scale to millions. Supebase is an open source
                Firebase alternative providing all the backend features you need.
              </FooterTagline>
              <SocialLinks>
                <SocialLink href="#">{Icons.github}</SocialLink>
                <SocialLink href="#">{Icons.twitter}</SocialLink>
                <SocialLink href="#">{Icons.discord}</SocialLink>
              </SocialLinks>
            </FooterBrand>

            <FooterColumn>
              <FooterColumnTitle>Product</FooterColumnTitle>
              <FooterLinks>
                <FooterLinkItem><FooterLink href="#">Database</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Authentication</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Storage</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Edge Functions</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Realtime</FooterLink></FooterLinkItem>
              </FooterLinks>
            </FooterColumn>

            <FooterColumn>
              <FooterColumnTitle>Resources</FooterColumnTitle>
              <FooterLinks>
                <FooterLinkItem><FooterLink href="#">Documentation</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Guides</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Blog</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Changelog</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Status</FooterLink></FooterLinkItem>
              </FooterLinks>
            </FooterColumn>

            <FooterColumn>
              <FooterColumnTitle>Company</FooterColumnTitle>
              <FooterLinks>
                <FooterLinkItem><FooterLink href="#">About</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Careers</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Partners</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Contact</FooterLink></FooterLinkItem>
              </FooterLinks>
            </FooterColumn>

            <FooterColumn>
              <FooterColumnTitle>Legal</FooterColumnTitle>
              <FooterLinks>
                <FooterLinkItem><FooterLink href="#">Privacy Policy</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">Terms of Service</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">DPA</FooterLink></FooterLinkItem>
                <FooterLinkItem><FooterLink href="#">SOC 2</FooterLink></FooterLinkItem>
              </FooterLinks>
            </FooterColumn>
          </FooterGrid>

          <FooterBottom>
            <Copyright>© 2024 Supebase Inc. All rights reserved.</Copyright>
            <FooterBottomLinks>
              <FooterBottomLink href="#">Privacy</FooterBottomLink>
              <FooterBottomLink href="#">Terms</FooterBottomLink>
            </FooterBottomLinks>
          </FooterBottom>
        </FooterContainer>
      </Footer>
    </PageWrapper>
  );
}
