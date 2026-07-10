import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // TODO: port full webhook handler from api/stripe-webhook.js
  return NextResponse.json({ received: true })
}
