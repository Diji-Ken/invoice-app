import React from 'react';
import path from 'path';
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import { InvoicePDF } from '@/lib/pdf/InvoicePDF';
import { InvoicePDFAomidori } from '@/lib/pdf/InvoicePDFAomidori';
import type { Invoice, Customer, CompanySettings } from '@/lib/types';

/**
 * Resolve seal_image_url to an absolute path for local files,
 * or pass through remote URLs and data URIs as-is.
 */
function resolveSealUrl(url: string | null): string | null {
  if (!url) return null;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  return path.join(process.cwd(), 'public', url);
}

export async function GET(
  _request: Request,
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

    const { id } = await params;

    // Get user's organization
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

    // Fetch invoice (with nested customer) and company settings in parallel
    const [invoiceResult, settingsResult] = await Promise.all([
      supabase
        .from('invoices')
        .select('*, customer:customers(*)')
        .eq('id', id)
        .eq('organization_id', member.organization_id)
        .single(),
      supabase
        .from('company_settings')
        .select('*')
        .eq('organization_id', member.organization_id)
        .single(),
    ]);

    if (invoiceResult.error || !invoiceResult.data) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }
    if (settingsResult.error || !settingsResult.data) {
      return NextResponse.json(
        { error: 'Company settings not found' },
        { status: 400 }
      );
    }

    const invoice = invoiceResult.data as unknown as Invoice & {
      customer: Customer;
    };
    const settings = settingsResult.data as CompanySettings;
    const customer = invoice.customer;

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 400 }
      );
    }

    const settingsForPdf = {
      ...settings,
      seal_image_url: resolveSealUrl(settings.seal_image_url),
    };

    // Select PDF template based on company_settings.pdf_style
    const PdfComponent =
      settings.pdf_style === 'aomidori' ? InvoicePDFAomidori : InvoicePDF;

    const element = React.createElement(PdfComponent, {
      invoice,
      customer,
      settings: settingsForPdf,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfBuffer = await renderToBuffer(element);

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Invoice PDF error:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Failed to generate PDF',
      },
      { status: 500 }
    );
  }
}
