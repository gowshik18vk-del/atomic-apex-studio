'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Film,
  Zap,
  Wand2,
  Trash2,
  Sliders,
  Maximize2,
  Download,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { MODEL_REGISTRY } from '@/lib/models';
import { CAMERA_PRESETS } from '@/lib/constants/models';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';
import { Generation } from '@/lib/types';

const INSPIRATIONAL_VIDEO_PROMPTS = [
  'Cinematic drone tracking shot of an obsidian cyberpunk monolith in neon rain, volumetric lighting, photorealistic 8k octane render',
  'High-fashion streetwear model walking in Tokyo night street, anamorphic lens flare, cinematic slow motion stride',
  'Liquid crystal fragrance bottle shattering into floating golden droplets, hyper-detailed macro photography, studio spotlight sweep',
  'FPV racing drone diving alongside futuristic hover-racing prototype through canyon chicane, dust trail dynamics, motion blur',
  'Astronaut floating into ancient alien cathedral on distant moon, dust particles swirling in blue starlight beam',
];

export default function CreateVideoPage() {
  const router = useRouter();
  const {
    addGeneration,
    setSelectedAsset,
    referenceImageForVideo,
    setReferenceImageForVideo,
    generations,
  } = useGenerationStore();
  const { deductCredits, addCredits, credits } = useCreditsStore();

  const videoModels = [
    MODEL_REGISTRY['swift-v1'],
    MODEL_REGISTRY['studio-v1'],
    MODEL_REGISTRY['range'],
    MODEL_REGISTRY['kling-4-0'],
  ].filter(Boolean);

  const [selectedModelId, setSelectedModelId] = useState(videoModels[0].id);
  const [generationMode, setGenerationMode] = useState<'text' | 'image'>(
    referenceImageForVideo ? 'image' : 'text'
  );
  const [prompt, setPrompt] = useState('');
  const [cameraMotion, setCameraMotion] = useState('Drone Orbit 360');
  const [duration, setDuration] = useState<'5s' | '10s'>('5s');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [aspectRatio, setAspectRatio] = useState('16:9');

  // Async Job State
  const [activeJob, setActiveJob] = useState<{
    id: string;
    jobId: string;
    status: 'queued' | 'running' | 'succeeded' | 'failed';
    stage: string;
    progress: number;
    error?: string;
  } | null>(null);

  const [latestResult, setLatestResult] = useState<Generation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (referenceImageForVideo) {
      setGenerationMode('image');
      if (!prompt) {
        setPrompt('Cinematic motion extension of the reference frame with dynamic camera movement');
      }
    }
  }, [referenceImageForVideo]);

  const currentModel = videoModels.find((m) => m.id === selectedModelId) || videoModels[0];
  const videoGenerations = generations.filter((g) => g.type === 'video');

  const handleRandomPrompt = () => {
    const pick =
      INSPIRATIONAL_VIDEO_PROMPTS[
        Math.floor(Math.random() * INSPIRATIONAL_VIDEO_PROMPTS.length)
      ];
    setPrompt(pick);
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      handleRandomPrompt();
      return;
    }
    const enhanced = `${prompt.trim()}, dynamic camera motion, temporal coherence, photorealistic physics, 8k resolution, cinematic 35mm lens`;
    setPrompt(enhanced);
  };

  // Poll video status every 3 seconds while job is active
  useEffect(() => {
    if (!activeJob || activeJob.status === 'succeeded' || activeJob.status === 'failed') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/generations/${activeJob.id}?jobId=${activeJob.jobId}&model=${currentModel.id}`
        );
        if (!res.ok) return;

        const data = await res.json();

        if (data.status === 'queued') {
          setActiveJob((prev) => prev && { ...prev, status: 'queued', stage: 'Queued in GPU cluster...', progress: 20 });
        } else if (data.status === 'running') {
          setActiveJob((prev) => prev && { ...prev, status: 'running', stage: 'Rendering neural frames & optical flow...', progress: 65 });
        } else if (data.status === 'succeeded') {
          clearInterval(interval);
          setActiveJob(null);

          const newGen: Generation = {
            id: activeJob.id,
            userId: 'a0000000-0000-0000-0000-000000000001',
            type: 'video',
            model: currentModel.label,
            prompt,
            parameters: { camera: cameraMotion, fps, duration },
            status: 'completed',
            outputUrl: data.resultUrl,
            thumbnailUrl: data.thumbUrl,
            aspectRatio,
            duration,
            creditsCost: currentModel.creditCost,
            isFavorite: false,
            createdAt: new Date().toISOString(),
          };

          setLatestResult(newGen);
          addGeneration(newGen);
          triggerConfetti();
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setActiveJob((prev) => prev && {
            ...prev,
            status: 'failed',
            stage: 'Render failed. Credits have been refunded to your account.',
            error: data.error || 'Pipeline error',
          });
          // Refund credits locally in store
          addCredits(currentModel.creditCost);
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [activeJob, currentModel]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      handleRandomPrompt();
      return;
    }

    if (credits < currentModel.creditCost) {
      alert('Insufficient credits! You can claim +50 free credits from the sidebar or settings.');
      return;
    }

    const deducted = deductCredits(currentModel.creditCost);
    if (!deducted) return;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel.id,
          prompt,
          cameraMotion,
          duration,
          fps,
          aspectRatio,
          sourceImage: generationMode === 'image' ? referenceImageForVideo : undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        addCredits(currentModel.creditCost); // refund
        throw new Error(err.error || 'Video dispatch failed');
      }

      const data = await response.json();

      // Set active async job
      setActiveJob({
        id: data.id,
        jobId: data.jobId,
        status: 'queued',
        stage: 'Dispatching to video neural engine...',
        progress: 15,
      });
    } catch (err: any) {
      alert(err.message || 'Video generation failed.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime/10 text-apex-lime">
              <Film size={16} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Create Video
            </h1>
            <span className="rounded-full bg-apex-lime/15 px-2.5 py-0.5 text-[10px] font-bold text-apex-lime uppercase tracking-wider">
              Native Video Engine
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Render cinematic videos with camera motion trajectories, temporal stability, and non-blocking asynchronous jobs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-studio-900 px-3 py-1.5 rounded-xl border border-white/5">
          <span>Cost: <strong className="text-apex-lime">⚡ {currentModel.creditCost} credits</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher */}
          <div className="flex rounded-2xl bg-studio-900/90 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setGenerationMode('text')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                generationMode === 'text'
                  ? 'bg-apex-lime text-black shadow-glow-subtle'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Text to Video
            </button>
            <button
              type="button"
              onClick={() => setGenerationMode('image')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                generationMode === 'image'
                  ? 'bg-apex-lime text-black shadow-glow-subtle'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Upload size={13} />
              Image to Video (Motion Animate)
            </button>
          </div>

          {/* Reference Image (Image-to-Video mode) */}
          {generationMode === 'image' && (
            <div className="rounded-2xl border border-dashed border-apex-lime/30 bg-studio-900/50 p-4 flex items-center gap-4">
              {referenceImageForVideo ? (
                <div className="relative h-20 w-32 flex-shrink-0 rounded-xl overflow-hidden border border-white/20">
                  <img
                    src={referenceImageForVideo}
                    alt="Reference"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => setReferenceImageForVideo(null)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-red-500"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex h-20 w-32 flex-shrink-0 items-center justify-center rounded-xl bg-studio-950 border border-white/10 text-zinc-500">
                  <Upload size={20} />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white">Source Image Motion</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {referenceImageForVideo
                    ? 'Start frame locked. The AI will synthesize realistic physics and camera path.'
                    : 'Upload an image or create one in Create Image to animate it here.'}
                </p>
                {!referenceImageForVideo && (
                  <button
                    onClick={() => {
                      setReferenceImageForVideo(
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                      );
                    }}
                    className="mt-2 text-[11px] text-apex-lime hover:underline font-semibold"
                  >
                    Use sample cyber muse image →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Model Selector Cards (Swift V1, Studio V1, Range) */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 block">
              Select Video Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {videoModels.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-apex-lime bg-apex-lime/5 shadow-glow-subtle'
                        : 'border-white/5 bg-studio-900/60 hover:border-white/15 hover:bg-studio-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-apex-lime' : 'text-white'}`}>
                        {model.label}
                      </span>
                      {model.badge && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            isSelected
                              ? 'bg-apex-lime text-black'
                              : 'bg-white/5 text-zinc-400'
                          }`}
                        >
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2">
                      {model.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between w-full text-[10px] text-zinc-500 font-mono">
                      <span>Max {model.supportedDurations?.join('/') || '5s'}</span>
                      <span className="text-apex-lime font-bold">⚡ {model.creditCost} cr</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Box */}
          <div className="rounded-2xl border border-white/10 bg-studio-900/80 p-4 space-y-3 shadow-glass-card">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Motion Directive & Scene Prompt
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
                  Enhance
                </button>
                {prompt && (
                  <button
                    onClick={() => setPrompt('')}
                    type="button"
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe character motion, camera trajectory, environment physics, and visual style..."
              className="w-full resize-none rounded-xl border border-white/10 bg-studio-950 p-3.5 text-xs text-white placeholder-zinc-500 focus:border-apex-lime/60 focus:outline-none focus:ring-1 focus:ring-apex-lime/30 leading-relaxed font-sans"
            />
          </div>

          {/* Camera Motion Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 block flex items-center gap-1.5">
              <Camera size={13} className="text-apex-lime" /> Camera Trajectory
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CAMERA_PRESETS.map((cam) => {
                const isSelected = cameraMotion === cam.label;
                return (
                  <button
                    key={cam.id}
                    onClick={() => setCameraMotion(cam.label)}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-medium ${
                      isSelected
                        ? 'border-apex-lime bg-apex-lime/10 text-white shadow-glow-subtle font-bold'
                        : 'border-white/5 bg-studio-900/60 text-zinc-400 hover:border-white/15 hover:text-white'
                    }`}
                  >
                    {cam.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & FPS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl border border-white/5 bg-studio-900/50 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Duration
              </span>
              <div className="flex gap-2">
                {(['5s', '10s'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      duration === d
                        ? 'bg-apex-lime text-black shadow-glow-subtle'
                        : 'bg-studio-950 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/5 bg-studio-900/50 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Frame Rate (FPS)
              </span>
              <div className="flex gap-2">
                {([24, 30, 60] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fps === f
                        ? 'bg-apex-lime text-black shadow-glow-subtle'
                        : 'bg-studio-950 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {f}fps
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={Boolean(activeJob)}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
              activeJob
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'glow-btn'
            }`}
          >
            <Zap size={16} className="fill-current" />
            {activeJob
              ? 'Rendering in Background...'
              : `Generate Video (${currentModel.creditCost} Credits)`}
          </button>
        </div>

        {/* Right Column: Viewport & Async Polling Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-20">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 block flex items-center justify-between">
              <span>Video Viewport</span>
              {activeJob && (
                <span className="text-apex-cyan text-[10px] flex items-center gap-1 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-apex-cyan animate-pulse" />
                  STATUS: {activeJob.status.toUpperCase()}
                </span>
              )}
            </label>

            <div className="relative rounded-2xl border border-white/10 bg-studio-900 overflow-hidden flex flex-col justify-center items-center min-h-[440px] shadow-2xl">
              {/* Async Progress Card (queued, running, done, failed) */}
              {activeJob ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 w-full">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-apex-lime to-emerald-400 text-black shadow-glow-lime animate-pulse">
                    <Film size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-white text-sm">
                      {currentModel.label} Async Job
                    </h4>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-apex-lime uppercase">
                      Job ID: {activeJob.jobId}
                    </span>
                    <p className="text-xs text-zinc-400 font-mono max-w-xs pt-1">{activeJob.stage}</p>
                  </div>

                  {activeJob.status === 'failed' ? (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle size={14} />
                      <span>{activeJob.error || 'Job failed. Credits refunded.'}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-48 h-1.5 bg-studio-950 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-apex-lime transition-all duration-300 shadow-glow-lime"
                          style={{ width: `${activeJob.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Polling GET /api/generations every 3s...
                      </span>
                    </>
                  )}
                </div>
              ) : latestResult ? (
                <div className="relative w-full h-full flex flex-col">
                  <div className="relative flex-1 bg-black flex items-center justify-center">
                    <video
                      src={latestResult.outputUrl}
                      poster={latestResult.thumbnailUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-auto max-h-[380px] object-contain"
                    />
                  </div>

                  {/* Result Details */}
                  <div className="p-3.5 bg-studio-950 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-mono text-apex-lime">{latestResult.model}</span>
                      <span>{latestResult.duration} • {latestResult.parameters?.fps || 30}fps</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 line-clamp-1 italic">
                      "{latestResult.prompt}"
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(latestResult.prompt);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-studio-900 hover:bg-white/10 text-zinc-300 text-[11px] font-medium border border-white/10 flex items-center justify-center gap-1 transition-colors"
                      >
                        {copied ? <Check size={12} className="text-apex-lime" /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Copy Prompt'}
                      </button>
                      <a
                        href={latestResult.outputUrl}
                        download="apex-video.mp4"
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-2 rounded-xl bg-studio-900 hover:bg-white/10 text-zinc-300 text-[11px] font-medium border border-white/10 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Download size={12} />
                        Download MP4
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-studio-950 border border-white/5 text-zinc-600">
                    <Film size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-400">Cinema Studio Viewport</h4>
                    <p className="text-[11px] text-zinc-600 max-w-xs mt-0.5">
                      Configure camera trajectory and duration, then hit generate to synthesize video clips inside Atomic Apex Studio.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* In-Page Recent Generations */}
      <div className="pt-8 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
            <Layers size={15} className="text-apex-lime" /> Recent Video Generations
          </h3>
          <button
            onClick={() => router.push('/assets')}
            className="text-xs text-zinc-400 hover:text-apex-lime transition-colors"
          >
            View All in Assets →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {videoGenerations.slice(0, 5).map((gen) => (
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
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded px-1.5 py-0.5 text-[9px] font-mono text-white">
                <Play size={8} className="fill-current text-apex-lime" />
                {gen.duration || '5s'}
              </div>
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
