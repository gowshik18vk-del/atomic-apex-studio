// app/api/generations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MODEL_REGISTRY, getAdapter } from '@/lib/models';

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

    return NextResponse.json({
      id,
      jobId,
      status: statusResult.status,
      resultUrl: statusResult.resultUrl,
      thumbUrl: statusResult.thumbUrl,
      error: statusResult.error,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Status check failed' },
      { status: 500 }
    );
  }
}
