// app/api/generations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MODEL_REGISTRY, getAdapter } from '@/lib/models';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const jobId = searchParams.get('jobId') || id;
    const modelKey = searchParams.get('model') || 'swift-v1';

    const modelConfig = MODEL_REGISTRY[modelKey] || MODEL_REGISTRY['swift-v1'];
    const adapter = getAdapter(modelConfig);

    const statusResult = await adapter.getStatus(jobId);

    // If job failed, execute atomic server-side credit refund
    if (statusResult.status === 'failed' && isSupabaseConfigured && supabase) {
      await supabase.rpc('refund_credits', {
        p_user_id: 'a0000000-0000-0000-0000-000000000001',
        p_amount: modelConfig.creditCost,
        p_generation_id: id,
        p_reason: 'Job failed during render pipeline',
      });

      await supabase
        .from('generations')
        .update({ status: 'failed', error: statusResult.error || 'Render failure' })
        .eq('id', id);
    }

    // If succeeded, update status in DB
    if (statusResult.status === 'succeeded' && isSupabaseConfigured && supabase) {
      await supabase
        .from('generations')
        .update({
          status: 'succeeded',
          result_path: statusResult.resultUrl,
          thumb_path: statusResult.thumbUrl,
          finished_at: new Date().toISOString(),
        })
        .eq('id', id);
    }

    return NextResponse.json({
      id,
      jobId,
      status: statusResult.status,
      resultUrl: statusResult.resultUrl,
      thumbUrl: statusResult.thumbUrl,
      error: statusResult.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Status check failed' }, { status: 500 });
  }
}
