// app/video-studio/page.tsx
'use client';

import ModernStudioNavbar from '@/components/shell/ModernStudioNavbar';
import NewGenVideoStudioPage from '@/app/(studio)/create/new-gen-video/page';

export default function DirectVideoStudioPage() {
  return (
    <div className="min-h-screen bg-[#05070a]">
      <ModernStudioNavbar />
      <NewGenVideoStudioPage />
    </div>
  );
}
