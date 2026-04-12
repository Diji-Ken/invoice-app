-- ============================================================
-- Email Configuration Table
-- Per-tenant SMTP settings for sending business emails (invoices)
-- Passwords encrypted with AES-256-GCM at application layer
-- ============================================================

CREATE TABLE email_configs (
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'none'
    CHECK (provider IN ('none','gmail','outlook','icloud','yahoo','xserver','custom_smtp')),
  -- SMTP connection
  smtp_host text,
  smtp_port integer,
  smtp_secure boolean DEFAULT true,
  smtp_user text,
  smtp_password_encrypted text,  -- AES-256-GCM encrypted
  -- From address
  from_name text,
  from_address text,
  reply_to text,
  -- Verification status
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  last_test_at timestamptz,
  last_test_error text,
  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE email_configs ENABLE ROW LEVEL SECURITY;

-- Only owners and admins can read/write email config
CREATE POLICY "email_config_admin_only" ON email_configs
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM org_members
      WHERE user_id = auth.uid() AND role IN ('owner','admin')
    )
  );

CREATE TRIGGER trg_email_configs_updated_at
  BEFORE UPDATE ON email_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
