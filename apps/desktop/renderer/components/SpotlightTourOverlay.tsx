'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  Zap,
  Plus,
  Rocket,
  Clock,
  Calendar,
  Users,
} from 'lucide-react';

export interface TourStep {
  targetSelector: string;
  route: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="dashboard-builder-btn"]',
    route: '/dashboard',
    title: 'Build Day Plan Action',
    description: 'Click here anytime from your Dashboard to start structuring your morning deep work queue.',
    icon: CalendarPlus,
  },
  {
    targetSelector: '[data-tour="builder-add-btn"]',
    route: '/builder',
    title: 'Task & Break Creator',
    description: 'Add custom focus tasks and auto-advancing recovery breaks to your day timeline.',
    icon: Plus,
  },
  {
    targetSelector: '[data-tour="builder-start-btn"]',
    route: '/builder',
    title: 'Start Execution Engine',
    description: 'Locks in your structured Day Plan and launches hands-free session execution.',
    icon: Rocket,
  },
  {
    targetSelector: '[data-tour="runtime-timer-card"]',
    route: '/runtime',
    title: 'Live Countdown Engine',
    description: 'Displays active task progress. As focus tasks finish, recovery breaks begin automatically with zero manual clicks.',
    icon: Timer,
  },
  {
    targetSelector: '[data-tour="runtime-extend-btn"]',
    route: '/runtime',
    title: 'Task Extension & Controls',
    description: 'Need more time? Instantly extend your active session (+10m / +20m) or pause without breaking drift math.',
    icon: Clock,
  },
  {
    targetSelector: '[data-tour="summary-score-card"]',
    route: '/summary',
    title: 'Daily Summary & Score',
    description: 'Automated 0-100 Productivity Score calculated from completion rate and planning accuracy.',
    icon: CheckSquare,
  },
  {
    targetSelector: '[data-tour="stats-week-controls"]',
    route: '/stats',
    title: 'Historical Week Controls',
    description: 'Navigate past weeks to compare total focus hours and execution accuracy across your history.',
    icon: BarChart3,
  },
  {
    targetSelector: '[data-tour="heatmap-grid-card"]',
    route: '/heatmap',
    title: 'Consistency Heatmap Grid',
    description: 'GitHub-style activity grid tracking daily focus consistency with edge-safe tooltips.',
    icon: Calendar,
  },
  {
    targetSelector: '[data-tour="leaderboard-team-card"]',
    route: '/leaderboard',
    title: 'Custom Teams & Invites',
    description: 'Create or join private execution teams using 6-digit codes or direct email invitations.',
    icon: Users,
  },
  {
    targetSelector: '[data-tour="leaderboard-table-card"]',
    route: '/leaderboard',
    title: 'Global Rankings & Flags',
    description: 'Compete on global leaderboards featuring country flags (🇳🇬 🇺🇸 🇬🇧) based on timezone telemetry.',
    icon: Trophy,
  },
];

interface SpotlightTourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpotlightTourOverlay: React.FC<SpotlightTourOverlayProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useSessionStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
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
      } else if (attempts < 12) {
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
    onClose();
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
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
        top: Math.max(16, targetRect.top - 220),
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 380)),
      };
      caretPositionClass = 'caret-bottom';
    } else {
      // Place popover below target
      popoverStyle = {
        top: targetRect.bottom + 16,
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 380)),
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
            top: targetRect.top - 4,
            left: targetRect.left - 4,
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
            <div className="p-2 rounded-xl bg-[#2F6FED] text-white">
              <IconComp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">{step.title}</h3>
              <span className="text-[10px] font-mono text-[#38BDF8]">
                {currentStepIndex + 1} of {TOUR_STEPS.length}
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
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex ? 'w-4 bg-[#38BDF8]' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Prev
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-xl bg-[#2F6FED] hover:bg-[#1E56C9] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
