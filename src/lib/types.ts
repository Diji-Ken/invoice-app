export type InvoiceStatus = 'draft' | 'issued' | 'sent' | 'paid' | 'cancelled' | 'overdue';
export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';
export type PdfStyle = 'standard' | 'aomidori';

export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  created_at: string;
}

export interface CompanySettings {
  id: string;
  organization_id: string;
  company_name: string;
  representative_name: string | null;
  postal_code: string | null;
  address_line1: string | null;
  address_line2: string | null;
  registration_number: string | null;
  phone: string | null;
  email: string | null;
  bank_name: string | null;
  bank_branch: string | null;
  bank_account_type: string | null;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  seal_image_url: string | null;
  logo_image_url: string | null;
  pdf_style: PdfStyle;
  email_subject_template: string | null;
  email_body_template: string | null;
  sender_email: string | null;
  invoice_number_prefix: string;
  next_invoice_seq: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  organization_id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  postal_code: string | null;
  address: string | null;
  payment_method: string;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number | null;
  unit_price: number | null;
  unit: string;
  price: number;
}

export interface Invoice {
  id: string;
  organization_id: string;
  invoice_number: string;
  customer_id: string;
  customer?: Customer;
  subject: string;
  issue_date: string;
  payment_due_date: string | null;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  sent_at: string | null;
  paid_at: string | null;
  memo: string;
  notes: string;
  recurring_invoice_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecurringInvoice {
  id: string;
  organization_id: string;
  customer_id: string;
  customer?: Customer;
  send_day: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  subject: string;
  items: InvoiceItem[];
  tax_rate: number;
  payment_due_day: number;
  memo: string;
  auto_send: boolean;
  last_generated_month: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLog {
  id: string;
  invoice_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}
