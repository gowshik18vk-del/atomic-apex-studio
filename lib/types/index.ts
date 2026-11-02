// lib/types/index.ts

export type MediaType = 'image' | 'video';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  credits: number;
  role: 'creator' | 'pro' | 'admin';
  createdAt: string;
}

export interface Generation {
  id: string;
  userId: string;
  type: MediaType;
  model: string;
  prompt: string;
  negativePrompt?: string;
  parameters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputUrl: string;
  thumbnailUrl?: string;
  aspectRatio: string;
  duration?: string;
  creditsCost: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  badge?: string;
  description: string;
  type: MediaType | 'multimodal' | 'chat';
  creditsCost: number;
  aspectRatios: string[];
  maxDuration?: string;
  cameraMotions?: string[];
  recommended?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
}

export interface ApiRunnerPreset {
  name: string;
  method: 'GET' | 'POST';
  endpoint: string;
  description: string;
  headers: Record<string, string>;
  body: Record<string, any>;
}

export interface ApiRunnerResult {
  status: number;
  statusText: string;
  timeMs: number;
  headers: Record<string, string>;
  data: any;
}
