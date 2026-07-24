# Security Policy — BRT Inc. Portfolio

## Supported Versions
| Version | Supported |
|---------|-----------|
| main    | ✅ |

## Reporting a Vulnerability

Email: charleskris9@gmail.com  
Subject: `[SECURITY] <brief description>`

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We respond within 72 hours. Do not publicly disclose until we've had a chance to remediate.

## Security Measures
- No client-bundle secrets (Supabase anon key via env only)
- CSP enforced (no unsafe-inline in script-src)
- All dependencies audited weekly via gitleaks + osv-scanner
- Supabase RLS enforced for all data access
