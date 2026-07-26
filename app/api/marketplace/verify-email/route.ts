import { NextRequest, NextResponse } from 'next/server'
import { isInstitutionalEmail, isSadcDomain } from '@/lib/marketplace/verify-institution'

export async function POST(req: NextRequest) {
  const body = await req.json() as { email?: string }
  const email = (body.email ?? '').trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const [institutional, sadc] = await Promise.all([
    isInstitutionalEmail(email),
    Promise.resolve(isSadcDomain(email)),
  ])

  return NextResponse.json({ institutional, sadc })
}
