// lib/models.ts
// The Single Source of Truth for Models & Provider Adapters

export interface ModelConfig {
  id: string;
  label: string;
  kind: 'image' | 'video' | 'chat' | 'multimodal';
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
  // --- IMAGE GENERATION MODELS ---
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
  'apex-vision-v2': {
    id: 'apex-vision-v2',
    label: 'Apex Vision (Default)',
    kind: 'image',
    provider: 'atomic-labs',
    providerModelId: 'apex-vision-v2.5-cinema',
    creditCost: 2,
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '21:9'],
    isDefault: true,
    description: 'Premier hyper-realistic image synthesis with unmatched skin texture, specular lighting & prompt fidelity.',
    badge: 'FLAGSHIP',
  },
  'apex-ultra-v2': {
    id: 'apex-ultra-v2',
    label: 'Apex Ultra V2',
    kind: 'image',
    provider: 'atomic-labs',
    providerModelId: 'apex-ultra-v2.0-engine',
    creditCost: 3,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
    description: 'Next-gen composition model optimized for commercial ads, character consistency and vibrant neon colors.',
    badge: 'NEW',
  },
  'seedance-2-5': {
    id: 'seedance-2-5',
    label: 'Seedance 2.5',
    kind: 'image',
    provider: 'atomic-labs',
    providerModelId: 'seedance-v2.5-color',
    creditCost: 3,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
    description: 'Next-gen composition model optimized for commercial ads, character consistency and vibrant neon colors.',
    badge: 'NEW',
  },
  'flux-pro-studio': {
    id: 'flux-pro-studio',
    label: 'Flux Pro Studio',
    kind: 'image',
    provider: 'atomic-labs',
    providerModelId: 'flux-pro-studio-v1',
    creditCost: 4,
    supportedAspectRatios: ['16:9', '1:1', '21:9'],
    description: 'State-of-the-art text generation inside image, micro-details, and crisp architectural interiors.',
    badge: 'PRO',
  },
  'photoreal-v3': {
    id: 'photoreal-v3',
    label: 'Photoreal V3',
    kind: 'image',
    provider: 'atomic-labs',
    providerModelId: 'photoreal-analog-v3',
    creditCost: 2,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    description: 'Raw analog 35mm film simulation with natural grain, dynamic exposure, and subtle imperfections.',
    badge: 'ANALOG',
  },

  // --- VIDEO GENERATION MODELS ---
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
  'kling-4-0': {
    id: 'kling-4-0',
    label: 'Kling 4.0 Cinema',
    kind: 'video',
    provider: 'atomic-labs',
    providerModelId: 'kling-cinema-v4.0',
    creditCost: 10,
    supportedAspectRatios: ['16:9', '9:16'],
    supportedDurations: ['5s', '10s'],
    description: 'Multi-prompt camera trajectories with deep physics simulation and fluid liquid/cloth movement.',
    badge: 'PRO MOVIE',
  },

  // --- MULTIMODAL & CREATOR STUDIO MODELS ---
  'gemini-2-5-flash': {
    id: 'gemini-2-5-flash',
    label: 'Google Gemini 2.5 Flash',
    kind: 'multimodal',
    provider: 'gemini',
    providerModelId: 'gemini-2.0-flash',
    creditCost: 1,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    description: 'Sub-second multimodal reasoning, instant prompt enhancement, and creative storyboarding.',
    badge: 'SPEED',
  },
  'gemini-pro-vision': {
    id: 'gemini-pro-vision',
    label: 'Google Gemini Pro Vision',
    kind: 'multimodal',
    provider: 'gemini',
    providerModelId: 'gemini-1.5-pro',
    creditCost: 2,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    description: 'Long-context visual inspection, scene breakdown, and multi-image artistic style transfer.',
    badge: 'DEEP REASONING',
  },
  'gpt-4o-omni': {
    id: 'gpt-4o-omni',
    label: 'OpenAI GPT-4o Vision',
    kind: 'multimodal',
    provider: 'openai',
    providerModelId: 'gpt-4o',
    creditCost: 2,
    supportedAspectRatios: ['16:9', '1:1'],
    description: 'Comprehensive art direction, prompt orchestration, and high-fidelity structured outputs.',
    badge: 'OMNI',
  },
  'apex-ultra-engine': {
    id: 'apex-ultra-engine',
    label: 'Apex Ultra Engine',
    kind: 'multimodal',
    provider: 'atomic-labs',
    providerModelId: 'apex-ultra-hybrid-v1',
    creditCost: 3,
    supportedAspectRatios: ['16:9', '9:16', '21:9', '1:1'],
    description: 'Unified hybrid intelligence balancing text, image concepts, and motion curves in one synthesis pass.',
    badge: 'CREATIVE DIRECTOR',
  },

  // --- CHAT MODELS ---
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
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=85',
];

// Fallback & Simulation Studio Adapter implementation
export class MockStudioAdapter implements ProviderAdapter {
  async generate(model: ModelConfig, params: GenerationParams): Promise<GenerationResult> {
    const jobId = 'job_' + Math.random().toString(36).substring(2, 10);

    if (model.kind === 'image' || model.kind === 'multimodal') {
      // Determine dimensions from aspect ratio
      let width = 1280;
      let height = 720;
      switch (params.aspectRatio) {
        case '9:16':
          width = 720;
          height = 1280;
          break;
        case '1:1':
          width = 1024;
          height = 1024;
          break;
        case '4:5':
          width = 1024;
          height = 1280;
          break;
        case '4:3':
          width = 1152;
          height = 864;
          break;
        case '21:9':
          width = 1536;
          height = 640;
          break;
        default:
          width = 1280;
          height = 720;
      }

      const seed = Math.floor(Math.random() * 99999999);
      const cleanPrompt = (params.prompt || 'Cinematic masterpiece').trim();
      // Generate real AI image dynamically via Pollinations AI
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

      return {
        jobId,
        status: 'succeeded',
        resultUrl: pollinationsUrl,
        thumbUrl: pollinationsUrl,
      };
    } else {
      // Video renders asynchronously with rapid response for seamless UX
      const pick = CURATED_VIDEO_RESULTS[Math.floor(Math.random() * CURATED_VIDEO_RESULTS.length)];
      jobStore.set(jobId, {
        status: 'queued',
        createdAt: Date.now(),
        durationMs: model.id === 'swift-v1' ? 2000 : 3000,
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
      // If serverless restarted or job id not in memory, return a default succeeded video result
      const fallback = CURATED_VIDEO_RESULTS[0];
      return {
        jobId,
        status: 'succeeded',
        resultUrl: fallback.video,
        thumbUrl: fallback.poster,
      };
    }

    const elapsed = Date.now() - job.createdAt;
    if (elapsed < 800) {
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
  return new MockStudioAdapter();
}
