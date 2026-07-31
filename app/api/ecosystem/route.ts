import { NextResponse } from 'next/server'
import { PROJECTS, EDGES } from '@/lib/ecosystem-graph'

export const revalidate = 3600

export function GET() {
  return NextResponse.json({
    data: {
      projects: PROJECTS,
      edges: EDGES,
      meta: {
        totalProjects: PROJECTS.length,
        totalEdges: EDGES.length,
        domains: ['uav', 'ml', 'commerce', 'security', 'game', 'ops', 'hub'],
        generatedAt: new Date().toISOString(),
      },
    },
  })
}
