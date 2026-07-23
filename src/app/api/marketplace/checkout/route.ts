import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { convertToNGN } from '@/lib/currency';
import crypto from 'crypto';

interface CartItem {
  apiId: string;
  apiName: string;
  billingPeriod: 'monthly' | 'yearly';
  price: number;
  selectedLanguages?: string[];
}

function generateApiKey(): string {
  return `spb_${crypto.randomBytes(24).toString('hex')}`;
}

function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `SPBMKT_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, startTrial } = body as { items: CartItem[]; startTrial?: boolean };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If starting free trial, create trial subscriptions immediately
    if (startTrial) {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const subscriptions = items.map(item => ({
        user_id: profile.id,
        api_id: item.apiId,
        api_name: item.apiName,
        billing_period: item.billingPeriod,
        status: 'trial' as const,
        api_key: generateApiKey(),
        amount_paid: 0,
        currency: 'USD',
        selected_languages: item.selectedLanguages || null,
        trial_ends_at: trialEndsAt.toISOString(),
        starts_at: new Date().toISOString(),
        expires_at: trialEndsAt.toISOString(),
      }));

      const { error: insertError } = await supabase
        .from('api_subscriptions')
        .upsert(subscriptions, { onConflict: 'user_id,api_id' });

      if (insertError) {
        console.error('Error creating trial subscriptions:', insertError);
        return NextResponse.json({ error: 'Failed to start trial' }, { status: 500 });
      }

      return NextResponse.json({ success: true, trial: true });
    }

    // Calculate total in USD then convert to NGN
    const totalUSD = items.reduce((sum, item) => sum + item.price, 0);
    const totalNGN = convertToNGN(totalUSD);
    const amountInKobo = Math.round(totalNGN * 100);

    const reference = generateReference();

    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      if (process.env.NODE_ENV === 'development') {
        baseUrl = request.headers.get('origin') || 'http://localhost:3000';
      } else {
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: amountInKobo,
        currency: 'NGN',
        reference,
        callback_url: `${baseUrl}/dashboard/marketplace/success`,
        metadata: {
          type: 'marketplace',
          items: items.map(item => ({
            api_id: item.apiId,
            api_name: item.apiName,
            billing_period: item.billingPeriod,
            price: item.price,
            selected_languages: item.selectedLanguages,
          })),
          user_id: profile.id,
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      amount: amountInKobo,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
