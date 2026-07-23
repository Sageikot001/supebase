export type BillingPeriod = 'monthly' | 'yearly';

export interface PlanPricing {
  monthly: number;
  yearly: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  pricing: PlanPricing;
  tag?: 'popular' | 'best-value';
  cta: string;
}

export interface PlanFeature {
  name: string;
  values: [string | boolean, string | boolean, string | boolean, string | boolean];
  tooltip?: string;
}

export const billingPeriods: { id: BillingPeriod; label: string; discount?: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Annually', discount: 'Save 20%' },
];

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for passion projects & simple websites.',
    pricing: {
      monthly: 0,
      yearly: 0,
    },
    cta: 'Start for Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For production applications with the power to scale.',
    pricing: {
      monthly: 25,
      yearly: 20,
    },
    tag: 'popular',
    cta: 'Get Started',
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Collaborate with your team with additional security.',
    pricing: {
      monthly: 599,
      yearly: 499,
    },
    cta: 'Get Started',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale applications with custom needs.',
    pricing: {
      monthly: -1, // Contact sales
      yearly: -1,
    },
    tag: 'best-value',
    cta: 'Contact Sales',
  },
];

export const features: PlanFeature[] = [
  { name: 'Dedicated Postgres Database', values: [true, true, true, true] },
  { name: 'Unlimited API requests', values: [true, true, true, true] },
  { name: 'Database size', values: ['500 MB', '8 GB', '16 GB', 'Custom'] },
  { name: 'Automatic backups', values: [false, '7 days', '14 days', 'Custom'] },
  { name: 'Point in time recovery', values: [false, false, true, true] },
  { name: 'Storage', values: ['1 GB', '100 GB', '200 GB', 'Custom'] },
  { name: 'Storage egress', values: ['2 GB', '200 GB', '400 GB', 'Custom'] },
  { name: 'Custom domains', values: [false, true, true, true] },
  { name: 'Edge Functions', values: ['500K/mo', '2M/mo', '5M/mo', 'Unlimited'] },
  { name: 'Realtime connections', values: ['200', '500', '1,000', 'Unlimited'] },
  { name: 'Auth MAUs', values: ['50,000', '100,000', '100,000', 'Unlimited'] },
  { name: 'Team members', values: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { name: 'Support', values: ['Community', 'Email', 'Priority', 'Dedicated'] },
  { name: 'SOC2 compliance', values: [false, false, true, true] },
  { name: 'SSO/SAML', values: [false, false, true, true] },
  { name: 'SLA', values: [false, false, '99.9%', '99.99%'] },
];

export interface PlanLimits {
  databaseSizeMb: number;
  storageSizeMb: number;
  edgeFunctionInvocations: number;
  realtimeConnections: number;
  authMaus: number;
  backupDays: number;
  customDomains: number;
  storageGb: number;
}

export const planLimits: Record<string, PlanLimits> = {
  free: {
    databaseSizeMb: 500,
    storageSizeMb: 1024,
    edgeFunctionInvocations: 500000,
    realtimeConnections: 200,
    authMaus: 50000,
    backupDays: 0,
    customDomains: 0,
    storageGb: 1,
  },
  pro: {
    databaseSizeMb: 8192,
    storageSizeMb: 102400,
    edgeFunctionInvocations: 2000000,
    realtimeConnections: 500,
    authMaus: 100000,
    backupDays: 7,
    customDomains: 10,
    storageGb: 100,
  },
  team: {
    databaseSizeMb: 16384,
    storageSizeMb: 204800,
    edgeFunctionInvocations: 5000000,
    realtimeConnections: 1000,
    authMaus: 100000,
    backupDays: 14,
    customDomains: 50,
    storageGb: 200,
  },
  enterprise: {
    databaseSizeMb: -1,
    storageSizeMb: -1,
    edgeFunctionInvocations: -1,
    realtimeConnections: -1,
    authMaus: -1,
    backupDays: -1,
    customDomains: -1,
    storageGb: -1,
  },
};

export function getPlanLimits(planId: string | null | undefined): PlanLimits | null {
  if (!planId) return planLimits.free;
  return planLimits[planId] ?? planLimits.free;
}

export function getPlanById(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function getBillingPeriod(id: BillingPeriod) {
  return billingPeriods.find((bp) => bp.id === id);
}

export function calculateTotal(plan: Plan, billingPeriod: BillingPeriod): number {
  if (plan.pricing[billingPeriod] === -1) return -1;
  const months = billingPeriod === 'yearly' ? 12 : 1;
  return plan.pricing[billingPeriod] * months;
}

export function formatPrice(price: number): string {
  if (price === -1) return 'Custom';
  if (price === 0) return 'Free';
  return `$${price}`;
}
