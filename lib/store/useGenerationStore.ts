// lib/store/useGenerationStore.ts
import { create } from 'zustand';
import { Generation, MediaType } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { useAuthStore } from './useAuthStore';

const INITIAL_GENERATIONS: Generation[] = [
  {
    id: 'gen-seed-1',
    userId: 'a0000000-0000-0000-0000-000000000001',
    type: 'video',
    model: 'Studio V1',
    prompt: 'Cinematic drone tracking shot of an obsidian cyberpunk monolith in neon rain, volumetric lighting, photorealistic 8k octane render',
    negativePrompt: 'blurry, low quality, jitter, distortion',
    parameters: { camera: 'Drone Orbit 360', fps: 30, motion: 8, seed: 42918 },
    status: 'completed',
    outputUrl: 'https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4',
    thumbnailUrl: 'https://static-public-media.higgsfield.ai/cards/e00fa340-fd99-47d6-ae8f-9bdd20f9393e.webp',
    aspectRatio: '16:9',
    duration: '5s',
    creditsCost: 5,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'gen-seed-2',
    userId: 'a0000000-0000-0000-0000-000000000001',
    type: 'video',
    model: 'Swift V1',
    prompt: 'High-fashion streetwear model walking in Tokyo night street, anamorphic lens flare, cinematic slow motion',
    parameters: { camera: 'Tracking Dolly', fps: 24, motion: 7, seed: 18492 },
    status: 'completed',
    outputUrl: 'https://static-public-media.higgsfield.ai/cards/d6b970cb-8a24-41e6-8c83-023fd2ab585b.mp4',
    thumbnailUrl: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/streetwear.webp',
    aspectRatio: '9:16',
    duration: '5s',
    creditsCost: 5,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'gen-seed-3',
    userId: 'a0000000-0000-0000-0000-000000000001',
    type: 'image',
    model: 'Apex Vision (Default)',
    prompt: 'Hyper-detailed portrait of a synthetic cybernetic muse, glowing emerald eyes, intricate bioluminescent filigree, Hasselblad 100mm f/1.4',
    negativePrompt: 'ugly, deformed, bad anatomy, text, cartoon',
    parameters: { guidance: 7.5, steps: 35, sampler: 'DPM++ 2M Karras' },
    status: 'completed',
    outputUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    creditsCost: 2,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'gen-seed-4',
    userId: 'a0000000-0000-0000-0000-000000000001',
    type: 'image',
    model: 'Apex Vision (Default)',
    prompt: 'Futuristic luxury architectural pavilion perched above misty Nordic fjords at twilight, architectural digest, warm interior glow',
    parameters: { guidance: 8.0, steps: 40 },
    status: 'completed',
    outputUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    creditsCost: 2,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

interface GenerationState {
  generations: Generation[];
  isGenerating: boolean;
  progress: number;
  currentStage: string;
  selectedAsset: Generation | null;
  referenceImageForVideo: string | null;
  setIsGenerating: (loading: boolean, stage?: string, progress?: number) => void;
  setProgress: (progress: number, stage?: string) => void;
  setSelectedAsset: (asset: Generation | null) => void;
  setReferenceImageForVideo: (imageUrl: string | null) => void;
  addGeneration: (item: Generation) => void;
  toggleFavorite: (id: string) => void;
  deleteGeneration: (id: string) => void;
  initialize: () => Promise<void>;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  generations: INITIAL_GENERATIONS,
  isGenerating: false,
  progress: 0,
  currentStage: '',
  selectedAsset: null,
  referenceImageForVideo: null,

  setIsGenerating: (loading: boolean, stage = '', progress = 0) => {
    set({ isGenerating: loading, currentStage: stage, progress });
  },

  setProgress: (progress: number, stage?: string) => {
    set((state) => ({
      progress,
      currentStage: stage !== undefined ? stage : state.currentStage,
    }));
  },

  setSelectedAsset: (asset: Generation | null) => {
    set({ selectedAsset: asset });
  },

  setReferenceImageForVideo: (imageUrl: string | null) => {
    set({ referenceImageForVideo: imageUrl });
  },

  addGeneration: (item: Generation) => {
    set((state) => {
      const updated = [item, ...state.generations];
      if (typeof window !== 'undefined') {
        localStorage.setItem('apex_generations', JSON.stringify(updated));
      }
      return { generations: updated };
    });

    // Sync to Supabase
    const user = useAuthStore.getState().user;
    if (user && isSupabaseConfigured && supabase) {
      supabase.from('generations').insert({
        id: item.id,
        user_id: user.id,
        type: item.type,
        model: item.model,
        prompt: item.prompt,
        negative_prompt: item.negativePrompt,
        parameters: item.parameters,
        status: item.status,
        output_url: item.outputUrl,
        thumbnail_url: item.thumbnailUrl,
        aspect_ratio: item.aspectRatio,
        duration: item.duration,
        credits_cost: item.creditsCost,
        is_favorite: item.isFavorite,
      }).then(() => {});
    }
  },

  toggleFavorite: (id: string) => {
    set((state) => {
      const updated = state.generations.map((gen) =>
        gen.id === id ? { ...gen, isFavorite: !gen.isFavorite } : gen
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('apex_generations', JSON.stringify(updated));
      }
      return { generations: updated };
    });

    const target = get().generations.find((g) => g.id === id);
    if (target && isSupabaseConfigured && supabase) {
      supabase
        .from('generations')
        .update({ is_favorite: target.isFavorite })
        .eq('id', id)
        .then(() => {});
    }
  },

  deleteGeneration: (id: string) => {
    set((state) => {
      const updated = state.generations.filter((gen) => gen.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apex_generations', JSON.stringify(updated));
      }
      return { generations: updated, selectedAsset: null };
    });

    if (isSupabaseConfigured && supabase) {
      supabase.from('generations').delete().eq('id', id).then(() => {});
    }
  },

  initialize: async () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('apex_generations');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ generations: parsed });
            return;
          }
        } catch (e) {}
      }
    }

    // Try fetching from Supabase
    const user = useAuthStore.getState().user;
    if (user && isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const mapped: Generation[] = data.map((d) => ({
          id: d.id,
          userId: d.user_id,
          type: d.type,
          model: d.model,
          prompt: d.prompt,
          negativePrompt: d.negative_prompt,
          parameters: d.parameters || {},
          status: d.status,
          outputUrl: d.output_url,
          thumbnailUrl: d.thumbnail_url,
          aspectRatio: d.aspect_ratio,
          duration: d.duration,
          creditsCost: d.credits_cost,
          isFavorite: d.is_favorite,
          createdAt: d.created_at,
        }));
        set({ generations: mapped });
        if (typeof window !== 'undefined') {
          localStorage.setItem('apex_generations', JSON.stringify(mapped));
        }
      }
    }
  },
}));
