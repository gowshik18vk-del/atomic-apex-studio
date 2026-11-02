// app/api/runner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const runnerSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).default('GET'),
  url: z.string().url('Must be a valid URL'),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.any().optional(),
});

function isBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower === '127.0.0.1' || lower === '::1' || lower === '0.0.0.0') {
    return true;
  }
  // Check private and link-local IP ranges
  if (/^10\./.test(lower)) return true; // 10.0.0.0/8
  if (/^192\.168\./.test(lower)) return true; // 192.168.0.0/16
  if (/^169\.254\./.test(lower)) return true; // 169.254.0.0/16 (link local & cloud metadata)
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) return true; // 172.16.0.0/12
  if (lower.endsWith('.local') || lower.endsWith('.internal')) return true;

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { method, url, headers = {}, body } = runnerSchema.parse(json);

    const parsedUrl = new URL(url);

    // 1. Enforce http and https only
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Protocol forbidden. Only HTTP and HTTPS are permitted.' },
        { status: 400 }
      );
    }

    // 2. SSRF Protection: Block localhost, private, and metadata ranges
    if (isBlockedHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: `Destination forbidden: Access to private/internal network addresses (${parsedUrl.hostname}) is blocked.` },
        { status: 403 }
      );
    }

    // 3. 15-second execution timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const startTime = performance.now();

    let fetchBody: string | undefined = undefined;
    if (method !== 'GET' && body) {
      fetchBody = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, {
      method,
      headers: {
        'User-Agent': 'Atomic-Apex-API-Runner/1.0',
        ...headers,
      },
      body: fetchBody,
      signal: controller.signal,
      redirect: 'manual', // Do not automatically follow redirects into private networks
    });

    clearTimeout(timeout);
    const duration = Math.round(performance.now() - startTime);

    // 4. 1 MB response cap
    const arrayBuffer = await response.arrayBuffer();
    const maxBytes = 1024 * 1024; // 1MB
    const slicedBuffer = arrayBuffer.slice(0, maxBytes);
    const text = new TextDecoder().decode(slicedBuffer);

    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = text;
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => {
      responseHeaders[k] = v;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      durationMs: duration,
      headers: responseHeaders,
      data: parsedData,
      truncated: arrayBuffer.byteLength > maxBytes,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out after 15 seconds.' },
        { status: 504 }
      );
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues?.[0]?.message || 'Invalid parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Execution error' }, { status: 500 });
  }
}
