-- Assertions for supabase/migrations/004_payment_references.sql
-- Run via: supabase/tests/run_004_tests.sh   (do NOT run against the live project)
--
-- Assumes the runner has already applied the Supabase stubs, 001_initial_schema.sql and
-- 004_payment_references.sql to a throwaway PostgreSQL container.
--
-- Any failure raises an exception; ON_ERROR_STOP makes psql exit non-zero, which the runner
-- reports. "ALL ASSERTIONS PASSED" only prints if every check below succeeded.

\set ON_ERROR_STOP on

\echo ''
\echo '--- A. table exists and is empty ---'
SELECT count(*) AS must_be_zero FROM payment_references;

\echo '--- B. column contract (Tasks 2-5 code against this) ---'
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'payment_references'
ORDER BY ordinal_position;

\echo '--- C. constraints ---'
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
WHERE conrelid = 'payment_references'::regclass ORDER BY conname;

\echo '--- D. policies (expect TO authenticated, no auth.role()) ---'
SELECT policyname, cmd, roles::text, qual, with_check FROM pg_policies
WHERE tablename = 'payment_references' ORDER BY policyname;

\echo '--- E. indexes ---'
SELECT indexname FROM pg_indexes WHERE tablename = 'payment_references' ORDER BY indexname;

DO $$
DECLARE n int; owner_id uuid; other_id uuid; row_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  SELECT id INTO other_id FROM auth.users ORDER BY id DESC LIMIT 1;
  IF owner_id = other_id THEN RAISE EXCEPTION 'FAIL: fixture needs two distinct auth.users'; END IF;

  -- ---------- structural ----------
  IF (SELECT relrowsecurity FROM pg_class WHERE oid='payment_references'::regclass) IS NOT TRUE THEN
    RAISE EXCEPTION 'FAIL: RLS not enabled';
  END IF;
  RAISE NOTICE 'PASS: RLS enabled';

  -- R-1 regression guard: auth.role() is deprecated and must not reappear in any policy.
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_references'
             AND (coalesce(qual,'') || coalesce(with_check,'')) ILIKE '%auth.role%') THEN
    RAISE EXCEPTION 'FAIL: deprecated auth.role() found in a policy predicate';
  END IF;
  RAISE NOTICE 'PASS: no auth.role() in any policy';

  -- Policies must be bound to the authenticated role via TO, not a predicate.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_references'
                 AND policyname='authenticated_read' AND roles::text = '{authenticated}') THEN
    RAISE EXCEPTION 'FAIL: authenticated_read not scoped TO authenticated';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_references'
                 AND policyname='authenticated_update' AND roles::text = '{authenticated}') THEN
    RAISE EXCEPTION 'FAIL: authenticated_update not scoped TO authenticated';
  END IF;
  RAISE NOTICE 'PASS: both policies scoped TO authenticated';

  IF (SELECT count(*) FROM pg_policies WHERE tablename='payment_references') <> 2 THEN
    RAISE EXCEPTION 'FAIL: expected exactly 2 policies (no INSERT/DELETE policy may exist)';
  END IF;
  RAISE NOTICE 'PASS: exactly 2 policies, none for INSERT or DELETE';

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_payment_references_status_created')
  OR NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_payment_references_emali_reference') THEN
    RAISE EXCEPTION 'FAIL: expected both indexes';
  END IF;
  -- emali_reference must NOT be unique (reject-then-resubmit must stay legal).
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_payment_references_emali_reference'
             AND indexdef ILIKE '%UNIQUE%') THEN
    RAISE EXCEPTION 'FAIL: emali_reference index must not be UNIQUE';
  END IF;
  RAISE NOTICE 'PASS: both indexes present, emali_reference non-unique';

  -- ---------- defaults (Task 2 insert shape) ----------
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
  VALUES ('consultation', 50000, 'Test User', '+26876000000', 'TESTREF123')
  RETURNING id INTO row_id;
  IF NOT EXISTS (SELECT 1 FROM payment_references WHERE id=row_id AND status='pending'
                 AND currency='SZL' AND created_at IS NOT NULL
                 AND confirmed_at IS NULL AND confirmed_by IS NULL) THEN
    RAISE EXCEPTION 'FAIL: defaults did not land';
  END IF;
  RAISE NOTICE 'PASS: defaults land (status=pending, currency=SZL)';

  -- ---------- column CHECKs ----------
  BEGIN
    INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
    VALUES ('x', 0, 'n', 'c', 'r');
    RAISE EXCEPTION 'FAIL: amount_cents=0 accepted';
  EXCEPTION WHEN check_violation THEN RAISE NOTICE 'PASS: amount_cents=0 rejected'; END;

  BEGIN
    INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
    VALUES ('x', -1, 'n', 'c', 'r');
    RAISE EXCEPTION 'FAIL: negative amount_cents accepted';
  EXCEPTION WHEN check_violation THEN RAISE NOTICE 'PASS: negative amount_cents rejected'; END;

  BEGIN
    UPDATE payment_references SET status='paid' WHERE id=row_id;
    RAISE EXCEPTION 'FAIL: status=paid accepted';
  EXCEPTION WHEN check_violation THEN RAISE NOTICE 'PASS: status=paid rejected'; END;

  BEGIN
    INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
    VALUES ('x', 1, NULL, 'c', 'r');
    RAISE EXCEPTION 'FAIL: null payer_name accepted';
  EXCEPTION WHEN not_null_violation THEN RAISE NOTICE 'PASS: null payer_name rejected'; END;

  BEGIN
    UPDATE payment_references SET status='confirmed', confirmed_at=now(),
      confirmed_by='00000000-0000-0000-0000-0000000000ff' WHERE id=row_id;
    RAISE EXCEPTION 'FAIL: bogus confirmed_by accepted';
  EXCEPTION WHEN foreign_key_violation THEN RAISE NOTICE 'PASS: bogus confirmed_by rejected by FK'; END;

  -- ---------- R-2: no auto-confirm, enforced against the service-role path ----------
  BEGIN
    INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact,
                                    emali_reference, status)
    VALUES ('x', 1, 'n', 'c', 'r', 'confirmed');
    RAISE EXCEPTION 'FAIL: inserted status=confirmed with no confirmed_at/confirmed_by';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: cannot insert pre-confirmed row (no auto-confirm)'; END;

  BEGIN
    INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact,
                                    emali_reference, status, confirmed_at)
    VALUES ('x', 1, 'n', 'c', 'r', 'confirmed', now());
    RAISE EXCEPTION 'FAIL: inserted status=confirmed with no confirmed_by';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: confirmed row requires confirmed_by'; END;

  BEGIN
    INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact,
                                    emali_reference, status, confirmed_by)
    VALUES ('x', 1, 'n', 'c', 'r', 'rejected', owner_id);
    RAISE EXCEPTION 'FAIL: inserted status=rejected with no confirmed_at';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: rejected row requires confirmed_at'; END;

  BEGIN
    UPDATE payment_references SET confirmed_at=now(), confirmed_by=owner_id WHERE id=row_id;
    RAISE EXCEPTION 'FAIL: pending row accepted confirmation metadata';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: pending row cannot carry confirmed_at/confirmed_by'; END;

  -- ---------- Task 4 happy path (service-role, bypasses RLS) ----------
  UPDATE payment_references SET status='confirmed', confirmed_at=now(), confirmed_by=owner_id
  WHERE id=row_id AND status='pending';
  IF NOT EXISTS (SELECT 1 FROM payment_references WHERE id=row_id AND status='confirmed'
                 AND confirmed_by=owner_id AND confirmed_at IS NOT NULL) THEN
    RAISE EXCEPTION 'FAIL: Task 4 confirm path did not apply';
  END IF;
  RAISE NOTICE 'PASS: Task 4 confirm path works';

  -- Task 4 reject path.
  UPDATE payment_references SET status='pending', confirmed_at=NULL, confirmed_by=NULL WHERE id=row_id;
  UPDATE payment_references SET status='rejected', confirmed_at=now(), confirmed_by=owner_id
  WHERE id=row_id AND status='pending';
  RAISE NOTICE 'PASS: Task 4 reject path works';
  UPDATE payment_references SET status='pending', confirmed_at=NULL, confirmed_by=NULL WHERE id=row_id;
END $$;

\echo '--- F. RLS: anon ---'
DO $$
DECLARE n int;
BEGIN
  SET LOCAL ROLE anon;
  SELECT count(*) INTO n FROM payment_references;
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL: anon can see % rows', n; END IF;
  RAISE NOTICE 'PASS: anon sees 0 rows';
END $$;

DO $$ BEGIN
  SET LOCAL ROLE anon;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
  VALUES ('x', 1, 'n', 'c', 'r');
  RAISE EXCEPTION 'FAIL: anon insert accepted';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS: anon insert blocked'; END $$;

\echo '--- G. RLS: authenticated ---'
DO $$
DECLARE n int; owner_id uuid; other_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  SELECT id INTO other_id FROM auth.users ORDER BY id DESC LIMIT 1;
  PERFORM set_config('request.jwt.claim.sub', owner_id::text, true);
  SET LOCAL ROLE authenticated;

  SELECT count(*) INTO n FROM payment_references;
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL: authenticated sees % rows, expected 1', n; END IF;
  RAISE NOTICE 'PASS: authenticated can read';

  -- Legitimate self-attributed confirm must pass both the RLS WITH CHECK and the CHECK constraint.
  UPDATE payment_references SET status='confirmed', confirmed_at=now(), confirmed_by=owner_id;
  RAISE NOTICE 'PASS: authenticated may confirm as themselves';

  -- Reset for the next block. Once 005_harden_payment_references_update_rls.sql narrows
  -- authenticated_update's USING to status = 'pending', authenticated can no longer flip a
  -- confirmed row back to pending — that is the intended "a decided row cannot be laundered
  -- back to pending" guarantee 005 adds (see its assertion E). So this reset has to run as a
  -- role that bypasses RLS, and the row count must be checked: silently affecting 0 rows here
  -- would leave the row 'confirmed' and make the next block fail with a misleading "forged
  -- confirmed_by" error instead of an honest setup failure.
  RESET ROLE;
  UPDATE payment_references SET status='pending', confirmed_at=NULL, confirmed_by=NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'test setup failed: reset did not affect expected row — check role/RLS state between assertions (% rows affected)', n;
  END IF;
END $$;

DO $$
DECLARE owner_id uuid; other_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  SELECT id INTO other_id FROM auth.users ORDER BY id DESC LIMIT 1;
  PERFORM set_config('request.jwt.claim.sub', owner_id::text, true);
  SET LOCAL ROLE authenticated;
  UPDATE payment_references SET status='confirmed', confirmed_at=now(), confirmed_by=other_id;
  RAISE EXCEPTION 'FAIL: authenticated forged confirmed_by to another user';
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'PASS: authenticated cannot forge confirmed_by attribution'; END $$;

DO $$ BEGIN
  SET LOCAL ROLE authenticated;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
  VALUES ('x', 1, 'n', 'c', 'r');
  RAISE EXCEPTION 'FAIL: authenticated insert accepted';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS: authenticated insert blocked'; END $$;

DO $$
DECLARE before_n int; deleted_n int;
BEGIN
  SELECT count(*) INTO before_n FROM payment_references;
  SET LOCAL ROLE authenticated;
  WITH d AS (DELETE FROM payment_references RETURNING 1) SELECT count(*) INTO deleted_n FROM d;
  RESET ROLE;
  IF deleted_n <> 0 OR (SELECT count(*) FROM payment_references) <> before_n THEN
    RAISE EXCEPTION 'FAIL: authenticated deleted % rows', deleted_n;
  END IF;
  RAISE NOTICE 'PASS: authenticated delete removes 0 rows';
END $$;

\echo '--- H. service_role bypasses RLS (Task 2 submit path) ---'
DO $$
DECLARE n int;
BEGIN
  SET LOCAL ROLE service_role;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact, emali_reference)
  VALUES ('service-role-insert', 12345, 'API', '+268', 'REF-SR');
  SELECT count(*) INTO n FROM payment_references;
  IF n <> 2 THEN RAISE EXCEPTION 'FAIL: service_role sees % rows, expected 2', n; END IF;
  RAISE NOTICE 'PASS: service_role can insert and read all';
END $$;

-- R-2 against the exact threat model: service_role bypasses RLS, so the "no auto-confirm"
-- rule has to live in a CHECK constraint. Prove the bypass does not extend to it.
DO $$
DECLARE owner_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users ORDER BY id LIMIT 1;
  SET LOCAL ROLE service_role;
  INSERT INTO payment_references (service_slug, amount_cents, payer_name, payer_contact,
                                  emali_reference, status, confirmed_at, confirmed_by)
  VALUES ('x', 1, 'n', 'c', 'r', 'confirmed', NULL, NULL);
  RAISE EXCEPTION 'FAIL: service_role inserted a pre-confirmed row';
EXCEPTION WHEN check_violation THEN
  RAISE NOTICE 'PASS: service_role cannot auto-confirm (CHECK is not bypassed by RLS bypass)';
END $$;

\echo ''
\echo 'ALL ASSERTIONS PASSED'
