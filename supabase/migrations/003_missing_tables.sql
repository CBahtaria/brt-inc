CREATE TABLE IF NOT EXISTS service_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  client_id uuid REFERENCES clients(id),
  title text NOT NULL,
  content text,
  signed_at timestamptz,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE service_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner_all" ON service_agreements
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS runbook_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  steps jsonb DEFAULT '[]',
  tags text[],
  created_at timestamptz DEFAULT now()
);
ALTER TABLE runbook_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner_all" ON runbook_templates
  FOR ALL USING (auth.uid() = user_id);
