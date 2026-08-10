-- eMali manual payment reconciliation. A submitted reference is a claim, not proof of
-- payment: rows start 'pending' and only an authenticated portal action moves them to
-- 'confirmed' or 'rejected'.
--
-- Verified by supabase/tests/run_004_tests.sh — run it after editing this file.

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
  confirmed_by uuid REFERENCES auth.users,

  -- "No auto-confirm" is a plan-level non-negotiable, so it is enforced declaratively rather
  -- than left to the API layer. DEFAULT 'pending' only fires when the column is omitted, and
  -- the service-role key bypasses RLS — but nothing bypasses a CHECK. A row cannot reach
  -- 'confirmed'/'rejected' without recording who decided and when.
  CONSTRAINT payment_references_confirmation_consistency CHECK (
    (status = 'pending' AND confirmed_at IS NULL AND confirmed_by IS NULL)
    OR (status IN ('confirmed', 'rejected') AND confirmed_at IS NOT NULL AND confirmed_by IS NOT NULL)
  )
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
  TO authenticated
  USING (true);

-- WITH CHECK stops a portal user updating the row directly (bypassing the confirm/reject API
-- route) from attributing the decision to someone else. Paired with the CHECK constraint
-- above, a confirm must carry the caller's own auth.uid().
--
-- USING (true) below is superseded by 005_harden_payment_references_update_rls.sql, which
-- narrows it to USING (status = 'pending'). See that file for why.
CREATE POLICY "authenticated_update" ON payment_references
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (confirmed_by IS NULL OR confirmed_by = auth.uid());

-- Portal list is ordered by created_at within a status filter.
CREATE INDEX IF NOT EXISTS idx_payment_references_status_created
  ON payment_references(status, created_at DESC);

-- Deliberately not UNIQUE: a rejected reference must be correctable and resubmittable.
-- Indexed so a duplicate-reference lookup is not a seq scan.
CREATE INDEX IF NOT EXISTS idx_payment_references_emali_reference
  ON payment_references(emali_reference);
