import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateTotals } from '@/lib/invoice-helpers';

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
      .from('invoices')
      .select('*, customer:customers(*)')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/invoices/[id] error:', err);
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
      issue_date,
      payment_due_date,
      items,
      tax_rate,
      memo,
      notes,
    } = body;

    // Verify invoice exists and belongs to org
    const { data: existing, error: fetchError } = await supabase
      .from('invoices')
      .select('status')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    if (existing.status !== 'draft') {
      return NextResponse.json(
        { error: '下書き以外の請求書は編集できません' },
        { status: 400 }
      );
    }

    const { subtotal, tax, total } = calculateTotals(
      items,
      tax_rate ?? 0.1
    );

    const { data, error } = await supabase
      .from('invoices')
      .update({
        customer_id,
        subject,
        issue_date,
        payment_due_date: payment_due_date || null,
        items,
        tax_rate: tax_rate ?? 0.1,
        subtotal,
        tax,
        total,
        memo: memo ?? '',
        notes: notes ?? '',
      })
      .eq('id', id)
      .eq('organization_id', orgId)
      .select('*, customer:customers(id, company_name)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('PUT /api/invoices/[id] error:', err);
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

    // Verify invoice is draft
    const { data: existing, error: fetchError } = await supabase
      .from('invoices')
      .select('status')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    if (existing.status !== 'draft') {
      return NextResponse.json(
        { error: '下書きの請求書のみ削除できます' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('organization_id', orgId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/invoices/[id] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
