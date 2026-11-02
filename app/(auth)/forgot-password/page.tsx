'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    const res = await sendPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setErrorMsg(res.error || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="relative min-h-screen bg-studio-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -mt-24 h-96 w-96 rounded-full bg-[#C9A25E]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -mb-24 h-96 w-96 rounded-full bg-apex-cyan/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9A25E] to-amber-200 text-black shadow-glow-gold">
              <span className="font-display text-2xl font-black">A</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              ATOMIC APEX <span className="text-[#C9A25E]">STUDIO</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400">
            Recover access to your creative studio account.
          </p>
        </div>

        {/* Reset Panel */}
        <div className="rounded-3xl border border-white/10 bg-studio-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {isSubmitted ? (
            <div className="space-y-4 text-center py-2 animate-in fade-in duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A25E]/15 text-[#C9A25E] border border-[#C9A25E]/30">
                <CheckCircle2 size={28} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Check Your Inbox</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  We sent password reset instructions to{' '}
                  <span className="text-[#C9A25E] font-medium">{email}</span>. Click the link in the email to set a new password.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <KeyRound size={16} className="text-[#C9A25E]" />
                  Reset Your Password
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enter your registered email address and Firebase Authentication will dispatch a secure reset link.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

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
                      className="w-full rounded-xl border border-white/10 bg-studio-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-[#C9A25E] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A25E] to-amber-300 hover:from-[#B8904D] hover:to-amber-200 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-gold transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending Instructions...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-white/5">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={13} />
                  Remember your password? <span className="text-[#C9A25E] font-medium">Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-zinc-600 font-mono">
          Firebase Authentication • Secure Password Reset
        </div>
      </div>
    </div>
  );
}
