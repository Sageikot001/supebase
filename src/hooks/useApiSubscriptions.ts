'use client';

import { useState, useEffect } from 'react';

interface ApiSubscription {
  id: string;
  api_id: string;
  api_name: string;
  billing_period: 'monthly' | 'yearly';
  status: 'trial' | 'active' | 'cancelled' | 'expired';
  api_key: string;
  amount_paid: number;
  trial_ends_at: string | null;
  starts_at: string;
  expires_at: string;
  selected_languages: string[] | null;
}

export function useApiSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<ApiSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const response = await fetch('/api/marketplace/subscriptions');
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      } catch (error) {
        console.error('Failed to fetch API subscriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  const hasApi = (apiId: string) => {
    return subscriptions.some(
      sub => sub.api_id === apiId && ['trial', 'active'].includes(sub.status)
    );
  };

  const getApiSubscription = (apiId: string) => {
    return subscriptions.find(
      sub => sub.api_id === apiId && ['trial', 'active'].includes(sub.status)
    );
  };

  return { subscriptions, loading, hasApi, getApiSubscription };
}
