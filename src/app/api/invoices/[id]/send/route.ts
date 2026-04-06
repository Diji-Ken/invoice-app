import React from 'react';
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import { InvoicePDF } from '@/lib/pdf/InvoicePDF';
import { InvoicePDFAomidori } from '@/lib/pdf/InvoicePDFAomidori';
import { sendInvoiceEmail } from '@/lib/email';
import type { Invoice, Customer, CompanySettings } from '@/lib/types';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const { data: member } = await supabase
      .from('org_members').select('organization_id').eq('user_id', user.id).single();
    if (!member) return NextResponse.json({ error: 'No organization' }, { status: 403 });

    // Fetch invoice, customer, settings
    const [invoiceResult, settingsResult] = await Promise.all([
      supabase.from('invoices').select('*, customer:customers(*)').eq('id', id).eq('organization_id', member.organization_id).single(),
      supabase.from('company_settings').select('*').eq('organization_id', member.organization_id).single(),
    ]);

    if (!invoiceResult.data) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    if (!settingsResult.data) return NextResponse.json({ error: 'Settings not found' }, { status: 400 });

    const invoice = invoiceResult.data as unknown as Invoice & { customer: Customer };
    const settings = settingsResult.data as CompanySettings;
    const customer = invoice.customer;

    if (!customer?.email) return NextResponse.json({ error: '取引先のメールアドレスが設定されていません' }, { status: 400 });

    // Generate PDF buffer
    const PdfComponent = settings.pdf_style === 'aomidori' ? InvoicePDFAomidori : InvoicePDF;
    const element = React.createElement(PdfComponent, { invoice, customer, settings }) as unknown as React.ReactElement<DocumentProps>;
    const pdfBuffer = await renderToBuffer(element);

    // Send email
    await sendInvoiceEmail({ invoice, customer, settings, pdfBuffer: Buffer.from(pdfBuffer) });

    // Update status to sent
    await supabase.from('invoices').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Send invoice error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to send' }, { status: 500 });
  }
}
