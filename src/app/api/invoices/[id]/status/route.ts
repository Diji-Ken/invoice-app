import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { InvoiceStatus } from '@/lib/types';

const validTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ['issued', 'cancelled'],
  issued: ['sent', 'cancelled'],
  sent: ['paid', 'overdue', 'cancelled'],
  paid: [],
  cancelled: [],
  overdue: ['paid', 'cancelled'],
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: member } = await supabase
      .from('org_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!member) {
      return NextResponse.json(
        { error: 'No organization' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status } = (await request.json()) as { status: InvoiceStatus };

    // Fetch current invoice
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('status')
      .eq('id', id)
      .eq('organization_id', member.organization_id)
      .single();

    if (fetchError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const currentStatus = invoice.status as InvoiceStatus;
    const allowed = validTransitions[currentStatus] ?? [];

    if (!allowed.includes(status)) {
      return NextResponse.json(
        {
          error: `ステータスを「${currentStatus}」から「${status}」に変更できません`,
        },
        { status: 400 }
      );
    }

    // Build update payload with timestamp fields
    const updatePayload: Record<string, unknown> = { status };

    if (status === 'sent') {
      updatePayload.sent_at = new Date().toISOString();
    }
    if (status === 'paid') {
      updatePayload.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updatePayload)
      .eq('id', id)
      .eq('organization_id', member.organization_id)
      .select('*, customer:customers(id, company_name)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('PUT /api/invoices/[id]/status error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
