-- Missing indexes identified in audit — queries on user_id and created_at were doing full table scans.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_user_id
  ON clients(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proposals_user_created
  ON proposals(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_user_created
  ON invoices(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_number_desc
  ON invoices(invoice_number DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_service_agreements_user_id
  ON service_agreements(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_runbook_templates_user_id
  ON runbook_templates(user_id);
