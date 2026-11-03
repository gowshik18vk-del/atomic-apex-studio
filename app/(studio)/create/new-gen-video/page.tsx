'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Video,
  Zap,
  Sparkles,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  Clock,
  Layers,
  Cloud,
  Cpu,
  Infinity as InfinityIcon,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Camera,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { NEW_GEN_VIDEO_MODELS } from '@/lib/constants/models';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { triggerConfetti } from '@/lib/utils';
import { Generation } from '@/lib/types';

const PRESET_CINEMATIC_PROMPTS = [
  'Futuristic electric hypercar drifting through nocturnal Tokyo overpass, anamorphic lens flares, motion blur, octane render',
  'Golden eagle soaring through crystalline glacial canyon at sunrise, volumetric morning mist, ultra-smooth 60fps tracking camera',
  'Ethereal cyberpunk cyborg woman gazing across floating neon metropolis in rain, hyper-detailed reflections, 8k cinematic lighting',
  'Liquid crystal fragrance bottle shattering into floating golden droplets, hyper-detailed macro photography, studio spotlight sweep',
  'Deep space exploration vessel entering iridescent wormhole event horizon, gravitational lensing, interstellar cinema scale',
  'Bioluminescent underwater manta ray gliding through abyssal deep-sea trench with glowing coral reef below',
];

export default function NewGenVideoStudioPage() {
  const { addGeneration, generations } = useGenerationStore();

  // Model & Generation State
  const [selectedModelId, setSelectedModelId] = useState(NEW_GEN_VIDEO_MODELS[0].id);
  const [prompt, setPrompt] = useState(
    'Futuristic electric hypercar drifting through nocturnal Tokyo overpass, anamorphic lens flares, motion blur'
  );
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('10s');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [cameraMotion, setCameraMotion] = useState('Drone Orbit 360');

  // Player & UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentModel =
    NEW_GEN_VIDEO_MODELS.find((m) => m.id === selectedModelId) || NEW_GEN_VIDEO_MODELS[0];

  // Default initial video result
  const [activeVideo, setActiveVideo] = useState<Generation>({
    id: 'init-newgen-1',
    userId: 'user',
    type: 'video',
    model: currentModel.name,
    prompt: prompt,
    outputUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=85',
    aspectRatio: '16:9',
    duration: '10s',
    creditsCost: 0,
    isFavorite: true,
    createdAt: new Date().toISOString(),
    parameters: {
      provider: currentModel.provider,
      unlimited: true,
      cloudRendered: true,
    },
    status: 'completed',
  });

  const handleSurprisePrompt = () => {
    const pick =
      PRESET_CINEMATIC_PROMPTS[Math.floor(Math.random() * PRESET_CINEMATIC_PROMPTS.length)];
    setPrompt(pick);
  };

  const handleCopyPrompt = () => {
    if (activeVideo?.prompt) {
      navigator.clipboard.writeText(activeVideo.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationProgress(10);
    setProgressStage(`Allocating ${currentModel.provider} Cloud GPU...`);

    try {
      // Step 1: Smooth simulated neural pipeline animation
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          if (prev === 30) {
            setProgressStage(`Synthesizing motion vectors with ${currentModel.name}...`);
          } else if (prev === 60) {
            setProgressStage('Encoding 1080p MP4 stream in cloud (0% local GPU used)...');
          }
          return prev + 15;
        });
      }, 300);

      // Step 2: Call the backend video synthesis endpoint
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel.id,
          prompt: prompt.trim(),
          aspect_ratio: aspectRatio,
          duration: duration,
          fps: fps,
          camera_motion: cameraMotion,
        }),
      });

      clearInterval(interval);

      if (!res.ok) {
        throw new Error('Video synthesis failed. Please retry.');
      }

      const data = await res.json();
      setGenerationProgress(100);
      setProgressStage('Rendering Complete!');

      // Short delay for visual polish
      await new Promise((r) => setTimeout(r, 400));

      const newGen: Generation = {
        id: data.id || 'gen_' + Date.now(),
        userId: 'user',
        type: 'video',
        model: currentModel.name,
        prompt: prompt.trim(),
        outputUrl: data.output_url || 'https://vjs.zencdn.net/v/oceans.mp4',
        thumbnailUrl: data.thumbnail_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=85',
        aspectRatio: aspectRatio,
        duration: duration,
        creditsCost: 0,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        parameters: {
          provider: currentModel.provider,
          cameraMotion,
          fps,
          unlimited: true,
          cloudRendered: true,
        },
        status: 'completed',
      };

      addGeneration(newGen);
      setActiveVideo(newGen);
      setIsPlaying(true);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      alert('Generation error: ' + (err.message || 'Please try again.'));
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setProgressStage('');
    }
  };

  const newGenHistory = generations.filter(
    (g) =>
      g.type === 'video' &&
      (g.model?.includes('Wan') ||
        g.model?.includes('LTX') ||
        g.model?.includes('CogVideo') ||
        g.creditsCost === 0)
  );

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col bg-[#05070a] text-white selection:bg-emerald-400 selection:text-black">
      {/* 1. SEPARATE TOP DIRECTOR BAR */}
      <div className="border-b border-white/5 bg-studio-950/90 px-4 py-3 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-apex-cyan text-black font-extrabold shadow-glow-lime">
              <Video size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-black tracking-wider text-white uppercase">
                  New Gen Video Studio
                </span>
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <InfinityIcon size={12} /> UNLIMITED CLOUD
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                100% remote execution • 0 bytes downloaded to your machine
              </span>
            </div>
          </div>

          {/* Center Model Switcher Tabs */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/50 p-1">
            {NEW_GEN_VIDEO_MODELS.map((m) => {
              const isSelected = m.id === selectedModelId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-400 to-apex-lime text-black shadow-glow-lime'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{m.name.split(' (')[0]}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[8px] font-extrabold uppercase ${
                      isSelected ? 'bg-black/30 text-black' : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Provider & Specs */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300 font-mono">
              <Cloud size={14} className="text-apex-cyan" />
              <span>Provider: <strong className="text-white">{currentModel.provider}</strong></span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 size={14} />
              <span>Free & Unlimited</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CINEMA STAGE (CENTRAL VIEWPORT) */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center p-4 pb-44 sm:p-6 sm:pb-44">
        <div
          className={`relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl transition-all duration-300 ${
            aspectRatio === '9:16'
              ? 'aspect-[9/16] max-w-xs'
              : aspectRatio === '1:1'
              ? 'aspect-square max-w-lg'
              : aspectRatio === '21:9'
              ? 'aspect-[21/9]'
              : 'aspect-video'
          }`}
        >
          {/* Active Video Player */}
          <video
            ref={videoRef}
            src={activeVideo.outputUrl}
            poster={activeVideo.thumbnailUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          />

          {/* Generating Overlay HUD */}
          {isGenerating && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 p-6 backdrop-blur-md">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <Cloud size={32} className="text-emerald-400 animate-pulse" />
              </div>

              <div className="mt-4 space-y-2 text-center">
                <h3 className="font-display text-base font-bold text-white">
                  Synthesizing with {currentModel.name}
                </h3>
                <p className="text-xs text-zinc-300 font-mono">
                  {progressStage}
                </p>

                {/* Progress Bar */}
                <div className="mx-auto mt-3 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-apex-lime to-apex-cyan transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400">
                  {generationProgress}%
                </span>

                <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Executing remotely on {currentModel.provider} GPU cluster</span>
                </div>
              </div>
            </div>
          )}

          {/* Top Video Overlay: Model Info & Actions */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white font-display">
                {activeVideo.model}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                • {activeVideo.duration} • {activeVideo.aspectRatio}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-md hover:bg-black/80 transition-all"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
              </button>

              <a
                href={activeVideo.outputUrl}
                download={`newgen_${Date.now()}.mp4`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 px-3.5 py-1.5 text-xs font-bold text-black backdrop-blur-md shadow-glow-lime transition-all"
              >
                <Download size={13} />
                <span>Download MP4</span>
              </a>
            </div>
          </div>

          {/* Bottom Video Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl border border-white/10 bg-black/60 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
              </button>
              <span className="text-xs text-zinc-300 line-clamp-1 max-w-md hidden sm:inline">
                {activeVideo.prompt}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                1080p Stream
              </span>
            </div>
          </div>
        </div>

        {/* Recent Generations Filmstrip (Horizontal Scroll) */}
        {newGenHistory.length > 0 && (
          <div className="mt-6 w-full max-w-5xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Recent Renders ({newGenHistory.length})
              </span>
              <span className="text-[11px] text-zinc-500">Click to replay</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {newGenHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveVideo(item);
                    setIsPlaying(true);
                  }}
                  className={`group relative h-16 w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border transition-all ${
                    activeVideo.id === item.id
                      ? 'border-emerald-400 shadow-glow-lime'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=85'}
                    alt={item.prompt}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={14} className="text-white fill-current" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. FLOATING DIRECTOR COMMAND BAR (DOCKED AT BOTTOM, ALWAYS VISIBLE) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-studio-950/95 p-4 backdrop-blur-2xl">
        <div className="mx-auto max-w-5xl space-y-3">
          {/* Main Prompt Bar + Primary Generate Action */}
          <div className="relative flex items-center gap-2 rounded-2xl border border-white/15 bg-black/60 p-2 shadow-2xl focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400/30">
            {/* Surprise Me Prompt Button */}
            <button
              type="button"
              onClick={handleSurprisePrompt}
              title="Generate random cinematic prompt"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-all"
            >
              <Sparkles size={18} />
            </button>

            {/* Main Prompt Input */}
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isGenerating) handleGenerate();
              }}
              placeholder={`Describe your cinematic scene for ${currentModel.name}...`}
              className="w-full bg-transparent px-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
            />

            {/* Prominent Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex h-11 flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-apex-lime to-apex-cyan px-6 text-sm font-black text-black shadow-glow-lime transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Zap className="animate-spin" size={16} />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <Video size={16} />
                  <span>Generate Video</span>
                  <span className="rounded bg-black/20 px-1.5 py-0.2 text-[9px] font-mono">0 CR</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Director Controls Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left Controls: Ratio & Duration & Camera */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Aspect Ratio Pills */}
              <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-0.5">
                {['16:9', '9:16', '1:1', '21:9'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                      aspectRatio === ratio
                        ? 'bg-emerald-400 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              {/* Duration Pills */}
              <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-0.5">
                {['5s', '10s', '15s', '30s'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                      duration === d
                        ? 'bg-emerald-400 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Camera Motion Selector */}
              <div className="relative">
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-zinc-300 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="Drone Orbit 360">Drone Orbit 360</option>
                  <option value="FPV Dive">FPV Dive</option>
                  <option value="Cinematic Dolly">Cinematic Dolly</option>
                  <option value="Handheld Organic">Handheld Organic</option>
                  <option value="Curved 3D Rail">Curved 3D Rail</option>
                  <option value="Pan Left/Right">Pan Left/Right</option>
                </select>
              </div>

              {/* Framerate */}
              <div className="hidden sm:flex items-center rounded-lg border border-white/10 bg-black/40 p-0.5">
                {[24, 30, 60].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFps(f as any)}
                    className={`rounded px-2 py-1 text-[11px] font-semibold transition-all ${
                      fps === f
                        ? 'bg-apex-cyan text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {f}fps
                  </button>
                ))}
              </div>
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 size={12} /> Unlimited Generations
              </span>
              <span>•</span>
              <span>Zero Local Download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
