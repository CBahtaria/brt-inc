export type FilterCategory = 'web' | 'security' | 'ai' | 'systems' | 'game' | 'institutional'

export interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  categories: FilterCategory[]
  metrics: string[]
  variant: 'standard' | 'gaming'
  featured?: boolean
  wide?: boolean
}

export const PROJECTS: Project[] = [
  {
    slug: 'sentinel',
    title: 'UEDF Sentinel v5.0',
    description: 'Real-time military C2 for UAV fleets. Post-audit hardened: PDO-only SQL, TOTP 2FA, IP-bound session tokens, hash-chained audit log. 9 findings (3 Critical, 6 High) patched, zero regressions, zero downtime.',
    tags: ['PHP 8', 'MySQL', 'WebSocket', 'NATS', 'AES-GCM'],
    categories: ['web', 'security'],
    metrics: ['9 findings patched', '22 files hardened', '0 regressions'],
    variant: 'standard',
    featured: true,
  },
  {
    slug: 'uav-stack',
    title: 'Agentic UAV Stack',
    description: 'Autonomous drone platform built to DAL-A aviation safety. AI route planner feeds formal safety governor validating 5 geometric invariants before flight control. Invariant layer blocks compromised AI/network by construction.',
    tags: ['Zig 0.14.0', 'EKF 13-state', 'AES-GCM-256'],
    categories: ['systems'],
    metrics: ['783/783 tests pass', 'SRL-3 HIL harness', 'SRL-5 formal'],
    variant: 'standard',
  },
  {
    slug: 'maize-classifier',
    title: 'Maize Classifier',
    description: 'Disease detection on-device (no internet). MobileNetV2 fine-tuned on 3,500 SADC field images — 94.2% top-1 accuracy, <200ms inference. Platt-calibrated confidence surfaces honest uncertainty.',
    tags: ['Python', 'MobileNetV2', 'TFLite', 'FastAPI', 'PWA'],
    categories: ['ai'],
    metrics: ['94.2% accuracy', '<200ms inference', '3,500 SADC images'],
    variant: 'standard',
  },
  {
    slug: 'eswatini-dashboard',
    title: 'Eswatini Macro Dashboard',
    description: 'National-accounts intelligence: ARIMA, SARIMA, Prophet forecasts on Eswatini macroeconomic data. Monte Carlo fiscal simulations (10,000 paths, 95% CI). Plotly Dash UI + production FastAPI (11 endpoint groups).',
    tags: ['Python', 'FastAPI', 'Prophet', 'Plotly Dash', 'Docker'],
    categories: ['ai'],
    metrics: ['54 tests', '10k MC paths', '7 services'],
    variant: 'standard',
    wide: true,
  },
  {
    slug: 'studio-p',
    title: 'Studio P Barbershop',
    description: 'Booking platform: replaced WhatsApp + notebook. Customers self-book 24/7, staff see live schedules, double-booking constraints at DB level. Supabase RLS ensures staff can only read/write own records.',
    tags: ['React 19', 'TypeScript', 'Supabase', 'Vercel'],
    categories: ['web'],
    metrics: ['8 colour themes', '0ms layout flash', '100% RLS'],
    variant: 'standard',
  },
  {
    slug: 'brt-platform',
    title: 'BRT Platform',
    description: 'Knowledge retrieval for professional services: staff query internal docs in plain language. Hybrid retrieval (dense BGE-large + Splade sparse) + RRF fusion + MiniLM reranking. Self-hosted on single GPU.',
    tags: ['Python', 'FastAPI', 'Qdrant', 'BGE-large', 'MiniLM'],
    categories: ['ai', 'web'],
    metrics: ['3 retrieval stages', 'RRF fusion', '54ms p50'],
    variant: 'standard',
  },
  {
    slug: 'mahlanya-rpg',
    title: 'MahlanyaRPG',
    description: 'Historical 3D RPG (18th–20th century Eswatini) in UE5 C++. Hardware-adaptive scaler sets Nanite/Lumen/resolution/NPC budgets from iGPU to RTX 4090. Steam, siSwati localisation, and co-op foundations shipped.',
    tags: ['UE5 C++', 'Zig', 'Python', 'GDAL', 'Steam'],
    categories: ['game'],
    metrics: ['310 pipeline tests', '5 hardware tiers', '19 perf CVars'],
    variant: 'gaming',
  },
  {
    slug: 'bedf-c2',
    title: 'BEDF C2 System v5.0',
    description: 'Command & control for Bartaria Eswatini Defence Force. PHP 8.2 MVC + MFA (TOTP), CSRF, rate limiting, blockchain-anchored audit log. Expo React Native field app + AES WebSockets.',
    tags: ['PHP 8.2', 'Expo', 'Node.js', 'WebSocket', 'NATS'],
    categories: ['web', 'security', 'systems'],
    metrics: ['TOTP 2FA', '4 RBAC roles', 'AES-GCM telemetry'],
    variant: 'standard',
    wide: true,
  },
  {
    slug: 'civisgrid',
    title: 'CivisGrid Resilience v4.0',
    description: 'National civilian infrastructure command for Eswatini. Tracks assets, regions, and districts across a 6NF schema covering all 4 admin regions. PHP 8 backend, PDO prepared statements, REST API.',
    tags: ['PHP 8', 'PDO', 'MySQL', '6NF Schema', 'REST API'],
    categories: ['web', 'institutional'],
    metrics: ['6NF schema', '4 admin regions', 'v4.0 release'],
    variant: 'standard',
  },
  {
    slug: 'eswatini-readers',
    title: 'Eswatini Readers',
    description: 'National digital library for Eswatini. Readers browse by genre, read chapter-by-chapter, track reading history. Authors publish via managed workflow. Multi-role auth, full book management.',
    tags: ['PHP 8', 'MySQLi', 'MariaDB', 'Multi-Role Auth'],
    categories: ['web', 'institutional'],
    metrics: ['3 user roles', 'Chapter-by-chapter', 'Author workflow'],
    variant: 'standard',
  },
  {
    slug: 'biometric-attendance',
    title: 'Biometric Attendance',
    description: 'Dual-biometric attendance for SADC institutions. Face embedding registration + per-session QR code. TensorFlow.js in-browser face detection — no biometric data leaves the institution.',
    tags: ['TypeScript', 'Node.js', 'face-api.js', 'QR Code', 'Express'],
    categories: ['web', 'ai', 'institutional'],
    metrics: ['2 biometric modes', 'On-device face detection', '0 data egress'],
    variant: 'standard',
  },
]
