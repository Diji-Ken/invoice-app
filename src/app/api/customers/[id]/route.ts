import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Helper: authenticate user and resolve their organization_id.
 */
async function resolveOrg(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, orgId: null };

  const { data: member } = await supabase
    .from('org_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  return { user, orgId: member?.organization_id ?? null };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { user, orgId } = await resolveOrg(supabase);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!orgId) {
      return NextResponse.json({ error: 'No organization' }, { status: 403 });
    }

    const { id } = await params;

    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (error || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (err) {
    console.error('GET /api/customers/[id] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { user, orgId } = await resolveOrg(supabase);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!orgId) {
      return NextResponse.json({ error: 'No organization' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.company_name || body.company_name.trim() === '') {
      return NextResponse.json(
        { error: 'company_name is required' },
        { status: 400 }
      );
    }

    const { data: customer, error } = await supabase
      .from('customers')
      .update({
        company_name: body.company_name.trim(),
        contact_person: body.contact_person ?? null,
        email: body.email ?? null,
        postal_code: body.postal_code ?? null,
        address: body.address ?? null,
        payment_method: body.payment_method ?? 'bank_transfer',
        notes: body.notes ?? '',
        is_active: body.is_active ?? true,
      })
      .eq('id', id)
      .eq('organization_id', orgId)
      .select()
      .single();

    if (error || !customer) {
      return NextResponse.json(
        { error: error?.message ?? 'Customer not found' },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (err) {
    console.error('PUT /api/customers/[id] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { user, orgId } = await resolveOrg(supabase);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!orgId) {
      return NextResponse.json({ error: 'No organization' }, { status: 403 });
    }

    const { id } = await params;

    // Soft-delete: set is_active = false
    const { data: customer, error } = await supabase
      .from('customers')
      .update({ is_active: false })
      .eq('id', id)
      .eq('organization_id', orgId)
      .select()
      .single();

    if (error || !customer) {
      return NextResponse.json(
        { error: error?.message ?? 'Customer not found' },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/customers/[id] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
