-- Hardens the authenticated_update policy from 004_payment_references.sql so a decision is
-- immutable once made.
--
-- 004 left USING (true): every row, whatever its status, was in scope for an authenticated
-- UPDATE. "Only a pending row may be decided" lived solely in the confirm/reject route's
-- .eq('status', 'pending'), and an application-layer guard is not a boundary — the anon key
-- ships in every browser bundle, so anyone signed in to the portal can skip the route and
-- issue UPDATE payment_references SET ... WHERE id = '<uuid>' straight from the JS client.
-- With USING (true) that re-decides a settled financial record and rewrites who is on the
-- hook for it.
--
-- Adding status = 'pending' to USING moves the rule into the database. The route's guard
-- becomes defense in depth rather than the only thing enforcing it.
--
-- Verified by supabase/tests/run_005_tests.sh — run it after editing this file.

-- Bare CREATE POLICY is not idempotent (see 003_missing_tables.sql for that failure), and
-- ALTER POLICY errors when the policy is absent, so drop-then-create as 004 does.
DROP POLICY IF EXISTS "authenticated_update" ON payment_references;

-- USING is evaluated against the pre-update row: a confirmed or rejected row is simply not
-- visible to UPDATE, so a second decision matches zero rows instead of overwriting the first.
-- The legitimate path is untouched — a confirm reads a pending row, and the confirm/reject
-- route uses the service-role key, which bypasses RLS entirely and never depended on this.
--
-- WITH CHECK is unchanged from 004: it applies to the post-update row and stops a direct
-- client update from attributing the decision to another user.
CREATE POLICY "authenticated_update" ON payment_references
  FOR UPDATE
  TO authenticated
  USING (status = 'pending')
  WITH CHECK (confirmed_by IS NULL OR confirmed_by = auth.uid());
