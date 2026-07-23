export type FilterCategory = 'web' | 'security' | 'ai' | 'systems' | 'game' | 'institutional' | 'platform'

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
  status: 'live' | 'production' | 'building' | 'partial' | 'phase11'
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
    status: 'live',
  },
  {
    slug: 'uav-stack',
    title: 'Agentic UAV Stack',
    description: 'Autonomous drone platform built to DAL-A aviation safety. MRAC altitude-adaptive flight control (σ-modification, 400 Hz), radiation/fog/piezo energy harvesting, 9-persona vulnerability scanner, hash-chained audit log, and Raft-consensus swarm coordination. AI is advisory; the formal safety governor has final say.',
    tags: ['Python', 'Zig 0.14', 'NATS JetStream', 'EKF 13-state', 'AES-GCM-256'],
    categories: ['systems', 'ai', 'security'],
    metrics: ['1,128 tests — SRL-6', 'DAL-A formal shield', 'AAFCS 0–5000 m'],
    variant: 'standard',
    status: 'live',
  },
  {
    slug: 'maize-classifier',
    title: 'Maize Classifier',
    description: 'Disease detection on-device (no internet). MobileNetV2 fine-tuned on 3,500 SADC field images — 94.2% top-1 accuracy, <200ms inference. Platt-calibrated confidence surfaces honest uncertainty.',
    tags: ['Python', 'MobileNetV2', 'TFLite', 'FastAPI', 'PWA'],
    categories: ['ai'],
    metrics: ['94.2% accuracy', '<200ms inference', '3,500 SADC images'],
    variant: 'standard',
    status: 'production',
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
    status: 'production',
  },
  {
    slug: 'studio-p',
    title: 'Studio P Barbershop',
    description: 'Booking platform: replaced WhatsApp + notebook. Customers self-book 24/7, staff see live schedules, double-booking constraints at DB level. Supabase RLS ensures staff can only read/write own records.',
    tags: ['React 19', 'TypeScript', 'Supabase', 'Vercel'],
    categories: ['web'],
    metrics: ['8 colour themes', '0ms layout flash', '100% RLS'],
    variant: 'standard',
    status: 'production',
  },
  {
    slug: 'brt-platform',
    title: 'BRT Platform',
    description: 'Knowledge retrieval for professional services: staff query internal docs in plain language. Hybrid retrieval (dense BGE-large + Splade sparse) + RRF fusion + MiniLM reranking. Self-hosted on single GPU.',
    tags: ['Python', 'FastAPI', 'Qdrant', 'BGE-large', 'MiniLM'],
    categories: ['ai', 'web'],
    metrics: ['3 retrieval stages', 'RRF fusion', '54ms p50'],
    variant: 'standard',
    status: 'production',
  },
  {
    slug: 'mahlanya-rpg',
    title: 'MahlanyaRPG',
    description: 'Historical 3D RPG (18th–20th century Eswatini) in UE5 C++. 13 C++ simulation plugins — fault-line deformation, Darcy-law groundwater, mineral vein generation, Lotka-Volterra ecology. Zig SIMD erosion sim on real Copernicus 10m DEM. Next.js 14 PWA world viewer. VR/OpenXR (Meta Quest 3 + SteamVR).',
    tags: ['UE5 C++', 'Zig SIMD', 'Python', 'Three.js', 'OpenXR'],
    categories: ['game'],
    metrics: ['338 pipeline tests', '13 C++ plugins', 'VR + PWA layer'],
    variant: 'gaming',
    status: 'phase11',
  },
  {
    slug: 'lets-connect-eswatini',
    title: 'Lets Connect Eswatini',
    description: 'Multilayered social platform for Eswatini — Telegram-style messaging, GitHub-style project explorer, Instagram-style feed. Clustered Mitochondria edge nodes compress + semantically embed data before it reaches the server. 5-layer security envelope: phone OTP + proof-of-work, ClamAV + YARA scan, GBT spam classifier, async LLM semantic check. Self-improving adaptive engine tightens thresholds weekly without a code deploy.',
    tags: ['NestJS 11', 'NATS JetStream', 'zstd', 'ONNX', 'Redis'],
    categories: ['web', 'ai', 'platform'],
    metrics: ['37 tests passing', 'Clustered Mitochondria', '5-layer security'],
    variant: 'standard',
    wide: true,
    status: 'building',
  },
  {
    slug: 'likhona-lami',
    title: 'Likhona Lami',
    description: 'Skills marketplace for Eswatini gig workers — escrow-protected MTN MoMo payouts, legal compliance engine enforcing Wages Order 2022 minimums per skill category, siSwati morphological tokenizer with NLLB-200 translation, and PostGIS-powered spatial job matching. Expo 54 mobile + Next.js 14 web + NestJS 11 API.',
    tags: ['NestJS 11', 'Expo 54', 'Next.js 14', 'PostGIS', 'MTN MoMo'],
    categories: ['web', 'ai', 'institutional', 'platform'],
    metrics: ['siSwati NLP', 'Wages Order 2022', 'MTN MoMo escrow'],
    variant: 'standard',
    status: 'production',
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
    status: 'live',
  },
  {
    slug: 'civisgrid',
    title: 'CivisGrid Resilience v4.0',
    description: 'National civilian infrastructure command for Eswatini. Tracks assets, regions, and districts across a 6NF schema covering all 4 admin regions. PHP 8 backend, PDO prepared statements, REST API.',
    tags: ['PHP 8', 'PDO', 'MySQL', '6NF Schema', 'REST API'],
    categories: ['web', 'institutional'],
    metrics: ['6NF schema', '4 admin regions', 'v4.0 release'],
    variant: 'standard',
    status: 'production',
  },
  {
    slug: 'eswatini-readers',
    title: 'Eswatini Readers',
    description: 'National digital library for Eswatini. Readers browse by genre, read chapter-by-chapter, track reading history. Authors publish via managed workflow. Multi-role auth, full book management.',
    tags: ['PHP 8', 'MySQLi', 'MariaDB', 'Multi-Role Auth'],
    categories: ['web', 'institutional'],
    metrics: ['3 user roles', 'Chapter-by-chapter', 'Author workflow'],
    variant: 'standard',
    status: 'production',
  },
  {
    slug: 'biometric-attendance',
    title: 'Biometric Attendance',
    description: 'Dual-biometric attendance for SADC institutions. Face embedding registration + per-session QR code. TensorFlow.js in-browser face detection — no biometric data leaves the institution.',
    tags: ['TypeScript', 'Node.js', 'face-api.js', 'QR Code', 'Express'],
    categories: ['web', 'ai', 'institutional'],
    metrics: ['2 biometric modes', 'On-device face detection', '0 data egress'],
    variant: 'standard',
    status: 'production',
  },
]
