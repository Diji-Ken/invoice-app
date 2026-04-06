import { Resend } from 'resend';
import type { Invoice, Customer, CompanySettings } from './types';
import { fmtDate, fmtCurrency } from './invoice-helpers';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInvoiceEmailParams {
  invoice: Invoice;
  customer: Customer;
  settings: CompanySettings;
  pdfBuffer: Buffer;
}

function replacePlaceholders(template: string, params: {
  invoice: Invoice;
  customer: Customer;
  settings: CompanySettings;
}): string {
  const { invoice, customer, settings } = params;
  const issueDate = new Date(invoice.issue_date);
  const month = issueDate.getMonth() + 1;

  return template
    .replace(/\{請求先会社名\}/g, customer.company_name)
    .replace(/\{請求先担当者名\}/g, customer.contact_person || '')
    .replace(/\{商品名\}/g, invoice.subject)
    .replace(/\{支払期限\}/g, invoice.payment_due_date ? fmtDate(invoice.payment_due_date) : '')
    .replace(/\{取引日\}/g, fmtDate(invoice.issue_date))
    .replace(/\{月\}/g, String(month))
    .replace(/\{請求金額\}/g, `¥${fmtCurrency(invoice.total)}`)
    .replace(/\{請求書ファイル名\}/g, `${invoice.invoice_number}.pdf`)
    .replace(/\{請求元会社名\}/g, settings.company_name)
    .replace(/\{請求元担当者名\}/g, settings.representative_name || '')
    .replace(/\{請求元電話番号\}/g, settings.phone || '')
    .replace(/\{請求元メールアドレス\}/g, settings.email || '');
}

const DEFAULT_SUBJECT = '{月}月分請求書_{商品名}_{請求先会社名}御中';

const DEFAULT_BODY = `{請求先会社名} 御中
{請求先担当者名} 様

平素は格別のお引き立てを賜り、誠にありがとうございます。
{商品名}のご請求書を送付させていただきます。

1. ご請求内容

{商品名}
{支払期限}
{請求金額}

2. 添付ファイル
   ファイル名：{請求書ファイル名}

お支払いにつきましては、請求書に記載の方法でお支払いいただきますようお願い申し上げます。

ご不明な点がございましたら、お手数ではございますが下記までご連絡ください。

今後ともどうぞよろしくお願い申し上げます。

-----------
{請求元会社名}
{請求元担当者名}
TEL: {請求元電話番号}
Email: {請求元メールアドレス}
-----------`;

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  const { invoice, customer, settings, pdfBuffer } = params;

  if (!customer.email) {
    throw new Error('取引先のメールアドレスが設定されていません');
  }

  const subjectTemplate = settings.email_subject_template || DEFAULT_SUBJECT;
  const bodyTemplate = settings.email_body_template || DEFAULT_BODY;

  const subject = replacePlaceholders(subjectTemplate, params);
  const body = replacePlaceholders(bodyTemplate, params);

  const fromEmail = settings.sender_email || settings.email || 'noreply@example.com';
  // Resend requires verified domain. For development, use onboarding@resend.dev
  const from = process.env.RESEND_FROM_EMAIL || `${settings.company_name} <${fromEmail}>`;

  const { data, error } = await resend.emails.send({
    from,
    to: customer.email,
    subject,
    text: body,
    attachments: [
      {
        filename: `${invoice.invoice_number}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    throw new Error(`メール送信に失敗しました: ${error.message}`);
  }

  return data;
}
