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
} from 'lucide-react';

export interface TourStep {
  targetSelector: string;
  route: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const TOUR_STEPS: TourStep[] = [
  // 1. Dashboard - Nav Rail
  {
    targetSelector: '[data-tour="nav-rail"]',
    route: '/dashboard',
    title: 'Sidebar Navigation Rail',
    description: 'Switch seamlessly between your Dashboard, Plan Builder, Active Runtime, Daily Summary, History, Statistics, Heatmap, Leaderboards, and Settings.',
    icon: LayoutDashboard,
  },
  // 2. Dashboard - Overview Cards
  {
    targetSelector: '[data-tour="dashboard-overview-cards"]',
    route: '/dashboard',
    title: 'Overview Stat Metrics',
    description: 'Instant glance at your Current Streak, Planning Accuracy percentage, and Total Productive Time tracked against your daily goal.',
    icon: Flame,
  },
  // 3. Dashboard - Build Day Plan CTA
  {
    targetSelector: '[data-tour="dashboard-builder-btn"]',
    route: '/dashboard',
    title: 'Build Day Plan Action',
    description: 'Click here anytime from your Dashboard to structure your daily focus queue with mathematical precision.',
    icon: CalendarPlus,
  },
  // 4. Dashboard - Replay Tour Action
  {
    targetSelector: '[data-tour="dashboard-replay-tour-btn"]',
    route: '/dashboard',
    title: 'Replay Product Tour',
    description: 'Need clarity on any feature later? Click this button on your Dashboard to re-trigger this interactive tour anytime.',
    icon: Sparkles,
  },
  // 5. Plan Builder - Input
  {
    targetSelector: '[data-tour="builder-add-input"]',
    route: '/builder',
    title: 'Task & Break Creator',
    description: 'Enter task titles, set planned durations (15m, 30m, 45m, 60m), and specify focus vs recovery break types.',
    icon: Plus,
  },
  // 6. Plan Builder - Item List
  {
    targetSelector: '[data-tour="builder-item-list"]',
    route: '/builder',
    title: 'Plan Queue & Timeline',
    description: 'Review your ordered timeline of focus sessions and recovery breaks. Drag or reorder items before starting execution.',
    icon: CalendarPlus,
  },
  // 7. Plan Builder - Start Button
  {
    targetSelector: '[data-tour="builder-start-btn"]',
    route: '/builder',
    title: 'Start Execution Engine',
    description: 'Locks in your structured Day Plan and launches hands-free session execution in the Runtime Engine.',
    icon: Rocket,
  },
  // 8. Runtime Engine - Active Timer Widget
  {
    targetSelector: '[data-tour="runtime-timer-card"]',
    route: '/runtime',
    title: 'Live Countdown Engine',
    description: 'Displays real-time countdown timer, circular progress ring, and active session status. As focus tasks finish, breaks begin automatically with zero manual clicks.',
    icon: Timer,
  },
  // 9. Runtime Engine - Pause & Skip Controls
  {
    targetSelector: '[data-tour="runtime-action-controls"]',
    route: '/runtime',
    title: 'Pause, Resume & Skip Controls',
    description: 'Pause execution without breaking drift telemetry, resume when ready, or skip to the next scheduled task.',
    icon: Zap,
  },
  // 10. Runtime Engine - Extension Controls
  {
    targetSelector: '[data-tour="runtime-extend-btn"]',
    route: '/runtime',
    title: 'Task Extension Controls',
    description: 'In the flow? Instantly extend your active session (+5m, +10m, +20m) with one click.',
    icon: Clock,
  },
  // 11. Runtime Engine - Up Next Queue
  {
    targetSelector: '[data-tour="runtime-queue-card"]',
    route: '/runtime',
    title: 'Up Next Schedule Queue',
    description: 'Preview upcoming focus tasks and recovery breaks waiting in your execution queue for today.',
    icon: CalendarPlus,
  },
  // 12. Daily Summary - Score Card
  {
    targetSelector: '[data-tour="summary-score-card"]',
    route: '/summary',
    title: 'Daily Productivity Score',
    description: 'Automated 0-100 score calculated mathematically from your completion rate, time accuracy, and focus consistency.',
    icon: CheckSquare,
  },
  // 13. Daily Summary - Variance Breakdown
  {
    targetSelector: '[data-tour="summary-variance-card"]',
    route: '/summary',
    title: 'Planning Accuracy & Variance',
    description: 'Compares your planned duration vs actual execution time for each task to sharpen your future estimations.',
    icon: Target,
  },
  // 14. Daily Summary - Streak Audit
  {
    targetSelector: '[data-tour="summary-streak-card"]',
    route: '/summary',
    title: 'Streak & Goal Audit',
    description: 'Audit whether today earned a streak progression badge (≥75% completion threshold).',
    icon: Flame,
  },
  // 15. Task History - Log List
  {
    targetSelector: '[data-tour="history-list-card"]',
    route: '/history',
    title: 'Historical Logs & Search',
    description: 'Browse all past execution days, search by task name, and filter by completion status.',
    icon: History,
  },
  // 16. Task History - Log Detail View
  {
    targetSelector: '[data-tour="history-detail-card"]',
    route: '/history',
    title: 'Daily History Breakdown',
    description: 'Inspect detailed task-by-task logs, exact timestamps, and duration metrics from previous days.',
    icon: CheckSquare,
  },
  // 17. Statistics - Focus Hours Chart
  {
    targetSelector: '[data-tour="stats-chart-card"]',
    route: '/stats',
    title: 'Focus Hours Bar Chart',
    description: 'Visual breakdown comparing focus hours across Monday to Sunday for your active week.',
    icon: BarChart3,
  },
  // 18. Statistics - Week Navigation Controls
  {
    targetSelector: '[data-tour="stats-week-controls"]',
    route: '/stats',
    title: 'Historical Week Controls',
    description: 'Navigate back to inspect previous weeks and analyze long-term focus trends.',
    icon: Calendar,
  },
  // 19. Heatmap - Activity Grid
  {
    targetSelector: '[data-tour="heatmap-grid-card"]',
    route: '/heatmap',
    title: '18-Week Activity Heatmap',
    description: 'GitHub-style grid tracking daily focus activity with hover tooltips showing exact completion metrics.',
    icon: Calendar,
  },
  // 20. Heatmap - Streak & Days Stats
  {
    targetSelector: '[data-tour="heatmap-stats-card"]',
    route: '/heatmap',
    title: 'Streak & Active Days Metrics',
    description: 'Monitors total active focus days, 100% perfect execution days, and current unbroken streak count.',
    icon: Flame,
  },
  // 21. Leaderboard - Custom Teams
  {
    targetSelector: '[data-tour="leaderboard-team-card"]',
    route: '/leaderboard',
    title: 'Custom Teams & Invites',
    description: 'Create or join private execution teams using 6-digit invite codes to hold your team accountable.',
    icon: Users,
  },
  // 22. Leaderboard - Friends & Invites
  {
    targetSelector: '[data-tour="leaderboard-friends-card"]',
    route: '/leaderboard',
    title: 'Friends List & Direct Invites',
    description: 'Invite colleagues via email or add friends to track real-time focus rankings together.',
    icon: Users,
  },
  // 23. Leaderboard - Global Rankings & Flags
  {
    targetSelector: '[data-tour="leaderboard-table-card"]',
    route: '/leaderboard',
    title: 'Global Rankings & Country Flags',
    description: 'Compete on global leaderboards featuring regional country flags (🇳🇬 🇺🇸 🇬🇧) based on timezone telemetry.',
    icon: Trophy,
  },
  // 24. Settings - Profile & Avatar
  {
    targetSelector: '[data-tour="settings-profile-card"]',
    route: '/settings',
    title: 'Profile & Custom Avatar',
    description: 'Update your display name, username handle, and generate custom DiceBear avatars.',
    icon: Settings,
  },
  // 25. Settings - Daily Goal & Notifications
  {
    targetSelector: '[data-tour="settings-goal-card"]',
    route: '/settings',
    title: 'Daily Goal & Notifications',
    description: 'Set your daily productive time target (e.g. 4h 00m) and toggle desktop system notifications.',
    icon: Target,
  },
  // 26. Settings - Sound Effects
  {
    targetSelector: '[data-tour="settings-sound-card"]',
    route: '/settings',
    title: 'Completion Sound Chimes',
    description: 'Customize audio feedback chimes played when focus tasks auto-complete.',
    icon: Zap,
  },
  // 27. Settings - Theme Switcher
  {
    targetSelector: '[data-tour="settings-theme-card"]',
    route: '/settings',
    title: 'Light & Dark Theme Switcher',
    description: 'Toggle between Light, Dark, or System mode to suit your workspace ambiance.',
    icon: Settings,
  },
];

export const SpotlightTourOverlay: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useSessionStore();
  const { isOpen, currentStepIndex, closeTour, nextStep, prevStep } = useTourStore();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Recalculate target element rect on route change, step change, or window resize
  useEffect(() => {
    if (!isOpen || !step) return;

    // Navigate to step route if needed
    if (pathname !== step.route) {
      router.push(step.route);
    }

    let attempts = 0;
    const findTarget = () => {
      const el = document.querySelector(step.targetSelector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else if (attempts < 15) {
        attempts++;
        setTimeout(findTarget, 120);
      }
    };

    const timer = setTimeout(findTarget, 150);

    const handleResize = () => {
      const el = document.querySelector(step.targetSelector);
      if (el) setTargetRect(el.getBoundingClientRect());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
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

  // Compute Popover Position relative to targeted element
  let popoverStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  let caretPositionClass = '';

  if (targetRect) {
    // If target element is low on screen, place popover above
    if (targetRect.bottom > window.innerHeight - 240) {
      popoverStyle = {
        top: Math.max(16, targetRect.top - 230),
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 390)),
      };
      caretPositionClass = 'caret-bottom';
    } else {
      // Place popover below target
      popoverStyle = {
        top: targetRect.bottom + 16,
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 390)),
      };
      caretPositionClass = 'caret-top';
    }
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
