const { Resend } = require('resend');

// In-memory rate limiter — protects against burst spam on the same instance.
// Serverless instances are reused under Vercel Fluid Compute, so this is
// effective for sustained hammering within a single warm instance.
const RATE_MAP = new Map();
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_MAX       = 5;              // max submissions per window per IP

function isRateLimited(ip) {
  const now  = Date.now();
  const prev = (RATE_MAP.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  if (prev.length >= RATE_MAX) return true;
  prev.push(now);
  RATE_MAP.set(ip, prev);
  return false;
}

// Trim and enforce a hard max length, returning null if absent/blank.
function field(val, maxLen) {
  if (!val) return null;
  const s = String(val).trim();
  return s.length === 0 ? null : s.slice(0, maxLen);
}

function sanitise(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function redactEmail(email) {
  return email.replace(/^(.{2})(.*)(@.*)$/, (_, a, _b, c) => `${a}***${c}`);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — please try again in 15 minutes.' });
  }

  // Parse body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { _gotcha } = body || {};

  // Honeypot — bots fill hidden fields; silently accept so they think it worked
  if (_gotcha) return res.status(200).json({ ok: true });

  // Field extraction with hard length caps (server-side enforcement)
  const name    = field(body.name,    200);
  const email   = field(body.email,   254);
  const message = field(body.message, 5000);
  const subject = field(body.subject, 200);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Build sanitised email content
  const safeEmail   = sanitise(email);
  const safeName    = sanitise(name);
  const safeMessage = sanitise(message).replace(/\n/g, '<br>');
  const safeService = subject ? sanitise(subject) : null;
  const emailSubject = subject
    ? `[Enquiry] ${subject} — ${name}`
    : `[Enquiry] New message from ${name}`;

  const html = `
<h2 style="font-family:sans-serif;margin:0 0 8px">New enquiry — BRT Inc.</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="padding:6px 0;font-weight:600;color:#555;width:120px;vertical-align:top">From</td><td>${safeName}</td></tr>
  <tr><td style="padding:6px 0;font-weight:600;color:#555;vertical-align:top">Reply-to</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
  ${safeService ? `<tr><td style="padding:6px 0;font-weight:600;color:#555;vertical-align:top">Service</td><td>${safeService}</td></tr>` : ''}
</table>
<hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5">
<div style="font-family:sans-serif;font-size:14px;line-height:1.7;color:#222">${safeMessage}</div>
`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'BRT Inc. Contact <noreply@brtinc.dev>',
    to: 'charleskris9@gmail.com',
    reply_to: email,
    subject: emailSubject.slice(0, 300),
    html,
  });

  if (error) {
    console.error(JSON.stringify({
      event: 'contact_form_error',
      error: error.message || String(error),
      email: redactEmail(email),
      timestamp: new Date().toISOString(),
    }));
    return res.status(500).json({ error: 'Failed to send — please try again or email charleskris9@gmail.com directly.' });
  }

  console.log(JSON.stringify({
    event: 'contact_form_sent',
    email: redactEmail(email),
    service: subject || null,
    timestamp: new Date().toISOString(),
  }));

  return res.status(200).json({ ok: true });
};
