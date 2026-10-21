import type { Metadata } from 'next';
import { Familjen_Grotesk, DM_Mono } from 'next/font/google';
import SiteNav from './components/hero/SiteNav';
import { MusicPlayerProvider } from './components/hero/useMusicPlayer';
import './globals.css';

/* next/font downloads and self-hosts these at build time. Nothing is
   requested from Google at runtime, which keeps visitor IPs out of
   Google's hands — the GDPR question that a plain <link> to Google Fonts
   raises for an EU site. */
const grotesk = Familjen_Grotesk({
  variable: '--font-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const mono = DM_Mono({
  variable: '--font-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ESA: Sound Production',
  description: 'Sound designer, musician, composer.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body>
        <MusicPlayerProvider>
          {/* Outside the page template, so it doesn't blur between pages. */}
          <SiteNav />
          {children}
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
