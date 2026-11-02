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

  // Check cookies for Supabase or session token
  const hasSupabaseCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
  const hasApexSession = request.cookies.has('apex_session_token');

  const isAuthenticated = hasSupabaseCookie || hasApexSession;

  // If visiting protected route while signed out -> redirect to /login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If visiting login/signup while already authenticated -> redirect to /dashboard
  if ((pathname === '/login' || pathname === '/signup') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
  ],
};
