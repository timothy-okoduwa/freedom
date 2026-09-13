'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSessionStore } from '../../../stores/useSessionStore';
import { formatRemainingTime } from '../../../lib/timerEngine';
import { ProgressRing, Button, Card, Modal } from '@freedom/ui';

export default function RuntimePage() {
  const {
    activeItem,
    activePlan,
    remainingMs,
    extendTask,
    finishTask,
    skipTask,
    pause,
    resume,
  } = useSessionStore();

  const [isSkipConfirmOpen, setIsSkipConfirmOpen] = useState(false);

  if (!activeItem || !activePlan) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="text-4xl">⏱</div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No Active Execution</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Build your day queue and hit Start Day to begin running the execution engine.
        </p>
        <Link
          href="/builder"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#2558BE] text-white text-xs font-semibold transition-colors"
        >
          Go to Day Plan Builder
        </Link>
      </div>
    );
  }

  const { formatted, isOvertime } = formatRemainingTime(remainingMs);

  const totalPlannedMinutes = activeItem.plannedDurationMinutes + activeItem.extensionMinutes;
  const totalPlannedMs = totalPlannedMinutes * 60000;
  const elapsedMs = totalPlannedMs - remainingMs;
  const progress = Math.min(100, Math.max(0, (elapsedMs / totalPlannedMs) * 100));

  const isBreak = activeItem.itemType === 'break';
  const isPaused = !!activeItem.pausedAt;

  // Next item preview
  const currentIndex = activePlan.items.findIndex((i) => i.id === activeItem.itemId);
  const nextItem = activePlan.items[currentIndex + 1];

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isPaused
                ? 'bg-zinc-400'
                : isOvertime
                ? 'bg-[#E8A33D] animate-ping'
                : 'bg-[#1FAE6B] animate-pulse'
            }`}
          />
          <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300">
            {isPaused ? 'SESSION PAUSED' : isOvertime ? 'OVERTIME EXTENSION' : 'RUNNING ON TRACK'}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Item {currentIndex + 1} of {activePlan.items.length}
          </span>
        </div>
      </div>

      {/* Main Execution Card */}
      <Card
        variant="default"
        className={`p-8 sm:p-12 text-center transition-all ${
          isOvertime
            ? 'border-[#E8A33D]/40 bg-[#FFFDF9] dark:bg-amber-950/20'
            : 'bg-white dark:bg-[#18181B] border-neutral-200 dark:border-[#27272A]'
        }`}
      >
        <span className="text-xs uppercase font-mono tracking-widest text-[#2F6FED]">
          {isBreak ? '☕ Recovery Break' : '💻 Active Task'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1 mb-8 max-w-lg mx-auto">
          {activeItem.title}
        </h1>

        {/* Central Progress Ring */}
        <div className="flex justify-center my-6">
          <ProgressRing
            progress={progress}
            size={220}
            strokeWidth={12}
            color={
              isOvertime
                ? '#E8A33D'
                : isBreak
                ? '#1FAE6B'
                : '#2F6FED'
            }
            bgColor="#27272A"
          >
            <div className="flex flex-col items-center">
              <span
                className={`text-5xl sm:text-6xl font-mono font-bold tracking-tight tabular-nums ${
                  isOvertime ? 'text-[#E8A33D]' : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {formatted}
              </span>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                {isOvertime ? 'Exceeded Plan' : `${Math.round(progress)}% completed`}
              </span>
            </div>
          </ProgressRing>
        </div>

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <Button
            variant={isPaused ? 'primary' : 'secondary'}
            size="md"
            onClick={() => (isPaused ? resume() : pause())}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </Button>
          <Button variant="secondary" size="md" onClick={() => extendTask(10)}>
            +10 min
          </Button>
          <Button variant="secondary" size="md" onClick={() => extendTask(20)}>
            +20 min
          </Button>
          <Button variant="primary" size="md" onClick={() => finishTask()}>
            Finish Now ✓
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setIsSkipConfirmOpen(true)}
            className="text-[#E5484D] hover:bg-[#FDECEE] dark:hover:bg-red-950/30"
          >
            Skip
          </Button>
        </div>
      </Card>

      {/* Up Next Card */}
      {nextItem ? (
        <Card variant="surface" className="p-4 flex items-center justify-between bg-white dark:bg-[#18181B] border-neutral-200 dark:border-[#27272A]">
          <div className="flex items-center gap-3">
            <span className="text-sm">{nextItem.type === 'break' ? '☕' : '💻'}</span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Up Next in Queue
              </span>
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{nextItem.title}</span>
            </div>
          </div>
          <span className="font-mono text-xs text-[#2F6FED] font-medium">
            {nextItem.plannedDurationMinutes}m
          </span>
        </Card>
      ) : (
        <Card variant="surface" className="p-4 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-[#18181B] border-neutral-200 dark:border-[#27272A]">
          🏁 This is the final item in today's Day Plan!
        </Card>
      )}

      {/* Skip Confirmation Modal */}
      <Modal
        isOpen={isSkipConfirmOpen}
        onClose={() => setIsSkipConfirmOpen(false)}
        title="Skip Current Item?"
        description="Skipping a task records it as incomplete and affects your Productivity Score."
      >
        <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" onClick={() => setIsSkipConfirmOpen(false)}>
            Keep Working
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              skipTask();
              setIsSkipConfirmOpen(false);
            }}
          >
            Confirm Skip
          </Button>
        </div>
      </Modal>
    </div>
  );
}
