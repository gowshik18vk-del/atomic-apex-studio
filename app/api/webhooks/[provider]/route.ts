// app/api/webhooks/[provider]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const authHeader = req.headers.get('authorization') || req.headers.get('x-webhook-secret');
    const expectedSecret = process.env.WEBHOOK_SECRET || 'local-dev-webhook-secret-999';

    if (authHeader !== `Bearer ${expectedSecret}` && authHeader !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook signature' }, { status: 401 });
    }

    const payload = await req.json();
    const { generation_id, status, result_url, error } = payload;

    if (!generation_id || !status) {
      return NextResponse.json({ error: 'Missing generation_id or status' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      if (status === 'succeeded') {
        await supabase
          .from('generations')
          .update({
            status: 'succeeded',
            result_path: result_url,
            finished_at: new Date().toISOString(),
          })
          .eq('id', generation_id);
      } else if (status === 'failed') {
        await supabase
          .from('generations')
          .update({
            status: 'failed',
            error: error || 'Provider render failure',
            finished_at: new Date().toISOString(),
          })
          .eq('id', generation_id);
      }
    }

    return NextResponse.json({ received: true, provider, generation_id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
