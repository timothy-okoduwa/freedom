import type { Metadata } from 'next';
import { DownloadClient } from './DownloadClient';

export const metadata: Metadata = {
  title: 'Download Freedom for macOS & Windows',
  description:
    'Download Freedom for Mac and Windows. Automatic execution engine for high-agency builders. Plan once, start your day, and let Freedom run your task queue.',
  alternates: {
    canonical: 'https://usefreedom.top/download',
  },
  openGraph: {
    title: 'Download Freedom for macOS & Windows',
    description:
      'Download Freedom for Mac and Windows. Automatic execution engine for high-agency builders.',
    url: 'https://usefreedom.top/download',
    images: ['/freedom.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download Freedom for macOS & Windows',
    description: 'Download Freedom for Mac and Windows. Automatic execution engine.',
    images: ['/freedom.png'],
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}
