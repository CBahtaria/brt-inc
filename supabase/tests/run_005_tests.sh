#!/usr/bin/env bash
# Verifies supabase/migrations/005_harden_payment_references_update_rls.sql against a throwaway
# PostgreSQL container: the tightened authenticated_update USING clause, and that tightening it
# broke neither the legitimate confirm nor the service-role route.
#
#   ./supabase/tests/run_005_tests.sh
#
# Requires docker. Never touches the live Supabase project — it creates and destroys its own
# container. Exits non-zero on the first failed assertion. Run run_004_tests.sh too; this file
# deliberately does not re-assert what 004 already covers.
set -euo pipefail

CONTAINER=emali-pg-test-005
IMAGE=docker.io/library/postgres:16-alpine
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS="$HERE/../migrations"

cleanup() { docker rm -f "$CONTAINER" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup

docker run -d --name "$CONTAINER" -e POSTGRES_PASSWORD=pg -e POSTGRES_DB=app "$IMAGE" >/dev/null
for _ in $(seq 1 60); do
  docker exec "$CONTAINER" pg_isready -U postgres -d app >/dev/null 2>&1 && break
  docker exec "$CONTAINER" sleep 1 >/dev/null 2>&1 || true
done
docker exec "$CONTAINER" pg_isready -U postgres -d app >/dev/null

psql_f() { docker exec -i "$CONTAINER" psql -U postgres -d app -v ON_ERROR_STOP=1 "$@"; }

# Same stubs as run_004_tests.sh. auth.role() is deliberately NOT defined — a policy that
# reintroduces it fails to apply here, which is the point.
docker exec -i "$CONTAINER" psql -U postgres -d app -v ON_ERROR_STOP=1 -q <<'SQL'
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY DEFAULT gen_random_uuid());
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
INSERT INTO auth.users (id) VALUES
  ('11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222');
SQL

echo "--- applying 001_initial_schema.sql ---"
docker cp "$MIGRATIONS/001_initial_schema.sql" "$CONTAINER:/tmp/001.sql" >/dev/null
psql_f -q -f /tmp/001.sql

echo "--- applying 004_payment_references.sql ---"
docker cp "$MIGRATIONS/004_payment_references.sql" "$CONTAINER:/tmp/004.sql" >/dev/null
psql_f -q -f /tmp/004.sql

echo "--- applying 005_harden_payment_references_update_rls.sql ---"
docker cp "$MIGRATIONS/005_harden_payment_references_update_rls.sql" "$CONTAINER:/tmp/005.sql" >/dev/null
psql_f -q -f /tmp/005.sql

echo "--- re-applying 005 (idempotency) ---"
psql_f -q -f /tmp/005.sql

echo "--- assertions ---"
docker cp "$HERE/005_harden_payment_references_update_rls_test.sql" "$CONTAINER:/tmp/test.sql" >/dev/null
psql_f -f /tmp/test.sql

echo
echo "005_harden_payment_references_update_rls.sql: OK"
