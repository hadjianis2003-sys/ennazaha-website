import { NextResponse } from 'next/server'
import { submitToHubspot } from '@/lib/hubspot'
import { HUBSPOT_WAITLIST_FORM_ID } from '@/lib/config'

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      fullName?: string; email?: string; phone?: string; preferredCity?: string
    }

    if (!body.email || !body.fullName || !body.phone || !body.preferredCity) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const fields: Record<string, string> = {
      firstname: body.fullName,
      email: body.email,
      phone: body.phone,
      city: body.preferredCity,
      lead_type: 'Waitlist Lead',
    }

    const ok = await submitToHubspot(HUBSPOT_WAITLIST_FORM_ID, fields)
    if (!ok) console.error('[lead/waitlist] HubSpot submission failed', fields)

    return NextResponse.json({ success: true, message: `Added to waitlist for ${body.preferredCity}.` })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
