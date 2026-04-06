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

export async function GET() {
  try {
    const supabase = await createClient();
    const orgId = await getOrgId(supabase);

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('recurring_invoices')
      .select('*, customer:customers(id, company_name)')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ recurring_invoices: data ?? [] });
  } catch (err) {
    console.error('GET /api/recurring error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const orgId = await getOrgId(supabase);

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    } = body;

    if (!customer_id || !subject || !send_day || !items?.length) {
      return NextResponse.json(
        { error: '\u5FC5\u9808\u9805\u76EE\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059' },
        { status: 400 }
      );
    }

    if (send_day < 1 || send_day > 31) {
      return NextResponse.json(
        { error: '\u9001\u4ED8\u65E5\u306F1\u301C31\u306E\u7BC4\u56F2\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044' },
        { status: 400 }
      );
    }

    // Verify customer belongs to org
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('id', customer_id)
      .eq('organization_id', orgId)
      .single();

    if (!customer) {
      return NextResponse.json(
        { error: '\u53D6\u5F15\u5148\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('recurring_invoices')
      .insert({
        organization_id: orgId,
        customer_id,
        subject,
        send_day,
        start_date: start_date || new Date().toISOString().split('T')[0],
        end_date: end_date || null,
        items,
        tax_rate: tax_rate ?? 0.1,
        payment_due_day: payment_due_day ?? 99,
        memo: memo || '',
        auto_send: auto_send ?? false,
        is_active: true,
      })
      .select('*, customer:customers(id, company_name)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('POST /api/recurring error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
