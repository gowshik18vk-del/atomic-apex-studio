// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/create/image',
  '/create/video',
  '/studio',
  '/chat',
  '/assets',
  '/history',
  '/settings',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If explicitly logging out via query parameter, clear cookie and proceed to /login
  if (pathname === '/login' && (request.nextUrl.searchParams.has('logout') || request.nextUrl.searchParams.has('reset'))) {
    const response = NextResponse.next();
    response.cookies.delete('apex_session_token');
    return response;
  }

  // Check if current route is protected
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check cookies for session token
  const hasApexSession = request.cookies.has('apex_session_token');

  // If visiting protected route while signed out -> redirect to /login
  if (isProtected && !hasApexSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If visiting login/signup/forgot-password while already authenticated -> redirect to /dashboard
  if ((pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') && hasApexSession) {
    return NextResponse.redirect(new URL('https://atomic-apex-creator-studio.lovable.app'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create/:path*',
    '/studio/:path*',
    '/chat/:path*',
    '/assets/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
};
