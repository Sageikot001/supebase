import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ organizations: [] });
    }

    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select(`
        role,
        organization:organizations (
          id,
          name,
          slug,
          billing_email,
          created_at
        )
      `)
      .eq('user_id', profile.id);

    if (error) {
      console.error('Error fetching organizations:', error);
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }

    const organizations = memberships?.map((m) => ({
      ...m.organization,
      role: m.role,
    })) || [];

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        owner_id: profile.id,
        billing_email: session.user.email,
      })
      .select()
      .single();

    if (orgError) {
      if (orgError.code === '23505') {
        return NextResponse.json({ error: 'Organization slug already exists' }, { status: 400 });
      }
      console.error('Error creating organization:', orgError);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }

    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: profile.id,
        role: 'owner',
      });

    if (memberError) {
      await supabase.from('organizations').delete().eq('id', org.id);
      console.error('Error adding owner as member:', memberError);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }

    return NextResponse.json({ organization: { ...org, role: 'owner' } });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
