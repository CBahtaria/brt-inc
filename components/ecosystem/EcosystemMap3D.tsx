'use client'
import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// ── Tokens ───────────────────────────────────────────────────────────────────
const COLORS: Record<string, string> = {
  uav:           '#2dd4bf',  // teal
  platform:      '#6366f1',  // indigo
  intelligence:  '#10b981',  // emerald
  gaming:        '#f59e0b',  // amber
  ml:            '#f43f5e',  // rose
  institutional: '#64748b',  // slate
  edge:          '#d97706',  // amber-dark
  web:           '#818cf8',  // indigo-light
  security:      '#ec4899',  // pink — Layered / privacy
  llm:           '#a78bfa',  // violet — brt-llm
  consumer:      '#fb923c',  // orange — 10 consumer services
}

// ── 3-D positions per node (cluster grouping) ──────────────────────────────
const NODE_DATA = [
  // UAV cluster — top right
  { id: 'uav',          label: 'Agentic UAV Stack',       cluster: 'uav',           pos: [3, 2, 0]      as [number,number,number], r: 0.55 },
  { id: 'sentinel',     label: 'Sentinel v5',             cluster: 'uav',           pos: [4.5, 3, 1]    as [number,number,number], r: 0.38 },
  { id: 'bartarian',    label: 'BARTARIAN Defence',       cluster: 'uav',           pos: [5, 1, -1]     as [number,number,number], r: 0.28 },
  // Intelligence — centre
  { id: 'brain',        label: 'Second Brain',            cluster: 'intelligence',  pos: [0, 0, 0]      as [number,number,number], r: 0.60 },
  { id: 'nats',         label: 'NATS JetStream',          cluster: 'intelligence',  pos: [1, -1, 1]     as [number,number,number], r: 0.42 },
  { id: 'brt-platform', label: 'BRT Platform',            cluster: 'intelligence',  pos: [1.5, 1.5, -2] as [number,number,number], r: 0.36 },
  { id: 'levin',        label: 'Levin Search',            cluster: 'intelligence',  pos: [2.5, -2.5, -2] as [number,number,number], r: 0.28 },
  // Platform — left
  { id: 'lce',          label: 'Lets Connect Eswatini',   cluster: 'platform',      pos: [-3.5, 1.5, 0]  as [number,number,number], r: 0.48 },
  { id: 'likhona',      label: 'Likhona Lami',            cluster: 'platform',      pos: [-4.5, -0.5, 1] as [number,number,number], r: 0.38 },
  // Gaming — bottom-left
  { id: 'mahlanya',     label: 'MahlanyaRPG',             cluster: 'gaming',        pos: [-3, -3, -1]    as [number,number,number], r: 0.44 },
  // ML
  { id: 'maize',        label: 'Maize Classifier',        cluster: 'ml',            pos: [0.5, -3.5, 1]  as [number,number,number], r: 0.30 },
  { id: 'brt-llm',      label: 'BRT LLM',                 cluster: 'llm',           pos: [-0.5, -5, -1]  as [number,number,number], r: 0.35 },
  // Edge
  { id: 'zig',          label: 'Zig Bridge',              cluster: 'edge',          pos: [5.5, -1.5, 2]  as [number,number,number], r: 0.32 },
  { id: 'ecosystem',    label: 'BRT Ecosystem',           cluster: 'edge',          pos: [4.5, -3, 0]    as [number,number,number], r: 0.40 },
  // Institutional
  { id: 'civisgrid',    label: 'CivisGrid',               cluster: 'institutional', pos: [-5.5, -2, -2]  as [number,number,number], r: 0.28 },
  { id: 'readers',      label: 'Eswatini Readers',        cluster: 'institutional', pos: [-7, -0.5, 0]   as [number,number,number], r: 0.26 },
  // Security — far right
  { id: 'layered',      label: 'Layered',                 cluster: 'security',      pos: [7, 2, 0]       as [number,number,number], r: 0.44 },
  // Web/ops
  { id: 'brtinc',       label: 'BRT Inc. Portfolio',      cluster: 'web',           pos: [-1.5, 3.5, 2]  as [number,number,number], r: 0.32 },
  { id: 'wheels',       label: 'Wheels & Deals',          cluster: 'web',           pos: [-0.5, 5.0, -1] as [number,number,number], r: 0.35 },
  { id: 'studio-p',     label: 'Studio P',                cluster: 'web',           pos: [1.5, 5.0, 2]   as [number,number,number], r: 0.26 },
  // Consumer services — top arc
  { id: 'burnout',      label: 'Burnout Recovery',        cluster: 'consumer',      pos: [0, 7.5, 0]     as [number,number,number], r: 0.22 },
  { id: 'propman',      label: 'AI Property Manager',     cluster: 'consumer',      pos: [-2.5, 7, 1]    as [number,number,number], r: 0.20 },
  { id: 'foodbox',      label: 'Local Food Box',          cluster: 'consumer',      pos: [2.5, 7, -1]    as [number,number,number], r: 0.20 },
  { id: 'signtrans',    label: 'Sign Translator',         cluster: 'consumer',      pos: [-5, 6.5, 1]    as [number,number,number], r: 0.20 },
  { id: 'fraudshield',  label: 'Senior Fraud Shield',     cluster: 'consumer',      pos: [5, 6.5, -1]    as [number,number,number], r: 0.22 },
  { id: 'codereview',   label: 'AI Code Reviewer',        cluster: 'consumer',      pos: [-3, 8, -1]     as [number,number,number], r: 0.20 },
  { id: 'physio',       label: 'Remote Physio',           cluster: 'consumer',      pos: [3, 8, 1]       as [number,number,number], r: 0.20 },
  { id: 'ewaste',       label: 'E-Waste Recycling',       cluster: 'consumer',      pos: [-7, 5.5, 0]    as [number,number,number], r: 0.18 },
  { id: 'meetingdoer',  label: 'AI Meeting Doer',         cluster: 'consumer',      pos: [7, 5.5, 0]     as [number,number,number], r: 0.20 },
  { id: 'solar',        label: 'Simple Home Solar',       cluster: 'consumer',      pos: [0, 6, 3]       as [number,number,number], r: 0.20 },
]

// ── Links (source id, target id, type) ───────────────────────────────────────
const LINK_DATA: { s: string; t: string; type: 'nats' | 'crypto' | 'advisory' | 'shared' }[] = [
  // UAV cluster
  { s: 'uav',          t: 'sentinel',     type: 'nats'     },
  { s: 'uav',          t: 'brain',        type: 'nats'     },
  { s: 'uav',          t: 'nats',         type: 'nats'     },
  { s: 'uav',          t: 'zig',          type: 'crypto'   },
  { s: 'uav',          t: 'lce',          type: 'nats'     },
  { s: 'uav',          t: 'mahlanya',     type: 'nats'     },
  { s: 'uav',          t: 'ecosystem',    type: 'nats'     },
  { s: 'bartarian',    t: 'sentinel',     type: 'advisory' },
  // Brain / intelligence
  { s: 'brain',        t: 'sentinel',     type: 'nats'     },
  { s: 'brain',        t: 'lce',          type: 'nats'     },
  { s: 'brain',        t: 'likhona',      type: 'advisory' },
  { s: 'brain',        t: 'mahlanya',     type: 'advisory' },
  { s: 'brain',        t: 'nats',         type: 'nats'     },
  { s: 'brain',        t: 'ecosystem',    type: 'advisory' },
  { s: 'brain',        t: 'wheels',       type: 'advisory' },
  { s: 'brain',        t: 'brt-platform', type: 'nats'     },
  { s: 'brain',        t: 'brt-llm',      type: 'advisory' },
  // BRT Platform (RAG)
  { s: 'brt-platform', t: 'nats',         type: 'nats'     },
  { s: 'brt-platform', t: 'brt-llm',      type: 'advisory' },
  // Levin
  { s: 'levin',        t: 'brain',        type: 'advisory' },
  { s: 'levin',        t: 'brt-platform', type: 'advisory' },
  // Layered
  { s: 'layered',      t: 'brain',        type: 'advisory' },
  { s: 'layered',      t: 'sentinel',     type: 'shared'   },
  { s: 'layered',      t: 'nats',         type: 'nats'     },
  // Platform
  { s: 'lce',          t: 'likhona',      type: 'shared'   },
  { s: 'lce',          t: 'sentinel',     type: 'nats'     },
  // Edge
  { s: 'zig',          t: 'ecosystem',    type: 'crypto'   },
  { s: 'ecosystem',    t: 'sentinel',     type: 'nats'     },
  // Institutional
  { s: 'civisgrid',    t: 'lce',          type: 'shared'   },
  { s: 'readers',      t: 'civisgrid',    type: 'shared'   },
  { s: 'readers',      t: 'brtinc',       type: 'shared'   },
  // Web
  { s: 'brtinc',       t: 'likhona',      type: 'shared'   },
  { s: 'brtinc',       t: 'mahlanya',     type: 'shared'   },
  { s: 'brtinc',       t: 'wheels',       type: 'shared'   },
  { s: 'brtinc',       t: 'studio-p',     type: 'shared'   },
  // Consumer services → brtinc (portfolio) + layered (fraud shield)
  { s: 'fraudshield',  t: 'layered',      type: 'advisory' },
  { s: 'codereview',   t: 'brt-llm',      type: 'advisory' },
  { s: 'burnout',      t: 'brtinc',       type: 'shared'   },
  { s: 'propman',      t: 'brtinc',       type: 'shared'   },
  { s: 'foodbox',      t: 'brtinc',       type: 'shared'   },
  { s: 'signtrans',    t: 'brtinc',       type: 'shared'   },
  { s: 'fraudshield',  t: 'brtinc',       type: 'shared'   },
  { s: 'codereview',   t: 'brtinc',       type: 'shared'   },
  { s: 'physio',       t: 'brtinc',       type: 'shared'   },
  { s: 'ewaste',       t: 'brtinc',       type: 'shared'   },
  { s: 'meetingdoer',  t: 'brtinc',       type: 'shared'   },
  { s: 'solar',        t: 'brtinc',       type: 'shared'   },
]

const LINK_COLOR: Record<string, string> = {
  nats:     '#2dd4bf',
  crypto:   '#d97706',
  advisory: '#10b981',
  shared:   '#6366f1',
}

// ── Node details for the panel ───────────────────────────────────────────────
const NODE_DETAIL: Record<string, { stack: string; desc: string; metrics: Record<string, string> }> = {
  uav:          { stack: 'Python · NATS · MAVLink · SO(3) EKF · MRAC', desc: '7-layer formal UAV stack. DAL-A safety governor has final say on all flight commands. SO(3) Lie group geometry, fog water harvesting (4 mission profiles), 942 tests, SRL-3 HIL cleared.', metrics: { 'Tests': '942+', 'SRL': '3 (HIL)', 'DAL-A gates': '15+', 'Status': 'LIVE' } },
  sentinel:     { stack: 'PHP 8.1 · MySQL · Redis · NATS · WebSocket', desc: 'Unified command HQ. UAV Fleet, LCE, and Ecosystem tabs. TOTP 2FA, Redis cache, 100 req/min rate limit. All 9 security audit findings resolved — UAT ready.', metrics: { 'Auth': 'TOTP 2FA', 'Cache': '30 s TTL', 'Audit': '9/9 resolved', 'Status': 'UAT ready' } },
  brain:        { stack: 'Python · brt-base · Obsidian · NATS · sqlite', desc: 'Cognitive core. 17 autonomous tasks, token-budgeted per domain. 9-persona weekly vuln scan. Reads all streams. Primary model: brt-base (Llama 3.2 3B fine-tune via Ollama).', metrics: { 'Tasks': '17 autonomous', 'Model': 'brt-base (local)', 'Vault': 'Obsidian', 'Status': 'LIVE' } },
  nats:         { stack: 'NATS Server · JetStream · TLS · ACL', desc: 'Central nervous system. 8 persistent streams, 50+ subjects, per-stream ACL. All real-time flows through here.', metrics: { 'Streams': '8', 'Subjects': '50+', 'Auth': 'TLS + ACL', 'Status': 'LIVE' } },
  'brt-platform': { stack: 'FastAPI · Qdrant · Redis · brt-base · NATS', desc: 'SADC RAG system for institutional clients. Hybrid dense + sparse retrieval, per-tenant Qdrant collections, rate-limited API keys, brt-base for cited generation. Ministries, defence forces, libraries.', metrics: { 'Vector DB': 'Qdrant', 'Isolation': 'Per-tenant', 'Cache': 'Redis', 'Status': 'In dev' } },
  levin:        { stack: 'Python · BrainFuck interpreter · Levin search', desc: 'BrainFuck interpreter over Levin universal search. Incremental execution with dead-set pruning and O(1) bracket jumps. Explores program space using the universal prior as a search heuristic.', metrics: { 'Search': 'Universal prior', 'Lang': 'BrainFuck', 'Pruning': 'Dead-set', 'Status': 'Research' } },
  lce:          { stack: 'NestJS 11 · Next.js 14 · Expo 54 · PostGIS · Qdrant · ClamAV', desc: 'Multilayer social platform. Clustered Mitochondria edge-compress before server. NATS JetStream event streaming, TypeORM persistence, 5-layer security (ClamAV + YARA + LLM scan).', metrics: { 'Auth': 'OTP + PoW 2²⁰', 'Scan': 'ClamAV + YARA + LLM', 'Tests': '37 passing', 'Status': 'In dev' } },
  likhona:      { stack: 'pnpm monorepo · NestJS 11 · Expo 54 · PostGIS · MTN MoMo', desc: 'Production skills marketplace. pnpm monorepo with Expo React Native customer + pro apps. MTN MoMo escrow, Labour Act compliance, siSwati NLP (13 noun-class prefixes), PostGIS location-aware.', metrics: { 'Tests': '37 passing', 'Language': 'siSwati ↔ EN', 'Payments': 'MTN MoMo', 'Status': 'Production' } },
  mahlanya:     { stack: 'UE5.4 C++ · OpenXR · Three.js · Copernicus DEM', desc: 'Historical RPG set in pre-colonial Eswatini. Phase 11: EswatiniGeophysics plugin — fault lines, mineral veins, Darcy groundwater. 10m DEM terrain, historically accurate CVT settlements. VR + PWA.', metrics: { 'C++ plugins': '13', 'Tests': '338', 'VR': 'OpenXR', 'Status': 'Phase 11' } },
  maize:        { stack: 'TensorFlow · MobileNetV2 · TFLite · Expo', desc: 'On-device binary leaf disease classifier for SSA smallholder farmers. No internet required. MobileNetV2 backbone, TFLite export. 94.2% top-1 accuracy on SADC field images.', metrics: { 'Accuracy': '94.2%', 'Inference': '<200 ms', 'Target': 'SSA farmers', 'Status': 'Production' } },
  'brt-llm':    { stack: 'Llama 3.2 3B · Unsloth · LoRA · Ollama · brt-base', desc: 'Fine-tuned domain LLM for BRT Inc. portfolio. brt-base = Llama 3.2 3B + LoRA on 116 JSONL pairs covering all products, pricing, DAL-A rules, SRL progression, and 10 consumer services. Served via Ollama REST.', metrics: { 'Base': 'Llama 3.2 3B', 'Training': '116 pairs', 'Serving': 'Ollama :11434', 'Probes': '7/10' } },
  zig:          { stack: 'Zig 0.14 · AES-GCM-256 · X25519 ECDH · NATS', desc: 'Edge bridge. Encrypts every sensor packet before it leaves the physical layer. 13-state EKF for sensor fusion.', metrics: { 'Cipher': 'AES-GCM-256', 'KEx': 'X25519 ECDH', 'Status': 'Partial' } },
  ecosystem:    { stack: 'Python · GPIO · Modbus RTU · OpenWRT · NATS', desc: 'Physical infra layer. Drones harvest fog water, solar, RF, piezo. Capacitor bank, reservoir monitoring, WLAN mesh.', metrics: { 'Sensors': '8 types', 'Harvest': 'fog+solar+RF+piezo', 'Status': 'In dev' } },
  civisgrid:    { stack: 'PHP 8 · PDO · MySQL · Next.js', desc: 'National asset tracking and resilience planning platform for Eswatini government. Tracks infrastructure assets, service continuity, and civic resources at national scale.', metrics: { 'Scale': 'National', 'Auth': 'PHP sessions + PDO', 'Status': 'Active' } },
  readers:      { stack: 'PHP 8 · MySQLi · env-based DB config', desc: 'Eswatini national digital library. Read, publish, and browse books by chapter. Session fixation patched, prepared statements throughout, DB credentials env-based. Security audit complete.', metrics: { 'Auth': 'Session + regen', 'SQL': 'Prepared stmts', 'Audit': 'Clean', 'Status': 'LIVE' } },
  layered:      { stack: 'Chrome MV3 · NestJS · Ed25519 · WebAuthn · NATS', desc: 'Privacy extension suite. Ed25519 certificate pinning for MITM defence, WebAuthn biometric vault unlock, E2E encrypted credential vault, OSINT panel, interview AI, proxy. declarativeNetRequest ad blocker, Chrome Side Panel API.', metrics: { 'Pricing': 'R 49–R 99/mo', 'Auth': 'WebAuthn biometric', 'MITM': 'Ed25519 pinning', 'Status': 'LIVE' } },
  brtinc:       { stack: 'Next.js 16 · React 19 · Supabase · Vercel · Framer Motion', desc: 'Institutional face of BRT Inc. 24 services, case studies, 3D ecosystem map, SADC Sovereign Marketplace, dynamic sitemap, JSON-LD schema, full SEO metadata. You are here.', metrics: { 'Services': '17 core + 10 consumer', 'Pages': '56 static', 'URL': 'brtinc.dev', 'Status': 'LIVE' } },
  bartarian:    { stack: 'PHP 8.2 · Expo RN · RBAC', desc: 'Defence command interface. RBAC + auth boundaries. Expo React Native mobile. Security audit in progress.', metrics: { 'Auth': 'RBAC', 'Status': 'Partial' } },
  wheels:       { stack: 'Next.js 16 · Supabase · sharp · brt-base · Vercel', desc: 'Used car dealership platform for Matsapha, Eswatini. Procedural ASCII highway animation, Thandi AI chat (brt-base via Ollama), admin vehicle posting, WebP media pipeline, anonymous analytics + personalized feed.', metrics: { 'API endpoints': '36', 'AI': 'brt-base local', 'Media': 'WebP pipeline', 'Status': 'LIVE' } },
  'studio-p':   { stack: 'React 19 · TypeScript · Supabase · Pake (Tauri)', desc: 'Barbershop booking platform for Matsapha. Clients book chair time slots via calendar UI. Pake wraps the React app as a native desktop app (~8MB vs Electron 150MB) for barber shop owners.', metrics: { 'Desktop': 'Pake / Tauri', 'DB': 'Supabase RLS', 'Auth': 'Supabase Auth', 'Status': 'LIVE' } },
  // Consumer services
  burnout:      { stack: 'React · brt-base · local inference', desc: 'Guided digital rest system for screen fatigue. Structured micro-recovery schedules — timed focus blocks, mandatory off-screen intervals, progressive re-entry. Monitors usage patterns and intervenes with contextual rest prompts.', metrics: { 'Model': 'brt-base', 'Pricing': 'Subscription', 'Status': 'Concept' } },
  propman:      { stack: 'NestJS · React · MTN MoMo · brt-base', desc: 'AI property manager for small landlords. Automates rent reminders, maintenance triage, tenant Q&A, monthly income/expense summaries. Integrates SnapScan and EFT.', metrics: { 'Payments': 'MTN MoMo · EFT', 'Pricing': 'Per unit/mo', 'Status': 'Concept' } },
  foodbox:      { stack: 'Next.js · NestJS · PostGIS · MTN MoMo', desc: 'Direct farm-to-door weekly produce box. Routes orders from SADC smallholder farms to households. Manages farm capacity, seasonal box composition, delivery routing, SZL/ZAR payments.', metrics: { 'Geo': 'PostGIS routing', 'Pricing': 'Per box/week', 'Status': 'Concept' } },
  signtrans:    { stack: 'Expo · TFLite · gesture model · TTS', desc: 'Real-time sign language ↔ spoken language translation. Phone camera captures signing → gesture recognition model → spoken audio. Reverse: mic → transcription → animated signs. Runs on-device.', metrics: { 'Inference': 'On-device', 'Pricing': 'Subscription', 'Status': 'Concept' } },
  fraudshield:  { stack: 'Layered extension · NestJS · pattern classifier', desc: 'Senior fraud protection built on Layered. Monitors accounts for scam patterns (social engineering scripts, impersonation, unusual amounts), blocks before money leaves, alerts trusted contact. Runs inside Layered locally.', metrics: { 'Base': 'Layered extension', 'Pricing': 'Per seat/mo', 'Status': 'Concept' } },
  codereview:   { stack: 'brt-base · NestJS · OWASP rules engine', desc: 'AI code reviewer for AI-generated or beginner code. Checks OWASP Top 10, hardcoded secrets, unsafe deserialization, SQL injection, missing auth guards. Structured severity report with remediation steps. CI webhook or ZIP upload.', metrics: { 'Rules': 'OWASP Top 10', 'Model': 'brt-base', 'Pricing': 'Per review', 'Status': 'Concept' } },
  physio:       { stack: 'Expo · MediaPipe · pose estimation · TFLite', desc: 'Remote physiotherapy via phone camera. Pose estimation compares joint angles against exercise template. Audio + visual cues correct form in real time. Session logs track range of motion and rep count.', metrics: { 'CV': 'MediaPipe poses', 'Inference': 'On-device', 'Pricing': 'Subscription', 'Status': 'Concept' } },
  ewaste:       { stack: 'Next.js · NestJS · logistics API · chain of custody', desc: 'E-waste pickup and certified recycling. Log devices, book pickup, BRT routes to certified recyclers. Chain-of-custody certificate issued per device. Prevents toxic landfill across SADC.', metrics: { 'Certificate': 'Per device', 'Pricing': 'Per pickup', 'Status': 'Concept' } },
  meetingdoer:  { stack: 'brt-base · Whisper · NestJS · calendar integrations', desc: 'AI that attends meetings, transcribes, summarises, extracts action items with owners + deadlines, and sends follow-ups. Integrates Google Meet, Zoom, Teams. Action items export to task tools.', metrics: { 'STT': 'Whisper local', 'Model': 'brt-base', 'Pricing': 'Per seat/mo', 'Status': 'Concept' } },
  solar:        { stack: 'Next.js · NestJS · site assessment · monitoring', desc: 'Unified home solar service. Site assessment, panel + inverter sizing, load calculation, financing options, installation coordination, grid connection, post-install monitoring dashboard (generation, consumption, export).', metrics: { 'Monitor': 'Real-time', 'Pricing': 'Fixed scope', 'Status': 'Concept' } },
}

// ── Travelling particle along a tube path ─────────────────────────────────────
function Particle({ from, to, color, speed = 1, delay = 0 }: {
  from: [number,number,number]; to: [number,number,number]; color: string; speed?: number; delay?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const tRef = useRef(delay)

  const mid = useMemo<[number,number,number]>(() => [
    (from[0] + to[0]) / 2 + (Math.random() - 0.5) * 1.5,
    (from[1] + to[1]) / 2 + (Math.random() - 0.5) * 1.5,
    (from[2] + to[2]) / 2 + (Math.random() - 0.5) * 1.5,
  ], [from, to])

  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...from),
    new THREE.Vector3(...mid),
    new THREE.Vector3(...to),
  ), [from, mid, to])

  useFrame((_, dt) => {
    if (!ref.current) return
    tRef.current = (tRef.current + dt * speed * 0.18) % 1
    const pos = curve.getPoint(tRef.current)
    ref.current.position.copy(pos)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

// ── Connection tube with particles ───────────────────────────────────────────
function Connection({ from, to, type }: { from: [number,number,number]; to: [number,number,number]; type: string }) {
  const color = LINK_COLOR[type] ?? '#ffffff'
  const count = type === 'nats' ? 3 : type === 'crypto' ? 2 : 1
  return (
    <group>
      <Line
        points={[from, to]}
        color={color}
        lineWidth={1}
        transparent
        opacity={type === 'nats' ? 0.4 : type === 'crypto' ? 0.55 : 0.25}
        dashed={type !== 'nats'}
        dashSize={0.3}
        gapSize={0.2}
      />
      {Array.from({ length: count }, (_, i) => (
        <Particle
          key={i}
          from={from} to={to}
          color={color}
          speed={type === 'nats' ? 1 : type === 'crypto' ? 0.7 : 0.4}
          delay={i / count}
        />
      ))}
    </group>
  )
}

// ── Node sphere ───────────────────────────────────────────────────────────────
function Node({ data, onClick, focused }: {
  data: typeof NODE_DATA[0]; onClick: (id: string) => void; focused: boolean
}) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const color = COLORS[data.cluster] ?? '#ffffff'

  useFrame((_, dt) => {
    if (!meshRef.current || !glowRef.current) return
    const t = performance.now() * 0.001
    const pulse = 1 + 0.04 * Math.sin(t * 1.8 + data.pos[0])
    meshRef.current.scale.setScalar(hovered || focused ? data.r * 1.25 : data.r)
    glowRef.current.scale.setScalar((hovered || focused ? data.r * 1.9 : data.r * 1.5) * pulse)
  })

  return (
    <group position={data.pos}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} toneMapped={false} />
      </mesh>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(data.id) }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || focused ? 0.9 : 0.45}
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={0.92}
          toneMapped={false}
        />
      </mesh>
      {/* Label */}
      <Text
        position={[0, -data.r * 1.8 - 0.3, 0]}
        fontSize={0.18}
        color={hovered || focused ? '#fafafa' : '#a1a1aa'}
        anchorX="center"
        anchorY="top"
        font="/fonts/GeistMono-Regular.woff"
        maxWidth={3}
      >
        {data.label}
      </Text>
    </group>
  )
}

// ── Camera fly-to focused node ────────────────────────────────────────────────
function CameraRig({ focusPos }: { focusPos: [number,number,number] | null }) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(...(focusPos ?? [0, 0, 12])), [focusPos])

  useFrame(() => {
    if (focusPos) {
      const desired = new THREE.Vector3(focusPos[0], focusPos[1], focusPos[2] + 4)
      camera.position.lerp(desired, 0.05)
    }
  })
  return null
}

// ── Main 3-D scene ────────────────────────────────────────────────────────────
function Scene({ onSelect }: { onSelect: (id: string | null) => void }) {
  const posMap = useMemo(() => Object.fromEntries(NODE_DATA.map(n => [n.id, n.pos])), [])
  const [focused, setFocused] = useState<string | null>(null)

  const handleClick = useCallback((id: string) => {
    const next = focused === id ? null : id
    setFocused(next)
    onSelect(next)
  }, [focused, onSelect])

  return (
    <>
      <Stars radius={60} depth={30} count={2000} factor={3} fade speed={0.4} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#10b981" distance={25} decay={2} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#6366f1" distance={20} decay={2} />

      {/* Connections */}
      {LINK_DATA.map((l, i) => {
        const sp = posMap[l.s]
        const tp = posMap[l.t]
        if (!sp || !tp) return null
        return <Connection key={i} from={sp} to={tp} type={l.type} />
      })}

      {/* Nodes */}
      {NODE_DATA.map(n => (
        <Node key={n.id} data={n} onClick={handleClick} focused={focused === n.id} />
      ))}

      <CameraRig focusPos={focused ? posMap[focused] : null} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={22}
        autoRotate
        autoRotateSpeed={0.35}
        makeDefault
      />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.6}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ── Panel ─────────────────────────────────────────────────────────────────────
function DetailPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const node    = NODE_DATA.find(n => n.id === id)
  const detail  = NODE_DETAIL[id]
  const color   = node ? COLORS[node.cluster] : '#6366f1'
  const link    = LINK_DATA.filter(l => l.s === id || l.t === id)
  const peers   = [...new Set(link.flatMap(l => [l.s, l.t]).filter(x => x !== id))]

  if (!node || !detail) return null
  return (
    <motion.aside
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0,   opacity: 1 }}
      exit={{   x: 340, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="absolute inset-y-0 right-0 w-80 flex flex-col overflow-y-auto"
      style={{ background: 'rgba(9,9,11,0.97)', borderLeft: `1px solid ${color}28`, backdropFilter: 'blur(20px)' }}
    >
      <div className="h-0.5 w-full shrink-0" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
      <div className="p-6 flex-1">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded"
          style={{ color: 'var(--text-subtle)', border: '1px solid var(--border)' }}
        >
          esc
        </button>
        <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color }}>{node.cluster}</p>
        <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>{node.label}</h2>
        <p className="font-mono text-[9px] mb-4 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>{detail.stack}</p>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{detail.desc}</p>

        <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>Metrics</p>
        <div className="space-y-1.5 mb-6">
          {Object.entries(detail.metrics).map(([k,v]) => (
            <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span className="font-mono text-[11px] font-semibold" style={{ color }}>{v}</span>
            </div>
          ))}
        </div>

        {peers.length > 0 && (
          <>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>Connected to</p>
            <div className="flex flex-wrap gap-2">
              {peers.map(p => {
                const pn = NODE_DATA.find(n => n.id === p)
                const pc = pn ? COLORS[pn.cluster] : '#ffffff'
                return (
                  <span key={p} className="font-mono text-[9px] px-2 py-1 rounded-full border" style={{ borderColor: pc + '40', color: pc }}>
                    {pn?.label ?? p}
                  </span>
                )
              })}
            </div>
          </>
        )}
      </div>
    </motion.aside>
  )
}

// ── Public component ──────────────────────────────────────────────────────────
export function EcosystemMap3D() {
  const [selected, setSelected] = useState<string | null>(null)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = () => setPrefersReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)', background: '#030508', touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, prefersReduced ? 1 : 2]}
        gl={{ antialias: !prefersReduced, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <Scene onSelect={setSelected} />
      </Canvas>

      {/* Legend */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-x-4 gap-y-1.5 pointer-events-none max-w-xs md:max-w-none">
        {Object.entries(COLORS).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 5px ${c}` }} />
            <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: '#52525b' }}>{k}</span>
          </div>
        ))}
      </div>

      {/* Legend edge types */}
      <div className="absolute bottom-6 left-4 flex flex-col gap-1.5 pointer-events-none">
        {Object.entries(LINK_COLOR).map(([t, c]) => (
          <div key={t} className="flex items-center gap-2">
            <span className="w-6 h-px" style={{ background: c, display: 'inline-block' }} />
            <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: '#52525b' }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="absolute bottom-5 right-4 font-mono text-[8px] uppercase tracking-widest pointer-events-none" style={{ color: '#52525b' }}>
        drag · scroll to zoom · click node
      </p>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <DetailPanel key={selected} id={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default EcosystemMap3D
