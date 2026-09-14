import React from 'react';
import { Footer } from '../../components/Footer';

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] text-[#111111] pt-24 pb-16 selection:bg-[#2F6FED] selection:text-white">
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
          {/* RELEASE v2.5 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold font-mono text-[#111]">v2.5.0</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1FAE6B] text-white text-[10px] font-mono font-bold uppercase tracking-wide">
                  LATEST RELEASE
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
