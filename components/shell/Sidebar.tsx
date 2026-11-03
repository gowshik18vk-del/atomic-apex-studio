'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Film,
  Layers,
  MessageSquareCode,
  FolderHeart,
  History,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { triggerConfetti } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const { credits, addCredits } = useCreditsStore();
  const { user } = useAuthStore();
  const [showClaimModal, setShowClaimModal] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Image', href: '/create/image', icon: Sparkles, badge: 'APEX VISION' },
    { name: 'Create Video', href: '/create/video', icon: Film, badge: 'STUDIO V1' },
    { name: 'Creator Studio', href: '/studio', icon: Layers, badge: 'MULTI-MODEL' },
    { name: 'Atomic Chat / API', href: '/chat', icon: MessageSquareCode, badge: 'AI & RUNNER' },
    { name: 'My Assets', href: '/assets', icon: FolderHeart },
    { name: 'History', href: '/history', icon: History },
    { name: 'Settings & Credits', href: '/settings', icon: Settings },
  ];

  const handleClaimCredits = () => {
    addCredits(50);
    triggerConfetti();
    setShowClaimModal(true);
    setTimeout(() => setShowClaimModal(false), 3000);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-white/5 bg-studio-950 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-apex-lime to-emerald-400 text-black shadow-glow-lime">
              <span className="font-display text-xl font-black tracking-tighter">A</span>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-studio-950 bg-apex-cyan animate-pulse" />
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  ATOMIC APEX
                  <span className="rounded bg-apex-lime/10 px-1 py-0.2 text-[9px] font-semibold text-apex-lime uppercase">
                    Studio
                  </span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Cinematic Creation Suite
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Button (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-apex-lime/10 text-apex-lime shadow-[inset_0_0_12px_rgba(204,255,0,0.15)] font-semibold border border-apex-lime/20'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  size={19}
                  className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-apex-lime' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />

                {!collapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    {item.badge && !isActive && (
                      <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-400 group-hover:bg-apex-lime/10 group-hover:text-apex-lime">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l bg-apex-lime shadow-glow-lime" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Integrated Single Sign-On Status */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-studio-900 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <ShieldCheck size={14} className="text-apex-cyan" />
                Single Sign-On Active
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-apex-lime" /> Apex Vision
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-apex-lime" /> Apex Pixel
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-apex-lime" /> Studio Suite
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-apex-lime" /> API Runner
              </span>
            </div>
          </div>
        )}

        {/* Credits Card */}
        <div className="p-3 border-t border-white/5">
          {!collapsed ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-studio-850 to-studio-900 p-3.5 shadow-glass-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-400">Available Credits</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-apex-lime">
                  <Zap size={12} className="fill-apex-lime" />
                  PRO TIER
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-display text-2xl font-black text-white">{credits}</span>
                <span className="text-xs text-zinc-500">/ 100 start</span>
              </div>

              <button
                onClick={handleClaimCredits}
                className="w-full py-2 px-3 rounded-xl bg-apex-lime/10 hover:bg-apex-lime text-apex-lime hover:text-black font-semibold text-xs transition-all border border-apex-lime/30 flex items-center justify-center gap-1.5 group"
              >
                <Zap size={13} className="group-hover:fill-black" />
                Claim +50 Free Credits
              </button>

              {showClaimModal && (
                <p className="mt-1.5 text-[10px] text-center text-emerald-400 font-medium">
                  +50 credits added to your studio balance!
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={handleClaimCredits}
              className="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-apex-lime/10 hover:bg-apex-lime hover:text-black text-apex-lime transition-all border border-apex-lime/30"
              title={`${credits} credits available. Click for +50.`}
            >
              <Zap size={16} className="fill-current" />
              <span className="text-[10px] font-bold mt-0.5">{credits}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
