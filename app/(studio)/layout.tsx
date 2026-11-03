'use client';

import React, { useEffect } from 'react';
import ModernStudioNavbar from '@/components/shell/ModernStudioNavbar';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import AssetModal from '@/components/assets/AssetModal';
import { Loader2 } from 'lucide-react';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkSession, isAuthenticated, isLoading } = useAuthStore();
  const { initialize } = useGenerationStore();
  const { syncWithDatabase } = useCreditsStore();

  useEffect(() => {
    checkSession();
    initialize();
    syncWithDatabase();
  }, []);

  // Prevent flash while session resolves
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080b11] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black shadow-lg animate-pulse">
          <span className="font-display text-xl">A</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Loader2 size={14} className="animate-spin text-indigo-400" />
          <span>Loading Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b11] text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Modern Top Navigation Bar */}
      <ModernStudioNavbar />

      {/* Main Full-Width Studio Workspace */}
      <main className="flex-1 w-full mx-auto flex flex-col">
        {children}
      </main>

      {/* Global Asset Inspector Modal */}
      <AssetModal />
    </div>
  );
}
