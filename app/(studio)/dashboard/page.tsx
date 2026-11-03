'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Film,
  Layers,
  MessageSquareCode,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Play,
  Heart,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { SHOWCASE_ITEMS } from '@/lib/constants/showcase';
import { formatDate } from '@/lib/utils';

import { ATOMIC_LINKS } from '@/lib/constants/links';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { credits } = useCreditsStore();
  const { generations, setSelectedAsset } = useGenerationStore();

  const toolCards = [
    {
      title: 'Atomic Apex Vision',
      subtitle: 'Image Generation',
      desc: 'Photorealistic imagery with native aspect ratio controls & style presets.',
      href: ATOMIC_LINKS.vision,
      isExternal: true,
      icon: Sparkles,
      badge: 'FLAGSHIP',
      accent: 'from-apex-lime to-emerald-400',
      credits: '2 cr',
    },
    {
      title: 'Apex Pixel Video',
      subtitle: 'Video Generation',
      desc: 'Swift, Studio & Range cinematic models with custom camera orbits.',
      href: ATOMIC_LINKS.pixelVideo,
      isExternal: true,
      icon: Film,
      badge: 'CINEMA 4K',
      accent: 'from-apex-cyan to-blue-500',
      credits: '5 cr',
    },
    {
      title: 'Creator Studio',
      subtitle: 'Multi-Model Suite',
      desc: 'Prompt-first creative studio. Every frame starts as a sentence.',
      href: ATOMIC_LINKS.creatorStudio,
      isExternal: true,
      icon: Layers,
      badge: 'ORCHESTRATOR',
      accent: 'from-purple-500 to-indigo-500',
      credits: '4 cr',
    },
    {
      title: 'Atomic Workspace Runner',
      subtitle: 'API Testing & Chat',
      desc: 'Project-aware AI workspace for real provider models and API testbench.',
      href: ATOMIC_LINKS.workspace,
      isExternal: true,
      icon: MessageSquareCode,
      badge: 'DEVELOPER',
      accent: 'from-amber-400 to-orange-500',
      credits: 'Free',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in-50">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-studio-900 via-studio-850 to-studio-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-apex-lime/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 h-48 w-48 rounded-full bg-apex-cyan/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-apex-lime/30 bg-apex-lime/10 px-3 py-1 text-xs font-semibold text-apex-lime">
            <ShieldCheck size={14} />
            <span>Single Sign-On Active • Founder Access</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-apex-lime to-emerald-400">
              {user?.fullName || 'Gowshik'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Your unified creative studio is primed. Generate photorealistic imagery with Apex Vision, render cinema video with Studio V1, or test pipelines with the API Runner — without leaving Atomic Apex Studio.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Zap size={14} className="text-apex-lime fill-apex-lime" />
              {credits} Credits Available
            </span>
            <span className="text-zinc-600">•</span>
            <span>4 Deeply Integrated Tools</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Engines Online
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Tool Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-apex-lime" /> Creative Engines
          </h2>
          <span className="text-xs text-zinc-500">Native Seamless Navigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {toolCards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={card.href}
                target={card.isExternal ? '_blank' : undefined}
                rel={card.isExternal ? 'noopener noreferrer' : undefined}
                className="group relative flex flex-col justify-between p-5 rounded-3xl border border-white/10 bg-studio-900/70 hover:border-apex-lime/40 transition-all duration-300 shadow-glass-card hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-black font-bold shadow-md`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-zinc-400 font-mono">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-white group-hover:text-apex-lime transition-colors">
                    {card.title}
                  </h3>
                  <span className="text-[11px] text-zinc-500 font-medium block mb-2">
                    {card.subtitle}
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">{card.credits}</span>
                  <span className="font-semibold text-apex-lime flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Launch <ArrowRight size={13} />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Model Latency & Conformance Grid */}
      <div className="p-5 rounded-3xl border border-white/10 bg-studio-900/50 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
          <span className="flex items-center gap-2">
            <TrendingUp size={15} className="text-apex-lime" /> Neural Engine Cluster Status
          </span>
          <span className="text-[11px] font-mono text-zinc-500">Latency & Availability</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-studio-950 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Apex Vision</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Image Synthesis • 1.1s</span>
          </div>

          <div className="p-3 rounded-xl bg-studio-950 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Studio V1 (Cinema)</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Motion Physics • 2.4s</span>
          </div>

          <div className="p-3 rounded-xl bg-studio-950 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Gemini 2.5 Flash</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Multimodal • 0.5s</span>
          </div>

          <div className="p-3 rounded-xl bg-studio-950 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">API Testbench</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Endpoints • 100% OK</span>
          </div>
        </div>
      </div>

      {/* Trending Community Creations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Trending Cinema Creations
            </h2>
            <p className="text-xs text-zinc-400">
              Generated by creators with Studio V1, Swift V1, and Apex Vision.
            </p>
          </div>
          <Link
            href="/assets"
            className="text-xs text-apex-lime hover:underline font-semibold flex items-center gap-1"
          >
            Explore Library <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SHOWCASE_ITEMS.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedAsset({
                  id: item.id,
                  userId: 'a0000000-0000-0000-0000-000000000001',
                  type: item.type,
                  model: item.model,
                  prompt: item.prompt,
                  parameters: { camera: item.cameraMovement },
                  status: 'completed',
                  outputUrl: item.mediaUrl,
                  thumbnailUrl: item.thumbnailUrl,
                  aspectRatio: item.aspectRatio,
                  duration: item.duration,
                  creditsCost: 5,
                  isFavorite: false,
                  createdAt: new Date().toISOString(),
                });
              }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-studio-900 cursor-pointer shadow-glass-card hover:border-apex-lime/30 transition-all duration-300"
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

              <div className="p-3.5 space-y-1.5">
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-apex-lime transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  {item.prompt}
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>{item.creator.name}</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Heart size={10} className="fill-zinc-400" /> {item.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
