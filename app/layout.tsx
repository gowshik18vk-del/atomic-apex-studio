// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atomic Apex Studio — AI-Native Creative Suite',
  description: 'Dark, cinematic, and premium AI creative studio for photorealistic images, cinema videos, and multi-model workflows.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-apex-lime selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
