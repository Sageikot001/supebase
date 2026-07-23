import type { Metadata } from 'next';
import { Source_Sans_3, Source_Code_Pro } from 'next/font/google';
import StyledComponentsRegistry from '@/styles/registry';
import SessionProvider from '@/components/SessionProvider';
import { CartProvider } from '@/contexts/CartContext';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sourceCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Supebase | The Open Source Firebase Alternative',
  description: 'Build in a weekend, scale to millions. Supebase is an open source Firebase alternative providing all the backend features you need to build a product.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceCode.variable}`}>
      <body style={{ margin: 0, fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <SessionProvider>
          <CartProvider>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
