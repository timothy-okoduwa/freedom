import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Freedom Desktop',
  description: 'Freedom Automatic Execution Engine',
};

const themeScript = `
  try {
    const t = localStorage.getItem('freedom_theme');
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased bg-transparent text-[#111111] dark:text-[#EDEDED]">
        {children}
      </body>
    </html>
  );
}
