-- eMali manual payment reconciliation. A submitted reference is a claim, not proof of
-- payment: rows start 'pending' and only an authenticated portal action moves them to
-- 'confirmed' or 'rejected'.

CREATE TABLE IF NOT EXISTS payment_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency text NOT NULL DEFAULT 'SZL',
  payer_name text NOT NULL,
  payer_contact text NOT NULL,
  emali_reference text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  confirmed_by uuid REFERENCES auth.users
);

ALTER TABLE payment_references ENABLE ROW LEVEL SECURITY;

-- Public submissions happen server-side via the service-role key (bypasses RLS by design).
-- Only authenticated portal users may read or update rows. There is deliberately no INSERT
-- or DELETE policy: nothing holding an anon or user JWT may create or destroy a payment record.

-- Bare CREATE POLICY is not idempotent, which would make re-applying this file fail even
-- though the CREATE TABLE above tolerates it (see 003_missing_tables.sql for that failure).
DROP POLICY IF EXISTS "authenticated_read" ON payment_references;
DROP POLICY IF EXISTS "authenticated_update" ON payment_references;

CREATE POLICY "authenticated_read" ON payment_references
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update" ON payment_references
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Portal list is ordered by created_at within a status filter.
CREATE INDEX IF NOT EXISTS idx_payment_references_status_created
  ON payment_references(status, created_at DESC);
