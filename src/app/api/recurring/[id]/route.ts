import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getOrgId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from('org_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  return member?.organization_id ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const orgId = await getOrgId(supabase);

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from('recurring_invoices')
      .select('*, customer:customers(*)')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: '\u5B9A\u671F\u8ACB\u6C42\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/recurring/[id] error:', err);
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
    const orgId = await getOrgId(supabase);

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      customer_id,
      subject,
      send_day,
      start_date,
      end_date,
      items,
      tax_rate,
      payment_due_day,
      memo,
      auto_send,
      is_active,
    } = body;

    // Verify recurring invoice belongs to org
    const { data: existing, error: fetchError } = await supabase
      .from('recurring_invoices')
      .select('id')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: '\u5B9A\u671F\u8ACB\u6C42\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (customer_id !== undefined) updateData.customer_id = customer_id;
    if (subject !== undefined) updateData.subject = subject;
    if (send_day !== undefined) updateData.send_day = send_day;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date || null;
    if (items !== undefined) updateData.items = items;
    if (tax_rate !== undefined) updateData.tax_rate = tax_rate;
    if (payment_due_day !== undefined) updateData.payment_due_day = payment_due_day;
    if (memo !== undefined) updateData.memo = memo;
    if (auto_send !== undefined) updateData.auto_send = auto_send;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('recurring_invoices')
      .update(updateData)
      .eq('id', id)
      .eq('organization_id', orgId)
      .select('*, customer:customers(id, company_name)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('PUT /api/recurring/[id] error:', err);
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
    const orgId = await getOrgId(supabase);

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Deactivate instead of hard delete
    const { error } = await supabase
      .from('recurring_invoices')
      .update({ is_active: false })
      .eq('id', id)
      .eq('organization_id', orgId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/recurring/[id] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
