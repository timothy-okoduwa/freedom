'use client';

import React, { useRef } from 'react';
import { MacWindow } from '@freedom/ui';
import { DraggableSticker } from './DraggableSticker';
import {
  CheckSquare,
  History,
  BarChart3,
  Calendar,
  Users,
  Trophy,
  Flame,
  Shield,
  Zap,
  ArrowRight,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Mail,
  UserCheck,
  Award,
} from 'lucide-react';

export const FeatureSuiteGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="features-suite"
      ref={containerRef}
      className="max-w-6xl mx-auto px-4 py-16 sm:py-24 space-y-24 sm:space-y-36 relative select-none"
    >
      {/* Draggable Fun Accent Stickers */}
      <DraggableSticker
        src="/stuff/spongbob.gif"
        alt="Spongebob"
        containerRef={containerRef}
        className="absolute left-2 top-[20%] hidden xl:block rotate-[-8deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Deep Work Sponge 🧽"
      />

      <DraggableSticker
        src="/stuff/naruto.gif"
        alt="Naruto Running"
        soundSrc="/stuff/naruto.mp3"
        containerRef={containerRef}
        className="absolute right-2 top-[55%] hidden lg:block rotate-[6deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Naruto theme 🎶"
      />

      <DraggableSticker
        src="/stuff/solo-leveling.gif"
        alt="Solo Leveling"
        soundSrc="/stuff/solo-level.mp3"
        containerRef={containerRef}
        className="absolute left-2 top-[75%] hidden lg:block rotate-[-6deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Solo Leveling theme ⚔️"
      />

      {/* SECTION HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF1FE] border border-[#2F6FED]/30 text-xs font-mono font-bold text-[#2F6FED] uppercase tracking-wider shadow-2xs">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Full Product Ecosystem</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] leading-tight">
          Everything built to power your focus.
        </h2>
        <p className="text-base sm:text-lg text-[#6B6B6B]">
          From automated daily summaries to private team leaderboards, discover how Freedom keeps you in flow.
        </p>
      </div>

      {/* FEATURE 1: Daily Summary & Wrap-up Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <CheckSquare className="w-3.5 h-3.5 text-[#2F6FED]" />
            <span>05 · daily wrap-up</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
            Daily Summary & Accuracy Audit
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            When your workday ends, Freedom automatically computes your 0-100 Productivity Score.
            Review your planned duration vs actual duration, break ratios, and completed task breakdown.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#111111]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B]" />
              Automated Score Audit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED]" />
              Planning Accuracy %
            </span>
          </div>
        </div>

        <div className="w-full">
          <MacWindow caption="daily-summary-audit.mov" className="rotate-1 hover:rotate-0 transition-transform shadow-2xl">
            <div className="p-6 bg-[#0F172A] text-white space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#2F6FED] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Daily Wrap-up</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">Today · Sep 14, 2026</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold font-mono text-[#38BDF8]">95 / 100</div>
                  <div className="text-[10px] text-[#1FAE6B] font-mono font-bold">Accuracy: 96.8%</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="font-semibold text-white">✓ Refactor Authentication Logic</span>
                  <span className="font-mono text-[#38BDF8]">45m / 45m</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="font-semibold text-white">✓ Database Index Migration</span>
                  <span className="font-mono text-[#1FAE6B]">30m / 30m</span>
                </div>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>

      {/* FEATURE 2: Task History Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="w-full order-2 lg:order-1">
          <MacWindow caption="task-history-archive.mov" className="-rotate-1 hover:rotate-0 transition-transform shadow-2xl">
            <div className="p-6 bg-white dark:bg-[#121215] space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between bg-[#FAFAFA] dark:bg-[#18181B] p-2.5 rounded-xl border border-[#E5E5E5] dark:border-[#27272A]">
                <div className="flex items-center gap-2 text-[#888]">
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-xs">Search past tasks...</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] font-mono text-[#555]">Cmd + K</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111] dark:text-white">API Rate Limit & Webhooks</div>
                    <div className="text-[10px] text-[#888] font-mono">Sep 14 · 10:15 AM - 11:00 AM</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EAF1FE] text-[#2F6FED] font-mono font-bold text-[11px]">45 mins</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111] dark:text-white">Stripe Billing Webhook Handler</div>
                    <div className="text-[10px] text-[#888] font-mono">Sep 13 · 02:30 PM - 03:30 PM</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E8F8F0] text-[#1FAE6B] font-mono font-bold text-[11px]">60 mins</span>
                </div>
              </div>
            </div>
          </MacWindow>
        </div>

        <div className="space-y-4 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <History className="w-3.5 h-3.5 text-[#1FAE6B]" />
            <span>06 · searchable archive</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
            Searchable Task History Timeline
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Never lose track of what you accomplished. Every focus session is automatically recorded
            with timestamps, planned vs actual durations, and task completion tags. Search and audit
            your past productivity anytime.
          </p>
        </div>
      </div>

      {/* FEATURE 3: Productivity Analytics & Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <BarChart3 className="w-3.5 h-3.5 text-[#D97706]" />
            <span>07 · deep analytics</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
            Productivity Statistics & Week History
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Analyze your output with weekly trend lines, total productive hours, and average planning score.
            Use history navigation controls to look back at previous weeks all the way to your first account setup.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#111111]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              Historical Week Navigation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B]" />
              Total Focus Hour Audit
            </span>
          </div>
        </div>

        <div className="w-full">
          <MacWindow caption="productivity-stats.mov" className="rotate-1 hover:rotate-0 transition-transform shadow-2xl">
            <div className="p-6 bg-white dark:bg-[#121215] space-y-4">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <button type="button" className="p-1 rounded bg-black/5 dark:bg-white/10 text-xs font-bold">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-[#111] dark:text-white">Sep 07 - Sep 14, 2026</span>
                  <button type="button" className="p-1 rounded bg-black/5 dark:bg-white/10 text-xs font-bold">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#EAF1FE] text-[#2F6FED] font-mono text-xs font-bold">38.5 hrs focus</span>
              </div>

              {/* Bar Graph Simulation */}
              <div className="h-32 flex items-end justify-between gap-2 pt-2">
                {[
                  { day: 'Mon', hrs: '5.2h', h: '60%' },
                  { day: 'Tue', hrs: '6.5h', h: '85%' },
                  { day: 'Wed', hrs: '7.1h', h: '95%' },
                  { day: 'Thu', hrs: '4.8h', h: '55%' },
                  { day: 'Fri', hrs: '6.2h', h: '80%' },
                  { day: 'Sat', hrs: '4.0h', h: '45%' },
                  { day: 'Sun', hrs: '4.7h', h: '50%' },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#888]">{item.hrs}</span>
                    <div className="w-full bg-[#E5E5E5] dark:bg-neutral-800 h-24 rounded-t-md relative overflow-hidden flex items-end">
                      <div className="w-full bg-gradient-to-t from-[#2563EB] to-[#60A5FA] rounded-t-md transition-all" style={{ height: item.h }} />
                    </div>
                    <span className="text-[10px] font-bold text-[#111] dark:text-white">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </MacWindow>
        </div>
      </div>

      {/* FEATURE 4: Productivity Heatmap & Streaks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="w-full order-2 lg:order-1">
          <MacWindow caption="productivity-heatmap.mov" className="-rotate-1 hover:rotate-0 transition-transform shadow-2xl">
            <div className="p-6 bg-white dark:bg-[#121215] space-y-4 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-xs font-mono font-bold text-[#111] dark:text-white">14-Day Focus Streak</span>
                </div>
                <span className="text-xs font-mono text-[#1FAE6B] font-bold">100% Active</span>
              </div>

              {/* GitHub-style Heatmap Simulation */}
              <div className="p-3 bg-[#FAFAFA] dark:bg-[#18181B] rounded-xl border border-[#E5E5E5] dark:border-[#27272A] space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-[#888]">
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep 2026</span>
                </div>
                <div className="grid grid-cols-12 gap-1.5">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const level = (i % 5) + 1;
                    return (
                      <div
                        key={i}
                        className={`h-4 rounded.sm transition-transform hover:scale-125 cursor-pointer ${
                          level === 5
                            ? 'bg-[#1FAE6B]'
                            : level === 4
                            ? 'bg-[#1FAE6B]/80'
                            : level === 3
                            ? 'bg-[#1FAE6B]/50'
                            : 'bg-[#1FAE6B]/25'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </MacWindow>
        </div>

        <div className="space-y-4 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <Calendar className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>08 · visual consistency</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
            Productivity Heatmap & Streaks
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Visualize your long-term consistency with a GitHub-style activity heatmap.
            Smart edge tooltips prevent UI clipping, while streak flame badges keep you motivated to execute every single day.
          </p>
        </div>
      </div>

      {/* FEATURE 5: Teams & Email Invites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <Users className="w-3.5 h-3.5 text-[#9333EA]" />
            <span>09 · team collaboration</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
            Private Teams & Email Invites
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Create custom teams, invite teammates using 6-digit codes or direct email, and enjoy strict privacy.
            Team owners can manage members, send invitations, and delete teams with cascading cleanup.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#111111]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              Owner Admin Controls
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              Direct Email Invites
            </span>
          </div>
        </div>

        <div className="w-full">
          <MacWindow caption="teams-and-invitations.mov" className="rotate-1 hover:rotate-0 transition-transform shadow-2xl">
            <div className="p-6 bg-white dark:bg-[#121215] space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF5FF] dark:bg-purple-950/30 border border-[#E9D5FF] dark:border-purple-800/40">
                <div>
                  <div className="font-bold text-[#111] dark:text-white">Core Engineering Team</div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-mono">Code: FREEDOM-78</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white font-bold text-[10px]">OWNER</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] space-y-2">
                <div className="text-[11px] font-bold text-[#555] dark:text-[#AAA]">Team Members (3)</div>
                <div className="flex items-center justify-between bg-white dark:bg-neutral-900 p-2 rounded-lg border border-black/5 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#1FAE6B]" />
                    <span className="font-semibold text-[#111] dark:text-white">Timothy (Owner)</span>
                  </div>
                  <span className="text-[10px] text-[#1FAE6B] font-mono font-bold">142h total</span>
                </div>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>

      {/* FEATURE 6: Competitions & Country Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="w-full order-2 lg:order-1">
          <MacWindow caption="leaderboard-competitions.mov" className="-rotate-1 hover:rotate-0 transition-transform shadow-2xl">
            <div className="p-6 bg-white dark:bg-[#121215] space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-[#111] dark:text-white">Global Leaderboard</span>
                </div>
                <span className="text-[10px] font-mono text-[#2F6FED] font-bold">Live Rankings</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-[#FEF3C7]/40 dark:bg-amber-950/20 border border-[#FDE68A] dark:border-amber-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-amber-600 text-xs">#1</span>
                    <span>🇳🇬</span>
                    <span className="font-bold text-[#111] dark:text-white">Timothy Okoduwa</span>
                  </div>
                  <span className="font-mono text-emerald-600 font-bold text-xs">142.5 hrs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-neutral-400 text-xs">#2</span>
                    <span>🇺🇸</span>
                    <span className="font-bold text-[#111] dark:text-white">Alex Chen</span>
                  </div>
                  <span className="font-mono text-[#2F6FED] font-bold text-xs">118.0 hrs</span>
                </div>
              </div>
            </div>
          </MacWindow>
        </div>

        <div className="space-y-4 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <Trophy className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>10 · friendly competition</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
            Competitions & Country Flags
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Compete on global leaderboards or create private team competitions.
            Display your country flag (🇳🇬 🇺🇸 🇬🇧 🇨🇦 🇩🇪) based on timezone, track focus ranks in real time, and celebrate high-output milestones.
          </p>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to take control of your output?</h3>
          <p className="text-sm text-[#94A3B8]">Download Freedom for macOS today and experience hands-free execution.</p>
        </div>
        <a
          href="/download"
          className="px-6 py-3.5 rounded-2xl bg-[#2F6FED] hover:bg-[#1E56C9] text-white font-bold text-sm transition-all shadow-lg active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Get Freedom Free</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
