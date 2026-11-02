'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Zap,
  Sparkles,
  Film,
  Layers,
  Code2,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Sliders,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';

interface TopbarProps {
  collapsed: boolean;
  onOpenMobile: () => void;
}

export default function Topbar({ collapsed, onOpenMobile }: TopbarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();
  const { credits, addCredits } = useCreditsStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const quickTools = [
    { name: 'Image', href: '/create/image', icon: Sparkles },
    { name: 'Video', href: '/create/video', icon: Film },
    { name: 'Studio', href: '/studio', icon: Layers },
    { name: 'API Runner', href: '/chat', icon: Code2 },
  ];

  return (
    <header
      className={`fixed top-0 right-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-studio-950/80 px-4 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobile}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Global Studio Search */}
        <div className="relative flex-1 hidden sm:block">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts, models, styles, or cinema settings..."
            className="w-full rounded-full border border-white/10 bg-studio-900/90 py-1.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 transition-all focus:border-apex-lime/50 focus:outline-none focus:ring-1 focus:ring-apex-lime/30"
          />
        </div>
      </div>

      {/* Middle: Quick Tool Pills */}
      <div className="hidden xl:flex items-center gap-1.5 bg-studio-900/60 p-1 rounded-full border border-white/5">
        {quickTools.map((t) => {
          const isActive = pathname === t.href;
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-apex-lime text-black font-semibold shadow-glow-lime'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={12} />
              {t.name}
            </Link>
          );
        })}
      </div>

      {/* Right side: SSO Pill, Credits & Profile */}
      <div className="flex items-center gap-3">
        {/* Single Sign-On Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-studio-900 border border-white/5 text-[11px] text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-apex-lime" />
          <span className="font-mono text-zinc-300">SSO Active</span>
        </div>

        {/* Credits Counter */}
        <button
          onClick={() => {
            addCredits(50);
            triggerConfetti();
          }}
          className="flex items-center gap-1.5 rounded-full border border-apex-lime/40 bg-apex-lime/10 px-3 py-1 text-xs font-semibold text-apex-lime transition-all hover:bg-apex-lime hover:text-black shadow-glow-subtle"
          title="Click to recharge +50 demo credits"
        >
          <Zap size={13} className="fill-current" />
          <span>{credits}</span>
          <span className="text-[10px] opacity-75 font-normal">Credits</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1 transition-all hover:bg-white/5"
          >
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="h-8 w-8 rounded-full border border-apex-lime/40 object-cover"
            />
            <span className="hidden md:block text-xs font-medium text-zinc-200">
              {user?.fullName?.split(' ')[0] || 'Gowshik'}
            </span>
            <ChevronDown size={14} className="text-zinc-500" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-studio-900 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in-50 zoom-in-95"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs font-semibold text-white">{user?.fullName || 'Gowshik Admin'}</p>
                <p className="text-[11px] text-zinc-400 font-mono truncate">{user?.email || 'creator@atomic-apex.ai'}</p>
                <div className={`mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                  user?.role === 'admin'
                    ? 'bg-[#C9A25E]/15 text-[#C9A25E] border border-[#C9A25E]/30'
                    : 'bg-apex-cyan/15 text-apex-cyan border border-apex-cyan/30'
                }`}>
                  {user?.role === 'admin' ? <Shield size={10} /> : <Sparkles size={10} />}
                  {user?.role === 'admin' ? 'Studio Founder / Admin' : 'Studio Creator'}
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <Sliders size={14} className="text-zinc-400" />
                  Studio Settings & API Keys
                </Link>
                <Link
                  href="/assets"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <User size={14} className="text-zinc-400" />
                  My Creative Assets
                </Link>
              </div>

              <div className="pt-1 border-t border-white/5">
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
