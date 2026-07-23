'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
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

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #EDEDED;
  margin: 0 0 8px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #8F8F8F;
  text-align: center;
  margin: 0 0 32px 0;
`;

const Form = styled.form`
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 12px;
  padding: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #EDEDED;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  font-size: 15px;
  color: #EDEDED;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #5E5E5E;
  }

  &:focus {
    outline: none;
    border-color: #3ECF8E;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 48px 12px 16px;
  background: #232323;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  font-size: 15px;
  color: #EDEDED;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #5E5E5E;
  }

  &:focus {
    outline: none;
    border-color: #3ECF8E;
  }
`;

const ToggleButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5E5E5E;
  z-index: 10;

  &:hover {
    color: #EDEDED;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #3ECF8E;
  color: #171717;
  border: none;
  border-radius: 8px;
  font-size: 15px;
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #5E5E5E;
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #2E2E2E;
  }

  span {
    padding: 0 16px;
  }
`;

const OAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OAuthButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: transparent;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  color: #EDEDED;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #3E3E3E;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ErrorMessage = styled.p`
  color: #F56565;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #8F8F8F;

  a {
    color: #3ECF8E;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Terms = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 12px;
  color: #5E5E5E;
  line-height: 1.6;

  a {
    color: #8F8F8F;
    text-decoration: none;

    &:hover {
      color: #EDEDED;
    }
  }
`;

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}&registered=true`);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Nav>
        <LogoLink href="/">
          {Icons.logo}
          <LogoText>Supebase</LogoText>
        </LogoLink>
      </Nav>
      <Main>
        <FormContainer>
          <Title>Create your account</Title>
          <Subtitle>Start building with Supebase for free</Subtitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <PasswordWrapper>
                <PasswordInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <ToggleButton
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </ToggleButton>
              </PasswordWrapper>
            </FormGroup>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Divider><span>or continue with</span></Divider>

            <OAuthButtons>
              <OAuthButton type="button">
                {Icons.github}
                GitHub
              </OAuthButton>
              <OAuthButton type="button">
                {Icons.globe}
                Google
              </OAuthButton>
            </OAuthButtons>
          </Form>
          <LoginLink>
            Already have an account? <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Sign in</Link>
          </LoginLink>
          <Terms>
            By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </Terms>
        </FormContainer>
      </Main>
    </PageWrapper>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ background: '#171717', minHeight: '100vh' }} />}>
      <RegisterContent />
    </Suspense>
  );
}
