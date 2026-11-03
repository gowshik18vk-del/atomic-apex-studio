// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { ATOMIC_LINKS } from '@/lib/constants/links';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get('next') || ATOMIC_LINKS.creatorStudio;
  return NextResponse.redirect(next);
}
