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
  Users,
} from 'lucide-react';
import { SHOWCASE_ITEMS } from '@/lib/constants/showcase';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeHeroVideo, setActiveHeroVideo] = useState(
    'https://static-public-media.higgsfield.ai/cards/4c2bb5a7-ba39-464d-be1d-01de1c52dcaf.mp4'
  );

  return (
    <div className="min-h-screen bg-studio-950 text-foreground selection:bg-apex-lime selection:text-black">
      {/* 1. Global Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-studio-950/80 px-6 sm:px-12 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-apex-lime to-emerald-400 text-black shadow-glow-lime">
            <span className="font-display text-xl font-black">A</span>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-studio-950 bg-apex-cyan animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              ATOMIC APEX
              <span className="rounded bg-apex-lime/15 px-1 py-0.5 text-[9px] font-bold text-apex-lime uppercase">
                STUDIO
              </span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Higgsfield Aesthetic Suite</span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-zinc-400">
          <Link href="/create/image" className="hover:text-white transition-colors">
            Apex Vision
          </Link>
          <Link href="/create/video" className="hover:text-white transition-colors">
            Video Maker
          </Link>
          <Link href="/studio" className="hover:text-white transition-colors">
            Creator Studio
          </Link>
          <Link href="/chat" className="hover:text-white transition-colors">
            API Runner & Chat
          </Link>
          <Link href="/assets" className="hover:text-white transition-colors">
            Showcase
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:block text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="glow-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-glow-lime"
          >
            Start Creating <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* 2. Cinematic Dark Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-apex-lime/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-apex-cyan/15 blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-apex-lime/30 bg-apex-lime/10 px-4 py-1.5 text-xs font-semibold text-apex-lime backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-apex-lime animate-pulse" />
            <span>ATOMIC APEX STUDIO • NEXT-GEN AI CREATIVE SUITE</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Cinematic AI Vision. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-apex-lime via-emerald-300 to-apex-cyan">
              Pure Unbounded Motion.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The all-in-one studio engineered for creators, directors, and developers. Deeply integrated image synthesis, Hollywood-grade video generation, multi-model creator workspace, and native API execution — with zero external redirects.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto glow-btn px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-glow-lime"
            >
              <Zap size={18} className="fill-current" />
              Start Creating Now (100 Free Credits)
            </Link>

            <Link
              href="/create/video"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-studio-900 hover:bg-studio-850 text-white border border-white/10 text-sm font-bold flex items-center justify-center gap-2 transition-all hover:border-white/20"
            >
              <Play size={16} className="text-apex-lime fill-apex-lime" />
              Watch Video Demos
            </Link>
          </div>

          {/* Single Sign-On Assurance Banner */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck size={14} className="text-apex-cyan" /> Unified Single Sign-On
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={14} className="text-apex-lime" /> No External Redirects
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Star size={14} className="text-amber-400 fill-amber-400" /> Seeded Admin Ready
            </span>
          </div>
        </div>

        {/* 3. Hero Video Display Showcase */}
        <div className="relative mt-14 rounded-3xl border border-white/10 bg-studio-900/60 p-2 sm:p-3 shadow-2xl backdrop-blur-2xl">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <video
              src={activeHeroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-transparent opacity-60" />

            {/* Video Overlay Pills */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="rounded bg-apex-lime text-black px-2 py-0.5 text-[10px] font-bold font-mono uppercase">
                  Studio V1 Cinema Engine
                </span>
                <h3 className="font-display text-lg font-bold text-white drop-shadow-md">
                  Dynamic Camera Trajectories & Volumetric Fluidity
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/create/video"
                  className="glow-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Film size={14} /> Open in Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four Core Integrated Tool Cards */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">
            Everything Inside One Creative Core
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Never be redirected to third-party domains. All generation models and developer utilities are deeply embedded and unified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Image Gen */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-apex-lime/40 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-apex-lime/10 border border-apex-lime/30 flex items-center justify-center text-apex-lime">
                  <Sparkles size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  APEX VISION
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-apex-lime transition-colors">
                Image Generation
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Hyper-detailed portraiture, architecture, and commercial product imagery with 8k sharpness, analog film stock, and native aspect ratio formatting.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <Link
                href="/create/image"
                className="text-xs font-semibold text-apex-lime hover:underline flex items-center gap-1"
              >
                Launch Image Studio <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Video Gen */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-apex-cyan/40 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-apex-cyan/10 border border-apex-cyan/30 flex items-center justify-center text-apex-cyan">
                  <Film size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  STUDIO & SWIFT
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-apex-cyan transition-colors">
                Video Generation
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Render 5s and 10s video clips with custom 3D camera orbits, drone flythroughs, dolly zooms, and cinematic framerates up to 60fps.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <Link
                href="/create/video"
                className="text-xs font-semibold text-apex-cyan hover:underline flex items-center gap-1"
              >
                Launch Video Studio <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3: Multi-Model Studio */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-purple-400/40 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Layers size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  ORCHESTRATOR
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                Creator Studio
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Run side-by-side model comparisons across Google Gemini 2.5 Flash, Kling 4.0, and Flux Pro. Build multi-shot storyboards and composite layers.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <Link
                href="/studio"
                className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1"
              >
                Launch Creator Studio <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 4: API Runner & Chat */}
          <div className="p-6 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-amber-400/40 transition-all duration-300 shadow-glass-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <MessageSquareCode size={22} />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  CO-PILOT & RUNNER
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                Atomic AI & API Runner
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Consult with Atomic AI on creative lighting, prompt equations, and scene setups. Execute live HTTP queries against studio endpoints with code export.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <Link
                href="/chat"
                className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
              >
                Launch API Runner <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending Showcase Grid */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-apex-lime font-mono uppercase tracking-wider">
              Higgsfield-Grade Quality
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white mt-1">
              Engineered for Visionary Creators
            </h2>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
          >
            Explore All Creations <ArrowRight size={12} />
          </Link>
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
                  <span className="font-mono text-apex-lime">{item.aspectRatio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Bottom CTA Banner */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-studio-900 to-studio-950 p-8 sm:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-apex-lime/10 blur-3xl pointer-events-none" />

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to Direct Your First Masterpiece?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Sign in with the seeded founder account or create a new profile. Start with 100 complimentary credits and experience the full power of Atomic Apex Studio.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="glow-btn px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-glow-lime w-full sm:w-auto"
            >
              <Zap size={16} className="fill-current" /> Launch Studio Dashboard
            </Link>

            <Link
              href="/login"
              className="px-6 py-4 rounded-2xl bg-studio-900 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-colors w-full sm:w-auto"
            >
              Sign In (Founder User)
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-white/5 bg-studio-950 px-6 sm:px-12 py-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime text-black font-bold text-xs">
            A
          </div>
          <span className="font-bold text-white">Atomic Apex Studio</span>
          <span>© 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/create/image" className="hover:text-white transition-colors">
            Create Image
          </Link>
          <Link href="/create/video" className="hover:text-white transition-colors">
            Create Video
          </Link>
          <Link href="/studio" className="hover:text-white transition-colors">
            Creator Studio
          </Link>
          <Link href="/chat" className="hover:text-white transition-colors">
            API Runner
          </Link>
        </div>
      </footer>
    </div>
  );
}
