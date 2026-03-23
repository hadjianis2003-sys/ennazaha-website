import { CMS_URL } from './config'

// Generic CMS fetcher — wraps fetch with Next.js cache options
export async function cmsFetch<T>(
  endpoint: string,
  options?: { cache?: RequestCache; next?: { revalidate?: number } }
): Promise<T> {
  const url = `${CMS_URL}/api/${endpoint}`
  const res = await fetch(url, {
    cache: options?.cache ?? 'no-store',
    next: options?.next,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`CMS fetch failed for ${endpoint}: ${res.status}`)
  }

  const json = await res.json()
  return json.data as T
}
