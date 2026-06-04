// Internal tools password gate — Web Crypto API, no server required.
// Session ends when the tab closes (sessionStorage, not localStorage).
const AUTH_KEY = 'brt_session';
const PASSWORD_HASH = 'PASTE_YOUR_HASH_HERE';

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === PASSWORD_HASH;
}

async function attemptLogin(password) {
  const hash = await sha256hex(password);
  if (hash === PASSWORD_HASH) {
    sessionStorage.setItem(AUTH_KEY, hash);
    return true;
  }
  return false;
}

// Injects a full-screen modal if not authenticated. Resolves when login succeeds.
function requireAuth() {
  if (isAuthenticated()) return;

  const overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:#0a0a0a', 'z-index:9999',
    'display:flex', 'align-items:center', 'justify-content:center',
    'font-family:monospace'
  ].join(';');

  overlay.innerHTML = `
    <div style="border:1px solid #333;padding:2rem;min-width:320px;color:#e8e6e1">
      <div style="color:#00ff88;margin-bottom:1.5rem;font-size:1.1rem">BRT Inc. // Internal Tools</div>
      <input id="auth-pw" type="password" placeholder="Access password"
        style="width:100%;box-sizing:border-box;background:#111;border:1px solid #333;
               color:#e8e6e1;padding:.6rem .8rem;font-family:monospace;font-size:1rem;outline:none"
        autocomplete="current-password" />
      <div id="auth-err" style="color:#ff4444;margin-top:.5rem;font-size:.85rem;min-height:1.2em"></div>
      <button id="auth-btn"
        style="margin-top:1rem;width:100%;background:#00ff88;color:#0a0a0a;border:none;
               padding:.6rem;font-family:monospace;font-size:1rem;cursor:pointer">
        Authenticate
      </button>
    </div>`;

  document.body.appendChild(overlay);
  document.getElementById('auth-pw').focus();

  async function tryLogin() {
    const pw = document.getElementById('auth-pw').value;
    const ok = await attemptLogin(pw);
    if (ok) {
      overlay.remove();
    } else {
      document.getElementById('auth-err').textContent = 'Incorrect password.';
      document.getElementById('auth-pw').value = '';
      document.getElementById('auth-pw').focus();
    }
  }

  document.getElementById('auth-btn').addEventListener('click', tryLogin);
  document.getElementById('auth-pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryLogin();
  });
}

// Structured error logger
window.onerror = (msg, src, line, col, err) => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), level: 'error', msg, src, line, col, stack: err?.stack }));
};
window.addEventListener('unhandledrejection', e => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), level: 'unhandledrejection', msg: String(e.reason) }));
});
