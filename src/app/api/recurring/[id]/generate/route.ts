import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateTotals } from '@/lib/invoice-helpers';

async function getOrgId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { orgId: null, userId: null };

  const { data: member } = await supabase
    .from('org_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  return { orgId: member?.organization_id ?? null, userId: user.id };
}

function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function calcPaymentDueDate(paymentDueDay: number): string {
  const now = new Date();
  // Payment due = next month
  let year = now.getFullYear();
  let month = now.getMonth() + 2; // next month (0-indexed + 2)

  if (month > 12) {
    month = month - 12;
    year++;
  }

  if (paymentDueDay === 99) {
    // End of next month
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }

  if (paymentDueDay === 25) {
    return `${year}-${String(month).padStart(2, '0')}-25`;
  }

  // payment_due_day === 0 means end of current month
  if (paymentDueDay === 0) {
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }

  // Default: end of next month
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { orgId, userId } = await getOrgId(supabase);

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const currentMonth = getCurrentMonth();

    // Get recurring invoice
    const { data: recurring, error: fetchError } = await supabase
      .from('recurring_invoices')
      .select('*')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (fetchError || !recurring) {
      return NextResponse.json(
        { error: '\u5B9A\u671F\u8ACB\u6C42\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093' },
        { status: 404 }
      );
    }

    // Check if already generated this month
    if (recurring.last_generated_month === currentMonth) {
      return NextResponse.json(
        { error: '\u4ECA\u6708\u5206\u306F\u65E2\u306B\u751F\u6210\u6E08\u307F\u3067\u3059' },
        { status: 409 }
      );
    }

    // Generate invoice number via RPC
    const { data: invoiceNumber, error: rpcError } = await supabase.rpc(
      'generate_invoice_number',
      { org_id: orgId }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message },
        { status: 500 }
      );
    }

    const { subtotal, tax, total } = calculateTotals(
      recurring.items,
      recurring.tax_rate
    );

    const today = new Date().toISOString().split('T')[0];
    const paymentDueDate = calcPaymentDueDate(recurring.payment_due_day);

    // Create invoice
    const { data: invoice, error: insertError } = await supabase
      .from('invoices')
      .insert({
        organization_id: orgId,
        invoice_number: invoiceNumber,
        customer_id: recurring.customer_id,
        subject: recurring.subject,
        issue_date: today,
        payment_due_date: paymentDueDate,
        items: recurring.items,
        tax_rate: recurring.tax_rate,
        subtotal,
        tax,
        total,
        status: 'draft',
        memo: recurring.memo || '',
        notes: '',
        recurring_invoice_id: recurring.id,
        created_by: userId,
      })
      .select('*, customer:customers(id, company_name)')
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // Update recurring invoice
    await supabase
      .from('recurring_invoices')
      .update({
        last_generated_month: currentMonth,
      })
      .eq('id', id);

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error('POST /api/recurring/[id]/generate error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
