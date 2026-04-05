import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateTotals } from '@/lib/invoice-helpers';

export async function GET(request: NextRequest) {
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

    const url = request.nextUrl;
    const status = url.searchParams.get('status');
    const customerId = url.searchParams.get('customerId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    let query = supabase
      .from('invoices')
      .select('*, customer:customers(id, company_name)', { count: 'exact' })
      .eq('organization_id', member.organization_id)
      .order('issue_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (search) {
      query = query.or(
        `invoice_number.ilike.%${search}%,subject.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      invoices: data,
      total: count ?? 0,
      page,
      limit,
    });
  } catch (err) {
    console.error('GET /api/invoices error:', err);
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

    if (!customer_id || !subject || !issue_date || !items?.length) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // Generate invoice number via RPC
    const { data: invoiceNumber, error: rpcError } = await supabase.rpc(
      'generate_invoice_number',
      { org_id: member.organization_id }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message },
        { status: 500 }
      );
    }

    const { subtotal, tax, total } = calculateTotals(items, tax_rate ?? 0.1);

    const { data: invoice, error: insertError } = await supabase
      .from('invoices')
      .insert({
        organization_id: member.organization_id,
        invoice_number: invoiceNumber,
        customer_id,
        subject,
        issue_date,
        payment_due_date: payment_due_date || null,
        items,
        tax_rate: tax_rate ?? 0.1,
        subtotal,
        tax,
        total,
        status: 'draft',
        memo: memo || '',
        notes: notes || '',
        created_by: user.id,
      })
      .select('*, customer:customers(id, company_name)')
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error('POST /api/invoices error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
