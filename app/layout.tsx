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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function purgeBadges() {
                  const selectors = ['#lovable-badge', '[class*="lovable-badge"]', 'a[href*="lovable.dev"]'];
                  selectors.forEach(sel => {
                    document.querySelectorAll(sel).forEach(el => el.remove());
                  });
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', purgeBadges);
                } else {
                  purgeBadges();
                }
                const obs = new MutationObserver(purgeBadges);
                obs.observe(document.documentElement, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-apex-lime selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
