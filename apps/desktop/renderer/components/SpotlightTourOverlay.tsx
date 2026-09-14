'use client';

import React, { useEffect, useState, useRef } from 'react';
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
    targetSelector: '[data-tour="nav-dashboard"]',
    route: '/dashboard',
    title: 'Dashboard & Live Focus',
    description: 'Your central command deck. View active timers, current day streaks, and launch floating overlay widgets.',
    icon: LayoutDashboard,
  },
  {
    targetSelector: '[data-tour="nav-builder"]',
    route: '/builder',
    title: 'Plan Builder',
    description: 'Order your deep work tasks and break blocks in the morning before starting your day.',
    icon: CalendarPlus,
  },
  {
    targetSelector: '[data-tour="nav-runtime"]',
    route: '/runtime',
    title: 'Hands-Free Engine',
    description: 'Hands-free execution. As focus tasks finish, breaks start automatically with zero manual clicking.',
    icon: Timer,
  },
  {
    targetSelector: '[data-tour="nav-summary"]',
    route: '/summary',
    title: 'Daily Summary & Audit',
    description: 'Automated end-of-day wrap-up auditing planned vs actual time, accuracy scores, and completion percentage.',
    icon: CheckSquare,
  },
  {
    targetSelector: '[data-tour="nav-stats"]',
    route: '/stats',
    title: 'Statistics & Heatmap',
    description: 'Track long-term productivity trends, total focus hours, and your GitHub-style activity grid.',
    icon: BarChart3,
  },
  {
    targetSelector: '[data-tour="nav-leaderboard"]',
    route: '/leaderboard',
    title: 'Leaderboard & Teams',
    description: 'Compete with friends or private teammates, track country flags, and celebrate output ranks.',
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
      } else if (attempts < 10) {
        attempts++;
        setTimeout(findTarget, 100);
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

  // Compute Popover Position (Right or Below target element)
  let popoverStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  let caretPositionClass = '';

  if (targetRect) {
    // If target is in left nav rail, position popover to the right of target
    if (targetRect.left < 300) {
      popoverStyle = {
        top: Math.max(20, Math.min(targetRect.top - 20, window.innerHeight - 260)),
        left: targetRect.right + 16,
      };
      caretPositionClass = 'caret-left';
    } else {
      // Position popover below target
      popoverStyle = {
        top: targetRect.bottom + 16,
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 340)),
      };
      caretPositionClass = 'caret-top';
    }
  }

  const IconComp = step.icon;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none animate-fadeIn">
      {/* Semi-transparent Backdrop Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300" onClick={handleFinish} />

      {/* Target Element Spotlight Highlight Box */}
      {targetRect && (
        <div
          className="fixed rounded-xl ring-4 ring-[#2F6FED] ring-offset-2 ring-offset-black/30 shadow-2xl transition-all duration-300 pointer-events-none z-50 animate-pulse bg-white/5"
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
        className="fixed z-50 w-80 sm:w-96 bg-[#0F172A] text-white p-5 rounded-2xl shadow-2xl border border-white/15 transition-all duration-300 space-y-4 font-sans"
        style={popoverStyle}
      >
        {/* Caret Triangle Arrow */}
        {caretPositionClass === 'caret-left' && (
          <div className="absolute -left-2 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#0F172A]" />
        )}
        {caretPositionClass === 'caret-top' && (
          <div className="absolute -top-2 left-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#0F172A]" />
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
