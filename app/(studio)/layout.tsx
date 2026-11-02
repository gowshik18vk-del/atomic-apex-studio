'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/shell/Sidebar';
import Topbar from '@/components/shell/Topbar';
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { checkSession, isAuthenticated, isLoading } = useAuthStore();
  const { initialize } = useGenerationStore();
  const { syncWithDatabase } = useCreditsStore();

  useEffect(() => {
    checkSession();
    initialize();
    syncWithDatabase();
  }, []);

  // Prevent flash of private content or login page while session resolves
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-studio-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9A25E] to-amber-200 text-black shadow-glow-gold animate-pulse">
          <span className="font-display text-2xl font-black">A</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Loader2 size={14} className="animate-spin text-[#C9A25E]" />
          <span>Authenticating Atomic Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-950 text-foreground flex">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Topbar
          collapsed={collapsed}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Asset Inspector Modal */}
      <AssetModal />
    </div>
  );
}
