import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Match all paths except static files, api routes, and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Extract subdomain (remove port if present)
  const currentHost = hostname.split(':')[0];

  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';

  // Check if this is the admin subdomain
  const isAdminSubdomain = currentHost.startsWith('admin.') ||
    currentHost === 'admin.localhost' ||
    hostname.startsWith('admin.');

  // Handle admin subdomain (production)
  if (isAdminSubdomain) {
    // Already on admin route, let it pass
    if (url.pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    // Rewrite to admin routes
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // In development, allow direct access to /admin routes
  // In production, block direct access (must use subdomain)
  if (url.pathname.startsWith('/admin')) {
    if (isDev) {
      // Allow direct access in development
      return NextResponse.next();
    } else {
      // Block in production - redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
