import { NextResponse } from 'next/server'

function isAuthed(request) {
  const session = request.cookies.get('admin_session')
  return session?.value === process.env.ADMIN_SECRET
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const method = request.method

  // ── Admin UI pages ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next()
    if (!isAuthed(request)) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // ── Admin-only API write operations ─────────────────────────────────────────
  const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

  if (isWriteMethod) {
    const needsAuth =
      pathname.startsWith('/api/products') ||
      pathname.startsWith('/api/categories') ||
      pathname.startsWith('/api/reviews/') ||
      pathname === '/api/upload'

    if (needsAuth && !isAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/products',
    '/api/products/:path*',
    '/api/categories',
    '/api/categories/:path*',
    '/api/reviews/:path*',
    '/api/upload',
  ],
}
