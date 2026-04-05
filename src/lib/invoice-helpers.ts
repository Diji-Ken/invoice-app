import type { InvoiceItem, CompanySettings } from './types';

export function calculateTotals(items: InvoiceItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => {
    if (item.quantity == null || item.unit_price == null) return sum;
    return sum + item.quantity * item.unit_price;
  }, 0);
  const tax = Math.floor(subtotal * taxRate);
  return { subtotal, tax, total: subtotal + tax };
}

export function buildBankLine(settings: CompanySettings): string {
  const parts: string[] = [];
  if (settings.bank_name) parts.push(settings.bank_name);
  if (settings.bank_branch) parts.push(settings.bank_branch);
  if (settings.bank_account_type) parts.push(settings.bank_account_type);
  if (settings.bank_account_number) parts.push(settings.bank_account_number);
  if (settings.bank_account_holder) parts.push(settings.bank_account_holder);
  return parts.join('\u3000');
}

export function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}年${m}月${day}日`;
}

export function fmtCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

export function emptyItem(): InvoiceItem {
  return { name: '', quantity: 1, unit_price: 0, unit: '式', price: 0 };
}
