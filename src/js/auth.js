// Supabase session-based auth gate.
// Requires window.supabaseClient (from supabase-client.js) to be loaded before this script.

async function requireAuth() {
  document.documentElement.style.opacity = '0';
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    window.location.replace('/login');
    return;
  }
  document.documentElement.style.opacity = '1';
}

async function logout() {
  await window.supabaseClient.auth.signOut();
  window.location.replace('/login');
}

// Structured error logger
window.onerror = (msg, src, line, col, err) => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), level: 'error', msg, src, line, col, stack: err?.stack }));
};
window.addEventListener('unhandledrejection', e => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), level: 'unhandledrejection', msg: String(e.reason) }));
});
