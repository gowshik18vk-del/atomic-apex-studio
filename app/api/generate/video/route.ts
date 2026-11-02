// app/api/generate/video/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CURATED_VIDEOS = [
  {
    video: 'https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4',
    poster: 'https://static-public-media.higgsfield.ai/cards/e00fa340-fd99-47d6-ae8f-9bdd20f9393e.webp',
  },
  {
    video: 'https://static-public-media.higgsfield.ai/cards/d6b970cb-8a24-41e6-8c83-023fd2ab585b.mp4',
    poster: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/streetwear.webp',
  },
  {
    video: 'https://static-public-media.higgsfield.ai/cards/4c2bb5a7-ba39-464d-be1d-01de1c52dcaf.mp4',
    poster: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/perfume.webp',
  },
  {
    video: 'https://static-public-media.higgsfield.ai/cards/8dddb16b-6fe1-4cac-a11a-a650691a292d.mp4',
    poster: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/football.webp',
  },
  {
    video: 'https://static-public-media.higgsfield.ai/cards/0019ff9b-e94d-4eec-893c-7ae8c953dc74.mp4',
    poster: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/landscape.webp',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt = 'Cinematic motion scene',
      model = 'swift-v1',
      camera_motion = 'Drone Orbit 360',
      duration = '5s',
      fps = 30,
      aspect_ratio = '16:9',
      motion_intensity = 7,
    } = body;

    if (!prompt.trim()) {
      return NextResponse.json({ error: 'Video prompt is required' }, { status: 400 });
    }

    const randomPick = CURATED_VIDEOS[Math.floor(Math.random() * CURATED_VIDEOS.length)];
    const id = 'gen-vid-' + Date.now();

    const result = {
      id,
      type: 'video',
      model,
      prompt,
      output_url: randomPick.video,
      thumbnail_url: randomPick.poster,
      aspect_ratio,
      duration,
      credits_cost: 5,
      created_at: new Date().toISOString(),
      status: 'completed',
      parameters: {
        camera_motion,
        fps,
        motion_intensity,
        seed: Math.floor(Math.random() * 99999999),
        temporal_coherence: 0.94,
      },
    };

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Video generation failed' }, { status: 500 });
  }
}
