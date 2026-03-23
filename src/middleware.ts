import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// These must be set in your .env.local and Vercel dashboard!
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ennazaha2024'

export function middleware(req: NextRequest) {
  // We only want to protect the /admin pages and the /api/admin endpoints
  if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin')) {
    
    // Get the Authorization header sent by the browser
    const basicAuth = req.headers.get('authorization')
    
    // If there is an auth header, check if it matches our expected credentials
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1] || ''
      // decode base64
      const [user, pwd] = atob(authValue).split(':')

      // If they match, let them in!
      if (user === ADMIN_USER && pwd === ADMIN_PASS) {
        return NextResponse.next()
      }
    }

    // If they aren't logged in, or put the wrong password, reject them
    // The "WWW-Authenticate: Basic" header tells the browser to pop up a login window
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard Access"',
      },
    })
  }

  // All other public pages continue as normal
  return NextResponse.next()
}

// Config to specify exactly which paths should run this middleware
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
