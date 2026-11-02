// app/api/generate/image/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CURATED_IMAGE_POOLS: Record<string, string[]> = {
  cyberpunk: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85',
  ],
  portrait: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&auto=format&fit=crop&q=85',
  ],
  architecture: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=85',
  ],
  scifi: [
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=85',
  ],
  automotive: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1600&auto=format&fit=crop&q=85',
  ],
  nature: [
    'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85',
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt = 'Cinematic composition',
      model = 'apex-vision-v2',
      negative_prompt = '',
      aspect_ratio = '16:9',
      style = 'cinematic',
    } = body;

    if (!prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Determine category based on prompt keywords
    const lower = prompt.toLowerCase();
    let category = 'cyberpunk';
    if (lower.includes('portrait') || lower.includes('face') || lower.includes('woman') || lower.includes('man') || lower.includes('model')) {
      category = 'portrait';
    } else if (lower.includes('building') || lower.includes('house') || lower.includes('interior') || lower.includes('architecture') || lower.includes('room')) {
      category = 'architecture';
    } else if (lower.includes('space') || lower.includes('galaxy') || lower.includes('star') || lower.includes('alien') || lower.includes('nebula')) {
      category = 'scifi';
    } else if (lower.includes('car') || lower.includes('vehicle') || lower.includes('racing') || lower.includes('speed')) {
      category = 'automotive';
    } else if (lower.includes('mountain') || lower.includes('forest') || lower.includes('ocean') || lower.includes('sunset')) {
      category = 'nature';
    }

    const pool = CURATED_IMAGE_POOLS[category] || CURATED_IMAGE_POOLS.cyberpunk;
    const selectedUrl = pool[Math.floor(Math.random() * pool.length)];

    const id = 'gen-img-' + Date.now();
    const result = {
      id,
      type: 'image',
      model,
      prompt,
      negative_prompt,
      output_url: selectedUrl,
      thumbnail_url: selectedUrl,
      aspect_ratio,
      style,
      credits_cost: 2,
      created_at: new Date().toISOString(),
      status: 'completed',
      parameters: {
        guidance_scale: 7.5,
        steps: 32,
        seed: Math.floor(Math.random() * 99999999),
        sampler: 'Euler a / DPM++ 2M Karras',
      },
    };

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
