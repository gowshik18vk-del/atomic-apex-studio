'use client';

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Film,
  Zap,
  Sliders,
  SplitSquareVertical,
  Plus,
  ArrowRight,
  Maximize2,
  Eye,
  Bot,
  Wand2,
  Clock,
  History,
} from 'lucide-react';
import { MODEL_REGISTRY } from '@/lib/models';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export default function CreatorStudioPage() {
  const { setSelectedAsset, generations } = useGenerationStore();
  const { deductCredits, credits } = useCreditsStore();

  const [kind, setKind] = useState<'image' | 'video'>('image');
  const [modelA, setModelA] = useState('apex-vision');
  const [modelB, setModelB] = useState('studio-v1');
  const [sharedPrompt, setSharedPrompt] = useState(
    'Bioluminescent synthetic cyber muse in neon rainfall, cinematic lighting, 8k resolution'
  );
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<{
    resultA: string;
    resultB: string;
    modelAName: string;
    modelBName: string;
  } | null>({
    resultA: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    resultB: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    modelAName: 'Apex Vision',
    modelBName: 'Swift V1 (Motion)',
  });

  const handleRunComparison = async () => {
    if (!sharedPrompt.trim()) return;

    const totalCost = 4;
    if (credits < totalCost) {
      alert('Insufficient credits for comparison render.');
      return;
    }

    deductCredits(totalCost);
    setIsComparing(true);

    try {
      // Execute 2 calls in parallel
      const [resA, resB] = await Promise.all([
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'apex-vision', prompt: sharedPrompt }),
        }),
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'swift-v1', prompt: sharedPrompt }),
        }),
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      setComparisonResults({
        resultA: dataA.resultUrl || dataA.thumbUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        resultB: dataB.resultUrl || dataB.thumbUrl || 'https://vjs.zencdn.net/v/oceans.mp4',
        modelAName: 'Apex Vision',
        modelBName: 'Swift V1',
      });
      triggerConfetti();
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime/10 text-apex-lime">
              <Layers size={16} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Creator Studio
            </h1>
            <span className="rounded-full bg-apex-lime/15 px-2.5 py-0.5 text-[10px] font-bold text-apex-lime uppercase tracking-wider">
              Unified Multi-Model Workspace
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Compare model outputs side by side with a shared prompt, switch seamlessly between image and video pipelines, and view history.
          </p>
        </div>

        {/* Image / Video Kind Switcher */}
        <div className="flex items-center bg-studio-900 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setKind('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              kind === 'image'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            Image Mode
          </button>
          <button
            onClick={() => setKind('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              kind === 'video'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film size={13} />
            Video Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Workspace (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Shared Prompt Bar */}
          <div className="p-5 rounded-2xl bg-studio-900/90 border border-white/10 space-y-3 shadow-glass-card">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bot size={14} className="text-apex-cyan" /> Shared Master Prompt
              </label>
              <span className="text-[11px] font-mono text-zinc-400">
                Parallel Multi-Model Comparison
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={sharedPrompt}
                onChange={(e) => setSharedPrompt(e.target.value)}
                placeholder="Enter scene prompt to benchmark side-by-side..."
                className="flex-1 rounded-xl border border-white/10 bg-studio-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-apex-lime/60 focus:outline-none"
              />
              <button
                onClick={handleRunComparison}
                disabled={isComparing}
                className="glow-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Zap size={14} className="fill-current" />
                {isComparing ? 'Rendering...' : 'Compare Side-by-Side (4 cr)'}
              </button>
            </div>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Model A Box */}
            <div className="rounded-2xl border border-apex-lime/30 bg-studio-900 overflow-hidden shadow-glass-card">
              <div className="p-3 bg-studio-950/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-apex-lime" />
                  <span className="text-xs font-bold text-white">Model A: Apex Vision</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Image Synthesis • 8K</span>
              </div>
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {comparisonResults ? (
                  <img
                    src={comparisonResults.resultA}
                    alt="Model A Result"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-zinc-600 text-xs">Waiting for render...</div>
                )}
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                  Specular Micro-Textures
                </div>
              </div>
            </div>

            {/* Model B Box */}
            <div className="rounded-2xl border border-apex-cyan/30 bg-studio-900 overflow-hidden shadow-glass-card">
              <div className="p-3 bg-studio-950/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-apex-cyan" />
                  <span className="text-xs font-bold text-white">Model B: Swift V1 / Studio</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Motion Physics • 30fps</span>
              </div>
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {comparisonResults ? (
                  <img
                    src={comparisonResults.resultB}
                    alt="Model B Result"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-zinc-600 text-xs">Waiting for render...</div>
                )}
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                  Optical Flow Vectors
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: History Rail (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-studio-900/60 shadow-glass-card space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <History size={14} className="text-apex-lime" /> Generation History Rail
            </h3>
            <p className="text-[11px] text-zinc-400">
              Recent generations across your unified studio session.
            </p>

            <div className="space-y-2 pt-2 max-h-[500px] overflow-y-auto">
              {generations.slice(0, 6).map((gen) => (
                <div
                  key={gen.id}
                  onClick={() => setSelectedAsset(gen)}
                  className="group flex items-center gap-2.5 p-2 rounded-xl bg-studio-950 hover:bg-white/5 border border-white/5 transition-all cursor-pointer"
                >
                  <div className="h-12 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-black border border-white/10">
                    <img
                      src={gen.thumbnailUrl || gen.outputUrl}
                      alt={gen.prompt}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-apex-lime font-bold block">
                      {gen.model}
                    </span>
                    <p className="text-[11px] text-zinc-300 truncate">
                      {gen.prompt}
                    </p>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {formatDate(gen.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
