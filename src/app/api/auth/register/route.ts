import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await createUser(email, name, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Create personal organization for the user
    const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: `${name}'s Organization`,
        slug: `${orgSlug}-${Date.now()}`,
        owner_id: user.id,
        billing_email: email,
      })
      .select()
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      // Don't fail registration if org creation fails - user can create one later
    }

    if (org) {
      // Add user as owner of the organization
      await supabase.from('organization_members').insert({
        organization_id: org.id,
        user_id: user.id,
        role: 'owner',
      });

      // Create free subscription for the organization
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 100); // Free plan doesn't expire

      await supabase.from('subscriptions').insert({
        organization_id: org.id,
        plan: 'free',
        billing_period: 'monthly',
        status: 'active',
        amount_paid: 0,
        currency: 'NGN',
        starts_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
