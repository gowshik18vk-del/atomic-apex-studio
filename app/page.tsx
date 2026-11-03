'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Film,
  Layers,
  MessageSquareCode,
  Zap,
  ArrowRight,
  Play,
  ShieldCheck,
  CheckCircle2,
  Code2,
  ExternalLink,
  ChevronRight,
  Star,
  Copy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SHOWCASE_ITEMS } from '@/lib/constants/showcase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { ATOMIC_LINKS } from '@/lib/constants/links';

// Atomic Apex Studio Signature Gilt Brand Mark (from creator studio)
function ApexBrandMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <defs>
        <linearGradient id="apex-gilt" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F6E05E" />
          <stop offset="1" stopColor="#C9A25E" />
        </linearGradient>
      </defs>
      <ellipse
        cx="16"
        cy="17"
        rx="13"
        ry="6.2"
        transform="rotate(-18 16 17)"
        stroke="url(#apex-gilt)"
        strokeWidth="1.2"
        opacity="0.85"
      />
      <path d="M16 4.5 L25 26 H20.6 L16 14.6 L11.4 26 H7 Z" fill="url(#apex-gilt)" />
      <circle cx="25.6" cy="11.2" r="1.6" fill="#F6E05E" />
    </svg>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeHeroVideo, setActiveHeroVideo] = useState(
    'https://static-public-media.higgsfield.ai/cards/4c2bb5a7-ba39-464d-be1d-01de1c52dcaf.mp4'
  );
  const [isMuted, setIsMuted] = useState(true);
  const [promptInput, setPromptInput] = useState('');
  const [generationType, setGenerationType] = useState<'image' | 'video'>('image');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const heroVideos = [
    {
      title: 'Commercial Fluid Dynamics',
      engine: 'Apex Studio V1',
      url: 'https://static-public-media.higgsfield.ai/cards/4c2bb5a7-ba39-464d-be1d-01de1c52dcaf.mp4',
    },
    {
      title: 'Cyberpunk Monolith Rain',
      engine: 'Apex Pixel Swift',
      url: 'https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4',
    },
    {
      title: 'High Velocity Canyon Rush',
      engine: 'Apex Range V2',
      url: 'https://static-public-media.higgsfield.ai/cards/8dddb16b-6fe1-4cac-a11a-a650691a292d.mp4',
    },
  ];

  const quickPromptChips = [
    {
      label: 'Dawn Ascent',
      type: 'image' as const,
      prompt:
        'Cinematic editorial photograph of a lone figure in a long camel coat on a misty brutalist concrete staircase at dawn, warm champagne light, deep navy shadows, film grain, 35mm',
    },
    {
      label: 'Copper Perfume',
      type: 'image' as const,
      prompt:
        'Luxury product still life: a smoked glass perfume bottle on a copper plinth, soft rim light, dark graphite background, subtle reflections, high-end commercial photography',
    },
    {
      label: 'Tokyo Neon Rain',
      type: 'video' as const,
      prompt:
        'Type it. Watch it move. Cinematic tracking shot of Shibuya crossing in heavy neon rain, reflections on wet asphalt, steam rising from grates, 35mm anamorphic flare',
    },
    {
      label: 'Volcanic Dunes',
      type: 'image' as const,
      prompt:
        'Wide aerial landscape of a winding river through dark volcanic dunes at golden hour, warm copper highlights, deep blue shadows, painterly cinematic matte',
    },
    {
      label: 'The Watchmaker',
      type: 'image' as const,
      prompt:
        'Portrait of an elderly watchmaker examining a gold movement through a loupe, Rembrandt lighting, dark navy workshop, warm brass tones, shallow depth of field',
    },
  ];

  const handleLaunchPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (generationType === 'image') {
      window.location.href = ATOMIC_LINKS.vision;
    } else {
      window.location.href = ATOMIC_LINKS.pixelVideo;
    }
  };

  const handleSelectChip = (chip: (typeof quickPromptChips)[0]) => {
    setPromptInput(chip.prompt);
    setGenerationType(chip.type);
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-foreground selection:bg-apex-lime selection:text-black">
      {/* 1. Global Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-[#070b12]/90 px-6 sm:px-10 backdrop-blur-xl">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <ApexBrandMark className="size-9 transition-transform group-hover:scale-105" />
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-[0.22em] text-white">
              ATOMIC APEX
            </span>
            <span className="mt-1 font-mono text-[9.5px] tracking-[0.42em] text-[#C9A25E]">
              STUDIO
            </span>
          </div>
        </Link>

        {/* Center Navigation Pills - Directing to user's products */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold text-zinc-300">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all text-apex-lime"
          >
            Explore
          </Link>
          <a
            href={ATOMIC_LINKS.vision}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
          >
            <span>Atomic Apex Vision</span>
            <ExternalLink size={11} className="text-zinc-500" />
          </a>
          <a
            href={ATOMIC_LINKS.pixelVideo}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
          >
            <span>Apex Pixel (Video)</span>
            <ExternalLink size={11} className="text-zinc-500" />
          </a>
          <a
            href={ATOMIC_LINKS.creatorStudio}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
          >
            <span>Creator Studio</span>
            <ExternalLink size={11} className="text-zinc-500" />
          </a>
          <a
            href={ATOMIC_LINKS.workspace}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
          >
            <Code2 size={13} className="text-apex-cyan" />
            <span>Workspace API</span>
            <ExternalLink size={11} className="text-zinc-500" />
          </a>
        </nav>

        {/* Right Auth / Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#C9A25E]/40 bg-[#C9A25E]/10 text-xs font-semibold text-[#C9A25E] hover:bg-[#C9A25E]/20 transition-all"
            >
              <span className="h-2 w-2 rounded-full bg-apex-lime animate-pulse" />
              <span>{user?.fullName || 'Studio Member'}</span>
              <span className="rounded bg-[#C9A25E]/20 px-1.5 py-0.5 text-[9px] font-mono text-white">
                {user?.credits || 100} CR
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
          )}

          <a
            href={ATOMIC_LINKS.creatorStudio}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-glow-lime"
          >
            Start Creating <ArrowRight size={13} />
          </a>
        </div>
      </header>

      {/* 2. Hero Section: "Every frame starts as a sentence." */}
      <section className="relative pt-32 pb-16 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#C9A25E]/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-36 right-10 h-80 w-80 rounded-full bg-apex-lime/10 blur-[110px] pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A25E]/30 bg-[#C9A25E]/10 px-4 py-1.5 text-xs font-semibold text-[#F6E05E] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#F6E05E] animate-pulse" />
            <span className="font-mono tracking-wider uppercase text-[11px]">
              Prompt-first creative studio
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.04]">
            Every frame starts as a{' '}
            <em className="italic not-italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F6E05E] via-amber-200 to-[#C9A25E] drop-shadow-sm">
              sentence
            </em>
            .
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Write what you want to see. Atomic Apex turns it into images and short videos using real AI models — no uploads, no source images.
          </p>

          {/* Interactive Fast Prompt Bar */}
          <form
            onSubmit={handleLaunchPrompt}
            className="pt-2 max-w-2xl mx-auto rounded-2xl border border-white/15 bg-studio-900/90 p-2 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
          >
            {/* Mode Switcher */}
            <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setGenerationType('image')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  generationType === 'image'
                    ? 'bg-[#C9A25E] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles size={13} /> Image
              </button>
              <button
                type="button"
                onClick={() => setGenerationType('video')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  generationType === 'video'
                    ? 'bg-apex-lime text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film size={13} /> Video
              </button>
            </div>

            {/* Input field */}
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={
                generationType === 'image'
                  ? 'Describe an image to open in Atomic Apex Vision...'
                  : 'Describe a video to open in Apex Pixel...'
              }
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />

            {/* Generate Action Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-apex-lime to-emerald-400 hover:opacity-90 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-lime whitespace-nowrap transition-all"
            >
              <span>{generationType === 'image' ? 'Open in Vision' : 'Open in Pixel'}</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Quick Prompt Idea Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-3xl mx-auto">
            <span className="text-[11px] text-zinc-500 font-mono">Try ideas:</span>
            {quickPromptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectChip(chip)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 hover:border-[#C9A25E]/50 hover:bg-white/10 text-zinc-300 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Hero Video Display Showcase */}
        <div className="relative mt-12 rounded-3xl border border-white/10 bg-studio-900/60 p-2 sm:p-3 shadow-2xl backdrop-blur-2xl">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <video
              src={activeHeroVideo}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-transparent opacity-70" />

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-apex-lime" />}
            </button>

            {/* Video Overlay Pills */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="rounded bg-apex-lime text-black px-2 py-0.5 text-[10px] font-bold font-mono uppercase">
                  Apex Pixel Cinematic Engine
                </span>
                <h3 className="font-display text-lg font-bold text-white drop-shadow-md">
                  Dynamic Camera Trajectories & Volumetric Fluidity
                </h3>
              </div>

              {/* Video Selector Thumbnails */}
              <div className="flex items-center gap-2">
                {heroVideos.map((hv, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHeroVideo(hv.url)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      activeHeroVideo === hv.url
                        ? 'border-apex-lime bg-apex-lime/20 text-white'
                        : 'border-white/10 bg-black/50 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {hv.engine}
                  </button>
                ))}
                <a
                  href={ATOMIC_LINKS.pixelVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ml-2"
                >
                  <Film size={14} /> Open in Pixel <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Creator Studio 4 Sample Panels (Original Lovable Replica) */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C9A25E] font-mono uppercase tracking-wider">
              Studio Samples • Prompt-First Generations
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Curated Exemplars from the Core Engine
            </h2>
          </div>
          <a
            href={ATOMIC_LINKS.creatorStudio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
          >
            Launch Prompt Studio <ExternalLink size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHOWCASE_ITEMS.slice(0, 4).map((sample) => (
            <figure
              key={sample.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-studio-900/80 shadow-glass-card hover:border-[#C9A25E]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] bg-black overflow-hidden">
                <img
                  src={sample.thumbnailUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 rounded bg-black/70 border border-white/15 px-2 py-0.5 text-[9px] font-mono text-[#F6E05E] uppercase tracking-wider backdrop-blur-md">
                  Sample
                </span>
                <span className="absolute right-2.5 top-2.5 rounded bg-black/70 border border-white/15 px-2 py-0.5 text-[9px] font-mono text-zinc-300 backdrop-blur-md">
                  {sample.model}
                </span>
              </div>

              <figcaption className="p-3.5 space-y-2">
                <h4 className="text-xs font-bold text-white line-clamp-1">{sample.title}</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                  {sample.prompt}
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(sample.id, sample.prompt)}
                    className="text-[10px] font-mono text-[#C9A25E] hover:underline flex items-center gap-1"
                  >
                    <Copy size={11} /> {copiedPromptId === sample.id ? 'Copied!' : 'Copy prompt'}
                  </button>
                  <a
                    href={sample.type === 'video' ? ATOMIC_LINKS.pixelVideo : ATOMIC_LINKS.vision}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-zinc-300 hover:text-white flex items-center gap-0.5"
                  >
                    Open <ExternalLink size={11} />
                  </a>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 5. Four Integrated Tool Suites (Directing to user's exact links) */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">
            Everything Inside Your Creative Suite
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Launch directly into each dedicated studio engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Atomic Apex Vision */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-[#C9A25E]/50 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-[#C9A25E]/10 border border-[#C9A25E]/30 flex items-center justify-center text-[#F6E05E]">
                  <Sparkles size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  APEX VISION V2
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-[#F6E05E] transition-colors">
                Atomic Apex Vision
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Turn text prompts into studio-grade images with Apex V1 and Apex Vision V2. 20 free credits every day, 8K render fidelity, and multiple aspect ratios.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <a
                href={ATOMIC_LINKS.vision}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#F6E05E] hover:underline flex items-center gap-1.5"
              >
                <span>Launch Atomic Apex Vision</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Card 2: Apex Pixel (Video) */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-apex-lime/50 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-apex-lime/10 border border-apex-lime/30 flex items-center justify-center text-apex-lime">
                  <Film size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  APEX PIXEL
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-apex-lime transition-colors">
                Apex Pixel (Video)
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Type it. Watch it move. Explore cinematic camera orbits, crane moves, and generate videos with ApexPixel Swift, Studio and Range.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <a
                href={ATOMIC_LINKS.pixelVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-apex-lime hover:underline flex items-center gap-1.5"
              >
                <span>Launch Apex Pixel</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Card 3: Creator Studio */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-purple-400/50 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Layers size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  ATOMIC APEX
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                Atomic Apex Creator Studio
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                A prompt-first creative studio. Every frame starts as a sentence. Generate images and videos with real AI models.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <a
                href={ATOMIC_LINKS.creatorStudio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1.5"
              >
                <span>Launch Creator Studio</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Card 4: Atomic Workspace API Runner */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-apex-cyan/50 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-apex-cyan/10 border border-apex-cyan/30 flex items-center justify-center text-apex-cyan">
                  <Code2 size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  WORKSPACE
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-apex-cyan transition-colors">
                Atomic Workspace Runner
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                A project-aware AI workspace for real provider models. Test prompts and generate code across Gemini, OpenAI, Claude, and Mistral.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <a
                href={ATOMIC_LINKS.workspace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-apex-cyan hover:underline flex items-center gap-1.5"
              >
                <span>Launch Workspace Runner</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trending Community Creations Reel */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-apex-lime font-mono uppercase tracking-wider">
              Atomic Apex Live Reel
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white mt-1">
              Community Reel & Prompt Feed
            </h2>
          </div>

          <a
            href={ATOMIC_LINKS.creatorStudio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
          >
            Explore Full Library <ExternalLink size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHOWCASE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-studio-900 shadow-glass-card hover:border-apex-lime/40 transition-all duration-300"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                {item.type === 'video' ? (
                  <video
                    src={item.mediaUrl}
                    poster={item.thumbnailUrl}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                <div className="absolute top-2.5 left-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-mono text-apex-lime border border-white/10">
                  {item.model}
                </div>

                {item.duration && (
                  <div className="absolute bottom-2.5 right-2.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300 flex items-center gap-1">
                    <Play size={8} className="fill-current text-apex-lime" />
                    {item.duration}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-apex-lime transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>{item.creator.name}</span>
                  <a
                    href={item.type === 'video' ? ATOMIC_LINKS.pixelVideo : ATOMIC_LINKS.vision}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-apex-lime hover:underline flex items-center gap-1"
                  >
                    Direct <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-studio-900 to-studio-950 p-8 sm:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-apex-lime/10 blur-3xl pointer-events-none" />

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to Direct Your First Masterpiece?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Sign in with Google OAuth or email to claim your 100 complimentary creation credits and direct your vision with Atomic Apex Studio.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={ATOMIC_LINKS.creatorStudio}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-glow-lime w-full sm:w-auto"
            >
              <Zap size={16} className="fill-current" /> Launch Atomic Apex Studio
            </a>

            <Link
              href="/login"
              className="px-6 py-4 rounded-2xl bg-studio-900 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-colors w-full sm:w-auto"
            >
              Sign In with Google
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-white/5 bg-[#070b12] px-6 sm:px-12 py-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2.5">
          <ApexBrandMark className="size-6" />
          <span className="font-bold text-white">Atomic Apex Studio</span>
          <span>© 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={ATOMIC_LINKS.vision}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Atomic Apex Vision
          </a>
          <a
            href={ATOMIC_LINKS.pixelVideo}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Apex Pixel (Video)
          </a>
          <a
            href={ATOMIC_LINKS.creatorStudio}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Creator Studio
          </a>
          <a
            href={ATOMIC_LINKS.workspace}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Workspace API
          </a>
        </div>
      </footer>
    </div>
  );
}
