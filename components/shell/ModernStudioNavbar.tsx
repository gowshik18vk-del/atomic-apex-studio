// components/shell/ModernStudioNavbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Video,
  Film,
  Sparkles,
  Layers,
  MessageSquareCode,
  FolderHeart,
  History,
  Settings,
  Zap,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
  PlusCircle,
  Key,
  Crown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';

export default function ModernStudioNavbar() {
  const pathname = usePathname();
  const { user, signOut, isAuthenticated } = useAuthStore();
  const { credits, isAdminUnlimited, redeemCode, addCredits, syncWithDatabase } = useCreditsStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Admin Code Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    syncWithDatabase();
  }, [syncWithDatabase]);

  const navLinks = [
    {
      name: 'New Gen Video',
      href: '/create/new-gen-video',
      icon: Video,
      badge: 'UNLIMITED',
      highlight: true,
    },
    {
      name: 'Video Studio',
      href: '/video',
      icon: Film,
    },
    {
      name: 'Image Studio',
      href: '/create/image',
      icon: Sparkles,
    },
    {
      name: 'Multi-Model Studio',
      href: '/studio',
      icon: Layers,
    },
    {
      name: 'AI Copilot & API',
      href: '/chat',
      icon: MessageSquareCode,
    },
    {
      name: 'My Gallery',
      href: '/assets',
      icon: FolderHeart,
    },
    {
      name: 'History',
      href: '/history',
      icon: History,
    },
  ];

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const res = redeemCode(inputCode);
    if (res.success) {
      setCodeFeedback({ type: 'success', message: res.message });
      triggerConfetti();
      setTimeout(() => {
        setAdminModalOpen(false);
        setInputCode('');
        setCodeFeedback(null);
      }, 2500);
    } else {
      setCodeFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080b11]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black shadow-lg transition-transform group-hover:scale-105">
                <span>A</span>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-extrabold tracking-wider text-white">
                  ATOMIC<span className="text-indigo-400">STUDIO</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                  Next-Gen AI Platform
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === '/video' && pathname === '/create/video');
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    } ${link.highlight && !isActive ? 'text-emerald-400 font-bold' : ''}`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-400' : ''} />
                    <span>{link.name}</span>

                    {link.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[8px] font-extrabold tracking-wider ${
                          isActive
                            ? 'bg-emerald-400 text-black'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Admin Code, Credits, Profile, Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Admin Code Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setAdminModalOpen(true);
                setCodeFeedback(null);
              }}
              title="Enter Admin Code for 100 Credits & Unlimited Generations"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                isAdminUnlimited
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {isAdminUnlimited ? (
                <>
                  <Crown size={13} className="text-amber-400" />
                  <span className="hidden sm:inline">ADMIN UNLIMITED</span>
                </>
              ) : (
                <>
                  <Key size={13} className="text-zinc-400" />
                  <span className="hidden sm:inline">Admin Code</span>
                </>
              )}
            </button>

            {/* Credit Balance Badge */}
            <div
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
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

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 text-xs text-zinc-300 hover:bg-white/10 transition-all"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 font-bold text-white text-xs">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium text-white max-w-[100px] truncate">
                    {user?.fullName || 'Creator'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0c1017] p-2 shadow-2xl backdrop-blur-2xl">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Settings size={14} /> Settings & Credits
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#080b11] p-4 lg:hidden space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Admin Code Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Admin Access Code</h3>
                  <p className="text-xs text-zinc-400">Unlock 100 Credits & Unlimited Video Generation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {isAdminUnlimited && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-semibold text-amber-300">
                <Crown size={16} className="text-amber-400 shrink-0" />
                <span>Admin Unlimited Mode is currently active! Credits are never deducted.</span>
              </div>
            )}

            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Enter 6-Digit Admin Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 141211"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {codeFeedback && (
                <div
                  className={`flex items-center gap-2 rounded-2xl p-3 text-xs font-medium ${
                    codeFeedback.type === 'success'
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  {codeFeedback.type === 'success' ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 shrink-0" />
                  )}
                  <span>{codeFeedback.message}</span>
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
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
