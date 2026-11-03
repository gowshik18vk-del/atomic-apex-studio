'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Video,
  Film,
  Sparkles,
  Layers,
  Zap,
  ArrowRight,
  Play,
  Volume2,
  VolumeX,
  Cloud,
  Cpu,
  Infinity as InfinityIcon,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Download,
  FolderHeart,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { NEW_GEN_VIDEO_MODELS } from '@/lib/constants/models';

export default function ModernLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [generationType, setGenerationType] = useState<'newgen' | 'image' | 'video'>('newgen');
  const [promptInput, setPromptInput] = useState(
    'Futuristic electric hypercar drifting through nocturnal Tokyo overpass, anamorphic lens flares, motion blur'
  );
  const [isMuted, setIsMuted] = useState(true);
  const [copied, setCopied] = useState(false);

  const heroVideos = [
    {
      title: 'Wan 2.1 • Nocturnal Hypercar Drift',
      provider: 'Wan-AI / Alibaba Cloud',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      badge: 'UNLIMITED CLOUD',
    },
    {
      title: 'LTX-Video • Realtime 30FPS Motion',
      provider: 'Lightricks Cloud',
      url: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
      badge: 'FAST DiT',
    },
    {
      title: 'CogVideoX • Cinematic Camera Rail',
      provider: 'THUDM / Zhipu AI Cloud',
      url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      badge: 'OPEN CINEMA',
    },
  ];

  const [activeHeroVideo, setActiveHeroVideo] = useState(heroVideos[0]);

  const quickChips = [
    {
      label: 'Tokyo Drift',
      prompt: 'Futuristic electric hypercar drifting through nocturnal Tokyo overpass, anamorphic lens flares, motion blur, octane render',
    },
    {
      label: 'Glacial Eagle',
      prompt: 'Golden eagle soaring through crystalline glacial canyon at sunrise, volumetric morning mist, ultra-smooth 60fps tracking camera',
    },
    {
      label: 'Cyberpunk Muse',
      prompt: 'Ethereal cyberpunk cyborg woman gazing across floating neon metropolis in rain, hyper-detailed reflections, 8k cinematic lighting',
    },
    {
      label: 'Deep Space',
      prompt: 'Deep space exploration vessel entering iridescent wormhole event horizon, gravitational lensing, interstellar cinema scale',
    },
  ];

  const handleLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = promptInput.trim() ? `?prompt=${encodeURIComponent(promptInput.trim())}` : '';
    if (generationType === 'image') {
      router.push(`/create/image${q}`);
    } else if (generationType === 'video') {
      router.push(`/create/video${q}`);
    } else {
      router.push(`/create/new-gen-video${q}`);
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Modern Minimal Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06080d]/80 px-6 backdrop-blur-2xl sm:px-12">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-extrabold text-white shadow-lg transition-transform group-hover:scale-105">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-black tracking-wider text-white">
                ATOMIC<span className="text-indigo-400">STUDIO</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                Next-Gen AI Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Link
              href="/create/new-gen-video"
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-400 hover:bg-emerald-500/20 transition-all font-bold"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>New Gen Video</span>
              <span className="rounded bg-emerald-400/20 px-1 py-0.2 text-[8px] uppercase tracking-wider font-extrabold">
                UNLIMITED
              </span>
            </Link>

            <Link
              href="/create/image"
              className="flex items-center gap-1 rounded-full px-3.5 py-1.5 hover:bg-white/5 hover:text-white transition-all"
            >
              <Sparkles size={13} className="text-indigo-400" />
              <span>Image Studio</span>
            </Link>

            <Link
              href="/create/video"
              className="flex items-center gap-1 rounded-full px-3.5 py-1.5 hover:bg-white/5 hover:text-white transition-all"
            >
              <Film size={13} className="text-purple-400" />
              <span>Video Suite</span>
            </Link>

            <Link
              href="/studio"
              className="flex items-center gap-1 rounded-full px-3.5 py-1.5 hover:bg-white/5 hover:text-white transition-all"
            >
              <Layers size={13} className="text-pink-400" />
              <span>Director Studio</span>
            </Link>

            <Link
              href="/assets"
              className="flex items-center gap-1 rounded-full px-3.5 py-1.5 hover:bg-white/5 hover:text-white transition-all text-zinc-400"
            >
              <FolderHeart size={13} />
              <span>Gallery</span>
            </Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/create/new-gen-video"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all"
              >
                <span>Launch Studio</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/create/new-gen-video"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-indigo-500 px-4 py-2 text-xs font-bold text-black shadow-lg hover:brightness-110 transition-all"
                >
                  <span>Start Free</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-6 pt-20 pb-16 sm:px-12 max-w-7xl mx-auto text-center space-y-8">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-32 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        {/* Status Badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            UNLIMITED CLOUD VIDEO & IMAGE GENERATION
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 text-[11px]">0 MB Downloaded to Your System</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-5xl mx-auto">
          Direct Next-Gen AI Video & Images{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
            Entirely in the Cloud
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          Create cinematic video clips and photorealistic images using open cloud architectures: Wan 2.1, LTX-Video 30FPS, CogVideoX, and Apex Vision. Zero local hardware requirements, zero watermarks.
        </p>

        {/* Unified Fast Director Prompt Bar */}
        <form
          onSubmit={handleLaunch}
          className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#0b0e17]/90 p-2.5 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          {/* Mode Switcher */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/50 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setGenerationType('newgen')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                generationType === 'newgen'
                  ? 'bg-emerald-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Video size={13} />
              <span>New Gen (Unlimited)</span>
            </button>

            <button
              type="button"
              onClick={() => setGenerationType('image')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                generationType === 'image'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={() => setGenerationType('video')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                generationType === 'video'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Film size={13} />
              <span>Video</span>
            </button>
          </div>

          {/* Prompt Input */}
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe the scene you want to generate in detail..."
            className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-black hover:brightness-110 shadow-lg whitespace-nowrap transition-all"
          >
            <span>Generate Now</span>
            <ArrowRight size={13} />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-zinc-500 font-mono text-[11px]">Inspiration:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPromptInput(chip.prompt)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-300 hover:border-indigo-400 hover:bg-white/10 transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 3. Hero Cinema Viewport */}
        <div className="relative mt-8 rounded-3xl border border-white/10 bg-[#080b12] p-3 shadow-2xl backdrop-blur-2xl max-w-5xl mx-auto">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <video
              src={activeHeroVideo.url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 z-20 rounded-full border border-white/15 bg-black/60 p-2.5 text-white backdrop-blur-md hover:bg-black/80 transition-all"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-emerald-400" />}
            </button>

            {/* Video Meta Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/60 p-3 backdrop-blur-md text-left">
              <div>
                <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400 uppercase border border-emerald-500/30">
                  {activeHeroVideo.badge}
                </span>
                <h3 className="font-display text-sm font-bold text-white mt-1">
                  {activeHeroVideo.title}
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Cloud Provider: {activeHeroVideo.provider}
                </p>
              </div>

              <Link
                href="/create/new-gen-video"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300 transition-all"
              >
                <span>Direct in Studio</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Engine Selector Carousel */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {heroVideos.map((hv, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveHeroVideo(hv)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeHeroVideo.title === hv.title
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-emerald-400">{hv.badge}</div>
                <div className="text-xs font-bold text-white truncate mt-0.5">{hv.title}</div>
                <div className="text-[10px] text-zinc-500 font-mono">{hv.provider}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Model Capabilities Grid */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400">
            Open Cloud Infrastructure
          </span>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Next-Gen Video & Image Engines
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            All models execute remotely in the cloud with zero downloads required on your system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Wan 2.1 Video */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0a0d16] hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Video size={20} />
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  UNLIMITED FREE
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                Wan 2.1 Video Engine
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                State-of-the-art open diffusion video model by Wan-AI / Alibaba Cloud. Generates fluid motion trajectories and photorealism at 1080p resolution.
              </p>
            </div>
            <div className="pt-6 border-t border-white/5 mt-6">
              <Link
                href="/create/new-gen-video"
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                Launch Wan 2.1 Studio <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card 2: LTX-Video */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0a0d16] hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Film size={20} />
                </div>
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-indigo-300 border border-indigo-500/30">
                  REALTIME 30FPS
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                LTX-Video (Lightricks)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ultra-fast DiT architecture hosted on Lightricks remote infrastructure. Generates smooth 30FPS video clips in seconds with dynamic camera controls.
              </p>
            </div>
            <div className="pt-6 border-t border-white/5 mt-6">
              <Link
                href="/create/new-gen-video"
                className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
              >
                Launch LTX-Video Studio <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card 3: Apex Vision Image */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0a0d16] hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Sparkles size={20} />
                </div>
                <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-purple-300 border border-purple-500/30">
                  FLAGSHIP 8K
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                Apex Vision & Flux Pro
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Premier image synthesis with unmatched skin texture, cinematic lighting, and sharp architectural interiors across multiple aspect ratios.
              </p>
            </div>
            <div className="pt-6 border-t border-white/5 mt-6">
              <Link
                href="/create/image"
                className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
              >
                Launch Image Studio <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean Footer */}
      <footer className="border-t border-white/10 bg-[#040609] px-6 sm:px-12 py-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-[10px]">
            A
          </div>
          <span className="font-bold text-zinc-300">Atomic Studio</span>
          <span>© 2026. Built with Next.js & Open Cloud APIs.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/create/new-gen-video" className="text-emerald-400 hover:underline font-bold">
            New Gen Video (Unlimited)
          </Link>
          <Link href="/create/image" className="hover:text-white transition-colors">
            Image Studio
          </Link>
          <Link href="/create/video" className="hover:text-white transition-colors">
            Video Suite
          </Link>
          <Link href="/studio" className="hover:text-white transition-colors">
            Director Studio
          </Link>
        </div>
      </footer>
    </div>
  );
}
