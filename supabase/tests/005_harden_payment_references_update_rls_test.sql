-- Assertions for supabase/migrations/005_harden_payment_references_update_rls.sql
-- Run via: supabase/tests/run_005_tests.sh   (do NOT run against the live project)
--
-- Scoped to the one thing 005 changes: the USING clause of authenticated_update. Everything
-- else about the table — constraints, indexes, insert/delete denial, no-auto-confirm — is
-- already covered by 004_payment_references_test.sql and is not re-tested here.
--
-- Any failure raises an exception; ON_ERROR_STOP makes psql exit non-zero, which the runner
-- reports. "ALL 005 ASSERTIONS PASSED" only prints if every check below succeeded.

\set ON_ERROR_STOP on

\echo ''
\echo '--- A. policy shape after 005 ---'
SELECT policyname, cmd, roles::text, qual, with_check FROM pg_policies
WHERE tablename = 'payment_references' ORDER BY policyname;

DO $$
DECLARE q text; wc text;
BEGIN
  SELECT qual, with_check INTO q, wc FROM pg_policies
  WHERE tablename='payment_references' AND policyname='authenticated_update';
  IF q IS NULL THEN RAISE EXCEPTION 'FAIL: authenticated_update policy is missing after 005'; END IF;

  IF q ILIKE '%true%' OR q NOT ILIKE '%status%' OR q NOT ILIKE '%pending%' THEN
    RAISE EXCEPTION 'FAIL: USING was not narrowed to pending rows, got: %', q;
  END IF;
  RAISE NOTICE 'PASS: USING restricted to pending rows (%)', q;

  -- WITH CHECK must survive 005 untouched; dropping it would reopen the attribution forgery
  -- that 004 closed.
  IF wc IS NULL OR wc NOT ILIKE '%confirmed_by%' OR wc NOT ILIKE '%uid%' THEN
    RAISE EXCEPTION 'FAIL: WITH CHECK lost the confirmed_by = auth.uid() guard, got: %', wc;
  END IF;
  RAISE NOTICE 'PASS: WITH CHECK attribution guard preserved';

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_references'
                 AND policyname='authenticated_update' AND roles::text = '{authenticated}'
                 AND cmd = 'UPDATE') THEN
    RAISE EXCEPTION 'FAIL: authenticated_update is no longer a TO authenticated UPDATE policy';
  END IF;

  -- 005 drops and recreates one policy; it must not have added or lost any.
  IF (SELECT count(*) FROM pg_policies WHERE tablename='payment_references') <> 2 THEN
    RAISE EXCEPTION 'FAIL: expected exactly 2 policies after 005';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_references'
             AND (coalesce(qual,'') || coalesce(with_check,'')) ILIKE '%auth.role%') THEN
    RAISE EXCEPTION 'FAIL: deprecated auth.role() found in a policy predicate';
  END IF;
  RAISE NOTICE 'PASS: still exactly 2 policies, no auth.role()';
END $$;

\echo '--- B. the legitimate path still works (pending row, self-attributed) ---'
DO $$
DECLARE owner_id uuid; row_id uuid; n int;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
  VALUES ('t005-legit', 1000, 'n', 'c', 'R-LEGIT') RETURNING id INTO row_id;

  PERFORM set_config('request.jwt.claim.sub', owner_id::text, true);
  SET LOCAL ROLE authenticated;
  UPDATE payment_references SET status='confirmed', confirmed_at=now(), confirmed_by=owner_id
  WHERE id=row_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  RESET ROLE;

  IF n <> 1 THEN RAISE EXCEPTION 'FAIL: 005 broke the legitimate confirm — % rows affected', n; END IF;
  RAISE NOTICE 'PASS: authenticated may still confirm a pending row';
END $$;

\echo '--- C. a confirmed row cannot be re-decided ---'
DO $$
DECLARE owner_id uuid; other_id uuid; row_id uuid; n int;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  SELECT id INTO other_id FROM auth.users ORDER BY id DESC LIMIT 1;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact,
                                  emali_reference, status, confirmed_at, confirmed_by)
  VALUES ('t005-confirmed', 1000, 'n', 'c', 'R-CONF', 'confirmed', now(), owner_id)
  RETURNING id INTO row_id;

  PERFORM set_config('request.jwt.claim.sub', other_id::text, true);
  SET LOCAL ROLE authenticated;
  -- Self-attributed, so WITH CHECK would pass. USING is what has to stop this.
  UPDATE payment_references SET status='rejected', confirmed_at=now(), confirmed_by=other_id
  WHERE id=row_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  RESET ROLE;

  IF n <> 0 THEN RAISE EXCEPTION 'FAIL: confirmed row was re-decided (% rows)', n; END IF;
  IF NOT EXISTS (SELECT 1 FROM payment_references
                 WHERE id=row_id AND status='confirmed' AND confirmed_by=owner_id) THEN
    RAISE EXCEPTION 'FAIL: confirmed row was mutated';
  END IF;
  RAISE NOTICE 'PASS: confirmed row is immutable to authenticated (0 rows, decision intact)';
END $$;

\echo '--- D. a rejected row cannot be re-decided ---'
DO $$
DECLARE owner_id uuid; other_id uuid; row_id uuid; n int;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  SELECT id INTO other_id FROM auth.users ORDER BY id DESC LIMIT 1;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact,
                                  emali_reference, status, confirmed_at, confirmed_by)
  VALUES ('t005-rejected', 1000, 'n', 'c', 'R-REJ', 'rejected', now(), owner_id)
  RETURNING id INTO row_id;

  PERFORM set_config('request.jwt.claim.sub', other_id::text, true);
  SET LOCAL ROLE authenticated;
  UPDATE payment_references SET status='confirmed', confirmed_at=now(), confirmed_by=other_id
  WHERE id=row_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  RESET ROLE;

  IF n <> 0 THEN RAISE EXCEPTION 'FAIL: rejected row was flipped to confirmed (% rows)', n; END IF;
  IF NOT EXISTS (SELECT 1 FROM payment_references WHERE id=row_id AND status='rejected') THEN
    RAISE EXCEPTION 'FAIL: rejected row was mutated';
  END IF;
  RAISE NOTICE 'PASS: rejected row is immutable to authenticated';
END $$;

\echo '--- E. a decided row cannot be reset to pending (laundering it back into scope) ---'
DO $$
DECLARE owner_id uuid; row_id uuid; n int;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact,
                                  emali_reference, status, confirmed_at, confirmed_by)
  VALUES ('t005-reset', 1000, 'n', 'c', 'R-RESET', 'confirmed', now(), owner_id)
  RETURNING id INTO row_id;

  PERFORM set_config('request.jwt.claim.sub', owner_id::text, true);
  SET LOCAL ROLE authenticated;
  -- confirmed_by NULL passes WITH CHECK, so again only USING can block it.
  UPDATE payment_references SET status='pending', confirmed_at=NULL, confirmed_by=NULL
  WHERE id=row_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  RESET ROLE;

  IF n <> 0 THEN RAISE EXCEPTION 'FAIL: confirmed row was reset to pending (% rows)', n; END IF;
  IF NOT EXISTS (SELECT 1 FROM payment_references WHERE id=row_id AND status='confirmed') THEN
    RAISE EXCEPTION 'FAIL: confirmed row was reset to pending';
  END IF;
  RAISE NOTICE 'PASS: a decided row cannot be laundered back to pending';
END $$;

\echo '--- F. WITH CHECK regression: attribution forgery on a pending row still blocked ---'
DO $$
DECLARE owner_id uuid; other_id uuid; row_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  SELECT id INTO other_id FROM auth.users ORDER BY id DESC LIMIT 1;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
  VALUES ('t005-forge', 1000, 'n', 'c', 'R-FORGE') RETURNING id INTO row_id;

  PERFORM set_config('request.jwt.claim.sub', owner_id::text, true);
  SET LOCAL ROLE authenticated;
  UPDATE payment_references SET status='confirmed', confirmed_at=now(), confirmed_by=other_id
  WHERE id=row_id;
  RAISE EXCEPTION 'FAIL: authenticated forged confirmed_by on a pending row';
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'PASS: attribution forgery still blocked by WITH CHECK';
END $$;

\echo '--- G. service_role (the confirm/reject route) is unaffected ---'
DO $$
DECLARE owner_id uuid; row_id uuid; n int;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
  VALUES ('t005-service', 1000, 'n', 'c', 'R-SVC') RETURNING id INTO row_id;

  SET LOCAL ROLE service_role;
  -- Mirrors app/api/emali/[id]/route.ts, whose own .eq('status','pending') is now belt to
  -- 005's braces rather than the sole enforcement point.
  UPDATE payment_references SET status='confirmed', confirmed_at=now(), confirmed_by=owner_id
  WHERE id=row_id AND status='pending';
  GET DIAGNOSTICS n = ROW_COUNT;
  RESET ROLE;

  IF n <> 1 THEN RAISE EXCEPTION 'FAIL: 005 broke the service-role confirm path (% rows)', n; END IF;
  RAISE NOTICE 'PASS: service-role confirm path unaffected by the tightened USING';
END $$;

\echo '--- H. read policy untouched: decided rows still visible to the portal list ---'
DO $$
DECLARE owner_id uuid; n int;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  PERFORM set_config('request.jwt.claim.sub', owner_id::text, true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO n FROM payment_references WHERE status <> 'pending';
  RESET ROLE;
  IF n < 1 THEN RAISE EXCEPTION 'FAIL: authenticated can no longer read decided rows'; END IF;
  RAISE NOTICE 'PASS: authenticated still reads decided rows (% of them)', n;
END $$;

\echo ''
\echo 'ALL 005 ASSERTIONS PASSED'
