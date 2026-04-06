import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateTotals } from '@/lib/invoice-helpers';

function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function calcPaymentDueDate(paymentDueDay: number): string {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 2;

  if (month > 12) {
    month = month - 12;
    year++;
  }

  if (paymentDueDay === 99) {
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }

  if (paymentDueDay === 25) {
    return `${year}-${String(month).padStart(2, '0')}-25`;
  }

  if (paymentDueDay === 0) {
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }

  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify CRON_SECRET
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date();
    const todayDay = now.getDate();
    const currentMonth = getCurrentMonth();
    const today = now.toISOString().split('T')[0];

    // Find recurring invoices to generate
    let query = supabase
      .from('recurring_invoices')
      .select('*')
      .eq('is_active', true)
      .eq('send_day', todayDay)
      .or(`last_generated_month.is.null,last_generated_month.neq.${currentMonth}`)
      .or(`end_date.is.null,end_date.gte.${today}`);

    const { data: recurringList, error: fetchError } = await query;

    if (fetchError) {
      console.error('Cron generate fetch error:', fetchError);
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    const results: { recurring_id: string; invoice_id: string; invoice_number: string }[] = [];
    const errors: { recurring_id: string; error: string }[] = [];

    for (const recurring of recurringList ?? []) {
      try {
        // Generate invoice number via RPC
        const { data: invoiceNumber, error: rpcError } = await supabase.rpc(
          'generate_invoice_number',
          { org_id: recurring.organization_id }
        );

        if (rpcError) {
          errors.push({ recurring_id: recurring.id, error: rpcError.message });
          continue;
        }

        const { subtotal, tax, total } = calculateTotals(
          recurring.items,
          recurring.tax_rate
        );

        const paymentDueDate = calcPaymentDueDate(recurring.payment_due_day);

        const { data: invoice, error: insertError } = await supabase
          .from('invoices')
          .insert({
            organization_id: recurring.organization_id,
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
            created_by: null,
          })
          .select('id, invoice_number')
          .single();

        if (insertError) {
          errors.push({ recurring_id: recurring.id, error: insertError.message });
          continue;
        }

        // Update recurring invoice
        await supabase
          .from('recurring_invoices')
          .update({
            last_generated_month: currentMonth,
          })
          .eq('id', recurring.id);

        results.push({
          recurring_id: recurring.id,
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
        });
      } catch (err) {
        errors.push({
          recurring_id: recurring.id,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      generated: results.length,
      errors: errors.length,
      results,
      errorDetails: errors,
    });
  } catch (err) {
    console.error('POST /api/cron/generate error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
