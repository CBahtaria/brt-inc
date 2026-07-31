'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import * as d3 from 'd3'
import {
  PROJECTS,
  EDGES,
  DOMAIN_COLORS,
  EDGE_TYPE_COLORS,
  type ProjectNode,
  type ProjectEdge,
  type Domain,
} from '@/lib/ecosystem-graph'

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 900
const H = 560

// Normalized (0–1) domain gravity targets
const DOMAIN_POS: Record<Domain, { x: number; y: number }> = {
  hub:      { x: 0.5,  y: 0.5  },
  uav:      { x: 0.75, y: 0.2  },
  ml:       { x: 0.8,  y: 0.65 },
  commerce: { x: 0.5,  y: 0.85 },
  security: { x: 0.2,  y: 0.6  },
  game:     { x: 0.2,  y: 0.2  },
  ops:      { x: 0.5,  y: 0.15 },
}

const NODE_RADIUS = 20
const HUB_RADIUS  = 32

const METRICS = ['14 systems', '20 connections', '8 NATS streams', 'SRL-6']

// ─── Types for D3-mutated nodes/edges ─────────────────────────────────────────

// After sim runs, D3 resolves edge source/target from string → object
// We use 'as unknown as' assertions at render time when we need x/y from resolved nodes.
type SimNode = ProjectNode & { x: number; y: number }

// ─── Edge opacity / stroke helpers ────────────────────────────────────────────

function edgeOpacity(vol: ProjectEdge['dataVolume'], dimmed: boolean): number {
  if (dimmed) return 0.04
  return vol === 'high' ? 0.6 : vol === 'medium' ? 0.4 : 0.2
}

function edgeStrokeWidth(vol: ProjectEdge['dataVolume']): number {
  return vol === 'high' ? 1.5 : vol === 'medium' ? 1 : 0.6
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EcosystemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef     = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  const [simNodes, setSimNodes] = useState<SimNode[]>([])
  const [simEdges, setSimEdges] = useState<ProjectEdge[]>([])
  const [simReady, setSimReady] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{
    node: ProjectNode
    x: number
    y: number
  } | null>(null)

  // Connected node IDs for the hovered node
  const connectedIds = (() => {
    if (!hoveredId) return new Set<string>()
    const ids = new Set<string>([hoveredId])
    simEdges.forEach(e => {
      const src = typeof e.source === 'object'
        ? (e.source as unknown as SimNode).id
        : (e.source as string)
      const tgt = typeof e.target === 'object'
        ? (e.target as unknown as SimNode).id
        : (e.target as string)
      if (src === hoveredId) ids.add(tgt)
      if (tgt === hoveredId) ids.add(src)
    })
    return ids
  })()

  // Run simulation once in view
  useEffect(() => {
    if (!isInView) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Deep-clone so D3 can mutate freely
    const nodes: SimNode[] = PROJECTS.map(p => ({
      ...p,
      x: DOMAIN_POS[p.domain].x * W,
      y: DOMAIN_POS[p.domain].y * H,
    })) as SimNode[]

    // D3 forceLink needs string ids initially; after init resolves to objects
    const edges = EDGES.map(e => ({ ...e })) as ProjectEdge[]

    if (prefersReduced) {
      // Skip sim — use deterministic DOMAIN_POS positions with slight jitter to separate same-domain nodes
      const domainCount: Partial<Record<Domain, number>> = {}
      nodes.forEach(n => {
        const idx = domainCount[n.domain] ?? 0
        domainCount[n.domain] = idx + 1
        const angle = (idx * Math.PI * 2) / 4
        n.x = DOMAIN_POS[n.domain].x * W + Math.cos(angle) * 55
        n.y = DOMAIN_POS[n.domain].y * H + Math.sin(angle) * 55
      })
      setSimNodes(nodes)
      setSimEdges(edges)
      setSimReady(true)
      return
    }

    const sim = d3
      .forceSimulation(nodes as unknown as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(edges as unknown as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
          .id((d: d3.SimulationNodeDatum) => (d as ProjectNode).id)
          .distance((d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) => {
            const vol = (d as unknown as ProjectEdge).dataVolume
            return vol === 'high' ? 90 : vol === 'medium' ? 130 : 170
          })
          .strength(0.4),
      )
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius(42))
      .force(
        'x',
        d3
          .forceX((d: d3.SimulationNodeDatum) =>
            DOMAIN_POS[(d as ProjectNode).domain].x * W,
          )
          .strength(0.12),
      )
      .force(
        'y',
        d3
          .forceY((d: d3.SimulationNodeDatum) =>
            DOMAIN_POS[(d as ProjectNode).domain].y * H,
          )
          .strength(0.12),
      )

    sim.on('end', () => {
      setSimNodes([...nodes])
      setSimEdges([...(edges as unknown as ProjectEdge[])])
      setSimReady(true)
    })

    // Safety: if sim hasn't ended by 3s, force-snapshot
    const timeout = setTimeout(() => {
      sim.stop()
      setSimNodes([...nodes])
      setSimEdges([...(edges as unknown as ProjectEdge[])])
      setSimReady(true)
    }, 3000)

    return () => {
      sim.stop()
      clearTimeout(timeout)
    }
  }, [isInView])

  // Tooltip positioning relative to container
  function handleMouseEnter(node: SimNode, e: React.MouseEvent) {
    setHoveredId(node.id)
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Scale from SVG coords to container pixels
    const scaleX = rect.width / W
    const scaleY = (rect.width / W) // maintain aspect ratio: maxWidth 900
    const svgHeight = Math.min(rect.width, W) * (H / W)
    void svgHeight // calculated for reference
    setTooltip({
      node,
      x: node.x * scaleX,
      y: node.y * scaleY,
    })
    void e
  }

  function handleMouseLeave() {
    setHoveredId(null)
    setTooltip(null)
  }

  // Quadratic bezier midpoint (perpendicular offset)
  function bezierPath(sx: number, sy: number, tx: number, ty: number): string {
    const mx = (sx + tx) / 2
    const my = (sy + ty) / 2
    // Perpendicular nudge
    const dx = tx - sx
    const dy = ty - sy
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const perp = 20
    const qx = mx - (dy / len) * perp
    const qy = my + (dx / len) * perp
    return `M ${sx} ${sy} Q ${qx} ${qy} ${tx} ${ty}`
  }

  const domains: Domain[] = ['uav', 'ml', 'commerce', 'security', 'game', 'ops', 'hub']

  return (
    <section
      ref={sectionRef}
      style={{ background: '#050d10', padding: '80px 24px' }}
    >
      <style>{`
        @keyframes dashFlow { to { stroke-dashoffset: -20; } }
        .flow-dash      { animation: dashFlow 2s   linear infinite; }
        .flow-dash-slow { animation: dashFlow 3.5s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .flow-dash, .flow-dash-slow { animation: none; }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(148,163,184,0.6)',
              marginBottom: 10,
            }}
          >
            PORTFOLIO NEURAL MAP
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              color: '#f1f5f9',
              lineHeight: 1.1,
            }}
          >
            14 Systems.{' '}
            <span style={{ color: 'rgba(148,163,184,0.5)' }}>One Brain.</span>
          </h2>
        </div>

        {/* Graph container */}
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ maxWidth: W, display: 'block', overflow: 'visible' }}
          >
            {/* Arrow markers — one per domain color */}
            <defs>
              {domains.map(domain => (
                <marker
                  key={domain}
                  id={`arrow-${domain}`}
                  viewBox="0 -5 10 10"
                  refX={NODE_RADIUS + 8}
                  refY={0}
                  markerWidth={6}
                  markerHeight={6}
                  orient="auto"
                >
                  <path
                    d="M0,-5L10,0L0,5"
                    fill={DOMAIN_COLORS[domain]}
                    fillOpacity={0.7}
                  />
                </marker>
              ))}
              {/* Edge-type arrow markers */}
              {(Object.keys(EDGE_TYPE_COLORS) as Array<keyof typeof EDGE_TYPE_COLORS>).map(etype => (
                <marker
                  key={`et-${etype}`}
                  id={`arrow-et-${etype}`}
                  viewBox="0 -5 10 10"
                  refX={NODE_RADIUS + 8}
                  refY={0}
                  markerWidth={5}
                  markerHeight={5}
                  orient="auto"
                >
                  <path
                    d="M0,-5L10,0L0,5"
                    fill={EDGE_TYPE_COLORS[etype]}
                    fillOpacity={0.8}
                  />
                </marker>
              ))}
            </defs>

            {/* Edges */}
            {simReady &&
              simEdges.map((edge, i) => {
                // D3 resolves string ids to node objects after sim.init
                const sNode = edge.source as unknown as SimNode
                const tNode = edge.target as unknown as SimNode

                if (!sNode || !tNode || typeof sNode !== 'object') return null

                const sx = sNode.x
                const sy = sNode.y
                const tx = tNode.x
                const ty = tNode.y

                const srcId = sNode.id
                const tgtId = tNode.id
                const dimmed =
                  hoveredId !== null &&
                  !connectedIds.has(srcId) &&
                  !connectedIds.has(tgtId)

                const dashClass =
                  edge.dataVolume === 'high'
                    ? 'flow-dash'
                    : edge.dataVolume === 'medium'
                    ? 'flow-dash'
                    : 'flow-dash-slow'

                const tgtNode = simNodes.find(n => n.id === tgtId)
                const markerDomain = tgtNode?.domain ?? 'hub'

                return (
                  <path
                    key={i}
                    d={bezierPath(sx, sy, tx, ty)}
                    fill="none"
                    stroke={EDGE_TYPE_COLORS[edge.type]}
                    strokeOpacity={edgeOpacity(edge.dataVolume, dimmed)}
                    strokeWidth={edgeStrokeWidth(edge.dataVolume)}
                    strokeDasharray="6 4"
                    className={dashClass}
                    markerEnd={`url(#arrow-${markerDomain})`}
                    style={{ transition: 'stroke-opacity 0.2s' }}
                  />
                )
              })}

            {/* Nodes */}
            {simReady &&
              simNodes.map(node => {
                const R = node.id === 'brt-inc' ? HUB_RADIUS : NODE_RADIUS
                const color = DOMAIN_COLORS[node.domain]
                const isHovered = hoveredId === node.id
                const dimmed =
                  hoveredId !== null && !connectedIds.has(node.id)
                const opacity = dimmed ? 0.25 : 1

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x},${node.y})`}
                    style={{
                      cursor: 'pointer',
                      opacity,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => handleMouseEnter(node, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Outer glow */}
                    <circle
                      r={R + 4}
                      fill={color}
                      fillOpacity={isHovered ? 0.25 : 0.08}
                      style={{ transition: 'fill-opacity 0.2s' }}
                    />

                    {/* Hub: extra outer ring */}
                    {node.id === 'brt-inc' && (
                      <circle
                        r={R + 10}
                        fill="none"
                        stroke={color}
                        strokeOpacity={0.2}
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                    )}

                    {/* Main circle */}
                    <circle
                      r={R}
                      fill={color}
                      fillOpacity={0.15}
                      stroke={color}
                      strokeOpacity={isHovered ? 1 : 0.6}
                      strokeWidth={node.id === 'brt-inc' ? 2.5 : 1.5}
                      style={{ transition: 'stroke-opacity 0.2s' }}
                    />

                    {/* Hub: inner double ring */}
                    {node.id === 'brt-inc' && (
                      <circle
                        r={R - 6}
                        fill="none"
                        stroke={color}
                        strokeOpacity={0.3}
                        strokeWidth={1}
                      />
                    )}

                    {/* Hover extra ring */}
                    {isHovered && (
                      <circle
                        r={R + 7}
                        fill="none"
                        stroke={color}
                        strokeOpacity={0.4}
                        strokeWidth={1}
                      />
                    )}

                    {/* Health bar */}
                    <rect
                      x={-R}
                      y={R - 4}
                      width={R * 2}
                      height={3}
                      rx={1.5}
                      fill="rgba(0,0,0,0.4)"
                    />
                    <rect
                      x={-R}
                      y={R - 4}
                      width={(node.health / 10) * R * 2}
                      height={3}
                      rx={1.5}
                      fill={color}
                      fillOpacity={0.8}
                    />

                    {/* Label */}
                    <text
                      y={R + 14}
                      fontSize={node.id === 'brt-inc' ? 9 : 8}
                      fill="rgba(148,163,184,0.8)"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.name}
                    </text>
                  </g>
                )
              })}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: Math.min(tooltip.x + 16, (containerRef.current?.clientWidth ?? 400) - 220),
                top: Math.max(tooltip.y - 80, 0),
                width: 200,
                background: 'rgba(5,13,16,0.96)',
                border: `1px solid ${DOMAIN_COLORS[tooltip.node.domain]}40`,
                borderRadius: 10,
                padding: '12px 14px',
                pointerEvents: 'none',
                zIndex: 20,
                backdropFilter: 'blur(8px)',
              }}
            >
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  marginBottom: 6,
                }}
              >
                {tooltip.node.name}
              </p>

              {/* Domain badge */}
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'monospace',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: DOMAIN_COLORS[tooltip.node.domain] + '20',
                  color: DOMAIN_COLORS[tooltip.node.domain],
                  border: `1px solid ${DOMAIN_COLORS[tooltip.node.domain]}40`,
                  marginBottom: 6,
                }}
              >
                {tooltip.node.domain}
              </span>

              <p
                style={{
                  fontSize: 10,
                  color: 'rgba(148,163,184,0.7)',
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                {tooltip.node.tagline}
              </p>

              {/* Tech pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {tooltip.node.tech.slice(0, 3).map(t => (
                  <span
                    key={t}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 9,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'rgba(148,163,184,0.08)',
                      color: 'rgba(148,163,184,0.7)',
                      border: '1px solid rgba(148,163,184,0.15)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Health */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(148,163,184,0.5)' }}>
                  HEALTH
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: 'rgba(148,163,184,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${tooltip.node.health * 10}%`,
                      height: '100%',
                      background: DOMAIN_COLORS[tooltip.node.domain],
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 9,
                    color: DOMAIN_COLORS[tooltip.node.domain],
                  }}
                >
                  {tooltip.node.health}/10
                </span>
              </div>

              {/* Status badge */}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  color:
                    tooltip.node.status === 'live' || tooltip.node.status === 'production'
                      ? '#22c55e'
                      : tooltip.node.status === 'building'
                      ? '#f59e0b'
                      : '#94a3b8',
                }}
              >
                ● {tooltip.node.status}
              </span>
            </div>
          )}
        </div>

        {/* Caption metric pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28, marginBottom: 20 }}>
          {METRICS.map(m => (
            <span
              key={m}
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                padding: '5px 14px',
                borderRadius: 99,
                border: '1px solid rgba(99,102,241,0.35)',
                color: 'rgba(99,102,241,0.9)',
                background: 'rgba(99,102,241,0.06)',
              }}
            >
              {m}
            </span>
          ))}
        </div>

        <a
          href="/ecosystem"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            fontWeight: 500,
            color: '#38bdf8',
            textDecoration: 'none',
          }}
        >
          Explore full 3D map →
        </a>
      </div>
    </section>
  )
}
