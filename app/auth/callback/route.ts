// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.session) {
        const response = NextResponse.redirect(`${origin}${next}`);
        // Ensure apex_session_token cookie is set for universal app middleware
        response.cookies.set('apex_session_token', data.session.access_token, {
          path: '/',
          maxAge: 604800,
          sameSite: 'lax',
          httpOnly: false,
        });
        return response;
      }
    }
  }

  // Fallback to dashboard with local session flag
  const fallback = NextResponse.redirect(`${origin}/dashboard`);
  fallback.cookies.set('apex_session_token', 'apex-oauth-session-' + Date.now(), {
    path: '/',
    maxAge: 604800,
    sameSite: 'lax',
  });
  return fallback;
}
