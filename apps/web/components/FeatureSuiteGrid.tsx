'use client';

import React from 'react';
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
} from 'lucide-react';

export const FeatureSuiteGrid: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24 space-y-16">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF1FE] border border-[#2F6FED]/30 text-xs font-mono font-bold text-[#2F6FED] uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Complete Productivity Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] leading-tight">
          Built for high-output builders & teams
        </h2>
        <p className="text-base sm:text-lg text-[#6B6B6B]">
          From automated daily summaries to private team leaderboards, Freedom gives you the exact tools to track, analyze, and supercharge your focus.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* 1. Daily Summary */}
        <div className="rounded-2xl bg-white border border-[#E5E5E5] p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2F6FED] flex items-center justify-center font-bold">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Daily Summary & Audit</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Automated end-of-day wrap-up auditing planned vs actual time, task completion percentages, break distribution, and planning accuracy score.
              </p>
            </div>
          </div>
          <div className="mt-6 p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-[#111]">
              <span className="font-bold">Wrap-up Accuracy</span>
              <span className="text-[#1FAE6B] font-bold">96.4%</span>
            </div>
            <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1FAE6B] h-full rounded-full" style={{ width: '96.4%' }} />
            </div>
            <div className="text-[11px] text-[#777] pt-1">✓ Automated session logging</div>
          </div>
        </div>

        {/* 2. Task History */}
        <div className="rounded-2xl bg-white border border-[#E5E5E5] p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#1FAE6B] flex items-center justify-center font-bold">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Task History Archive</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Complete searchable timeline of every focus session you run. Filter past sessions by date, review durations, and inspect task execution notes.
              </p>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-sans space-y-2">
            <div className="p-2 bg-white rounded-lg border border-black/5 flex items-center justify-between">
              <span className="font-semibold text-[#111] truncate">Frontend Component Architecture</span>
              <span className="font-mono text-[11px] text-[#2F6FED] font-bold">45m</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-black/5 flex items-center justify-between opacity-75">
              <span className="font-semibold text-[#111] truncate">PostgreSQL Index Optimization</span>
              <span className="font-mono text-[11px] text-[#1FAE6B] font-bold">30m</span>
            </div>
          </div>
        </div>

        {/* 3. Productivity Statistics */}
        <div className="rounded-2xl bg-white border border-[#E5E5E5] p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Productivity Analytics</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Deep work metrics with weekly performance trendlines. View total focus hours, navigate historical weeks, and track your peak output days.
              </p>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-mono grid grid-cols-2 gap-2">
            <div className="p-2 bg-white rounded-lg border border-black/5">
              <div className="text-[10px] text-[#777]">Focus Hours</div>
              <div className="text-base font-bold text-[#111]">34.5 hrs</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-black/5">
              <div className="text-[10px] text-[#777]">Avg Score</div>
              <div className="text-base font-bold text-[#D97706]">94 / 100</div>
            </div>
          </div>
        </div>

        {/* 4. Productivity Heatmap */}
        <div className="rounded-2xl bg-white border border-[#E5E5E5] p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Productivity Heatmap</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                GitHub-style activity grid visualizing daily streaks, active focus days, and long-term consistency with smart edge tooltips and month navigation.
              </p>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-[#111] font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" /> 14-Day Streak
              </span>
              <span className="text-[10px] text-[#777]">Sep 2026</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {[4, 5, 3, 5, 2, 5, 4, 3, 5, 5, 4, 5, 4, 5].map((lvl, idx) => (
                <div
                  key={idx}
                  className={`h-4 rounded-sm ${
                    lvl === 5
                      ? 'bg-[#1FAE6B]'
                      : lvl === 4
                      ? 'bg-[#1FAE6B]/80'
                      : lvl === 3
                      ? 'bg-[#1FAE6B]/50'
                      : 'bg-[#1FAE6B]/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 5. Custom Teams & Invites */}
        <div className="rounded-2xl bg-white border border-[#E5E5E5] p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] text-[#9333EA] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Teams & Email Invites</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Build private teams, invite teammates via 6-digit codes or direct email, manage team members, and enjoy strict privacy with owner controls.
              </p>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#111]">Invite Code:</span>
              <span className="font-mono bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[11px]">FREEDOM-78</span>
            </div>
            <div className="text-[11px] text-[#6B6B6B] flex items-center gap-1 pt-1">
              <Shield className="w-3 h-3 text-purple-600" />
              <span>Owner admin deletion & member kick controls</span>
            </div>
          </div>
        </div>

        {/* 6. Competitions & Leaderboards */}
        <div className="rounded-2xl bg-white border border-[#E5E5E5] p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Competitions & Flags</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Compete on global or private team leaderboards. Track country flags (🇳🇬 🇺🇸 🇬🇧), challenge friends, and celebrate top-tier deep work ranks.
              </p>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5 text-xs font-sans">
            <div className="flex items-center justify-between bg-white p-1.5 rounded-lg border border-black/5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#D97706]">#1</span>
                <span>🇳🇬</span>
                <span className="font-semibold text-[#111]">Timothy</span>
              </div>
              <span className="font-mono text-[11px] text-[#1FAE6B] font-bold">142h total</span>
            </div>
            <div className="flex items-center justify-between bg-white p-1.5 rounded-lg border border-black/5 opacity-80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">#2</span>
                <span>🇺🇸</span>
                <span className="font-semibold text-[#111]">Alex</span>
              </div>
              <span className="font-mono text-[11px] text-[#2F6FED] font-bold">118h total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to take control of your time?</h3>
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
