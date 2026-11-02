// lib/models.ts
// The Single Source of Truth for Models & Provider Adapters

export interface ModelConfig {
  id: string;
  label: string;
  kind: 'image' | 'video' | 'chat';
  provider: 'atomic-labs' | 'openai' | 'gemini' | 'replicate' | 'mock';
  providerModelId: string;
  creditCost: number;
  supportedAspectRatios: string[];
  supportedDurations?: string[];
  isDefault?: boolean;
  description: string;
  badge?: string;
}

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  'apex-vision': {
    id: 'apex-vision',
    label: 'Apex Vision',
    kind: 'image',
    provider: 'atomic-labs',
    providerModelId: 'apex-vision-v2.5-cinema',
    creditCost: 2,
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '21:9'],
    isDefault: true,
    description: 'Premier hyper-realistic image synthesis with unmatched skin texture, specular lighting & prompt fidelity.',
    badge: 'DEFAULT',
  },
  'swift-v1': {
    id: 'swift-v1',
    label: 'Swift V1',
    kind: 'video',
    provider: 'atomic-labs',
    providerModelId: 'swift-video-fast-v1',
    creditCost: 4,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    supportedDurations: ['5s'],
    isDefault: true,
    description: 'High-speed 4-second motion previews for social clips and kinetic action.',
    badge: 'FAST',
  },
  'studio-v1': {
    id: 'studio-v1',
    label: 'Studio V1',
    kind: 'video',
    provider: 'atomic-labs',
    providerModelId: 'studio-video-cinema-v1',
    creditCost: 8,
    supportedAspectRatios: ['16:9', '21:9', '9:16'],
    supportedDurations: ['5s', '10s'],
    description: 'Hollywood cinema-grade motion trajectories, volumetric haze, and temporal stability.',
    badge: 'CINEMA',
  },
  'range': {
    id: 'range',
    label: 'Range',
    kind: 'video',
    provider: 'atomic-labs',
    providerModelId: 'range-wide-landscape-v1',
    creditCost: 6,
    supportedAspectRatios: ['21:9', '16:9'],
    supportedDurations: ['5s', '10s'],
    description: 'Optimized for sweeping panoramic landscape vistas, vehicle chases, and anamorphic depth.',
    badge: 'ACTION',
  },
  'atomic-ai': {
    id: 'atomic-ai',
    label: 'Atomic AI',
    kind: 'chat',
    provider: 'gemini',
    providerModelId: 'gemini-2.0-flash',
    creditCost: 0,
    supportedAspectRatios: [],
    isDefault: true,
    description: 'Cinematic art director & prompt engineering co-pilot.',
    badge: 'CO-PILOT',
  },
};

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  duration?: string;
  fps?: number;
  quality?: string;
  cameraMotion?: string;
  sourceImage?: string;
}

export interface GenerationResult {
  jobId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  resultUrl?: string;
  thumbUrl?: string;
  error?: string;
}

export interface ProviderAdapter {
  generate(model: ModelConfig, params: GenerationParams): Promise<GenerationResult>;
  getStatus(jobId: string): Promise<GenerationResult>;
}

// In-Memory Async Job Store for Video Rendering
const jobStore = new Map<string, {
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  createdAt: number;
  durationMs: number;
  resultUrl: string;
  thumbUrl: string;
}>();

// Curated Video Assets for Production Visual Quality
const CURATED_VIDEO_RESULTS = [
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
];

const CURATED_IMAGE_RESULTS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=85',
];

// Mock & Fallback Adapter implementation
export class MockStudioAdapter implements ProviderAdapter {
  async generate(model: ModelConfig, params: GenerationParams): Promise<GenerationResult> {
    const jobId = 'job_' + Math.random().toString(36).substring(2, 10);

    if (model.kind === 'image') {
      // Synchronous return for image synthesis
      const pick = CURATED_IMAGE_RESULTS[Math.floor(Math.random() * CURATED_IMAGE_RESULTS.length)];
      return {
        jobId,
        status: 'succeeded',
        resultUrl: pick,
        thumbUrl: pick,
      };
    } else {
      // Video renders asynchronously
      const pick = CURATED_VIDEO_RESULTS[Math.floor(Math.random() * CURATED_VIDEO_RESULTS.length)];
      jobStore.set(jobId, {
        status: 'queued',
        createdAt: Date.now(),
        durationMs: 4000, // completes in ~4 seconds for fast user polling
        resultUrl: pick.video,
        thumbUrl: pick.poster,
      });

      return {
        jobId,
        status: 'queued',
      };
    }
  }

  async getStatus(jobId: string): Promise<GenerationResult> {
    const job = jobStore.get(jobId);
    if (!job) {
      return { jobId, status: 'failed', error: 'Job ID not found in queue' };
    }

    const elapsed = Date.now() - job.createdAt;
    if (elapsed < 1500) {
      return { jobId, status: 'queued' };
    } else if (elapsed < job.durationMs) {
      return { jobId, status: 'running' };
    } else {
      job.status = 'succeeded';
      return {
        jobId,
        status: 'succeeded',
        resultUrl: job.resultUrl,
        thumbUrl: job.thumbUrl,
      };
    }
  }
}

// Factory to resolve active adapter
export function getAdapter(model: ModelConfig): ProviderAdapter {
  const imageKey = process.env.IMAGE_PROVIDER_KEY;
  const videoKey = process.env.VIDEO_PROVIDER_KEY;

  if (model.kind === 'image' && imageKey) {
    // If external provider key is configured, live adapter can be plugged in
    return new MockStudioAdapter();
  }

  if (model.kind === 'video' && videoKey) {
    return new MockStudioAdapter();
  }

  return new MockStudioAdapter();
}
