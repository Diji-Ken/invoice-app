-- ============================================================
-- Invoice SaaS - Initial Schema Migration
-- Multi-tenant with Row Level Security
-- ============================================================

-- =========================
-- updated_at trigger function
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- 1. organizations
-- =========================
CREATE TABLE organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE,
  plan        text NOT NULL DEFAULT 'free'
                CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON organizations
  FOR ALL USING (
    id IN (SELECT organization_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 2. org_members
-- =========================
CREATE TABLE org_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            text NOT NULL DEFAULT 'member'
                    CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON org_members
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM org_members WHERE user_id = auth.uid())
  );

-- =========================
-- 3. company_settings
-- =========================
CREATE TABLE company_settings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       uuid NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  company_name          text NOT NULL,
  representative_name   text,
  postal_code           text,
  address_line1         text,
  address_line2         text,
  registration_number   text,
  phone                 text,
  email                 text,
  bank_name             text,
  bank_branch           text,
  bank_account_type     text DEFAULT '普通',
  bank_account_number   text,
  bank_account_holder   text,
  seal_image_url        text,
  logo_image_url        text,
  pdf_style             text NOT NULL DEFAULT 'standard'
                          CHECK (pdf_style IN ('standard', 'aomidori')),
  email_subject_template text,
  email_body_template    text,
  sender_email           text,
  invoice_number_prefix  text NOT NULL DEFAULT 'INV',
  next_invoice_seq       integer NOT NULL DEFAULT 1,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON company_settings
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE TRIGGER trg_company_settings_updated_at
  BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 4. customers
-- =========================
CREATE TABLE customers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_name    text NOT NULL,
  contact_person  text,
  email           text,
  postal_code     text,
  address         text,
  payment_method  text NOT NULL DEFAULT '銀行振込',
  notes           text NOT NULL DEFAULT '',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON customers
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 5. invoices
-- =========================
CREATE TABLE invoices (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number       text NOT NULL,
  customer_id          uuid REFERENCES customers(id),
  subject              text NOT NULL DEFAULT '',
  issue_date           date NOT NULL DEFAULT CURRENT_DATE,
  payment_due_date     date,
  items                jsonb NOT NULL DEFAULT '[]',
  subtotal             integer NOT NULL DEFAULT 0,
  tax_rate             numeric(5,2) NOT NULL DEFAULT 0.10,
  tax                  integer NOT NULL DEFAULT 0,
  total                integer NOT NULL DEFAULT 0,
  status               text NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft', 'issued', 'sent', 'paid', 'cancelled', 'overdue')),
  sent_at              timestamptz,
  paid_at              timestamptz,
  memo                 text NOT NULL DEFAULT '',
  notes                text NOT NULL DEFAULT '',
  recurring_invoice_id uuid,
  created_by           uuid REFERENCES auth.users(id),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, invoice_number)
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON invoices
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 6. recurring_invoices
-- =========================
CREATE TABLE recurring_invoices (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id          uuid REFERENCES customers(id),
  send_day             integer NOT NULL DEFAULT 25
                         CHECK (send_day >= 1 AND send_day <= 31),
  start_date           date NOT NULL DEFAULT CURRENT_DATE,
  end_date             date,
  is_active            boolean NOT NULL DEFAULT true,
  subject              text NOT NULL DEFAULT '',
  items                jsonb NOT NULL DEFAULT '[]',
  tax_rate             numeric(5,2) NOT NULL DEFAULT 0.10,
  payment_due_day      integer NOT NULL DEFAULT 31,
  memo                 text NOT NULL DEFAULT '',
  auto_send            boolean NOT NULL DEFAULT false,
  last_generated_month text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recurring_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON recurring_invoices
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE TRIGGER trg_recurring_invoices_updated_at
  BEFORE UPDATE ON recurring_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 7. invoice_logs
-- =========================
CREATE TABLE invoice_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  action     text NOT NULL,
  details    jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE invoice_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON invoice_logs
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices
      WHERE organization_id IN (
        SELECT organization_id FROM org_members WHERE user_id = auth.uid()
      )
    )
  );

-- =========================
-- Indexes
-- =========================
CREATE INDEX idx_customers_organization_id
  ON customers (organization_id);

CREATE INDEX idx_invoices_org_status_date
  ON invoices (organization_id, status, issue_date DESC);

CREATE INDEX idx_invoices_customer_id
  ON invoices (customer_id);

CREATE INDEX idx_recurring_invoices_org_active
  ON recurring_invoices (organization_id, is_active);

CREATE INDEX idx_invoice_logs_invoice_id
  ON invoice_logs (invoice_id);

-- =========================
-- Invoice number generator
-- =========================
CREATE OR REPLACE FUNCTION generate_invoice_number(org_id uuid)
RETURNS text AS $$
DECLARE
  settings record;
  next_num integer;
  year_str text;
BEGIN
  SELECT * INTO settings FROM company_settings WHERE organization_id = org_id FOR UPDATE;
  next_num := COALESCE(settings.next_invoice_seq, 1);
  UPDATE company_settings SET next_invoice_seq = next_num + 1 WHERE organization_id = org_id;
  year_str := to_char(CURRENT_DATE, 'YYYY');
  RETURN COALESCE(settings.invoice_number_prefix, 'INV') || '-' || year_str || '-' || lpad(next_num::text, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
