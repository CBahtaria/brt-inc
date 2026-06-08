// db.js — Thin CRUD wrappers around window.supabaseClient.
// Requires supabase-client.js to be loaded before this script.
// All functions are async and throw on Supabase error.

(function () {
  const client = () => window.supabaseClient;

  function throwIfError(error) {
    if (error) throw new Error(error.message || JSON.stringify(error));
  }

  // ----------------------------------------------------------
  // clients
  // ----------------------------------------------------------
  async function getClients() {
    const { data, error } = await client()
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    throwIfError(error);
    return data;
  }

  async function upsertClient(record) {
    const { data, error } = await client()
      .from('clients')
      .upsert(record)
      .select();
    throwIfError(error);
    return data;
  }

  async function deleteClient(id) {
    const { error } = await client()
      .from('clients')
      .delete()
      .eq('id', id);
    throwIfError(error);
  }

  // ----------------------------------------------------------
  // proposals
  // ----------------------------------------------------------
  async function getProposals() {
    const { data, error } = await client()
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
    throwIfError(error);
    return data;
  }

  async function upsertProposal(record) {
    const { data, error } = await client()
      .from('proposals')
      .upsert(record)
      .select();
    throwIfError(error);
    return data;
  }

  async function deleteProposal(id) {
    const { error } = await client()
      .from('proposals')
      .delete()
      .eq('id', id);
    throwIfError(error);
  }

  // ----------------------------------------------------------
  // invoices
  // ----------------------------------------------------------
  async function getInvoices() {
    const { data, error } = await client()
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    throwIfError(error);
    return data;
  }

  async function upsertInvoice(record) {
    const { data, error } = await client()
      .from('invoices')
      .upsert(record)
      .select();
    throwIfError(error);
    return data;
  }

  async function getNextInvoiceNumber() {
    const { data, error } = await client()
      .from('invoices')
      .select('invoice_number')
      .order('invoice_number', { ascending: false })
      .limit(1);
    throwIfError(error);
    if (!data || data.length === 0 || data[0].invoice_number == null) return 1001;
    return data[0].invoice_number + 1;
  }

  // ----------------------------------------------------------
  // onboarding_submissions
  // ----------------------------------------------------------
  async function insertOnboardingSubmission(record) {
    const { data, error } = await client()
      .from('onboarding_submissions')
      .insert(record)
      .select();
    throwIfError(error);
    return data;
  }

  async function getOnboardingSubmissions() {
    const { data, error } = await client()
      .from('onboarding_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    throwIfError(error);
    return data;
  }

  // ----------------------------------------------------------
  // service_agreements
  // ----------------------------------------------------------
  async function getServiceAgreements() {
    const { data, error } = await client()
      .from('service_agreements')
      .select('*')
      .order('created_at', { ascending: false });
    throwIfError(error);
    return data;
  }

  async function upsertServiceAgreement(record) {
    const { data, error } = await client()
      .from('service_agreements')
      .upsert(record)
      .select();
    throwIfError(error);
    return data;
  }

  async function deleteServiceAgreement(id) {
    const { error } = await client()
      .from('service_agreements')
      .delete()
      .eq('id', id);
    throwIfError(error);
  }

  // ----------------------------------------------------------
  // runbook_templates
  // ----------------------------------------------------------
  async function getRunbookTemplates() {
    const { data, error } = await client()
      .from('runbook_templates')
      .select('*')
      .order('created_at', { ascending: false });
    throwIfError(error);
    return data;
  }

  async function upsertRunbookTemplate(record) {
    const { data, error } = await client()
      .from('runbook_templates')
      .upsert(record)
      .select();
    throwIfError(error);
    return data;
  }

  async function deleteRunbookTemplate(id) {
    const { error } = await client()
      .from('runbook_templates')
      .delete()
      .eq('id', id);
    throwIfError(error);
  }

  async function touchRunbookTemplate(id) {
    const { error } = await client()
      .from('runbook_templates')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', id);
    throwIfError(error);
  }

  // ----------------------------------------------------------
  // Expose on window.db
  // ----------------------------------------------------------
  window.db = {
    // clients
    getClients,
    upsertClient,
    deleteClient,
    // proposals
    getProposals,
    upsertProposal,
    deleteProposal,
    // invoices
    getInvoices,
    upsertInvoice,
    getNextInvoiceNumber,
    // onboarding_submissions
    insertOnboardingSubmission,
    getOnboardingSubmissions,
    // service_agreements
    getServiceAgreements,
    upsertServiceAgreement,
    deleteServiceAgreement,
    // runbook_templates
    getRunbookTemplates,
    upsertRunbookTemplate,
    deleteRunbookTemplate,
    touchRunbookTemplate,
  };
})();
