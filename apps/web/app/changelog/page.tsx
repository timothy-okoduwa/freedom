import type { Metadata } from 'next';
import React from 'react';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Changelog & Release Notes — Freedom',
  description:
    'Every release, feature upgrade, and aesthetic refinement shipped for Freedom automatic execution engine.',
  alternates: {
    canonical: 'https://usefreedom.top/changelog',
  },
  openGraph: {
    title: 'Changelog — Freedom',
    description: 'Every release, feature upgrade, and aesthetic refinement shipped for Freedom.',
    url: 'https://usefreedom.top/changelog',
    images: ['/freedom.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog — Freedom',
    description: 'See the latest release updates and execution trail for Freedom.',
    images: ['/freedom.png'],
  },
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] text-[#111111] pt-24 pb-16 selection:bg-[#2F6FED] selection:text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#EAF1FE] text-[#2F6FED] font-mono text-xs font-bold uppercase tracking-wider">
            chain log
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-serif text-[#111111]">
            Changelog & Execution Trail
          </h1>
          <p className="text-sm sm:text-base text-[#666666]">
            Every release, feature upgrade, and aesthetic refinement shipped for Freedom.
          </p>
        </div>

        {/* Timeline Entries */}
        <div className="space-y-10">
          {/* RELEASE v3.6 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.6.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1FAE6B] text-white text-[10px] font-mono font-bold uppercase tracking-wide">
                  LATEST RELEASE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>⏱️ Queued & Running Task Duration Editing & Extended Time Persistence Fix</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Extended Task Duration Persistence Fix</strong>: Extended time added to active sessions (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">extensionMinutes</code>) is now fully preserved upon task completion and accurately saved into <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">actualMinutes</code> across History, Statistics, Heatmap, and Firestore.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Queued Task Duration Editing</strong>: Added full support for editing task duration (hours and minutes) for queued/pending items directly in the Day Plan Builder and Runtime engine preview.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Running Task Duration Adjustment (Increase & Reduce Time)</strong>: Enhanced active session controls with quick <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">+10m</code>, <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">-10m</code>, and custom time adjustment modes allowing both adding and reducing time on running tasks in real-time.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Multi-Track Earphone Audio Selector & Mizmo — Hello</strong>: Integrated new track <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Mizmo — Hello</code> alongside <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Ninajirachi — iPod Touch</code>. Clicking the status bar Earphones icon opens an interactive track selector dropdown; clicking again stops music playback cleanly.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Updated Desktop Application & Installer Builds</strong>: Rebuilt and deployed local <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/Applications/Freedom.app</code>, macOS DMG installer (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Freedom-1.0.0-arm64.dmg</code>), and Windows installer (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Freedom Setup 1.0.0.exe</code>).
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v3.5 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.5.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>🪟 Windows Setup Installer (.exe), OS Auto-Detection & Dynamic Navbar</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Native Windows Setup Installer</strong>: Shipped official Windows release build (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Freedom.Setup.1.0.0.exe</code>) hosted on GitHub releases.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Client-Side OS Auto-Detection & Download Routing</strong>: Built <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">useUserOS</code> hook. Automatically detects whether the user is on macOS or Windows and triggers the matching native installer download on <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/download</code>.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Dynamic OS Navbar Icon</strong>: The top navigation bar CTA button dynamically displays the native Apple icon for macOS users and the native Windows icon for Windows users.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>OS-Tailored Installation Steps & Terminal Fix Suppression</strong>: Customized installation steps on <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/download</code> according to user OS. Completely suppresses macOS quarantine (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">xattr</code>) instructions when accessed from Windows.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Clean Manual Download Trigger</strong>: Replaced static download links with programmatic triggers so status bar URL previews do not appear on hover.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v3.4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.4.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>💻 macOS Status Bar Monochrome Template Icon & Tray Fix</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Monochrome macOS Menu Bar Template Icon</strong>: Integrated high-resolution black & white logo artwork (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">b-w.png</code>) processed into native 22x22 points (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">trayTemplate.png</code>) and 44x44 pixels Retina (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">trayTemplate@2x.png</code>) template icons.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Native Dark/Light Mode Adaptability</strong>: Enabled Electron <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">setTemplateImage(true)</code> on macOS so the status bar icon automatically switches between crisp white in dark mode and crisp black in light mode.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Updated Desktop Application & DMG Build</strong>: Rebuilt and updated local <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/Applications/Freedom.app</code> and <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Freedom-1.0.0-arm64.dmg</code>.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v3.3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.3.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>🌐 Domain Migration to usefreedom.top & Complete System Linkage</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Official Production Domain Launch</strong>: Freedom web services, landing portal, and invite links migrated to the official custom domain <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">https://usefreedom.top/</code>.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Desktop Email & Invite Link Routing</strong>: Updated Electron IPC nodemailer email invite generator to dispatch direct links pointing to <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">https://usefreedom.top/</code> for new friend and team onboarding.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>System-Wide SEO Canonical URLs</strong>: Updated Next.js metadataBase, canonical URL tags, OpenGraph targets, JSON-LD schemas, sitemap, and robots.txt to index <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">https://usefreedom.top/</code>.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v3.2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.2.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>🎨 HIG App Icon, Windows Flag Fix, Redesigned Download Page & Full SEO Suite</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>HIG-Compliant macOS & Windows App Icon</strong>: Re-crafted desktop application icons adhering strictly to Apple Human Interface Guidelines (1024x1024 canvas with 824x824 squircle artwork and 100px padding margin). Ensures native system Dock sizing (no oversized icons) and full support for macOS Sequoia/Sonoma clear, dark, and tinted modes. Generated multi-resolution <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">.ico</code> (256x256) for Windows setup builds.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Windows Leaderboard Country Flags</strong>: Fixed country flag rendering on Windows OS by embedding standard SVG flag components across Leaderboard global, friends, and team rosters with automatic country code fallback.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Redesigned Download Page & Installation Cards</strong>: Upgraded <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/download</code> with Granola-inspired installation cards using edge-to-edge <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">step-1</code>, <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">step-2</code>, and <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">step-3</code> step illustrations styled with Freedom Blue branding.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Complete Web SEO & Metadata Suite</strong>: Implemented comprehensive OpenGraph tags, Twitter Card previews, JSON-LD structured data (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">SoftwareApplication</code> & <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Organization</code>), dynamic XML sitemap (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/sitemap.xml</code>), web crawler directives (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/robots.txt</code>), and PWA manifest (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/manifest.json</code>).
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Rebuilt App Installers & Application Bundle</strong>: Re-packaged and updated local <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">/Applications/Freedom.app</code>, macOS DMG installer (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Freedom-1.0.0-arm64.dmg</code>), and Windows installer (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Freedom Setup 1.0.0.exe</code>).
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v3.1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.1.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>⏱️ Mid-Task Editing, Extended Time Tracking, Auto New-Day Reset & macOS Icon</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Mid-Task Title Editing & Custom Extensions</strong>: Edit running task titles on the fly during execution and add custom extension time in hours and minutes.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Extended Time Breakdown & Hour Formatting</strong>: Tasks with added time show explicit extension breakdowns (e.g. <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">1m (+3m)</code> or <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">1h (+15m)</code>). Standardized task durations so 60+ minutes render cleanly in hours (e.g., <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">1h</code>, <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">1h 10m</code>).
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Automatic Midnight New-Day Reset</strong>: Active plans and completed task queues automatically roll over and reset at local midnight across Dashboard, Plan Builder, and Electron session state without requiring app restarts.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Leaderboard Productive Hours Ranking Fix</strong>: Resolved leaderboard sorting order so user rankings strictly prioritize verified productive execution hours.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Week Navigation UI & macOS Squircle Icon</strong>: Fixed button text wrapping and center alignment on the Weekly Output analytics card. Upgraded desktop app icon to an official macOS Big Sur/Sonoma glass squircle tile.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v3.0 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.0.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>✨ 38-Step Interactive Product Tour & Clamped Telemetry Overlay</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>38-Step Interactive Product Tour</strong>: Comprehensive walkthrough covering every page, card, button, sub-tab, and input across Dashboard, Plan Builder, Runtime Engine, Daily Summary, Task History, Statistics, Heatmap, Leaderboards, and Settings.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Sub-Tab Auto-Switching Event Bus</strong>: Stepping through the product tour automatically switches sub-tabs (Global, Friends, Teams, Competitions) so hidden cards render on the DOM before computing target coordinates.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Dynamic Tour Mock Mode</strong>: When a user has empty data on any page/tab, realistic mock preview cards render during the tour so spotlights highlight fully populated cards, disappearing automatically when the tour ends.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Viewport-Clamped Popovers & Smooth Auto-Scrolling</strong>: Target cards auto-scroll smoothly into the center of the viewport on every step. Tooltip cards feature strict safety bounds to prevent off-screen clipping, keeping Next/Prev buttons 100% visible and clickable.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v2.5 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v2.5.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>🛡️ Team Admin Deletion, Edge-Safe Heatmap & Stats History</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Team Owner Administration & Cascading Cleanup</strong>: Team owners can delete teams directly (<code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Delete Team</code>) with cascading Firestore removal of team documents, memberships, and pending invitations. Owners can also remove individual members from team rosters.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Strict Team Privacy & Pending Invite Cards</strong>: Friends are strictly isolated from private teams until invited or joined via code. Added a <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Pending Team Invitations</code> banner in the Leaderboard page with direct Accept & Join actions and automatic stale invite cleanup.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Edge-Safe Heatmap & Month Headers</strong>: GitHub-style month headers and day labels. Smart directional tooltip positioning prevents cut-off or forced horizontal scrolling on top rows or edge columns. Grid anchors to the current week so today is always visible.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Statistics Week-by-Week Navigation</strong>: Browse past weeks' execution output with <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">← Prev Week</code>, <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Current Week</code>, and <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">Next Week →</code> buttons, bounded by account creation week.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Desktop Email Delivery</strong>: Electron IPC nodemailer transport delivering HTML email invitations linking to <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">https://usefreedom.top/</code>.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v2.2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v2.2.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase tracking-wide">
                  STABLE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2">
                <span>⚡ The HeyClicky Spark & Seamless Flow</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#333] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Continuous iPod Touch Audio Engine</strong>: Audio playback of{' '}
                    <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">
                      Ninajirachi — iPod Touch
                    </code>{' '}
                    now stays playing uninterrupted across client-side page transitions.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Pill Drag & Double-Click App Focus</strong>: Drag the floating capsule anywhere on screen.
                    Single click toggles expansion/collapse; double click instantly brings the main Freedom app to front.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Interactive Canvas & Granola Download Flow</strong>: Added small bounded draggable stickers,
                    curved 3D rainbow folder wave trails, handwritten cursive signature, and a 3-step Mac installation guide.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2F6FED] font-bold shrink-0">✦</span>
                  <div>
                    <strong>Unified Official Logo Asset</strong>: High-resolution official Freedom logo icon deployed
                    across web header, floating pill, desktop app, and DMG installer bundle.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v2.1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-lg space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-[#111]">v2.1.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-[10px] font-mono font-bold uppercase">
                  LEADERBOARD & INVITES
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">September 2026</span>
            </div>

            <div className="space-y-4">
              <ul className="space-y-2.5 text-sm text-[#444] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#1FAE6B] font-bold">✓</span>
                  <span>Instant email invite generation with fallback team codes copied directly to clipboard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1FAE6B] font-bold">✓</span>
                  <span>Competitive Global, Friends, and Teams leaderboards with privacy opt-in controls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1FAE6B] font-bold">✓</span>
                  <span>Automatic theme switching and smart morning/afternoon/evening greetings.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RELEASE v2.0 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-md space-y-6 opacity-90">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-[#111]">v2.0.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-[#666] text-[10px] font-mono font-bold uppercase">
                  FLOATING PRESENCE ENGINE
                </span>
              </div>
              <span className="text-xs font-mono text-[#888]">August 2026</span>
            </div>

            <div className="space-y-4">
              <ul className="space-y-2 text-sm text-[#555] leading-relaxed">
                <li>• Granola-style floating pill countdown widget with non-focus-stealing design.</li>
                <li>• Fixed timestamp math runtime engine (resilient against sleep modes, reloads, and offline state).</li>
                <li>• Planned vs. Actual Productivity Score calculation algorithm (0 to 100).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
