-- ============================================================
-- BRT Inc. Operational Toolkit — Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- clients
-- ------------------------------------------------------------
CREATE TABLE clients (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users,
  name           TEXT,
  email          TEXT,
  stage          TEXT,
  service        TEXT,
  value          NUMERIC,
  follow_up_date DATE,
  source         TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all" ON clients
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- proposals
-- ------------------------------------------------------------
CREATE TABLE proposals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users,
  client_id   UUID REFERENCES clients(id) ON DELETE SET NULL,
  title       TEXT,
  scope       TEXT,
  line_items  JSONB DEFAULT '[]',
  total       NUMERIC,
  status      TEXT DEFAULT 'draft',
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all" ON proposals
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- invoices
-- ------------------------------------------------------------
CREATE TABLE invoices (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users,
  client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number INTEGER,
  line_items     JSONB DEFAULT '[]',
  total          NUMERIC,
  paid_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all" ON invoices
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- onboarding_submissions
-- ------------------------------------------------------------
CREATE TABLE onboarding_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company      TEXT,
  contact_name TEXT,
  email        TEXT,
  phone        TEXT,
  project_type TEXT,
  budget_range TEXT,
  timeline     TEXT,
  how_found    TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE onboarding_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (public intake form)
CREATE POLICY "public_insert" ON onboarding_submissions
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can read submissions
CREATE POLICY "owner_select" ON onboarding_submissions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ------------------------------------------------------------
-- service_agreements
-- ------------------------------------------------------------
CREATE TABLE service_agreements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users,
  client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_title  TEXT,
  scope          TEXT,
  deliverables   TEXT,
  total_price    NUMERIC,
  payment_terms  JSONB DEFAULT '{}',
  ip_transfer    BOOLEAN DEFAULT true,
  warranty_days  INTEGER DEFAULT 30,
  status         TEXT DEFAULT 'draft',
  signed_at      TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE service_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all" ON service_agreements
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- runbook_templates
-- ------------------------------------------------------------
CREATE TABLE runbook_templates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users,
  title        TEXT,
  category     TEXT,
  content      TEXT,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE runbook_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all" ON runbook_templates
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
