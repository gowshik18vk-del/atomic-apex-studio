'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/shell/Sidebar';
import Topbar from '@/components/shell/Topbar';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { useCreditsStore } from '@/lib/store/useCreditsStore';
import AssetModal from '@/components/assets/AssetModal';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { checkSession, isAuthenticated } = useAuthStore();
  const { initialize } = useGenerationStore();
  const { syncWithDatabase } = useCreditsStore();

  useEffect(() => {
    checkSession();
    initialize();
    syncWithDatabase();
  }, []);

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
