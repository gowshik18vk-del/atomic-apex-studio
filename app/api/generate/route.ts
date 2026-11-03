// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MODEL_REGISTRY, getAdapter } from '@/lib/models';

const generateSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  prompt: z.string().min(2, 'Prompt must be at least 2 characters').max(2000),
  negativePrompt: z.string().max(1000).optional(),
  aspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '21:9', '4:5']).default('16:9'),
  duration: z.enum(['5s', '10s']).optional(),
  fps: z.number().int().min(24).max(60).optional(),
  cameraMotion: z.string().optional(),
  sourceImage: z.string().url().optional().or(z.literal('')),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = generateSchema.parse(json);

    const modelConfig = MODEL_REGISTRY[validated.model];
    if (!modelConfig) {
      return NextResponse.json(
        { error: `Unknown model '${validated.model}'. Valid models: ${Object.keys(MODEL_REGISTRY).join(', ')}` },
        { status: 400 }
      );
    }

    const generationId = 'gen_' + Math.random().toString(36).substring(2, 12);
    const userId = validated.userId || 'a0000000-0000-0000-0000-000000000001';

    // Call Model Provider Adapter
    const adapter = getAdapter(modelConfig);
    const genResult = await adapter.generate(modelConfig, {
      prompt: validated.prompt,
      negativePrompt: validated.negativePrompt,
      aspectRatio: validated.aspectRatio,
      duration: validated.duration,
      fps: validated.fps,
      cameraMotion: validated.cameraMotion,
      sourceImage: validated.sourceImage || undefined,
    });

    // Return result immediately
    return NextResponse.json({
      id: generationId,
      jobId: genResult.jobId,
      kind: modelConfig.kind,
      model: modelConfig.label,
      status: genResult.status,
      cost: modelConfig.creditCost,
      resultUrl: genResult.resultUrl,
      thumbUrl: genResult.thumbUrl,
      aspectRatio: validated.aspectRatio,
      duration: validated.duration,
      prompt: validated.prompt,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues?.[0]?.message || 'Validation failed' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
