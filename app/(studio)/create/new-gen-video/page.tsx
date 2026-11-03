// app/(studio)/create/new-gen-video/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Video,
  ExternalLink,
  RotateCcw,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Zap,
  Key,
  Crown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';

const OFFICIAL_VIDEO_STUDIO_URL = 'https://atomic-apex-creator-studio.lovable.app/video';

export default function NewGenVideoStudioPage() {
  const { credits, isAdminUnlimited, redeemCode, syncWithDatabase } = useCreditsStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Admin Code Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminInputCode, setAdminInputCode] = useState('');
  const [adminFeedback, setAdminFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    syncWithDatabase();
  }, [syncWithDatabase]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleReloadIframe = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleAdminCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInputCode.trim()) return;

    const res = redeemCode(adminInputCode);
    if (res.success) {
      setAdminFeedback({ type: 'success', message: res.message });
      triggerConfetti();
      setTimeout(() => {
        setAdminModalOpen(false);
        setAdminInputCode('');
        setAdminFeedback(null);
      }, 2500);
    } else {
      setAdminFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col w-full h-[calc(100vh-4rem)] bg-[#05070a] text-white overflow-hidden"
    >
      {/* 1. TOP STUDIO DIRECT CONTROL BAR */}
      <div className="flex-shrink-0 border-b border-white/10 bg-[#080b11] px-4 py-2.5 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-7xl">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-black font-extrabold shadow-md">
              <Video size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-sm font-black tracking-wider text-white uppercase">
                  New Gen Video Studio
                </h1>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  OFFICIAL LIVE STUDIO
                </span>
                {isAdminUnlimited && (
                  <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    <Crown size={12} className="text-amber-400" /> ADMIN UNLIMITED
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Direct prompt-to-video synthesis • Zero presets • Real-time cloud neural models
              </span>
            </div>
          </div>

          {/* Right Action Controls: Direct Link, Reload, Fullscreen, Admin Code, Credits */}
          <div className="flex items-center gap-2">
            {/* Direct Open Link */}
            <a
              href={OFFICIAL_VIDEO_STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm"
              title="Open full official video studio in new browser tab"
            >
              <span>Open Direct Site</span>
              <ExternalLink size={13} />
            </a>

            {/* Reload Frame Button */}
            <button
              type="button"
              onClick={handleReloadIframe}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
              title="Reload studio frame"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reload</span>
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
              title="Toggle full screen"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full Screen'}</span>
            </button>

            {/* Admin Code Trigger */}
            <button
              type="button"
              onClick={() => {
                setAdminModalOpen(true);
                setAdminFeedback(null);
              }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                isAdminUnlimited
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {isAdminUnlimited ? (
                <>
                  <Crown size={13} className="text-amber-400" />
                  <span className="hidden md:inline">Admin Active</span>
                </>
              ) : (
                <>
                  <Key size={13} className="text-zinc-400" />
                  <span className="hidden md:inline">Admin Code (141211)</span>
                </>
              )}
            </button>

            {/* Credits Pill */}
            <div
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                isAdminUnlimited
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
              }`}
            >
              <Zap
                size={13}
                className={isAdminUnlimited ? 'text-amber-400 fill-current' : 'text-amber-400 fill-current animate-pulse'}
              />
              <span>{isAdminUnlimited ? '∞ UNLIMITED' : `${credits} CR`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EMBEDDED OFFICIAL LIVE VIDEO STUDIO WORKSPACE (ZERO PRESETS) */}
      <div className="relative flex-1 w-full h-full bg-[#030508]">
        {iframeLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#05070a]/90 backdrop-blur-md">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Video size={24} className="text-emerald-400 animate-pulse" />
            </div>
            <div className="mt-4 text-center space-y-1">
              <h3 className="font-display text-sm font-bold text-white">Connecting to New Gen Video Studio...</h3>
              <p className="text-xs text-zinc-400 font-mono">Loading real-time prompt models from your official engine</p>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={OFFICIAL_VIDEO_STUDIO_URL}
          title="New Gen Video Studio"
          onLoad={() => setIframeLoading(false)}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals allow-downloads"
        />
      </div>

      {/* 3. ADMIN CODE MODAL */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Admin Access Code</h3>
                  <p className="text-xs text-zinc-400">Unlock 100 Credits & Unlimited Generations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {isAdminUnlimited && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-semibold text-amber-300">
                <Crown size={16} className="text-amber-400 shrink-0" />
                <span>Admin Unlimited Mode is active! Generations are unlimited with 0 deductions.</span>
              </div>
            )}

            <form onSubmit={handleAdminCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Enter 6-Digit Admin Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 141211"
                  value={adminInputCode}
                  onChange={(e) => setAdminInputCode(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {adminFeedback && (
                <div
                  className={`flex items-center gap-2 rounded-2xl p-3 text-xs font-medium ${
                    adminFeedback.type === 'success'
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  {adminFeedback.type === 'success' ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 shrink-0" />
                  )}
                  <span>{adminFeedback.message}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-black hover:opacity-90 transition-opacity"
                >
                  Activate Admin Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
