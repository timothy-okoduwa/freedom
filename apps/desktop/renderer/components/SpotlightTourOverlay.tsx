'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSessionStore } from '../stores/useSessionStore';
import { useTourStore } from '../stores/useTourStore';
import { authService } from '../lib/firebase';
import {
  LayoutDashboard,
  CalendarPlus,
  Timer,
  CheckSquare,
  History,
  BarChart3,
  Trophy,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Plus,
  Rocket,
  Clock,
  Calendar,
  Users,
  Settings,
  Flame,
  Target,
  Swords,
  Sun,
  Volume2,
  Download,
  Search,
} from 'lucide-react';

export interface TourStep {
  targetSelector: string;
  route: string;
  subTab?: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const TOUR_STEPS: TourStep[] = [
  // ---------------- DASHBOARD (Steps 1-6) ----------------
  {
    targetSelector: '[data-tour="nav-rail"]',
    route: '/dashboard',
    title: 'Sidebar Navigation Rail',
    description: 'Switch seamlessly between Dashboard, Plan Builder, Runtime Engine, Summary, History, Stats, Heatmap, Leaderboards, and Settings.',
    icon: LayoutDashboard,
  },
  {
    targetSelector: '[data-tour="dashboard-header"]',
    route: '/dashboard',
    title: 'Dashboard Welcome & Greeting',
    description: 'Displays today\'s date and personalized greeting based on your local timezone.',
    icon: LayoutDashboard,
  },
  {
    targetSelector: '[data-tour="dashboard-overview-cards"]',
    route: '/dashboard',
    title: 'Overview Stat Metrics',
    description: 'Instant glance at your Current Streak, Planning Accuracy percentage, and Total Productive Time tracked against your daily goal.',
    icon: Flame,
  },
  {
    targetSelector: '[data-tour="dashboard-replay-tour-btn"]',
    route: '/dashboard',
    title: 'Replay Product Tour',
    description: 'Need clarity on any feature later? Click this button on your Dashboard to re-trigger this interactive tour anytime.',
    icon: Sparkles,
  },
  {
    targetSelector: '[data-tour="dashboard-builder-btn"]',
    route: '/dashboard',
    title: 'Build Day Plan Action',
    description: 'Click here anytime from your Dashboard to structure your daily focus queue with mathematical precision.',
    icon: CalendarPlus,
  },
  {
    targetSelector: '[data-tour="dashboard-queue-card"]',
    route: '/dashboard',
    title: 'Today\'s Execution Queue',
    description: 'Displays all scheduled focus tasks and recovery breaks waiting in your execution pipeline for today.',
    icon: CalendarPlus,
  },

  // ---------------- PLAN BUILDER (Steps 7-10) ----------------
  {
    targetSelector: '[data-tour="builder-header"]',
    route: '/builder',
    title: 'Plan Builder & 24H Cap',
    description: 'Freedom enforces a 24-hour total daily time cap to ensure your workday timeline remains realistic and balanced.',
    icon: CalendarPlus,
  },
  {
    targetSelector: '[data-tour="builder-add-btn"]',
    route: '/builder',
    title: 'Task & Break Creator',
    description: 'Enter task titles, set planned durations (15m, 25m, 45m, 60m), and specify focus vs recovery break types.',
    icon: Plus,
  },
  {
    targetSelector: '[data-tour="builder-item-list"]',
    route: '/builder',
    title: 'Plan Queue & Timeline',
    description: 'Review your ordered timeline of focus sessions and recovery breaks. Drag or reorder items before starting execution.',
    icon: CalendarPlus,
  },
  {
    targetSelector: '[data-tour="builder-start-btn"]',
    route: '/builder',
    title: 'Start Execution Engine',
    description: 'Locks in your structured Day Plan and launches hands-free session execution in the Runtime Engine.',
    icon: Rocket,
  },

  // ---------------- RUNTIME ENGINE (Steps 11-15) ----------------
  {
    targetSelector: '[data-tour="runtime-header"]',
    route: '/runtime',
    title: 'Live Execution Status Banner',
    description: 'Monitors real-time session telemetry: RUNNING ON TRACK, PAUSED, or OVERTIME EXTENSION.',
    icon: Timer,
  },
  {
    targetSelector: '[data-tour="runtime-timer-card"]',
    route: '/runtime',
    title: 'Live Countdown Engine',
    description: 'Displays real-time countdown timer, circular progress ring, and active session status. As focus tasks finish, breaks begin automatically with zero manual clicks.',
    icon: Timer,
  },
  {
    targetSelector: '[data-tour="runtime-action-controls"]',
    route: '/runtime',
    title: 'Pause, Resume & Skip Controls',
    description: 'Pause execution without breaking drift telemetry, resume when ready, or skip to the next scheduled task.',
    icon: Zap,
  },
  {
    targetSelector: '[data-tour="runtime-extend-btn"]',
    route: '/runtime',
    title: 'Task Extension Controls',
    description: 'In the flow? Instantly extend your active session (+10m, +20m) with one click.',
    icon: Clock,
  },
  {
    targetSelector: '[data-tour="runtime-queue-card"]',
    route: '/runtime',
    title: 'Up Next Schedule Queue',
    description: 'Preview upcoming focus tasks and recovery breaks waiting in your execution queue for today.',
    icon: CalendarPlus,
  },

  // ---------------- DAILY SUMMARY (Steps 16-19) ----------------
  {
    targetSelector: '[data-tour="summary-header"]',
    route: '/summary',
    title: 'Daily Execution Summary',
    description: 'Provides a mathematical post-workday audit of your completion rate, planning accuracy, and streak qualification.',
    icon: CheckSquare,
  },
  {
    targetSelector: '[data-tour="summary-score-card"]',
    route: '/summary',
    title: 'Daily Productivity Score',
    description: 'Automated 0-100 score calculated mathematically from your completion rate, time accuracy, and focus discipline.',
    icon: CheckSquare,
  },
  {
    targetSelector: '[data-tour="summary-variance-card"]',
    route: '/summary',
    title: 'Planning Accuracy & Variance',
    description: 'Compares your planned duration vs actual execution time for each task to sharpen your future estimations.',
    icon: Target,
  },
  {
    targetSelector: '[data-tour="summary-streak-card"]',
    route: '/summary',
    title: 'Item Execution Log & Streak Audit',
    description: 'Audit item-by-item completion logs and verify if today qualified for streak progression (≥75% completion threshold).',
    icon: Flame,
  },

  // ---------------- TASK HISTORY (Steps 20-22) ----------------
  {
    targetSelector: '[data-tour="history-search-card"]',
    route: '/history',
    title: 'Archive Logs Search Bar',
    description: 'Search past execution logs by task title or date to review historical performance.',
    icon: Search,
  },
  {
    targetSelector: '[data-tour="history-list-card"]',
    route: '/history',
    title: 'Historical Day Plans List',
    description: 'Browse all past execution days archived chronologically in your account.',
    icon: History,
  },
  {
    targetSelector: '[data-tour="history-detail-card"]',
    route: '/history',
    title: 'Daily History Breakdown',
    description: 'Inspect detailed task-by-task logs, exact timestamps, and duration metrics from previous days.',
    icon: CheckSquare,
  },

  // ---------------- STATISTICS (Steps 23-26) ----------------
  {
    targetSelector: '[data-tour="stats-overview-cards"]',
    route: '/stats',
    title: 'Historical Stat Overview',
    description: 'Displays Total Productive Hours, Overall Planning Accuracy, and Longest Unbroken Streak.',
    icon: BarChart3,
  },
  {
    targetSelector: '[data-tour="stats-reliability-card"]',
    route: '/stats',
    title: 'Execution Reliability Ratios',
    description: 'Monitors the ratio of completed tasks vs skipped or overrun tasks.',
    icon: Target,
  },
  {
    targetSelector: '[data-tour="stats-chart-card"]',
    route: '/stats',
    title: 'Weekly Output Bar Chart',
    description: 'Visual breakdown comparing focus hours across Monday to Sunday for your active week.',
    icon: BarChart3,
  },
  {
    targetSelector: '[data-tour="stats-week-controls"]',
    route: '/stats',
    title: 'Historical Week Controls',
    description: 'Navigate back to inspect previous weeks and analyze long-term focus trends.',
    icon: Calendar,
  },

  // ---------------- HEATMAP (Steps 27-28) ----------------
  {
    targetSelector: '[data-tour="heatmap-grid-card"]',
    route: '/heatmap',
    title: '18-Week Activity Heatmap',
    description: 'GitHub-style grid tracking daily focus activity with hover tooltips showing exact completion metrics.',
    icon: Calendar,
  },
  {
    targetSelector: '[data-tour="heatmap-stats-card"]',
    route: '/heatmap',
    title: 'Streak & Active Days Metrics',
    description: 'Monitors total active focus days, 100% perfect execution days, and current unbroken streak count.',
    icon: Flame,
  },

  // ---------------- LEADERBOARD (Steps 29-32) ----------------
  {
    targetSelector: '[data-tour="leaderboard-global-card"]',
    route: '/leaderboard',
    subTab: 'global',
    title: 'Global Rankings & Flags',
    description: 'Compete on global leaderboards featuring regional country flags (🇳🇬 🇺🇸 🇬🇧) based on timezone telemetry.',
    icon: Trophy,
  },
  {
    targetSelector: '[data-tour="leaderboard-friends-card"]',
    route: '/leaderboard',
    subTab: 'friends',
    title: 'Friends Leaderboard & Invites',
    description: 'Invite colleagues via email or add friends to track real-time focus rankings together.',
    icon: Users,
  },
  {
    targetSelector: '[data-tour="leaderboard-team-card"]',
    route: '/leaderboard',
    subTab: 'teams',
    title: 'Custom Teams & 6-Digit Codes',
    description: 'Create or join private execution teams using 6-digit invite codes to hold your team accountable.',
    icon: Users,
  },
  {
    targetSelector: '[data-tour="leaderboard-comp-card"]',
    route: '/leaderboard',
    subTab: 'competitions',
    title: 'Lock-in Competitions & Crowns',
    description: 'Compete in time-boxed focus sprints for Diamond 💎, Gold 👑, Silver 🥈, and Bronze 🥉 crowns.',
    icon: Swords,
  },

  // ---------------- SETTINGS (Steps 33-38) ----------------
  {
    targetSelector: '[data-tour="settings-theme-card"]',
    route: '/settings',
    title: 'Light & Dark Theme Switcher',
    description: 'Toggle between Light, Dark, or System mode to suit your workspace ambiance.',
    icon: Sun,
  },
  {
    targetSelector: '[data-tour="settings-sound-card"]',
    route: '/settings',
    title: 'Completion Sound Chimes',
    description: 'Customize audio feedback chimes played when focus tasks auto-complete.',
    icon: Volume2,
  },
  {
    targetSelector: '[data-tour="settings-profile-card"]',
    route: '/settings',
    title: 'Profile & DiceBear Avatar',
    description: 'Update your display name, username handle, and generate custom DiceBear avatars.',
    icon: Settings,
  },
  {
    targetSelector: '[data-tour="settings-goal-card"]',
    route: '/settings',
    title: 'Daily Goal & Notifications',
    description: 'Set your daily productive time target (e.g. 4h 00m) and toggle desktop system notifications.',
    icon: Target,
  },
  {
    targetSelector: '[data-tour="settings-tour-card"]',
    route: '/settings',
    title: 'Interactive Tour Replay',
    description: 'Replay this step-by-step walkthrough anytime from Settings.',
    icon: Sparkles,
  },
  {
    targetSelector: '[data-tour="settings-export-card"]',
    route: '/settings',
    title: 'Data Export & Session Reset',
    description: 'Export your complete execution history to JSON or manage your local session.',
    icon: Download,
  },
];

export const SpotlightTourOverlay: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useSessionStore();
  const { isOpen, currentStepIndex, closeTour, nextStep, prevStep } = useTourStore();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Broadcast step change, navigate route, auto-scroll target into view, and track position in real-time
  useEffect(() => {
    if (!isOpen || !step) return;

    // Dispatch step change event for page sub-tabs (e.g. Leaderboard)
    window.dispatchEvent(new CustomEvent('freedom_tour_step', { detail: step }));

    // Navigate to step route if needed
    if (pathname !== step.route) {
      router.push(step.route);
    }

    let isMounted = true;
    let attempts = 0;

    const findAndScrollTarget = () => {
      if (!isMounted) return;
      const el = document.querySelector(step.targetSelector);
      if (el) {
        // Auto-scroll element into center of view so user never has to search for it
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else if (attempts < 25) {
        attempts++;
        setTimeout(findAndScrollTarget, 100);
      }
    };

    const timer = setTimeout(findAndScrollTarget, 120);

    const handleUpdate = () => {
      if (!isMounted) return;
      const el = document.querySelector(step.targetSelector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isOpen, currentStepIndex, step, pathname, router]);

  if (!isOpen || !step) return null;

  const handleFinish = async () => {
    if (user?.uid) {
      try {
        localStorage.setItem(`freedom_walkthrough_seen_${user.uid}`, 'true');
        const updated = await authService.updateUser({ hasSeenWalkthrough: true });
        if (updated) setUser(updated);
      } catch (err) {
        console.warn('Failed to update walkthrough state:', err);
      }
    } else {
      localStorage.setItem('freedom_walkthrough_seen_guest', 'true');
    }
    closeTour();
  };

  const handleNextClick = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      nextStep(TOUR_STEPS.length);
    } else {
      handleFinish();
    }
  };

  // Compute Popover Position relative to targeted element with strict viewport clamping
  let popoverStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  let caretPositionClass = '';

  if (targetRect) {
    const popoverHeight = 250;
    const popoverWidth = 380;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    let calculatedTop = 0;

    if (spaceBelow >= popoverHeight + 16) {
      calculatedTop = targetRect.bottom + 12;
      caretPositionClass = 'caret-top';
    } else if (spaceAbove >= popoverHeight + 16) {
      calculatedTop = targetRect.top - popoverHeight - 12;
      caretPositionClass = 'caret-bottom';
    } else {
      if (spaceAbove > spaceBelow) {
        calculatedTop = Math.max(16, targetRect.top - popoverHeight - 8);
        caretPositionClass = 'caret-bottom';
      } else {
        calculatedTop = Math.min(viewportHeight - popoverHeight - 16, targetRect.bottom + 8);
        caretPositionClass = 'caret-top';
      }
    }

    // Strict safety bounds: popover card can NEVER bleed off the bottom or top of viewport
    const finalTop = Math.max(16, Math.min(viewportHeight - popoverHeight - 16, calculatedTop));

    let calculatedLeft = targetRect.left;
    if (targetRect.width > popoverWidth) {
      calculatedLeft = targetRect.left + (targetRect.width - popoverWidth) / 2;
    }
    const finalLeft = Math.max(16, Math.min(viewportWidth - popoverWidth - 16, calculatedLeft));

    popoverStyle = {
      top: `${finalTop}px`,
      left: `${finalLeft}px`,
    };
  }

  const IconComp = step.icon;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none animate-fadeIn">
      {/* Target Element Glowing Spotlight Highlight Box (NO DARK BACKDROP BLUR) */}
      {targetRect && (
        <div
          className="fixed rounded-xl ring-4 ring-[#2F6FED] ring-offset-2 ring-offset-white dark:ring-offset-black shadow-2xl transition-all duration-300 pointer-events-none z-50 animate-pulse"
          style={{
            top: Math.max(0, targetRect.top - 4),
            left: Math.max(0, targetRect.left - 4),
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Floating Dark Caret Tooltip Popover Box */}
      <div
        className="fixed pointer-events-auto z-50 w-80 sm:w-96 bg-[#0F172A] text-white p-5 rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 space-y-4 font-sans"
        style={popoverStyle}
      >
        {/* Caret Triangle Arrow */}
        {caretPositionClass === 'caret-top' && (
          <div className="absolute -top-2 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#0F172A]" />
        )}
        {caretPositionClass === 'caret-bottom' && (
          <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#0F172A]" />
        )}

        {/* Popover Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2F6FED] text-white shrink-0">
              <IconComp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">{step.title}</h3>
              <span className="text-[10px] font-mono text-[#38BDF8]">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFinish}
            title="Skip Tour"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popover Description */}
        <p className="text-xs text-[#CBD5E1] leading-relaxed font-medium">
          {step.description}
        </p>

        {/* Popover Footer Controls */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1 max-w-[150px] overflow-hidden">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all shrink-0 ${
                  idx === currentStepIndex ? 'w-4 bg-[#38BDF8]' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Prev
              </button>
            )}
            <button
              type="button"
              onClick={handleNextClick}
              className="px-3.5 py-1.5 rounded-xl bg-[#2F6FED] hover:bg-[#1E56C9] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
