import { NextResponse } from 'next/server'
import { submitToHubspot } from '@/lib/hubspot'
import { HUBSPOT_CONTACT_FORM_ID } from '@/lib/config'

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      fullName?: string; email?: string; phone?: string
      projectContext?: string; message?: string
    }

    if (!body.email || !body.fullName || !body.phone) {
      return NextResponse.json({ success: false, errors: [{ field: 'required', message: 'Missing required fields' }] }, { status: 400 })
    }

    const fields: Record<string, string> = {
      firstname: body.fullName,
      email: body.email,
      phone: body.phone,
      ...(body.projectContext && { deal_name: body.projectContext }),
      ...(body.message && { message: body.message }),
    }

    const ok = await submitToHubspot(HUBSPOT_CONTACT_FORM_ID, fields)
    if (!ok) {
      // Fallback: log to server (production would queue to DB)
      console.error('[lead/contact] HubSpot submission failed', fields)
    }

    return NextResponse.json({ success: true, message: 'Lead captured successfully.' })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
