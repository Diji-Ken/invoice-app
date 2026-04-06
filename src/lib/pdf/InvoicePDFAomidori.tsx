import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { FONT_FAMILY } from './fonts';
import type { Invoice, Customer, CompanySettings } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Props (shared with InvoicePDF)                                     */
/* ------------------------------------------------------------------ */

export interface InvoicePDFAomidoriProps {
  invoice: Invoice;
  customer: Customer;
  settings: CompanySettings;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MIN_TABLE_ROWS = 10;
const PRIMARY = '#0D7377';
const LIGHT_TEAL = '#E0F2F1';

/** Format a date string as '2025年01月15日' */
function fmtDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}年${m}月${day}日`;
}

/** Format a number as Japanese locale currency (no symbol) */
function fmtCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

/** Build bank transfer line from CompanySettings, joined by full-width spaces */
function buildBankLine(settings: CompanySettings): string {
  const parts: string[] = [];
  if (settings.bank_name) parts.push(settings.bank_name);
  if (settings.bank_branch) parts.push(settings.bank_branch);
  if (settings.bank_account_type) parts.push(settings.bank_account_type);
  if (settings.bank_account_number) parts.push(settings.bank_account_number);
  if (settings.bank_account_holder) parts.push(settings.bank_account_holder);
  return parts.join('\u3000');
}

/* ------------------------------------------------------------------ */
/*  Styles — Aomidori (teal accent)                                    */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  page: {
    fontFamily: FONT_FAMILY,
    fontSize: 9,
    paddingTop: 0,
    paddingBottom: 36,
    paddingHorizontal: 0,
    color: '#000',
  },
  /* Header bar */
  headerBar: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  headerBarText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
  },
  /* Content wrapper (horizontal padding for everything below the bar) */
  content: {
    paddingHorizontal: 40,
  },
  /* Meta (top-right: date + number) */
  metaBlock: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  /* Title */
  titleBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 2,
    color: PRIMARY,
  },
  /* Two-column header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftCol: {
    width: '50%',
  },
  rightCol: {
    width: '45%',
    flexDirection: 'row',
  },
  issuerInfo: {
    flex: 1,
  },
  sealBox: {
    width: 60,
    height: 60,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Left column fields */
  recipientName: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  subjectLine: {
    fontSize: 9,
    marginBottom: 4,
  },
  requestText: {
    fontSize: 9,
    marginBottom: 12,
  },
  totalLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    marginRight: 16,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 700,
    color: PRIMARY,
  },
  dueLine: {
    fontSize: 9,
    marginBottom: 16,
  },
  /* Right column (issuer) fields */
  issuerCompany: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 1,
  },
  issuerSender: {
    fontSize: 9,
    marginBottom: 4,
  },
  issuerDetail: {
    fontSize: 8,
    marginBottom: 1,
  },
  issuerRegistration: {
    fontSize: 8,
    marginBottom: 1,
    color: PRIMARY,
  },
  /* Items table */
  table: {
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: LIGHT_TEAL,
    borderTop: `1px solid ${PRIMARY}`,
    borderBottom: `1px solid ${PRIMARY}`,
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #ccc',
    paddingVertical: 5,
    minHeight: 22,
  },
  colName: {
    width: '50%',
    paddingLeft: 8,
  },
  colQty: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  colUnitPrice: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  colPrice: {
    width: '20%',
    textAlign: 'right',
    paddingRight: 8,
  },
  headerText: {
    fontSize: 8,
    fontWeight: 700,
    textAlign: 'center',
    color: PRIMARY,
  },
  cellText: {
    fontSize: 9,
  },
  cellTextBold: {
    fontSize: 9,
    fontWeight: 700,
  },
  /* Summary block (right-aligned) */
  summaryBlock: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 20,
  },
  summaryTable: {
    width: 260,
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #ccc',
    paddingVertical: 4,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    borderTop: `2px solid ${PRIMARY}`,
    borderBottom: `2px solid ${PRIMARY}`,
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 9,
    width: 130,
    paddingLeft: 8,
  },
  summaryValue: {
    fontSize: 9,
    width: 130,
    textAlign: 'right',
    paddingRight: 8,
  },
  summaryTotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    width: 130,
    paddingLeft: 8,
    color: PRIMARY,
  },
  summaryTotalValue: {
    fontSize: 10,
    fontWeight: 700,
    width: 130,
    textAlign: 'right',
    paddingRight: 8,
    color: PRIMARY,
  },
  /* Footer */
  footerNote: {
    fontSize: 9,
    marginBottom: 8,
    marginTop: 12,
  },
  bankLabel: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 2,
  },
  bankText: {
    fontSize: 9,
  },
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function InvoicePDFAomidori({
  invoice,
  customer,
  settings,
}: InvoicePDFAomidoriProps) {
  const bankLine = buildBankLine(settings);

  /* Collect unique footer notes */
  const footerNotes: string[] = [];
  if (invoice.notes) footerNotes.push(invoice.notes);
  if (invoice.memo && invoice.memo !== invoice.notes) {
    footerNotes.push(invoice.memo);
  }

  /* Pad table rows to minimum */
  const items = invoice.items ?? [];
  const padCount = Math.max(0, MIN_TABLE_ROWS - items.length);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Header bar ── */}
        <View style={s.headerBar}>
          <Text style={s.headerBarText}>{settings.company_name}</Text>
        </View>

        <View style={s.content}>
          {/* ── Meta (top-right) ── */}
          <View style={s.metaBlock}>
            <Text>{fmtDate(invoice.issue_date)}</Text>
            <Text>{invoice.invoice_number}</Text>
          </View>

          {/* ── Title ── */}
          <View style={s.titleBlock}>
            <Text style={s.title}>請求書</Text>
          </View>

          {/* ── Two-column header ── */}
          <View style={s.headerRow}>
            {/* Left: recipient + totals */}
            <View style={s.leftCol}>
              <Text style={s.recipientName}>
                {customer.company_name}　御中
              </Text>
              {invoice.subject ? (
                <Text style={s.subjectLine}>件名：{invoice.subject}</Text>
              ) : null}
              <Text style={s.requestText}>
                下記のとおりご請求申し上げます。
              </Text>
              <View style={s.totalLine}>
                <Text style={s.totalLabel}>ご請求金額</Text>
                <Text style={s.totalAmount}>
                  ¥ {fmtCurrency(invoice.total)} -
                </Text>
              </View>
              {invoice.payment_due_date ? (
                <Text style={s.dueLine}>
                  お支払期限：{fmtDate(invoice.payment_due_date)}
                </Text>
              ) : null}
            </View>

            {/* Right: issuer info + seal */}
            <View style={s.rightCol}>
              <View style={s.issuerInfo}>
                <Text style={s.issuerCompany}>{settings.company_name}</Text>
                {settings.representative_name ? (
                  <Text style={s.issuerSender}>
                    {settings.representative_name}
                  </Text>
                ) : null}
                {settings.postal_code ? (
                  <Text style={s.issuerDetail}>
                    〒{settings.postal_code}
                  </Text>
                ) : null}
                {settings.address_line1 ? (
                  <Text style={s.issuerDetail}>
                    {settings.address_line1}
                  </Text>
                ) : null}
                {settings.address_line2 ? (
                  <Text style={s.issuerDetail}>
                    {settings.address_line2}
                  </Text>
                ) : null}
                {settings.phone ? (
                  <Text style={s.issuerDetail}>TEL: {settings.phone}</Text>
                ) : null}
                {settings.email ? (
                  <Text style={s.issuerDetail}>{settings.email}</Text>
                ) : null}
                {settings.registration_number ? (
                  <Text style={s.issuerRegistration}>
                    登録番号: {settings.registration_number}
                  </Text>
                ) : null}
              </View>
              <View style={s.sealBox}>
                {settings.seal_image_url ? (
                  <Image
                    src={settings.seal_image_url}
                    style={{ width: 56, height: 56, objectFit: 'contain' }}
                  />
                ) : null}
              </View>
            </View>
          </View>

          {/* ── Items table ── */}
          <View style={s.table}>
            {/* Header */}
            <View style={s.tableHeader}>
              <View style={s.colName}>
                <Text style={s.headerText}>品番・品名</Text>
              </View>
              <View style={s.colQty}>
                <Text style={s.headerText}>数量</Text>
              </View>
              <View style={s.colUnitPrice}>
                <Text style={s.headerText}>単価</Text>
              </View>
              <View style={s.colPrice}>
                <Text style={s.headerText}>金額</Text>
              </View>
            </View>

            {/* Data rows */}
            {items.map((item, i) => (
              <View style={s.tableRow} key={i}>
                <View style={s.colName}>
                  <Text style={s.cellText}>{item.name}</Text>
                </View>
                <View style={s.colQty}>
                  <Text style={s.cellText}>
                    {item.quantity != null ? item.quantity : ''}
                  </Text>
                </View>
                <View style={s.colUnitPrice}>
                  <Text style={s.cellText}>
                    {item.unit_price != null
                      ? fmtCurrency(item.unit_price)
                      : ''}
                  </Text>
                </View>
                <View style={s.colPrice}>
                  <Text style={s.cellTextBold}>
                    {fmtCurrency(item.price)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Empty padding rows */}
            {Array.from({ length: padCount }).map((_, i) => (
              <View style={s.tableRow} key={`pad-${i}`}>
                <View style={s.colName}>
                  <Text style={s.cellText}> </Text>
                </View>
                <View style={s.colQty}>
                  <Text style={s.cellText}> </Text>
                </View>
                <View style={s.colUnitPrice}>
                  <Text style={s.cellText}> </Text>
                </View>
                <View style={s.colPrice}>
                  <Text style={s.cellText}> </Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Summary ── */}
          <View style={s.summaryBlock}>
            <View style={s.summaryTable}>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>小計</Text>
                <Text style={s.summaryValue}>
                  {fmtCurrency(invoice.subtotal)}
                </Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  消費税({invoice.tax_rate}%)
                </Text>
                <Text style={s.summaryValue}>
                  {fmtCurrency(invoice.tax)}
                </Text>
              </View>
              <View style={s.summaryTotalRow}>
                <Text style={s.summaryTotalLabel}>合計</Text>
                <Text style={s.summaryTotalValue}>
                  {fmtCurrency(invoice.total)}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Footer notes ── */}
          {footerNotes.map((note, i) => (
            <Text style={s.footerNote} key={i}>
              {note}
            </Text>
          ))}

          {/* ── Bank info ── */}
          {bankLine ? (
            <View>
              <Text style={s.bankLabel}>お振込先：</Text>
              <Text style={s.bankText}>{bankLine}</Text>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
