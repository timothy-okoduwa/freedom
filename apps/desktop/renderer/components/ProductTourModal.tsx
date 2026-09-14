'use client';

import React, { useState } from 'react';
import { useSessionStore } from '../stores/useSessionStore';
import { authService } from '../lib/firebase';
import {
  LayoutDashboard,
  CalendarPlus,
  Timer,
  CheckSquare,
  BarChart3,
  Trophy,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';

interface Step {
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  preview: React.ReactNode;
  bullets: string[];
}

interface ProductTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductTourModal: React.FC<ProductTourModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useSessionStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: Step[] = [
    {
      title: 'Welcome to Freedom',
      subtitle: 'Your hands-free deep work execution engine.',
      badge: 'Step 1 of 6 · Overview',
      icon: Sparkles,
      iconBg: 'bg-[#EFF6FF] dark:bg-blue-950/50 border-[#BFDBFE] dark:border-blue-800',
      iconColor: 'text-[#2F6FED]',
      bullets: [
        'Track your live focus session and daily streak directly from the left navigation rail.',
        'Launch the floating overlay widget anytime to keep your timer visible over IDEs and apps.',
        'Synchronized offline-first timestamp engine ensures zero timer drift even during laptop sleep.',
      ],
      preview: (
        <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#111] dark:text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F6FED] animate-ping" />
              Freedom Execution Engine
            </span>
            <span className="text-[#1FAE6B] font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" /> Live Session
            </span>
          </div>
          <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
            <span>Floating Overlay Widget</span>
            <span className="px-2 py-0.5 rounded bg-[#2F6FED]/10 text-[#2F6FED] font-bold text-[10px]">ACTIVE</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Plan Builder',
      subtitle: 'Structure your day before you begin.',
      badge: 'Step 2 of 6 · Morning Planning',
      icon: CalendarPlus,
      iconBg: 'bg-[#F0FDF4] dark:bg-emerald-950/50 border-[#BBF7D0] dark:border-emerald-800',
      iconColor: 'text-[#1FAE6B]',
      bullets: [
        'Add deep focus tasks and mindfulness break blocks to your daily timeline.',
        'Adjust planned duration per item and reorder blocks easily before starting.',
        'Hit "Start Day" to lock in your plan and begin hands-free execution.',
      ],
      preview: (
        <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] space-y-2 text-xs font-sans">
          <div className="p-2.5 bg-white dark:bg-neutral-900 rounded-lg border border-black/5 dark:border-white/10 flex items-center justify-between">
            <span className="font-medium text-[#111] dark:text-white">1. Implement Component Spec</span>
            <span className="font-mono text-[#2F6FED] font-bold">45m</span>
          </div>
          <div className="p-2.5 bg-white dark:bg-neutral-900 rounded-lg border border-black/5 dark:border-white/10 flex items-center justify-between opacity-75">
            <span className="font-medium text-[#555] dark:text-[#AAA]">☕ 5m Hydration & Rest</span>
            <span className="font-mono text-[#888]">5m</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Hands-Free Runtime',
      subtitle: 'Zero decision fatigue. Focus on the work.',
      badge: 'Step 3 of 6 · Auto Execution',
      icon: Timer,
      iconBg: 'bg-[#EEF2FF] dark:bg-indigo-950/50 border-[#C7D2FE] dark:border-indigo-800',
      iconColor: 'text-[#4F46E5]',
      bullets: [
        'When a focus task ends, your break starts automatically without manual clicking.',
        'Need extra time? Use quick +5m / +10m extensions directly from the runtime page.',
        'Sleep-proof & crash-proof: resuming the app restores exact remaining seconds instantly.',
      ],
      preview: (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#2F6FED] to-[#1D4ED8] text-white space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">RUNNING</span>
            <span>24m 12s remaining</span>
          </div>
          <div className="text-sm font-bold truncate">Frontend Architecture Refactor</div>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
      ),
    },
    {
      title: 'Daily Summary & History',
      subtitle: 'Objective metrics & searchable logs.',
      badge: 'Step 4 of 6 · Accountability',
      icon: CheckSquare,
      iconBg: 'bg-[#FEF3C7] dark:bg-amber-950/50 border-[#FDE68A] dark:border-amber-800',
      iconColor: 'text-[#D97706]',
      bullets: [
        'Automated end-of-day summary computes your 0-100 Productivity Score.',
        'View your planning accuracy percentage (planned duration vs actual duration).',
        'Inspect your full Task History archive to review every past focus session anytime.',
      ],
      preview: (
        <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[#555] dark:text-[#AAA]">Wrap-up Score</span>
            <span className="text-[#D97706] font-extrabold text-sm">95 / 100</span>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] rounded-lg">
            Accuracy: 96.8% · 14-Day Streak Bonus Active
          </div>
        </div>
      ),
    },
    {
      title: 'Heatmap & Statistics',
      subtitle: 'Track long-term streaks & weekly output.',
      badge: 'Step 5 of 6 · Analytics',
      icon: BarChart3,
      iconBg: 'bg-[#FAF5FF] dark:bg-purple-950/50 border-[#E9D5FF] dark:border-purple-800',
      iconColor: 'text-[#9333EA]',
      bullets: [
        'GitHub-style activity grid shows your daily focus consistency at a glance.',
        'Navigate past weeks in Statistics to compare focus hours and task completion.',
        'Smart edge tooltips let you inspect exact date stats without UI overflow.',
      ],
      preview: (
        <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#111] dark:text-white">Focus Heatmap</span>
            <span className="text-[#1FAE6B] font-bold">14d streak</span>
          </div>
          <div className="grid grid-cols-7 gap-1 pt-1">
            {[4, 5, 5, 3, 5, 4, 5, 5, 4, 5, 3, 5, 5, 4].map((v, i) => (
              <div key={i} className={`h-3 rounded-xs ${v === 5 ? 'bg-[#1FAE6B]' : 'bg-[#1FAE6B]/60'}`} />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Teams & Competitions',
      subtitle: 'Compete, collaborate & represent your country.',
      badge: 'Step 6 of 6 · Social & Teams',
      icon: Trophy,
      iconBg: 'bg-[#FFF1F2] dark:bg-rose-950/50 border-[#FECDD3] dark:border-rose-800',
      iconColor: 'text-[#E11D48]',
      bullets: [
        'Join or create private teams with custom 6-digit invite codes or email invites.',
        'Team owners have admin controls to manage members and delete teams.',
        'Compete on global and team leaderboards featuring country flags (🇳🇬 🇺🇸 🇬🇧).',
      ],
      preview: (
        <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] space-y-2 text-xs">
          <div className="flex items-center justify-between bg-white dark:bg-neutral-900 p-2 rounded-lg border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2 font-semibold text-[#111] dark:text-white">
              <span>🇳🇬</span>
              <span>Team Alpha</span>
            </div>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">FREEDOM-78</span>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  const handleFinish = async () => {
    if (user?.uid) {
      try {
        localStorage.setItem(`freedom_walkthrough_seen_${user.uid}`, 'true');
        const updated = await authService.updateUser({ hasSeenWalkthrough: true });
        if (updated) {
          setUser(updated);
        }
      } catch (err) {
        console.warn('Failed to save tour status:', err);
      }
    } else {
      localStorage.setItem('freedom_walkthrough_seen_guest', 'true');
    }
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const IconComp = current.icon;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-[#121215] border border-[#E5E5E5] dark:border-[#27272A] rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between transition-all">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E5E5] dark:border-[#27272A] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${current.iconBg} ${current.iconColor}`}>
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-[#2F6FED] uppercase tracking-wider">
                {current.badge}
              </span>
              <h3 className="text-lg font-extrabold text-[#111] dark:text-white leading-tight">
                {current.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFinish}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-[#666] dark:text-[#AAA] hover:text-[#111] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Skip Tour
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm font-medium text-[#555] dark:text-[#AAA]">
            {current.subtitle}
          </p>

          {/* Interactive Preview Mockup */}
          {current.preview}

          {/* Bullet points */}
          <ul className="space-y-2.5 text-xs text-[#444] dark:text-[#D4D4D8]">
            {current.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED] shrink-0 mt-1.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 sm:p-6 border-t border-[#E5E5E5] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#18181B] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-[#888]'
                : 'text-[#444] dark:text-[#CCC] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Step Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-6 bg-[#2F6FED]'
                    : 'w-2 bg-[#E5E5E5] dark:bg-[#27272A] hover:bg-[#888]'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#1E56C9] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
