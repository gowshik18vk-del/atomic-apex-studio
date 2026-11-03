'use client';

import { useEffect } from 'react';
import { ATOMIC_LINKS } from '@/lib/constants/links';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  useEffect(() => {
    window.location.href = ATOMIC_LINKS.creatorStudio;
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F6E05E] to-[#C9A25E] text-black shadow-glow-gold animate-pulse">
        <span className="font-display text-2xl font-black">A</span>
      </div>
      <div className="space-y-1">
        <h2 className="font-display text-lg font-bold text-white">Entering Atomic Apex Studio...</h2>
        <p className="text-xs text-zinc-400">Redirecting to your creator studio workspace.</p>
      </div>
      <Loader2 size={16} className="animate-spin text-[#C9A25E]" />
    </div>
  );
}
