'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Zap,
  Key,
  User,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import { triggerConfetti } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface LedgerItem {
  id: string;
  delta: number;
  reason: string;
  timestamp: string;
}

const INITIAL_LEDGER: LedgerItem[] = [
  { id: 'led-1', delta: 60, reason: 'Initial Free Starter Allocation (60 Credits)', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'led-2', delta: -5, reason: 'Generation fee for Studio V1 (Cinema)', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'led-3', delta: -2, reason: 'Generation fee for Apex Vision', timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
];

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const { credits, addCredits, resetCredits, isAdminUnlimited, redeemCode } = useCreditsStore();
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [adminCodeMsg, setAdminCodeMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleRedeemAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCodeInput.trim()) return;
    const res = redeemCode(adminCodeInput);
    if (res.success) {
      setAdminCodeMsg({ success: true, text: res.message });
      setLedger([
        {
          id: 'led-' + Date.now(),
          delta: 100,
          reason: 'Admin Unlock Code 141211 (Unlimited Generation)',
          timestamp: new Date().toISOString(),
        },
        ...ledger,
      ]);
      triggerConfetti();
      setAdminCodeInput('');
    } else {
      setAdminCodeMsg({ success: false, text: res.message });
    }
  };

  const [fullName, setFullName] = useState(user?.fullName || 'Gowshik (Apex Founder)');
  const [ledger, setLedger] = useState<LedgerItem[]>(INITIAL_LEDGER);
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGeminiKey(localStorage.getItem('apex_gemini_key') || '');
      setOpenaiKey(localStorage.getItem('apex_openai_key') || '');
    }
  }, []);

  const handleClaimCredits = () => {
    addCredits(50);
    const newEntry: LedgerItem = {
      id: 'led-' + Date.now(),
      delta: 50,
      reason: 'Claimed Free Founder Allowance',
      timestamp: new Date().toISOString(),
    };
    setLedger([newEntry, ...ledger]);
    triggerConfetti();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName });
    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_gemini_key', geminiKey);
      localStorage.setItem('apex_openai_key', openaiKey);
    }
    setSaved(true);
    triggerConfetti();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime/10 text-apex-lime">
            <Settings size={16} />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Studio Settings & Credit Ledger
          </h1>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Manage your account profile, audit transaction ledger, and configure provider credentials.
        </p>
      </div>

      {/* Credits Quota Card */}
      <div className="rounded-3xl border border-white/10 bg-studio-900/80 p-6 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap size={16} className="text-apex-lime fill-apex-lime" /> Credits Balance & Quotas
          </h2>
          <span className="rounded-full bg-apex-lime/10 px-2.5 py-0.5 text-[10px] font-mono text-apex-lime font-bold">
            FOUNDER TIER
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-studio-950 border border-white/5">
          <div>
            <span className="text-xs text-zinc-400 block">Available Credits</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-3xl font-black text-white">{credits}</span>
              <span className="text-xs text-zinc-500 font-mono">credits</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              • Image Generation = 2 credits &nbsp;|&nbsp; • Video Generation = 5–8 credits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClaimCredits}
              className="glow-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-glow-subtle"
            >
              <Zap size={13} className="fill-current" /> Claim +50 Credits
            </button>
            <button
              onClick={resetCredits}
              className="px-3 py-2 rounded-xl bg-studio-900 hover:bg-white/10 text-zinc-400 text-xs border border-white/10"
              title="Reset balance to initial 100"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Admin Unlimited Mode & Code Redemption */}
        <div className="p-4 rounded-2xl bg-studio-950 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key size={15} className="text-amber-400" />
              <span className="text-xs font-bold text-white">Admin Code Unlock (141211)</span>
            </div>
            {isAdminUnlimited && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                ADMIN UNLIMITED ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400">
            Enter admin code <code className="text-amber-400 font-mono">141211</code> to instantly claim 100 extra credits and unlock lifetime unlimited video generation with 0 deductions.
          </p>
          <form onSubmit={handleRedeemAdmin} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Code 141211"
              value={adminCodeInput}
              onChange={(e) => setAdminCodeInput(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 flex-1 max-w-xs"
            />
            <button
              type="submit"
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-bold transition-all"
            >
              Unlock Unlimited
            </button>
          </form>
          {adminCodeMsg && (
            <p className={`text-xs ${adminCodeMsg.success ? 'text-emerald-400' : 'text-red-400'}`}>
              {adminCodeMsg.text}
            </p>
          )}
        </div>
      </div>

      {/* Credit Ledger Table */}
      <div className="rounded-3xl border border-white/10 bg-studio-900/80 p-6 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt size={16} className="text-apex-cyan" /> Credit Ledger Audit Trail
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">Atomic Server Transactions</span>
        </div>

        <div className="space-y-2">
          {ledger.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-studio-950 border border-white/5 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    item.delta > 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {item.delta > 0 ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                </div>
                <div>
                  <span className="text-zinc-200 font-medium block">{item.reason}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{formatDate(item.timestamp)}</span>
                </div>
              </div>

              <span
                className={`font-mono font-bold ${
                  item.delta > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {item.delta > 0 ? `+${item.delta}` : item.delta} cr
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveSettings} className="rounded-3xl border border-white/10 bg-studio-900/80 p-6 shadow-glass-card space-y-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <User size={16} className="text-apex-lime" /> Account Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Admin Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'admin@atomicapex.studio'}
              className="w-full rounded-xl border border-white/5 bg-studio-950 px-3.5 py-2 text-xs text-zinc-400 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-studio-950 px-3.5 py-2 text-xs text-white focus:border-apex-lime/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            {saved ? '✓ Changes saved to local studio vault' : 'Profile updates sync with Firebase User document'}
          </span>
          <button
            type="submit"
            className="glow-btn px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Save size={13} /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
