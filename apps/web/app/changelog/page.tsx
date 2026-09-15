import type { Metadata } from 'next';
import React from 'react';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Changelog & Release Notes — Freedom',
  description:
    'Every release, feature upgrade, and aesthetic refinement shipped for Freedom automatic execution engine.',
  alternates: {
    canonical: 'https://freedom.app/changelog',
  },
  openGraph: {
    title: 'Changelog — Freedom',
    description: 'Every release, feature upgrade, and aesthetic refinement shipped for Freedom.',
    url: 'https://freedom.app/changelog',
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
          {/* RELEASE v3.1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v3.1.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1FAE6B] text-white text-[10px] font-mono font-bold uppercase tracking-wide">
                  LATEST RELEASE
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
                    <strong>Desktop Email Delivery</strong>: Electron IPC nodemailer transport delivering HTML email invitations linking to <code className="bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-black/10 text-xs font-mono">https://freedom-mac.vercel.app/</code>.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
