export type Domain = 'uav' | 'ml' | 'commerce' | 'security' | 'game' | 'ops' | 'hub'
export type EdgeType = 'commands' | 'feeds-data' | 'trains' | 'markets' | 'uses-api' | 'integrates'

export interface ProjectNode {
  id: string
  name: string
  tagline: string
  domain: Domain
  tech: string[]
  status: 'live' | 'production' | 'building' | 'research'
  health: number
  metrics: { label: string; value: string }[]
  description: string
  liveUrl?: string
  // D3 mutable fields — start undefined
  x?: number
  y?: number
  vx?: number
  vy?: number
  index?: number
  fx?: number | null
  fy?: number | null
}

export interface ProjectEdge {
  source: string   // ProjectNode.id (D3 resolves to object after sim.init)
  target: string
  type: EdgeType
  label: string
  bidirectional: boolean
  dataVolume: 'low' | 'medium' | 'high'
}

export const PROJECTS: ProjectNode[] = [
  {
    id: 'brt-inc',
    name: 'BRT INC',
    tagline: 'brt-inc.vercel.app · Vercel · Next.js 16',
    domain: 'hub',
    tech: ['Next.js 16', 'Supabase', 'Stripe', 'Resend'],
    status: 'live',
    health: 8,
    metrics: [{ label: 'PAGES', value: '21' }, { label: 'UPTIME', value: '99.9%' }],
    description: 'Public portfolio, SADC marketplace, client portal — the commercial face of BRT Inc.',
    liveUrl: 'https://brt-inc.vercel.app',
  },
  {
    id: 'sentinel',
    name: 'SENTINEL V5.0',
    tagline: 'C2 for autonomous systems',
    domain: 'uav',
    tech: ['PHP 8', 'MySQL', 'TOTP 2FA', 'RBAC', 'WebSocket'],
    status: 'live',
    health: 9,
    metrics: [{ label: 'OPERATORS', value: '200+' }, { label: 'ROLES', value: '4-RBAC' }],
    description: 'Zero-trust command & control platform. Signs every UAV command; jurisdiction-checked before execution.',
  },
  {
    id: 'agentic-uav-stack',
    name: 'AGENTIC UAV STACK',
    tagline: 'DAL-A · SRL-3 · 942 tests',
    domain: 'uav',
    tech: ['Python 3.12', 'ROS 2 Jazzy', 'PX4', 'NATS', 'MAVLink 2'],
    status: 'live',
    health: 9,
    metrics: [{ label: 'TESTS', value: '942' }, { label: 'SRL', value: 'SRL-3' }],
    description: 'Three-tier autonomous stack: AI advisory → formal governor → PX4 reactive. AI never commands; governor has final say.',
  },
  {
    id: 'brt-llm',
    name: 'BRT-BASE LLM',
    tagline: 'Llama 3.2 3B fine-tuned on SADC domain',
    domain: 'ml',
    tech: ['Unsloth', 'Ollama', 'LoRA', 'Llama 3.2 3B', 'LangGraph'],
    status: 'production',
    health: 7,
    metrics: [{ label: 'CTX', value: '8192' }, { label: 'PARAMS', value: '3B' }],
    description: 'Domain-fine-tuned LLM serving all BRT projects via Ollama. Advisory AI for UAV, chat for platforms, RAG backbone for second-brain.',
  },
  {
    id: 'maize-model',
    name: 'MAIZE CLASSIFIER',
    tagline: 'MobileNetV2 · Binary · SSA crops',
    domain: 'ml',
    tech: ['TensorFlow', 'MobileNetV2', 'Keras', 'Python 3.12'],
    status: 'production',
    health: 9,
    metrics: [{ label: 'ACCURACY', value: '94.2%' }, { label: 'TARGET', value: 'SSA' }],
    description: 'Binary disease classifier for SADC smallholder maize crops. On-device inference, no cloud dependency.',
  },
  {
    id: 'second-brain',
    name: 'SECOND BRAIN',
    tagline: '28-agent autonomous knowledge system',
    domain: 'ml',
    tech: ['Python 3.12', 'LangGraph', 'NATS', 'Qdrant', 'Ollama'],
    status: 'production',
    health: 8,
    metrics: [{ label: 'AGENTS', value: '28' }, { label: 'STREAMS', value: '8' }],
    description: 'Autonomous knowledge synthesis. Reads, synthesises, and cross-links research. Feeds brt-base fine-tuning data.',
  },
  {
    id: 'likhono-lami',
    name: 'LIKHONO LAMI',
    tagline: 'Skill marketplace · Eswatini',
    domain: 'commerce',
    tech: ['Expo 57', 'NestJS 11', 'PostGIS', 'MoMo', 'Peach Pay'],
    status: 'building',
    health: 8,
    metrics: [{ label: 'APPS', value: '2 mobile' }, { label: 'PAYMENTS', value: '4 gateways' }],
    description: 'Location-aware skill marketplace for Eswatini. Provider availability real-time via WebSocket.',
  },
  {
    id: 'lets-connect',
    name: 'LETS CONNECT ESWATINI',
    tagline: 'Social platform · NATS · AES-256',
    domain: 'commerce',
    tech: ['NestJS 11', 'NATS JetStream', 'TypeORM', 'PostgreSQL'],
    status: 'building',
    health: 6,
    metrics: [{ label: 'SECURITY', value: '5-layer' }, { label: 'ARCH', value: 'Clustered' }],
    description: 'Social connectivity platform for Eswatini with mitochondria clustering architecture and real-time messaging.',
  },
  {
    id: 'studio-p',
    name: 'STUDIO P',
    tagline: 'Barbershop booking · Eswatini',
    domain: 'commerce',
    tech: ['React 19', 'TypeScript', 'Supabase', 'Stripe'],
    status: 'production',
    health: 8,
    metrics: [{ label: 'BOOKINGS', value: 'Live' }, { label: 'APP', value: 'Pake desktop' }],
    description: 'Full-stack barbershop booking platform with desktop Pake app. Stripe payments, Supabase auth.',
  },
  {
    id: 'layered',
    name: 'LAYERED',
    tagline: 'Chrome MV3 privacy extension',
    domain: 'security',
    tech: ['TypeScript', 'Chrome MV3', 'WebAuthn', 'declarativeNetRequest'],
    status: 'production',
    health: 8,
    metrics: [{ label: 'VAULT', value: 'AES-256-GCM' }, { label: 'OSINT', value: '6 panels' }],
    description: 'Privacy-first browser extension. E2E encrypted vault, ad blocker, OSINT recon, biometric unlock, LLM relay.',
  },
  {
    id: 'MahlanyaRPG',
    name: 'MAHLANYA RPG',
    tagline: 'UE5 Swazi historical RPG · 19th C.',
    domain: 'game',
    tech: ['Unreal Engine 5', 'C++', 'Copernicus DEM', 'Historical CI'],
    status: 'research',
    health: 7,
    metrics: [{ label: 'ERA', value: '19th C. Swazi' }, { label: 'TERRAIN', value: '10m DEM' }],
    description: 'Historically accurate UE5 RPG set in 19th century Eswatini. Cultural geometry, geomorphology pipeline, 11 plugins.',
  },
  {
    id: 'class-attendance',
    name: 'CLASS ATTENDANCE',
    tagline: 'Face recognition · JWT · Eswatini schools',
    domain: 'ops',
    tech: ['Node.js', 'face-api.js', 'JWT', 'SQLite'],
    status: 'production',
    health: 7,
    metrics: [{ label: 'AUTH', value: '15m/7d JWT' }, { label: 'MODE', value: 'QR fallback' }],
    description: 'Biometric class attendance with face recognition. Adaptive: QR-only on low-end devices.',
  },
  {
    id: 'civisgrid',
    name: 'CIVISGRID',
    tagline: 'National asset tracker · Eswatini govt',
    domain: 'ops',
    tech: ['PHP 8', 'PDO', 'MySQL', 'CSRF', 'Leaflet'],
    status: 'production',
    health: 6,
    metrics: [{ label: 'SCALE', value: 'National' }, { label: 'ASSETS', value: 'Govt infra' }],
    description: 'National infrastructure asset tracking for Eswatini government resilience planning.',
  },
  {
    id: 'devops-practice1100',
    name: 'BRT RAG PLATFORM',
    tagline: 'FastAPI · Qdrant · RAG for institutions',
    domain: 'ops',
    tech: ['FastAPI', 'Qdrant', 'LangGraph', 'Podman', 'Redis'],
    status: 'building',
    health: 5,
    metrics: [{ label: 'ARCH', value: 'RAG' }, { label: 'CLIENT', value: 'Institutional' }],
    description: 'SADC RAG system for institutional clients. Vector search over SADC institutional knowledge.',
  },
]

export const EDGES: ProjectEdge[] = [
  { source: 'sentinel', target: 'agentic-uav-stack', type: 'commands', label: 'Signed commands', bidirectional: false, dataVolume: 'high' },
  { source: 'agentic-uav-stack', target: 'sentinel', type: 'feeds-data', label: 'Telemetry stream', bidirectional: false, dataVolume: 'high' },
  { source: 'brt-llm', target: 'agentic-uav-stack', type: 'feeds-data', label: 'Advisory AI (Ollama)', bidirectional: false, dataVolume: 'medium' },
  { source: 'brt-llm', target: 'second-brain', type: 'feeds-data', label: 'Shared model base', bidirectional: true, dataVolume: 'high' },
  { source: 'second-brain', target: 'brt-llm', type: 'trains', label: 'Synthesised knowledge', bidirectional: false, dataVolume: 'medium' },
  { source: 'maize-model', target: 'brt-llm', type: 'trains', label: 'Domain data', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-llm', target: 'likhono-lami', type: 'uses-api', label: 'AI chat (Ollama)', bidirectional: false, dataVolume: 'medium' },
  { source: 'brt-llm', target: 'layered', type: 'uses-api', label: 'LLM inference relay', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-llm', target: 'lets-connect', type: 'uses-api', label: 'Embeddings API', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-llm', target: 'MahlanyaRPG', type: 'feeds-data', label: 'Narrative AI', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-llm', target: 'devops-practice1100', type: 'feeds-data', label: 'RAG inference', bidirectional: false, dataVolume: 'medium' },
  { source: 'brt-inc', target: 'sentinel', type: 'markets', label: 'Product page', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-inc', target: 'agentic-uav-stack', type: 'markets', label: 'Product page', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-inc', target: 'likhono-lami', type: 'markets', label: 'Marketplace listing', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-inc', target: 'maize-model', type: 'markets', label: 'Product page', bidirectional: false, dataVolume: 'low' },
  { source: 'brt-inc', target: 'MahlanyaRPG', type: 'markets', label: 'Product page', bidirectional: false, dataVolume: 'low' },
  { source: 'layered', target: 'lets-connect', type: 'integrates', label: 'Privacy layer', bidirectional: false, dataVolume: 'low' },
  { source: 'civisgrid', target: 'lets-connect', type: 'integrates', label: 'Civic data', bidirectional: false, dataVolume: 'low' },
  { source: 'devops-practice1100', target: 'second-brain', type: 'integrates', label: 'Knowledge ops', bidirectional: false, dataVolume: 'low' },
  { source: 'studio-p', target: 'brt-inc', type: 'integrates', label: 'Studio portal', bidirectional: false, dataVolume: 'low' },
]

export const DOMAIN_COLORS: Record<Domain, string> = {
  hub:      '#6366f1',
  uav:      '#f59e0b',
  ml:       '#22c55e',
  commerce: '#38bdf8',
  security: '#2dd4bf',
  game:     '#f97316',
  ops:      '#94a3b8',
}

export const EDGE_TYPE_COLORS: Record<EdgeType, string> = {
  'commands':   '#ef4444',
  'feeds-data': '#22c55e',
  'trains':     '#a78bfa',
  'markets':    '#6366f1',
  'uses-api':   '#38bdf8',
  'integrates': '#94a3b8',
}
