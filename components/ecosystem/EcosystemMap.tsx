'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { heightReveal } from '@/lib/motion'

// ── Design tokens (mirrors globals.css) ─────────────────────────────────────
const T = {
  bg:          '#09090b',
  surface1:    '#111113',
  surface2:    '#18181b',
  border:      'rgba(255,255,255,0.06)',
  accent:      '#6366f1',
  accent2:     '#2dd4bf',
  accentGame:  '#f59e0b',
  text:        '#fafafa',
  textMuted:   '#a1a1aa',
  textSubtle:  '#52525b',
}

// Cluster colours — map UAV to accent2, platform to accent, intelligence to emerald, etc.
const CLUSTER_COLOR: Record<string, string> = {
  uav:           T.accent2,       // teal
  platform:      T.accent,        // indigo
  intelligence:  '#10b981',       // emerald
  gaming:        T.accentGame,    // amber
  ml:            '#f43f5e',       // rose
  institutional: '#64748b',       // slate
  edge:          '#d97706',       // amber-dark
  web:           '#818cf8',       // indigo-light
}

// ── Node / edge definitions ───────────────────────────────────────────────────
interface NodeDef {
  id: string; label: string; cluster: string; r: number;
  short: string; stack: string; desc: string;
  metrics: Record<string, string>;
  connections: { dir: string; to: string; label: string; subject: string }[];
}

interface LinkDef {
  source: string; target: string; type: string; label: string;
}

const NODES: NodeDef[] = [
  {
    id: 'agentic-uav', label: 'Agentic UAV Stack', cluster: 'uav', r: 28,
    short: 'SRL-6 · 1,128 tests · DAL-A',
    stack: 'Python · NATS JetStream · MAVLink · ROS2 · SO(3) EKF · MRAC · AAFCS',
    desc: '7-layer onion architecture with a formal safety governor at the centre. AI is advisory only — the governor has final say. MRAC adapts PID gains continuously across 0–5000 m ASL. 15+ DAL-A invariants enforced at runtime.',
    metrics: { 'SRL Level': '6', 'Tests': '1,128+', 'Safety gates': '15+', 'NATS streams': '8', 'Status': 'LIVE' },
    connections: [
      { dir: '→', to: 'Sentinel', label: 'real-time telemetry', subject: 'uav.v1.telemetry.*' },
      { dir: '→', to: 'Second Brain', label: 'audit + alert events', subject: 'uav.v1.audit.*' },
      { dir: '↔', to: 'Zig Bridge', label: 'AES-GCM-256 sensor data', subject: 'X25519 ECDH' },
      { dir: '→', to: 'LCE', label: 'fog density overlay', subject: 'uav.v1.fog.density_map' },
    ],
  },
  {
    id: 'sentinel', label: 'Sentinel v5', cluster: 'uav', r: 20,
    short: 'PHP 8.1 · RBAC · TOTP 2FA',
    stack: 'PHP 8.1 · MySQL · Redis · NATS · WebSocket · Docker · nginx',
    desc: 'Unified command HQ. UAV Fleet, LCE Live, and Ecosystem tabs give a single pane of glass. All metric endpoints cached 30 s via Redis. Rate-limited at 100 req/min per IP.',
    metrics: { 'Auth': 'TOTP 2FA', 'Cache TTL': '30 s', 'Workers': '2 PHP-FPM', 'Status': 'LIVE' },
    connections: [
      { dir: '←', to: 'UAV Stack', label: 'fleet telemetry', subject: 'uav.v1.telemetry.*' },
      { dir: '←', to: 'Second Brain', label: 'health · vuln scan', subject: 'uav.v1.system.*' },
    ],
  },
  {
    id: 'zig-bridge', label: 'Zig Bridge', cluster: 'edge', r: 16,
    short: 'Zig 0.14 · AES-GCM-256 · EKF-13',
    stack: 'Zig 0.14 · AES-GCM-256 · X25519 ECDH · NATS · libsodium',
    desc: 'Edge node that encrypts every sensor packet before it leaves the physical layer. X25519 ECDH key exchange with the brain daemon. 13-state EKF for navigation.',
    metrics: { 'Cipher': 'AES-GCM-256', 'KEx': 'X25519 ECDH', 'EKF states': '13', 'Status': 'Partial' },
    connections: [
      { dir: '↔', to: 'UAV Stack', label: 'encrypted stream', subject: 'X25519 + NATS' },
      { dir: '→', to: 'Ecosystem', label: 'reservoir + capacitor', subject: 'uav.v1.ecosystem.*' },
    ],
  },
  {
    id: 'second-brain', label: 'Second Brain', cluster: 'intelligence', r: 30,
    short: '17 tasks · Haiku / Sonnet / Opus',
    stack: 'Python · Ollama · Anthropic API · Obsidian vault · NATS · sqlite · Karpathy pipeline',
    desc: 'Cognitive core. 17 autonomous tasks, bounded token budgets per domain. Reads every NATS stream, synthesises to Obsidian vault, publishes weekly vulnerability scans (9 personas). Never touches the flight path.',
    metrics: { 'Tasks': '17 autonomous', 'Models': 'Haiku / Sonnet / Opus', 'Vault': 'Obsidian', 'Vuln scan': '9 personas', 'Status': 'LIVE' },
    connections: [
      { dir: '←', to: 'All services', label: 'subscribes all streams', subject: 'uav.v1.*  lce.v1.*' },
      { dir: '→', to: 'Sentinel', label: 'health + kardashev score', subject: 'uav.v1.system.*' },
      { dir: '↔', to: 'LCE', label: 'content moderation tasks', subject: 'lce.v1.moderation.queue' },
    ],
  },
  {
    id: 'lce', label: 'Lets Connect Eswatini', cluster: 'platform', r: 24,
    short: 'NestJS 11 · Next.js 14 · Expo 54',
    stack: 'NestJS 11 · Next.js 14 · Expo 54 · PostgreSQL + PostGIS · Redis · NATS · zstd · Qdrant · ClamAV',
    desc: 'Multilayered social platform — Telegram (DMs + groups), GitHub (projects), Instagram (discover). Clustered Mitochondria: edge nodes compress with zstd L3 and ONNX-embed before reaching the server. 5-layer security envelope per message.',
    metrics: { 'Auth': 'Phone OTP + PoW 2²⁰', 'Scan': 'ClamAV + YARA + LLM', 'Rate limit': '5 req/s anon', 'Status': 'In dev' },
    connections: [
      { dir: '→', to: 'Second Brain', label: 'moderation queue', subject: 'lce.v1.moderation.queue' },
      { dir: '↔', to: 'Likhona Lami', label: 'NestJS patterns · MTN MoMo', subject: 'shared codebase' },
      { dir: '←', to: 'UAV Stack', label: 'fog maps for Discover tab', subject: 'uav.v1.fog.density_map' },
    ],
  },
  {
    id: 'likhona-lami', label: 'Likhona Lami', cluster: 'platform', r: 20,
    short: 'Skills marketplace · MTN MoMo',
    stack: 'NestJS 11 · Next.js 14 · Expo 54 · PostGIS · MTN MoMo · siSwati NLP · NLLB-200 ONNX',
    desc: 'Production skills marketplace for Eswatini. MTN MoMo escrow, Eswatini Labour Act compliance engine, siSwati morphological tokenizer (13 Bantu noun-class prefixes), NLLB-200 translation running on-device via ONNX.',
    metrics: { 'Tests': '37 passing', 'Language': 'siSwati ↔ English', 'Payments': 'MTN MoMo', 'Status': 'Production' },
    connections: [
      { dir: '↔', to: 'LCE', label: 'auth + payment patterns', subject: 'code sharing' },
      { dir: '→', to: 'Second Brain', label: 'legal compliance events', subject: 'lce.v1.audit.legal' },
    ],
  },
  {
    id: 'mahlanya', label: 'MahlanyaRPG', cluster: 'gaming', r: 22,
    short: 'UE5.4 · 13 C++ plugins · 338 tests',
    stack: 'Unreal Engine 5.4 · C++ · OpenXR · Three.js · Next.js 14 · Copernicus DEM 30 m · Zig SIMD erosion',
    desc: 'Historical RPG in pre-colonial Eswatini. Phase 11 adds EswatiniGeophysics: fault-line simulation (Lubombo Monocline, Usutu Fault), mineral vein generation (Swazi granite/dolerite/magnetite), Darcy groundwater. VR (Meta Quest 3) + Next.js PWA. Proximity Parks show real drone fog-net sites in-game.',
    metrics: { 'C++ plugins': '13', 'Pipeline tests': '338', 'VR': 'OpenXR / Quest 3', 'DEM': 'Copernicus 30 m', 'Status': 'Phase 11' },
    connections: [
      { dir: '←', to: 'UAV Stack', label: 'live fog density overlay', subject: 'uav.v1.fog.density_map' },
      { dir: '→', to: 'Second Brain', label: 'weekly terrain report', subject: 'MAHLANYA_TERRAIN_REPORT' },
    ],
  },
  {
    id: 'maize', label: 'Maize Classifier', cluster: 'ml', r: 14,
    short: 'MobileNetV2 · on-device inference',
    stack: 'Python · TensorFlow · MobileNetV2 · Expo SDK 54 · on-device ONNX',
    desc: 'Leaf disease classifier for smallholder farmers in Eswatini and SADC. On-device inference — no cloud round-trip. Deployed as mobile app.',
    metrics: { 'Model': 'MobileNetV2', 'Inference': 'On-device', 'Status': 'Production' },
    connections: [],
  },
  {
    id: 'brt-inc', label: 'BRT Inc. Portfolio', cluster: 'web', r: 16,
    short: 'Next.js 16 · Tailwind · Vercel',
    stack: 'Next.js 16 · TypeScript · Tailwind · Supabase · Vercel · GSAP · Framer Motion',
    desc: 'Institutional face of BRT Inc. 13 projects, case studies, live metrics, Trust & Security page. You are here.',
    metrics: { 'Projects': '13', 'Pages': '21 static', 'Status': 'LIVE', 'URL': 'brt-inc.vercel.app' },
    connections: [],
  },
  {
    id: 'ecosystem', label: 'BRT Ecosystem', cluster: 'edge', r: 20,
    short: 'Fog · Solar MPPT · RF · WLAN mesh',
    stack: 'Python · Zig · GPIO · Modbus RTU · OpenWRT · NATS · capacitor bank · hydrophilic mesh',
    desc: 'Physical infrastructure layer. Drones harvest fog water (hydrophilic mesh), solar radiation (MPPT), RF energy, piezo vibration. Capacitor bank + reservoir monitoring + WLAN mesh nodes. Every sensor packet encrypted by the Zig bridge.',
    metrics: { 'Sensor types': '8', 'NATS': 'uav.v1.ecosystem.*', 'Harvest': 'fog+solar+RF+piezo', 'Status': 'In dev' },
    connections: [
      { dir: '↔', to: 'Zig Bridge', label: 'encrypted aggregation', subject: 'AES-GCM per-packet' },
      { dir: '→', to: 'Sentinel', label: 'reservoir + capacitor levels', subject: 'uav.v1.ecosystem.*' },
    ],
  },
  {
    id: 'nats', label: 'NATS JetStream', cluster: 'intelligence', r: 22,
    short: '8 streams · 50+ subjects · TLS + ACL',
    stack: 'NATS Server · JetStream · per-stream ACL · TLS · 50+ subjects',
    desc: 'Central nervous system of the platform. 8 persistent streams with retention policies. Subject ACLs enforce publish/subscribe boundaries per service. All real-time data flows through here.',
    metrics: { 'Streams': '8', 'Subjects': '50+', 'Auth': 'TLS + ACL', 'Rate': '≤100 Hz / stream', 'Status': 'LIVE' },
    connections: [],
  },
  {
    id: 'civisgrid', label: 'CivisGrid', cluster: 'institutional', r: 14,
    short: 'National civic infrastructure',
    stack: 'NestJS · PostgreSQL + PostGIS · Next.js · government data standards',
    desc: 'National-scale civic infrastructure dashboard — asset management, resilience tracking, library network integration for SADC government agencies.',
    metrics: { 'Scale': 'National', 'Status': 'Active' },
    connections: [],
  },
  {
    id: 'bartarian', label: 'BARTARIAN Defence', cluster: 'uav', r: 14,
    short: 'PHP 8.2 · Expo RN · RBAC',
    stack: 'PHP 8.2 · Expo React Native · MySQL · RBAC',
    desc: 'Defence-oriented command interface with RBAC + auth boundaries. Expo React Native mobile. In development.',
    metrics: { 'Auth': 'RBAC', 'Status': 'Partial' },
    connections: [
      { dir: '↔', to: 'Sentinel', label: 'command bridge', subject: 'REST API' },
    ],
  },
]

const LINKS: LinkDef[] = [
  { source: 'agentic-uav',  target: 'sentinel',      type: 'nats',     label: 'uav.v1.telemetry.*' },
  { source: 'agentic-uav',  target: 'second-brain',  type: 'nats',     label: 'uav.v1.audit.*' },
  { source: 'agentic-uav',  target: 'zig-bridge',    type: 'crypto',   label: 'AES-GCM X25519' },
  { source: 'agentic-uav',  target: 'lce',           type: 'nats',     label: 'fog overlay' },
  { source: 'agentic-uav',  target: 'mahlanya',      type: 'nats',     label: 'fog density' },
  { source: 'agentic-uav',  target: 'nats',          type: 'nats',     label: 'publishes' },
  { source: 'agentic-uav',  target: 'ecosystem',     type: 'nats',     label: 'uav.v1.ecosystem.*' },
  { source: 'second-brain', target: 'sentinel',      type: 'nats',     label: 'uav.v1.system.*' },
  { source: 'second-brain', target: 'lce',           type: 'nats',     label: 'lce.v1.moderation.*' },
  { source: 'second-brain', target: 'likhona-lami',  type: 'advisory', label: 'legal compliance' },
  { source: 'second-brain', target: 'mahlanya',      type: 'advisory', label: 'terrain report' },
  { source: 'second-brain', target: 'nats',          type: 'nats',     label: 'subscribes all' },
  { source: 'second-brain', target: 'ecosystem',     type: 'advisory', label: 'health sweep 4h' },
  { source: 'lce',          target: 'likhona-lami',  type: 'shared',   label: 'NestJS patterns' },
  { source: 'lce',          target: 'sentinel',      type: 'nats',     label: 'lce.v1.metrics.*' },
  { source: 'zig-bridge',   target: 'ecosystem',     type: 'crypto',   label: 'AES-GCM encrypt' },
  { source: 'ecosystem',    target: 'sentinel',      type: 'nats',     label: 'ecosystem tab' },
  { source: 'bartarian',    target: 'sentinel',      type: 'api',      label: 'command API' },
  { source: 'brt-inc',      target: 'likhona-lami',  type: 'display',  label: 'portfolio' },
  { source: 'brt-inc',      target: 'mahlanya',      type: 'display',  label: 'portfolio' },
  { source: 'brt-inc',      target: 'maize',         type: 'display',  label: 'portfolio' },
  { source: 'maize',        target: 'nats',          type: 'advisory', label: 'ML inference' },
]

const LINK_STYLE: Record<string, { stroke: string; opacity: number; dash: string; width: number }> = {
  nats:     { stroke: T.accent2,     opacity: 0.40, dash: '6 3',  width: 1.2 },
  crypto:   { stroke: '#d97706',     opacity: 0.55, dash: '2 4',  width: 1.8 },
  advisory: { stroke: '#10b981',     opacity: 0.30, dash: '8 4',  width: 1   },
  shared:   { stroke: T.accent,      opacity: 0.30, dash: '4 4',  width: 1   },
  api:      { stroke: '#818cf8',     opacity: 0.30, dash: '3 3',  width: 1   },
  display:  { stroke: T.textSubtle,  opacity: 0.18, dash: '2 6',  width: 0.8 },
}

// ── Component ────────────────────────────────────────────────────────────────

interface SimNode extends NodeDef {
  x: number; y: number; vx: number; vy: number; fx?: number | null; fy?: number | null;
}

interface SimLink {
  source: SimNode; target: SimNode; type: string; label: string;
}

export function EcosystemMap() {
  const svgRef    = useRef<SVGSVGElement>(null)
  const gRef      = useRef<SVGGElement>(null)
  const rafRef    = useRef<number>(0)
  const dashRef   = useRef(0)

  const [selected, setSelected] = useState<NodeDef | null>(null)
  const [hovered,  setHovered]  = useState<string | null>(null)

  const closePanel = useCallback(() => setSelected(null), [])

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    // Dynamic import so SSR is happy
    import('d3').then((d3) => {
      const svg = d3.select(svgRef.current!)
      const g   = d3.select(gRef.current!)
      const W   = svgRef.current!.clientWidth || window.innerWidth
      const H   = svgRef.current!.clientHeight || window.innerHeight

      // ── Defs ──────────────────────────────────────────────────────────────
      const defs = svg.select<SVGDefsElement>('defs')

      // Glow filters per cluster
      Object.entries(CLUSTER_COLOR).forEach(([key, color]) => {
        const f = defs.append('filter')
          .attr('id', `glow-${key}`)
          .attr('x', '-60%').attr('y', '-60%')
          .attr('width', '220%').attr('height', '220%')
        f.append('feGaussianBlur').attr('stdDeviation', 5).attr('result', 'blur')
        const m = f.append('feMerge')
        m.append('feMergeNode').attr('in', 'blur')
        m.append('feMergeNode').attr('in', 'blur')
        m.append('feMergeNode').attr('in', 'SourceGraphic')
      })

      // Arrow markers
      Object.entries(LINK_STYLE).forEach(([type, s]) => {
        defs.append('marker')
          .attr('id', `arrow-${type}`)
          .attr('viewBox', '0 -4 8 8').attr('refX', 18).attr('refY', 0)
          .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
          .append('path').attr('d', 'M0,-4L8,0L0,4')
          .attr('fill', s.stroke).attr('opacity', 0.7)
      })

      // ── Simulation ────────────────────────────────────────────────────────
      const nodes: SimNode[] = NODES.map(n => ({ ...n, x: W / 2, y: H / 2, vx: 0, vy: 0 }))
      const nodeById = new Map(nodes.map(n => [n.id, n]))

      const links: SimLink[] = LINKS.map(l => ({
        ...l,
        source: nodeById.get(l.source)!,
        target: nodeById.get(l.target)!,
      }))

      const sim = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
        .force('link', d3.forceLink(links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
          .id((d: any) => d.id)
          .distance((d: any) => d.type === 'crypto' ? 130 : 160)
          .strength(0.4))
        .force('charge', d3.forceManyBody().strength(-700))
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('collide', d3.forceCollide((d: any) => d.r + 28))
        .force('x', d3.forceX(W / 2).strength(0.025))
        .force('y', d3.forceY(H / 2).strength(0.025))

      // ── Links ─────────────────────────────────────────────────────────────
      const linkSel = g.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke',         (d: SimLink) => LINK_STYLE[d.type].stroke)
        .attr('stroke-opacity', (d: SimLink) => LINK_STYLE[d.type].opacity)
        .attr('stroke-width',   (d: SimLink) => LINK_STYLE[d.type].width)
        .attr('stroke-dasharray',(d: SimLink) => LINK_STYLE[d.type].dash)
        .attr('marker-end',     (d: SimLink) => `url(#arrow-${d.type})`)

      // ── Node groups ───────────────────────────────────────────────────────
      const nodeG = g.selectAll('.node-g')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node-g')
        .style('cursor', 'pointer')

      // Outer glow ring
      nodeG.append('circle')
        .attr('class', 'ring')
        .attr('r', (d: SimNode) => d.r + 10)
        .attr('fill', 'none')
        .attr('stroke', (d: SimNode) => CLUSTER_COLOR[d.cluster])
        .attr('stroke-opacity', 0.10)
        .attr('stroke-width', 8)

      // Main circle
      nodeG.append('circle')
        .attr('class', 'body')
        .attr('r', (d: SimNode) => d.r)
        .attr('fill', (d: SimNode) => CLUSTER_COLOR[d.cluster] + '14')
        .attr('stroke', (d: SimNode) => CLUSTER_COLOR[d.cluster])
        .attr('stroke-width', 1.5)
        .attr('filter', (d: SimNode) => `url(#glow-${d.cluster})`)

      // Inner core dot
      nodeG.append('circle')
        .attr('r', (d: SimNode) => d.r * 0.3)
        .attr('fill', (d: SimNode) => CLUSTER_COLOR[d.cluster])
        .attr('opacity', 0.5)

      // Label below node
      nodeG.append('text')
        .text((d: SimNode) => d.label)
        .attr('text-anchor', 'middle')
        .attr('dy', (d: SimNode) => d.r + 15)
        .attr('font-size', (d: SimNode) => (d.r > 22 ? 11 : 9) + 'px')
        .attr('font-family', 'var(--font-geist-sans, system-ui, sans-serif)')
        .attr('fill', T.textMuted)
        .attr('pointer-events', 'none')

      // Short descriptor
      nodeG.append('text')
        .text((d: SimNode) => d.short)
        .attr('text-anchor', 'middle')
        .attr('dy', (d: SimNode) => d.r + 27)
        .attr('font-size', '7px')
        .attr('font-family', 'var(--font-geist-mono, monospace)')
        .attr('fill', (d: SimNode) => CLUSTER_COLOR[d.cluster] + '80')
        .attr('pointer-events', 'none')

      // Interaction
      nodeG
        .on('click', (_ev: MouseEvent, d: SimNode) => { setSelected(d); })
        .on('mouseover', (_ev: MouseEvent, d: SimNode) => setHovered(d.id))
        .on('mouseout', () => setHovered(null))
        .call(
          d3.drag<SVGGElement, SimNode>()
            .on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
            .on('drag',  (ev, d) => { d.fx = ev.x; d.fy = ev.y })
            .on('end',   (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null }) as any
        )

      // Zoom + pan
      svg.call(
        d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.25, 3])
          .on('zoom', (ev) => g.attr('transform', ev.transform)) as any
      )

      // Simulation tick
      sim.on('tick', () => {
        linkSel
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y)
        nodeG.attr('transform', (d: SimNode) => `translate(${d.x},${d.y})`)
      })

      // Animation loop — flowing dashes + breathing rings
      let t0 = performance.now()
      function frame(t: number) {
        const dt = t - t0; t0 = t
        dashRef.current += dt

        g.selectAll<SVGLineElement, SimLink>('.link').each(function(d) {
          const el = d3.select(this)
          if (d.type === 'nats') {
            el.attr('stroke-dashoffset', -(dashRef.current * 0.04) % 9)
          } else if (d.type === 'crypto') {
            el.attr('stroke-dashoffset', -(dashRef.current * 0.02) % 6)
          } else if (d.type === 'advisory') {
            el.attr('stroke-dashoffset', -(dashRef.current * 0.015) % 12)
          }
        })

        // Breathing outer ring
        g.selectAll<SVGCircleElement, SimNode>('.ring').attr('stroke-opacity', (d, i) => {
          return 0.1 + 0.06 * Math.sin(dashRef.current * 0.002 + i * 0.7)
        })

        rafRef.current = requestAnimationFrame(frame)
      }
      rafRef.current = requestAnimationFrame(frame)

      return () => {
        cancelAnimationFrame(rafRef.current)
        sim.stop()
        g.selectAll('*').remove()
        svg.select('defs').selectAll('*').remove()
      }
    })

    return () => { cancelAnimationFrame(rafRef.current) }
  }, [])

  const clusterColor = selected ? CLUSTER_COLOR[selected.cluster] : T.accent

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)', background: T.bg }}>
      {/* Graph */}
      <svg ref={svgRef} className="w-full h-full">
        <defs />
        <g ref={gRef} />
      </svg>

      {/* Legend strip */}
      <div className="absolute top-4 left-6 flex flex-wrap gap-x-5 gap-y-2 pointer-events-none">
        {Object.entries(CLUSTER_COLOR).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: T.textSubtle }}>
              {k}
            </span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest pointer-events-none"
         style={{ color: T.textSubtle }}>
        click node · drag · scroll to zoom
      </p>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{   x: 340, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute inset-y-0 right-0 w-80 overflow-y-auto flex flex-col"
            style={{
              background: 'rgba(9,9,11,0.96)',
              borderLeft: `1px solid ${clusterColor}28`,
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Coloured top stripe */}
            <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${clusterColor}, transparent)` }} />

            <div className="p-6 flex-1">
              {/* Close */}
              <button
                onClick={closePanel}
                className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded transition-colors"
                style={{ color: T.textSubtle, border: `1px solid ${T.border}` }}
              >
                esc
              </button>

              {/* Header */}
              <p className="font-mono text-[9px] uppercase tracking-widest mb-1"
                 style={{ color: clusterColor }}>
                {selected.cluster} domain
              </p>
              <h2 className="text-xl font-semibold mb-1" style={{ color: T.text }}>
                {selected.label}
              </h2>
              <p className="font-mono text-[10px] mb-4" style={{ color: T.textSubtle }}>
                {selected.stack}
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: T.textMuted }}>
                {selected.desc}
              </p>

              {/* Metrics */}
              {Object.keys(selected.metrics).length > 0 && (
                <div className="mb-6">
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: T.textSubtle }}>
                    Metrics
                  </p>
                  <div className="space-y-2">
                    {Object.entries(selected.metrics).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-baseline py-2"
                           style={{ borderBottom: `1px solid ${T.border}` }}>
                        <span className="text-[11px]" style={{ color: T.textMuted }}>{k}</span>
                        <span className="font-mono text-[11px] font-semibold" style={{ color: clusterColor }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Integration points */}
              {selected.connections.length > 0 && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: T.textSubtle }}>
                    Integration points
                  </p>
                  <div className="space-y-3">
                    {selected.connections.map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex gap-3 pb-3"
                        style={{ borderBottom: `1px solid ${T.border}` }}
                      >
                        <span className="font-mono text-[11px] mt-0.5 shrink-0" style={{ color: clusterColor }}>
                          {c.dir}
                        </span>
                        <div>
                          <p className="text-[11px] leading-snug" style={{ color: T.text }}>
                            <strong>{c.to}</strong> — {c.label}
                          </p>
                          <p className="font-mono text-[9px] mt-0.5" style={{ color: T.textSubtle }}>
                            {c.subject}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
