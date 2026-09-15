import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Menubar } from '../components/Menubar';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://usefreedom.top'),
  title: {
    default: 'Freedom — Your Day Runs Itself | Automatic Execution Engine',
    template: '%s | Freedom',
  },
  description:
    'Freedom is an automatic execution engine for Mac & Windows. Plan once, start your day, and let Freedom run your task queue with a calm, floating presence.',
  keywords: [
    'Freedom app',
    'automatic execution engine',
    'macOS productivity tool',
    'Windows productivity app',
    'time management app',
    'focus app',
    'deep work engine',
    'task queue runner',
    'granola alternative',
    'floating widget productivity',
  ],
  authors: [{ name: 'Timothy Okoduwa', url: 'https://github.com/timothy-okoduwa' }],
  creator: 'Timothy Okoduwa',
  publisher: 'Freedom Technologies Inc.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usefreedom.top',
    siteName: 'Freedom',
    title: 'Freedom — Your Day Runs Itself | Automatic Execution Engine',
    description:
      'Freedom is an automatic execution engine for Mac & Windows. Plan once, start your day, and let Freedom run your task queue automatically.',
    images: [
      {
        url: '/freedom.png',
        width: 512,
        height: 512,
        alt: 'Freedom App Icon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freedom — Your Day Runs Itself',
    description:
      'Freedom is an automatic execution engine for Mac & Windows. Plan once, start your day, and let Freedom run your task queue.',
    images: ['/freedom.png'],
    creator: '@timothyokoduwa',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/freedom.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/freedom.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://usefreedom.top',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Freedom',
    operatingSystem: 'macOS, Windows',
    applicationCategory: 'ProductivityApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Freedom is an automatic execution engine for Mac & Windows. Plan once, start your day, and let Freedom run your queue with a calm floating presence.',
    image: 'https://usefreedom.top/freedom.png',
    downloadUrl:
      'https://github.com/timothy-okoduwa/freedom/releases/download/v1.0.0/Freedom-1.0.0-arm64.dmg',
    author: {
      '@type': 'Organization',
      name: 'Freedom Technologies Inc.',
      url: 'https://usefreedom.top',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-[#2F6FED] selection:text-white bg-white text-[#111111]">
        <Menubar />
        {children}
      </body>
    </html>
  );
}
