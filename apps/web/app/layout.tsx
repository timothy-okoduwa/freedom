import type { Metadata } from 'next';
import './globals.css';
import { Menubar } from '../components/Menubar';

export const metadata: Metadata = {
  title: 'Freedom — Your Day Runs Itself',
  description:
    'Freedom is an automatic execution engine for Mac & Windows. Plan once, start your day, and let Freedom run the queue with a calm, Granola-style floating presence.',
  icons: {
    icon: [
      { url: '/freedom.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/freedom.png',
    apple: '/freedom.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#2F6FED] selection:text-white bg-white text-[#111111]">
        <Menubar />
        {children}
      </body>
    </html>
  );
}
