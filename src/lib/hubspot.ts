export async function submitToHubspot(formId: string, fields: Record<string, string>): Promise<boolean> {
  const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID ?? ''
  if (!PORTAL_ID || !formId) return false

  const body = {
    fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
    context: { pageUri: process.env.NEXT_PUBLIC_APP_URL ?? '' },
  }

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${formId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
    return res.ok
  } catch {
    return false
  }
}
