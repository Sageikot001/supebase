import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

function generateApiKey(): string {
  return `spb_${crypto.randomBytes(24).toString('hex')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createAdminClient();

    switch (event.event) {
      case 'charge.success': {
        const { reference, customer, amount, currency, metadata } = event.data;

        // Find user by email
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customer.email)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Database error during profile lookup, ref:', reference);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (!profile) {
          console.error('User not found for payment ref:', reference);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Handle marketplace API purchases
        if (metadata?.type === 'marketplace' && metadata?.items) {
          const items = metadata.items as Array<{
            api_id: string;
            api_name: string;
            billing_period: 'monthly' | 'yearly';
            price: number;
            selected_languages?: string[];
          }>;

          for (const item of items) {
            const months = item.billing_period === 'yearly' ? 12 : 1;
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + months);

            const { error: apiSubError } = await supabase
              .from('api_subscriptions')
              .upsert({
                user_id: profile.id,
                api_id: item.api_id,
                api_name: item.api_name,
                billing_period: item.billing_period,
                status: 'active',
                api_key: generateApiKey(),
                amount_paid: item.price,
                currency: 'USD',
                selected_languages: item.selected_languages || null,
                trial_ends_at: null,
                starts_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
                paystack_reference: reference,
              }, {
                onConflict: 'user_id,api_id',
              });

            if (apiSubError) {
              console.error('API subscription failed:', item.api_id, apiSubError);
            } else {
              console.log('API subscription activated:', item.api_id, 'user:', profile.id);
            }
          }

          return NextResponse.json({ received: true });
        }

        // Handle platform subscription purchases
        const { data: membership } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', profile.id)
          .eq('role', 'owner')
          .single();

        if (!membership) {
          console.error('No owned organization found for user, ref:', reference);
          return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const billingPeriod = metadata?.billing_period || 'monthly';
        const months = billingPeriod === 'yearly' ? 12 : 1;
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + months);

        const plan = metadata?.plan_id || 'pro';

        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            organization_id: membership.organization_id,
            plan: plan,
            billing_period: billingPeriod,
            status: 'active',
            paystack_reference: reference,
            paystack_customer_code: customer.customer_code,
            amount_paid: amount,
            currency: currency,
            starts_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
          }, {
            onConflict: 'organization_id',
          });

        if (subscriptionError) {
          console.error('Subscription update failed, ref:', reference, subscriptionError);
          return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
        }

        console.log('Subscription activated, org_id:', membership.organization_id, 'ref:', reference, 'plan:', plan);
        break;
      }

      case 'subscription.disable':
      case 'subscription.not_renew': {
        const { customer, reference } = event.data;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customer.email)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Database error during subscription update, ref:', reference);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (profile) {
          const { data: membership } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', profile.id)
            .eq('role', 'owner')
            .single();

          if (membership) {
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                plan: 'free',
                status: 'active',
                updated_at: new Date().toISOString(),
              })
              .eq('organization_id', membership.organization_id);

            if (updateError) {
              console.error('Subscription downgrade failed, org_id:', membership.organization_id, updateError);
              return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
            }
            console.log('Subscription downgraded to free, org_id:', membership.organization_id);
          }
        }
        break;
      }

      case 'charge.failed': {
        const { reference, metadata } = event.data;
        console.log('Payment failed, ref:', reference, 'type:', metadata?.type || 'subscription');
        break;
      }

      default:
        console.log('Unhandled Paystack event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
