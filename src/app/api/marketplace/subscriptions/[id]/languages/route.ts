import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { selected_languages } = await request.json();

    if (!Array.isArray(selected_languages)) {
      return NextResponse.json({ error: 'Invalid languages format' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update the subscription's selected languages
    const { data, error } = await supabase
      .from('api_subscriptions')
      .update({
        selected_languages,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', profile.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating languages:', error);
      return NextResponse.json({ error: 'Failed to update languages' }, { status: 500 });
    }

    return NextResponse.json({ subscription: data });
  } catch (error) {
    console.error('Error in PUT /api/marketplace/subscriptions/[id]/languages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
