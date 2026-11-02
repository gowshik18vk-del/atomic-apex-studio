'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { triggerConfetti } from '@/lib/utils';

function GoogleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { signIn, signInWithGoogle, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleFillFounder = () => {
    setEmail('pcgowshik@gmail.com');
    setPassword('ApexStudio@2026!X');
    setErrorMsg('');
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);

    try {
      const res = await signInWithGoogle();
      if (res.success) {
        triggerConfetti();
        // Full browser navigation ensures session cookies are recognized by middleware immediately
        window.location.href = '/dashboard';
      } else {
        setErrorMsg(res.error || 'Failed to authenticate with Google.');
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google authentication error.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = await signIn(email, password);
    if (res.success) {
      triggerConfetti();
      // Full browser navigation guarantees all cookies are committed
      window.location.href = '/dashboard';
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="relative min-h-screen bg-studio-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -mt-24 h-96 w-96 rounded-full bg-apex-lime/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -mb-24 h-96 w-96 rounded-full bg-apex-cyan/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-apex-lime to-emerald-400 text-black shadow-glow-lime">
              <span className="font-display text-2xl font-black">A</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              ATOMIC APEX <span className="text-apex-lime">STUDIO</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400">
            Sign in once to access the entire AI creative studio suite.
          </p>
        </div>

        {/* Demo Seeded User Shortcut Card */}
        <div className="rounded-2xl border border-apex-lime/30 bg-studio-900/90 p-4 shadow-glass-card space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-apex-lime" /> Founder Account Access
            </span>
            <span className="rounded bg-apex-lime/15 px-1.5 py-0.5 text-[9px] font-mono font-bold text-apex-lime uppercase">
              100 CREDITS
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Seeded admin profile pre-configured with founder permissions and 100 credits.
          </p>

          <button
            type="button"
            onClick={handleFillFounder}
            className="w-full py-1.5 px-3 rounded-xl bg-apex-lime/10 hover:bg-apex-lime hover:text-black text-apex-lime text-xs font-semibold border border-apex-lime/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Zap size={12} className="fill-current" /> Autofill Founder Credentials
          </button>
        </div>

        {/* Main Auth Container */}
        <div className="rounded-3xl border border-white/10 bg-studio-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm group hover:border-white/30"
          >
            {isGoogleLoading ? (
              <Loader2 size={16} className="animate-spin text-apex-lime" />
            ) : (
              <GoogleIcon className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
            )}
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-studio-900 px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              or continue with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-studio-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-apex-lime/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-studio-950 py-2.5 pl-10 pr-10 text-xs text-white placeholder-zinc-500 focus:border-apex-lime/60 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 rounded-xl glow-btn text-xs font-bold flex items-center justify-center gap-2 mt-2 shadow-glow-lime disabled:opacity-50"
            >
              {isLoading && !isGoogleLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying Session...
                </>
              ) : (
                <>
                  Sign In to Atomic Apex Studio
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-zinc-500 pt-1">
            Don't have an account?{' '}
            <Link href="/signup" className="text-apex-lime hover:underline font-semibold">
              Create an Account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-zinc-600 font-mono">
          Single Sign-On • Supabase Auth • Pure Native Studio
        </div>
      </div>
    </div>
  );
}
