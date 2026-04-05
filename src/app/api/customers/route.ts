import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const { data: member } = await supabase
      .from('org_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!member) {
      return NextResponse.json(
        { error: 'No organization' },
        { status: 403 }
      );
    }

    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('organization_id', member.organization_id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ customers: customers ?? [] });
  } catch (err) {
    console.error('GET /api/customers error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required field
    if (!body.company_name || body.company_name.trim() === '') {
      return NextResponse.json(
        { error: 'company_name is required' },
        { status: 400 }
      );
    }

    // Get user's organization
    const { data: member } = await supabase
      .from('org_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!member) {
      return NextResponse.json(
        { error: 'No organization' },
        { status: 403 }
      );
    }

    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        organization_id: member.organization_id,
        company_name: body.company_name.trim(),
        contact_person: body.contact_person || null,
        email: body.email || null,
        postal_code: body.postal_code || null,
        address: body.address || null,
        payment_method: body.payment_method || 'bank_transfer',
        notes: body.notes || '',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ customer }, { status: 201 });
  } catch (err) {
    console.error('POST /api/customers error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
