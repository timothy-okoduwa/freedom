'use client';

import React, { useEffect, useState } from 'react';
import { useSessionStore } from '../../stores/useSessionStore';
import { formatRemainingTime } from '../../lib/timerEngine';
import { ProgressRing, FreedomLogo } from '@freedom/ui';
import { ChevronUp, Play, Pause, Plus, Check } from 'lucide-react';

export default function WidgetPage() {
  const { activeItem, remainingMs, loadActiveSession, extendTask, finishTask, pause, resume } =
    useSessionStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadActiveSession();

    // Check theme
    const updateTheme = () => {
      const saved = localStorage.getItem('freedom_theme') || 'dark';
      const dark =
        saved === 'dark' ||
        (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(dark);
    };
    updateTheme();
    window.addEventListener('storage', updateTheme);
    return () => window.removeEventListener('storage', updateTheme);
  }, [loadActiveSession]);

  // Auto-show floating pill whenever a session is active
  useEffect(() => {
    if (activeItem) {
      window.freedom?.widget?.show();
    }
  }, [activeItem]);

  // Hide floating pill widget completely 5 seconds after all tasks are completed & pill becomes idle
  useEffect(() => {
    if (!activeItem) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
        window.freedom?.widget?.toggleExpand(false);
        window.freedom?.widget?.hide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeItem]);

  const { formatted, isOvertime } = formatRemainingTime(remainingMs);

  const totalPlannedMinutes =
    (activeItem?.plannedDurationMinutes ?? 25) + (activeItem?.extensionMinutes ?? 0);
  const totalPlannedMs = totalPlannedMinutes * 60000;
  const elapsedMs = totalPlannedMs - remainingMs;
  const progress = Math.min(100, Math.max(0, (elapsedMs / totalPlannedMs) * 100));

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    window.freedom?.widget?.toggleExpand(next);
  };

  const isPaused = !!activeItem?.pausedAt;

  // Real-time second-by-second countdown computation (eliminates rounding up bug)
  const remainingSecsTotal = Math.max(0, Math.floor(remainingMs / 1000));
  const mins = Math.floor(remainingSecsTotal / 60);
  const secs = remainingSecsTotal % 60;
  const exactTimeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const clickTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = React.useRef<boolean>(false);

  const handlePillMouseDown = (e: React.MouseEvent) => {
    let prevX = e.screenX;
    let prevY = e.screenY;
    let totalMoved = 0;
    isDraggingRef.current = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.screenX - prevX;
      const dy = moveEvent.screenY - prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalMoved += dist;

      if (dist > 0) {
        if (totalMoved > 4) {
          isDraggingRef.current = true;
        }
        window.freedom?.widget?.moveBy(dx, dy);
        prevX = moveEvent.screenX;
        prevY = moveEvent.screenY;
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handlePillClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If user dragged the pill, ignore click event completely
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    if (e.detail === 1) {
      // Single Click: wait 260ms to confirm no second click follows
      clickTimerRef.current = setTimeout(() => {
        toggleExpand(); // ONLY expands/collapses the pill widget
        clickTimerRef.current = null;
      }, 260);
    } else if (e.detail >= 2) {
      // Double Click: cancel single-click expansion and focus main app window ONLY
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      window.freedom?.session?.focusMainWindow();
    }
  };

  // COLLAPSED: Freedom Signature Focus Capsule
  if (!isExpanded) {
    const isBreak = activeItem?.itemType === 'break';
    const accentColor = isBreak ? '#10B981' : '#2F6FED';

    return (
      <div
        className="w-screen h-screen flex items-center justify-center select-none bg-transparent overflow-hidden p-0 m-0"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div
          onMouseDown={handlePillMouseDown}
          onClick={handlePillClick}
          style={{ WebkitAppRegion: 'no-drag' } as any}
          title={activeItem ? `Freedom: ${activeItem.title} (${exactTimeStr}) — Single click to expand, double click for app` : 'Freedom — Single click to expand, double click for app'}
          className={`w-[38px] h-[84px] rounded-full flex flex-col items-center justify-between py-2 px-0.5 cursor-pointer hover:scale-105 transition-all duration-200 group ${
            isDark
              ? 'bg-[#090B10]/95 border border-[#2F6FED]/40 shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-white hover:border-[#2F6FED]'
              : 'bg-white/95 border border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#111] hover:border-[#2F6FED]'
          }`}
        >
          {/* Top: Freedom Signature Emblem Centered */}
          <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
            {activeItem && !isPaused && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: accentColor }}
              />
            )}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12 duration-300 overflow-hidden"
              style={{
                backgroundColor: activeItem ? `${accentColor}25` : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <img
                src="/freedom.png"
                alt="Freedom Logo"
                className="w-4 h-4 object-contain rounded-full shrink-0"
              />
            </div>
          </div>

          {/* Middle: Real-Time Exact Time Countdown */}
          <div className="text-center leading-none">
            {activeItem ? (
              <span
                className={`font-mono text-[9px] font-extrabold tracking-tight tabular-nums ${
                  isOvertime
                    ? 'text-[#E8A33D]'
                    : isDark
                    ? 'text-white'
                    : 'text-[#111]'
                }`}
              >
                {exactTimeStr}
              </span>
            ) : (
              <span className={`text-[8.5px] font-mono tracking-wider uppercase font-semibold ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                IDLE
              </span>
            )}
          </div>

          {/* Bottom: Freedom Focus Rhythm Bars */}
          <div className="flex items-center gap-[2.5px]">
            <span
              className={`w-[2px] rounded-full transition-all duration-300 ${
                activeItem
                  ? isPaused
                    ? 'h-1.5 opacity-40'
                    : 'h-2 animate-pulse'
                  : isDark ? 'h-1 bg-white/20' : 'h-1 bg-black/20'
              }`}
              style={{
                backgroundColor: activeItem ? accentColor : undefined,
                boxShadow: activeItem && !isPaused ? `0 0 4px ${accentColor}` : undefined,
              }}
            />
            <span
              className={`w-[2px] rounded-full transition-all duration-300 ${
                activeItem
                  ? isPaused
                    ? 'h-2.5 opacity-40'
                    : 'h-3.5 animate-pulse delay-75'
                  : isDark ? 'h-1.5 bg-white/30' : 'h-1.5 bg-black/30'
              }`}
              style={{
                backgroundColor: activeItem ? accentColor : undefined,
                boxShadow: activeItem && !isPaused ? `0 0 6px ${accentColor}` : undefined,
              }}
            />
            <span
              className={`w-[2px] rounded-full transition-all duration-300 ${
                activeItem
                  ? isPaused
                    ? 'h-1.5 opacity-40'
                    : 'h-2 animate-pulse delay-150'
                  : isDark ? 'h-1 bg-white/20' : 'h-1 bg-black/20'
              }`}
              style={{
                backgroundColor: activeItem ? accentColor : undefined,
                boxShadow: activeItem && !isPaused ? `0 0 4px ${accentColor}` : undefined,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // EXPANDED: Detailed Control Card
  return (
    <div
      className="w-full h-screen p-1 flex flex-col justify-center select-none bg-transparent"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      <div
        className={`w-full h-full rounded-2xl p-3 flex flex-col justify-between transition-all ${
          isDark
            ? 'bg-[#121215]/95 backdrop-blur-xl border border-white/10 text-white shadow-2xl'
            : 'bg-white/95 backdrop-blur-xl border border-black/10 text-[#111] shadow-xl'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="flex items-center gap-2.5">
            <ProgressRing
              progress={progress}
              size={28}
              strokeWidth={3}
              color={isOvertime ? '#E8A33D' : activeItem?.itemType === 'break' ? '#1FAE6B' : '#2F6FED'}
              bgColor={isDark ? '#27272A' : '#E5E7EB'}
            />
            <span
              className={`font-mono font-extrabold text-sm tabular-nums tracking-tight ${
                isOvertime ? 'text-[#E8A33D]' : isDark ? 'text-white' : 'text-[#111]'
              }`}
            >
              {formatted}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleExpand}
            title="Collapse to pill"
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-400 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Middle: Active Task Title */}
        <div className="py-0.5">
          <div className="text-[11px] font-bold truncate">
            {activeItem?.title || 'No active session'}
          </div>
        </div>

        {/* Bottom Control Buttons */}
        <div className="flex items-center gap-1.5" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            type="button"
            onClick={() => extendTask(10)}
            disabled={!activeItem}
            className={`flex-1 py-1 px-1.5 rounded-lg border text-[11px] font-semibold transition-colors disabled:opacity-40 cursor-pointer text-center ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            +10m
          </button>

          <button
            type="button"
            onClick={() => (isPaused ? resume() : pause())}
            disabled={!activeItem}
            className={`flex-1 py-1 px-1.5 rounded-lg border text-[11px] font-semibold transition-colors disabled:opacity-40 cursor-pointer text-center ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button
            type="button"
            onClick={() => finishTask()}
            disabled={!activeItem}
            className="flex-1 py-1 px-1.5 rounded-lg bg-[#2F6FED] hover:bg-[#2558BE] text-white text-[11px] font-semibold transition-colors disabled:opacity-40 cursor-pointer text-center shadow-xs"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
