'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Zap,
  Wand2,
  Trash2,
  Sliders,
  Maximize2,
  Download,
  Film,
  Heart,
  Copy,
  Check,
  ChevronDown,
  Layers,
  ArrowRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { MODEL_REGISTRY } from '@/lib/models';
import { ASPECT_RATIOS, STYLE_PRESETS } from '@/lib/constants/models';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';
import { Generation } from '@/lib/types';

const INSPIRATIONAL_PROMPTS = [
  'Hyper-detailed portrait of a synthetic cybernetic muse, glowing emerald eyes, intricate bioluminescent filigree, Hasselblad 100mm f/1.4, cinematic split lighting',
  'Futuristic luxury architectural pavilion perched above misty Nordic fjords at twilight, floor-to-ceiling glass, warm interior glow, architectural digest 8k',
  'Deep space explorer in obsidian gold suit overlooking an iridescent planetary ring system, cinematic anamorphic lens flares, 35mm film',
  'High-fashion streetwear model in reflective neon trenchcoat walking in Tokyo midnight rain, puddles reflecting magenta signs, sharp photography',
  'Close up of an ancient emerald mechanical scarab engraved with glowing runes, macro lens, polished brass, shallow depth of field, octane render',
];

export default function CreateImagePage() {
  const router = useRouter();
  const { addGeneration, setSelectedAsset, setReferenceImageForVideo, generations } =
    useGenerationStore();
  const { deductCredits, credits } = useCreditsStore();

  const apexModel = MODEL_REGISTRY['apex-vision'];
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [quality, setQuality] = useState<'Standard' | 'High'>('High');
  const [guidance, setGuidance] = useState(7.5);
  const [steps, setSteps] = useState(32);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [latestResult, setLatestResult] = useState<Generation | null>(null);
  const [copied, setCopied] = useState(false);

  const imageGenerations = generations.filter((g) => g.type === 'image');

  const handleRandomPrompt = () => {
    const pick = INSPIRATIONAL_PROMPTS[Math.floor(Math.random() * INSPIRATIONAL_PROMPTS.length)];
    setPrompt(pick);
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      handleRandomPrompt();
      return;
    }
    const enhanced = `${prompt.trim()}, masterpiece quality, volumetric lighting, photorealistic textures, 8k uhd, cinematic color grade by Roger Deakins`;
    setPrompt(enhanced);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      handleRandomPrompt();
      return;
    }

    if (credits < apexModel.creditCost) {
      alert('Insufficient credits! You can claim +50 free credits from the sidebar or settings.');
      return;
    }

    // Deduct credits server-side / client store
    const deducted = deductCredits(apexModel.creditCost);
    if (!deducted) return;

    setIsGenerating(true);
    setProgress(15);
    setStage('Analyzing prompt vectors & negative anchors...');

    const timer1 = setTimeout(() => {
      setProgress(45);
      setStage('Denoising neural latents with Apex Vision engine...');
    }, 800);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStage('Refining micro-textures, specular highlights & film grain...');
    }, 1600);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'apex-vision',
          prompt,
          negativePrompt: showNegative ? negativePrompt : undefined,
          aspectRatio,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Generation failed');
      }

      const data = await response.json();
      setProgress(100);
      setStage('Final rendering complete!');

      const newGen: Generation = {
        id: data.id || 'gen-' + Date.now(),
        userId: 'a0000000-0000-0000-0000-000000000001',
        type: 'image',
        model: 'Apex Vision',
        prompt,
        negativePrompt: showNegative ? negativePrompt : undefined,
        parameters: { guidance, steps, quality, style: selectedStyle },
        status: 'completed',
        outputUrl: data.resultUrl || data.thumbUrl,
        thumbnailUrl: data.thumbUrl || data.resultUrl,
        aspectRatio,
        creditsCost: apexModel.creditCost,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };

      setTimeout(() => {
        setIsGenerating(false);
        setLatestResult(newGen);
        addGeneration(newGen);
        triggerConfetti();
      }, 400);
    } catch (err: any) {
      setIsGenerating(false);
      alert(err.message || 'Generation encountered an issue.');
    }
  };

  const handleAnimate = (imgUrl: string) => {
    setReferenceImageForVideo(imgUrl);
    router.push('/create/video');
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime/10 text-apex-lime">
              <Sparkles size={16} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Create Image
            </h1>
            <span className="rounded-full bg-apex-lime/15 px-2.5 py-0.5 text-[10px] font-bold text-apex-lime uppercase tracking-wider">
              Apex Vision Default
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Generate photorealistic cinematic imagery with native aspect ratio controls and instant video animation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-studio-900 px-3 py-1.5 rounded-xl border border-white/5">
          <span>Cost: <strong className="text-apex-lime">⚡ {apexModel.creditCost} credits</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prompting & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Model Card */}
          <div className="p-4 rounded-2xl border border-apex-lime/30 bg-apex-lime/5 space-y-2 shadow-glow-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-apex-lime animate-pulse" />
                <h3 className="text-xs font-bold text-white">Apex Vision (Native Flagship)</h3>
              </div>
              <span className="rounded bg-apex-lime text-black px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase">
                ACTIVE MODEL
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {apexModel.description}
            </p>
            <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500 font-mono">
              <span>Atomic Labs Neural Synthesis</span>
              <span className="text-apex-lime font-bold">⚡ {apexModel.creditCost} credits per generation</span>
            </div>
          </div>

          {/* Prompt Box */}
          <div className="rounded-2xl border border-white/10 bg-studio-900/80 p-4 space-y-3 shadow-glass-card">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Creative Prompt
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRandomPrompt}
                  type="button"
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                  <Wand2 size={12} className="text-apex-cyan" />
                  Inspire Me
                </button>
                <button
                  onClick={handleEnhancePrompt}
                  type="button"
                  className="flex items-center gap-1 text-[11px] text-apex-lime hover:underline transition-all"
                >
                  <Sparkles size={12} />
                  Enhance Prompt
                </button>
                {prompt && (
                  <button
                    onClick={() => setPrompt('')}
                    type="button"
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                    title="Clear Prompt"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe your scene in rich visual detail: subject, lighting, mood, camera lens, color grading..."
              className="w-full resize-none rounded-xl border border-white/10 bg-studio-950 p-3.5 text-xs text-white placeholder-zinc-500 focus:border-apex-lime/60 focus:outline-none focus:ring-1 focus:ring-apex-lime/30 leading-relaxed font-sans"
            />

            {/* Negative Prompt */}
            <div>
              <button
                type="button"
                onClick={() => setShowNegative(!showNegative)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200"
              >
                <ChevronDown
                  size={13}
                  className={`transition-transform ${showNegative ? 'rotate-180' : ''}`}
                />
                {showNegative ? 'Hide Negative Prompt' : 'Add Negative Prompt'}
              </button>

              {showNegative && (
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Things to avoid: blurry, cartoon, low quality, deformed, extra fingers, text..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-studio-950 px-3.5 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:border-apex-lime/50 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Aspect Ratio Picker */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 block">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-apex-lime bg-apex-lime/10 text-white shadow-glow-subtle'
                        : 'border-white/5 bg-studio-900/60 text-zinc-400 hover:border-white/15 hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className={`mb-1.5 rounded-sm border border-current ${
                        isSelected ? 'border-apex-lime' : 'border-zinc-500'
                      }`}
                      style={{
                        width: `${Math.min(ratio.width * 2.2, 32)}px`,
                        height: `${Math.min(ratio.height * 2.2, 24)}px`,
                      }}
                    />
                    <span className="text-xs font-bold">{ratio.label}</span>
                    <span className="text-[9px] text-zinc-500 truncate mt-0.5">{ratio.desc.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality & Style Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-studio-900 border border-white/5 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Quality Preset
              </span>
              <div className="flex gap-2">
                {(['Standard', 'High'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      quality === q
                        ? 'bg-apex-lime text-black shadow-glow-subtle'
                        : 'bg-studio-950 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-studio-900 border border-white/5 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Style Preset
              </span>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full py-1.5 px-3 rounded-xl bg-studio-950 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-apex-lime/50"
              >
                {STYLE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
              isGenerating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'glow-btn'
            }`}
          >
            <Zap size={16} className="fill-current" />
            {isGenerating
              ? 'Synthesizing Imagery...'
              : `Generate Image (${apexModel.creditCost} Credits)`}
          </button>
        </div>

        {/* Right Column: Viewport & Skeleton / Result (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-20">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 block flex items-center justify-between">
              <span>Image Viewport</span>
              {latestResult && (
                <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SUCCEEDED
                </span>
              )}
            </label>

            <div className="relative rounded-2xl border border-white/10 bg-studio-900 overflow-hidden flex flex-col justify-center items-center min-h-[440px] shadow-2xl">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-apex-lime to-emerald-400 text-black shadow-glow-lime animate-pulse">
                    <Sparkles size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-white text-sm">
                      Apex Vision Processing
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono max-w-xs">{stage}</p>
                  </div>
                  {/* Progress bar */}
                  <div className="w-48 h-1.5 bg-studio-950 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-apex-lime transition-all duration-300 shadow-glow-lime"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-apex-lime">{progress}%</span>
                </div>
              ) : latestResult ? (
                <div className="relative w-full h-full flex flex-col">
                  <div className="relative flex-1 group overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={latestResult.outputUrl}
                      alt={latestResult.prompt}
                      className="w-full h-auto max-h-[380px] object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedAsset(latestResult)}
                    />
                    <button
                      onClick={() => setSelectedAsset(latestResult)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-1.5 text-xs font-semibold"
                    >
                      <Maximize2 size={16} /> Click to Inspect 4K
                    </button>
                  </div>

                  {/* Result Actions */}
                  <div className="p-3.5 bg-studio-950 border-t border-white/10 space-y-2">
                    <p className="text-[11px] text-zinc-300 line-clamp-1 italic">
                      "{latestResult.prompt}"
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleAnimate(latestResult.outputUrl)}
                        className="py-1.5 px-2 rounded-xl bg-apex-lime/10 hover:bg-apex-lime hover:text-black text-apex-lime text-[11px] font-semibold border border-apex-lime/30 flex items-center justify-center gap-1 transition-all"
                      >
                        <Film size={12} />
                        Animate
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(latestResult.prompt);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-studio-900 hover:bg-white/10 text-zinc-300 text-[11px] font-medium border border-white/10 flex items-center justify-center gap-1 transition-colors"
                      >
                        {copied ? <Check size={12} className="text-apex-lime" /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Prompt'}
                      </button>
                      <a
                        href={latestResult.outputUrl}
                        download="apex-vision.jpg"
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-2 rounded-xl bg-studio-900 hover:bg-white/10 text-zinc-300 text-[11px] font-medium border border-white/10 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Download size={12} />
                        Save
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-studio-950 border border-white/5 text-zinc-600">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-400">Ready to Render</h4>
                    <p className="text-[11px] text-zinc-600 max-w-xs mt-0.5">
                      Enter your prompt or choose Inspire Me to synthesize cinematic stills inside Atomic Apex Studio.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fast link to Video Generation */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-studio-900 to-studio-950 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Film size={14} className="text-apex-lime" /> Animate this image into video?
              </span>
              <button
                onClick={() => router.push('/create/video')}
                className="text-apex-lime font-semibold hover:underline flex items-center gap-1"
              >
                Create Video <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* In-Page Recent Generations */}
      <div className="pt-8 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
            <Layers size={15} className="text-apex-lime" /> Recent Image Generations
          </h3>
          <button
            onClick={() => router.push('/assets')}
            className="text-xs text-zinc-400 hover:text-apex-lime transition-colors"
          >
            View All in Assets →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {imageGenerations.slice(0, 5).map((gen) => (
            <div
              key={gen.id}
              onClick={() => setSelectedAsset(gen)}
              className="group relative rounded-xl overflow-hidden border border-white/10 bg-studio-900 cursor-pointer aspect-video"
            >
              <img
                src={gen.thumbnailUrl || gen.outputUrl}
                alt={gen.prompt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                <p className="text-[10px] text-white line-clamp-1">{gen.prompt}</p>
                <span className="text-[9px] text-apex-lime font-mono">{gen.model}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
