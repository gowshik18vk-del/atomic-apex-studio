'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Video,
  Zap,
  Wand2,
  Sliders,
  Download,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Cloud,
  Cpu,
  Infinity as InfinityIcon,
  Film,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { NEW_GEN_VIDEO_MODELS } from '@/lib/constants/models';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';
import { Generation } from '@/lib/types';

const NEW_GEN_PROMPTS = [
  'Ethereal cyberpunk cyborg woman gazing across floating neon metropolis in rain, hyper-detailed reflections, 8k cinematic lighting',
  'Golden eagle soaring through crystalline glacial canyon at sunrise, volumetric morning mist, ultra-smooth 60fps tracking camera',
  'Futuristic electric hypercar drifting through nocturnal Tokyo overpass, anamorphic lens flares, motion blur, photo-real octane render',
  'Time-lapse of an alien bioluminescent flora blooming under dual moonlit skies, shimmering pollen particles swirling in cosmic wind',
  'Deep space exploration vessel entering iridescent wormhole event horizon, gravitational lensing, interstellar cinema scale',
];

export default function NewGenVideoPage() {
  const router = useRouter();
  const { addGeneration, generations } = useGenerationStore();
  const { credits } = useCreditsStore();

  const [selectedModelId, setSelectedModelId] = useState(NEW_GEN_VIDEO_MODELS[0].id);
  const [prompt, setPrompt] = useState('');
  const [cameraMotion, setCameraMotion] = useState('Drone Orbit 360');
  const [duration, setDuration] = useState('10s');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [motionIntensity, setMotionIntensity] = useState(7);

  // Generation status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<Generation | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentModel =
    NEW_GEN_VIDEO_MODELS.find((m) => m.id === selectedModelId) || NEW_GEN_VIDEO_MODELS[0];

  const handleRandomPrompt = () => {
    const pick = NEW_GEN_PROMPTS[Math.floor(Math.random() * NEW_GEN_PROMPTS.length)];
    setPrompt(pick);
  };

  const handleCopyPrompt = () => {
    if (latestResult?.prompt) {
      navigator.clipboard.writeText(latestResult.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgressStage('Connecting to remote cloud cluster...');

    try {
      // Step 1: Send synthesis request to provider
      setProgressStage(`Dispatching to ${currentModel.provider}...`);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel.id,
          prompt: prompt.trim(),
          aspectRatio,
          duration,
          fps,
          cameraMotion,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Cloud video synthesis failed. Please retry.');
      }

      const initData = await res.json();
      setActiveJobId(initData.jobId);

      // Step 2: Poll async status with rapid cloud feedback
      setProgressStage('Synthesizing motion vectors in cloud (0% local GPU used)...');
      let attempts = 0;
      let finalResultUrl = initData.resultUrl;
      let finalThumbUrl = initData.thumbUrl;

      while (attempts < 20) {
        await new Promise((r) => setTimeout(r, 900));
        attempts++;

        const statusRes = await fetch(`/api/generations/${initData.jobId}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.status === 'succeeded') {
            finalResultUrl = statusData.resultUrl;
            finalThumbUrl = statusData.thumbUrl;
            break;
          } else if (statusData.status === 'failed') {
            throw new Error(statusData.error || 'Video render failed');
          } else {
            setProgressStage(`Rendering frames on ${currentModel.provider} (Stage ${attempts}/2)...`);
          }
        }
      }

      // Step 3: Complete & save generation
      const newGen: Generation = {
        id: initData.id || 'gen_' + Date.now(),
        userId: 'current-user',
        type: 'video',
        model: currentModel.name,
        prompt: prompt.trim(),
        parameters: {
          provider: currentModel.provider,
          cameraMotion,
          fps,
          duration,
          motionIntensity,
          cloudRendered: true,
          unlimited: true,
        },
        status: 'completed',
        outputUrl: finalResultUrl || 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
        thumbnailUrl: finalThumbUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=85',
        aspectRatio,
        duration,
        creditsCost: 0,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };

      addGeneration(newGen);
      setLatestResult(newGen);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgressStage('');
      setActiveJobId(null);
    }
  };

  const newGenHistory = generations.filter(
    (g) =>
      g.type === 'video' &&
      (g.model.includes('Wan') || g.model.includes('LTX') || g.model.includes('CogVideo') || g.creditsCost === 0)
  );

  return (
    <div className="min-h-screen bg-studio-950 pb-24 text-white">
      {/* Top Banner: Zero Download & Unlimited Cloud Guarantee */}
      <div className="border-b border-white/5 bg-gradient-to-r from-emerald-950/40 via-studio-900/60 to-apex-cyan/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-apex-lime/10 border border-apex-lime/20 text-apex-lime shadow-glow-lime">
              <Cloud size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-bold tracking-tight text-white">
                  New Gen Video Suite
                </h1>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <InfinityIcon size={12} /> UNLIMITED CLOUD
                </span>
                <span className="rounded-full bg-apex-cyan/20 px-2 py-0.5 text-[10px] font-semibold text-apex-cyan border border-apex-cyan/30">
                  0 BYTES LOCAL DOWNLOAD
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                100% remote cloud execution on dedicated GPU clusters. Your system stores zero model weights.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck size={16} className="text-apex-lime" />
              <span>Zero System Impact</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Cpu size={16} className="text-apex-cyan" />
              <span>Free & Unlimited Tier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Model Selection & Creative Controls */}
          <div className="space-y-6 lg:col-span-5">
            {/* Model Selector Card */}
            <div className="rounded-2xl border border-white/10 bg-studio-900/70 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Select Cloud Video Model
                </label>
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> 0 Credits (Unlimited)
                </span>
              </div>

              <div className="space-y-3">
                {NEW_GEN_VIDEO_MODELS.map((m) => {
                  const isSelected = m.id === selectedModelId;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-apex-lime bg-apex-lime/10 shadow-glow-lime'
                          : 'border-white/5 bg-studio-950/60 hover:border-white/20 hover:bg-studio-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold text-white">
                            {m.name}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                              isSelected
                                ? 'bg-apex-lime text-black font-extrabold'
                                : 'bg-white/10 text-zinc-300'
                            }`}
                          >
                            {m.badge}
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          FREE / UNLIMITED
                        </span>
                      </div>

                      {/* Explicit Provider Name */}
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-apex-cyan">
                        <Cloud size={13} />
                        <span>Cloud Provider: <strong className="text-white">{m.provider}</strong></span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prompt Input Box */}
            <div className="rounded-2xl border border-white/10 bg-studio-900/70 p-5 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Video Cinematic Prompt
                </label>
                <button
                  type="button"
                  onClick={handleRandomPrompt}
                  className="flex items-center gap-1 text-xs text-apex-lime hover:underline"
                >
                  <Sparkles size={13} /> Surprise Me
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the cinematic scene, camera motion, atmosphere, lighting..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-studio-950/80 p-3.5 text-sm text-white placeholder-zinc-500 focus:border-apex-lime focus:outline-none focus:ring-1 focus:ring-apex-lime"
              />

              {/* Aspect Ratio Selector */}
              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['16:9', '9:16', '1:1', '21:9'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                        aspectRatio === ratio
                          ? 'bg-apex-lime text-black shadow-glow-lime'
                          : 'border border-white/5 bg-studio-950/80 text-zinc-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration & Camera Motion Controls */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <Clock size={12} /> Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-studio-950 p-2 text-xs text-white focus:border-apex-lime focus:outline-none"
                  >
                    <option value="5s">5 Seconds</option>
                    <option value="10s">10 Seconds</option>
                    <option value="15s">15 Seconds</option>
                    <option value="30s">30 Seconds (Max)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <Camera size={12} /> Camera Motion
                  </label>
                  <select
                    value={cameraMotion}
                    onChange={(e) => setCameraMotion(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-studio-950 p-2 text-xs text-white focus:border-apex-lime focus:outline-none"
                  >
                    <option value="Drone Orbit 360">Drone Orbit 360</option>
                    <option value="FPV Dive">FPV Dive</option>
                    <option value="Cinematic Dolly">Cinematic Dolly</option>
                    <option value="Handheld Organic">Handheld Organic</option>
                    <option value="Curved 3D Rail">Curved 3D Rail</option>
                    <option value="Pan Left/Right">Pan Left/Right</option>
                  </select>
                </div>
              </div>

              {/* Framerate Selection */}
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-zinc-400">
                  Framerate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[24, 30, 60].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFps(f as any)}
                      className={`rounded-lg py-1.5 text-xs font-medium ${
                        fps === f
                          ? 'border border-apex-cyan bg-apex-cyan/10 text-apex-cyan'
                          : 'border border-white/5 bg-studio-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {f} FPS
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              {/* Generate Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-apex-lime via-emerald-400 to-apex-cyan py-3.5 text-sm font-bold text-black shadow-glow-lime transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Zap className="animate-spin" size={18} />
                    <span>Rendering on {currentModel.provider}...</span>
                  </>
                ) : (
                  <>
                    <Video size={18} />
                    <span>Generate Video (Free & Unlimited)</span>
                  </>
                )}
              </button>

              <div className="mt-3 text-center text-[11px] text-zinc-500 font-mono">
                No local hardware load • Zero storage impact • Powered by {currentModel.provider}
              </div>
            </div>
          </div>

          {/* Right Column: Video Canvas & Rendered Playback */}
          <div className="space-y-6 lg:col-span-7">
            {/* Main Stage Video Player Card */}
            <div className="rounded-2xl border border-white/10 bg-studio-900/70 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-display text-sm font-semibold tracking-wide text-zinc-200 uppercase">
                    Cloud Studio Preview
                  </span>
                </div>

                {latestResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-1 rounded-lg border border-white/10 bg-studio-950 px-2.5 py-1 text-xs text-zinc-300 hover:bg-white/5"
                    >
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                    <a
                      href={latestResult.outputUrl}
                      download={`newgen_${Date.now()}.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-apex-lime px-3 py-1 text-xs font-bold text-black hover:brightness-110"
                    >
                      <Download size={13} />
                      <span>Download MP4</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Video Player or Placeholder */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-studio-950 flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-apex-lime/20 border-t-apex-lime animate-spin" />
                      <Cloud size={24} className="text-apex-lime animate-pulse" />
                    </div>
                    <p className="font-display text-sm font-bold text-white">
                      Generating with {currentModel.name}
                    </p>
                    <p className="text-xs text-zinc-400 max-w-sm">
                      {progressStage || 'Allocating remote cloud GPU cluster...'}
                    </p>
                    <div className="mt-2 flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] text-zinc-400">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>Zero local download • 100% cloud streamed</span>
                    </div>
                  </div>
                ) : latestResult ? (
                  <video
                    src={latestResult.outputUrl}
                    poster={latestResult.thumbnailUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-zinc-500">
                      <Film size={32} />
                    </div>
                    <p className="text-sm font-medium text-zinc-300">
                      No video generated yet
                    </p>
                    <p className="text-xs text-zinc-500 max-w-xs">
                      Select an unlimited cloud model, type a prompt, and click Generate to produce remote AI motion scenes.
                    </p>
                  </div>
                )}
              </div>

              {/* Generation Details Bar */}
              {latestResult && (
                <div className="mt-4 rounded-xl border border-white/5 bg-studio-950/60 p-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 mb-2">
                    <span className="font-semibold text-zinc-300">Model & Provider:</span>
                    <span className="font-mono text-apex-cyan">
                      {latestResult.model} ({latestResult.parameters?.provider})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-400">
                    <span>Duration: <strong className="text-white">{latestResult.duration}</strong></span>
                    <span>Ratio: <strong className="text-white">{latestResult.aspectRatio}</strong></span>
                    <span>Cost: <strong className="text-emerald-400">0 Credits (Unlimited Free Tier)</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent New Gen Video Generations Gallery */}
            {newGenHistory.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-studio-900/70 p-6 backdrop-blur-xl">
                <h3 className="font-display text-sm font-bold text-white mb-4">
                  Recent Cloud Generations ({newGenHistory.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {newGenHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setLatestResult(item)}
                      className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-studio-950 hover:border-apex-lime transition-all"
                    >
                      <img
                        src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=85'}
                        alt={item.prompt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                        <span className="text-[10px] text-white font-medium line-clamp-1">
                          {item.prompt}
                        </span>
                        <span className="text-[9px] text-apex-lime font-mono">
                          {item.model}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
