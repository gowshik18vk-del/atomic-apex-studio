// app/api/models/route.ts
import { NextResponse } from 'next/server';
import { IMAGE_MODELS, VIDEO_MODELS, MULTI_MODELS } from '@/lib/constants/models';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    models: {
      image: IMAGE_MODELS,
      video: VIDEO_MODELS,
      multimodal: MULTI_MODELS,
    },
    meta: {
      studioName: 'Atomic Apex Studio',
      version: '2.5.0-cinema',
      engine: 'Atomic Neural Orchestrator',
    },
  });
}
