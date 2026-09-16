'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSessionStore } from '../../../stores/useSessionStore';
import { useTourStore } from '../../../stores/useTourStore';
import { formatRemainingTime, formatTaskDuration } from '../../../lib/timerEngine';
import { ProgressRing, Button, Card, Modal } from '@freedom/ui';
import { Pencil, Check, X, Clock, Plus } from 'lucide-react';

export default function RuntimePage() {
  const {
    activeItem,
    activePlan,
    remainingMs,
    updateTaskTitle,
    updateTaskDuration,
    extendTask,
    finishTask,
    skipTask,
    pause,
    resume,
  } = useSessionStore();

  const { isOpen: isTourActive } = useTourStore();
  const [isSkipConfirmOpen, setIsSkipConfirmOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isCustomExtendOpen, setIsCustomExtendOpen] = useState(false);
  const [extendMode, setExtendMode] = useState<'add' | 'reduce'>('add');
  const [extendHours, setExtendHours] = useState(0);
  const [extendMinutes, setExtendMinutes] = useState(15);
  const [isEditingNextDuration, setIsEditingNextDuration] = useState(false);
  const [nextHours, setNextHours] = useState(0);
  const [nextMinutes, setNextMinutes] = useState(0);

  // If no active session AND tour is active, supply mock active item & plan for the walkthrough demo
  const mockActiveItem = {
    dayPlanId: 'mock-plan-1',
    itemId: 'mock-item-1',
    itemType: 'task' as const,
    title: '🚀 Core Feature Engineering (Walkthrough Preview)',
    plannedDurationMinutes: 45,
    startedAt: new Date().toISOString(),
    extensionMinutes: 0,
    pausedAt: null,
    accumulatedPauseMs: 0,
  };

  const mockActivePlan = {
    id: 'mock-plan-1',
    userId: 'mock-user',
    date: '2026-09-14',
    state: 'running' as const,
    items: [
      { id: 'mock-item-1', type: 'task' as const, title: '🚀 Core Feature Engineering', plannedDurationMinutes: 45, actualMinutes: 0, extensionMinutes: 0, order: 1, state: 'pending' as const },
      { id: 'mock-item-2', type: 'break' as const, title: '☕ Recovery & Hydration', plannedDurationMinutes: 10, actualMinutes: 0, extensionMinutes: 0, order: 2, state: 'pending' as const },
      { id: 'mock-item-3', type: 'task' as const, title: '💻 UI Component Polish', plannedDurationMinutes: 30, actualMinutes: 0, extensionMinutes: 0, order: 3, state: 'pending' as const },
    ],
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
  };

  const hasRealActive = Boolean(activeItem && activePlan);
  const currentItem = hasRealActive ? activeItem : (isTourActive ? mockActiveItem : null);
  const currentPlan = hasRealActive ? activePlan : (isTourActive ? mockActivePlan : null);
  const currentRemainingMs = hasRealActive ? remainingMs : (isTourActive ? 24 * 60 * 1000 + 18000 : 0);

  if (!currentItem || !currentPlan) {
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

  const { formatted, isOvertime } = formatRemainingTime(currentRemainingMs);

  const totalPlannedMinutes = currentItem.plannedDurationMinutes + currentItem.extensionMinutes;
  const totalPlannedMs = totalPlannedMinutes * 60000;
  const elapsedMs = totalPlannedMs - currentRemainingMs;
  const progress = Math.min(100, Math.max(0, (elapsedMs / totalPlannedMs) * 100));

  const isBreak = currentItem.itemType === 'break';
  const isPaused = !!currentItem.pausedAt;

  // Next item preview
  const currentIndex = currentPlan.items.findIndex((i) => i.id === currentItem.itemId);
  const nextItem = currentPlan.items[currentIndex + 1];

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
            Item {currentIndex + 1} of {currentPlan.items.length}
          </span>
        </div>
      </div>

      {/* Main Execution Card */}
      <Card
        variant="default"
        data-tour="runtime-timer-card"
        className={`p-8 sm:p-12 text-center transition-all ${
          isOvertime
            ? 'border-[#E8A33D]/40 bg-[#FFFDF9] dark:bg-amber-950/20'
            : 'bg-white dark:bg-[#18181B] border-neutral-200 dark:border-[#27272A]'
        }`}
      >
        <span className="text-xs uppercase font-mono tracking-widest text-[#2F6FED]">
          {isBreak ? '☕ Recovery Break' : '💻 Active Task'}
        </span>

        {/* Editable Active Task Title */}
        <div className="mt-1 mb-8 max-w-lg mx-auto">
          {isEditingTitle ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (titleInput.trim() && currentItem) {
                      updateTaskTitle(currentItem.itemId, titleInput.trim());
                      setIsEditingTitle(false);
                    }
                  } else if (e.key === 'Escape') {
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full text-xl sm:text-2xl font-bold px-3 py-1.5 rounded-xl border border-[#2F6FED] bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-center focus:outline-none shadow-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (titleInput.trim() && currentItem) {
                    updateTaskTitle(currentItem.itemId, titleInput.trim());
                  }
                  setIsEditingTitle(false);
                }}
                className="p-2 rounded-xl bg-[#2F6FED] hover:bg-[#2558BE] text-white cursor-pointer shrink-0"
                title="Save Title"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                className="p-2 rounded-xl bg-neutral-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-neutral-300 dark:hover:bg-zinc-700 cursor-pointer shrink-0"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="group flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {currentItem.title}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setTitleInput(currentItem.title);
                  setIsEditingTitle(true);
                }}
                className="p-1.5 rounded-lg text-zinc-400 opacity-60 group-hover:opacity-100 hover:text-[#2F6FED] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer"
                title="Edit task name"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

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

        {/* Primary Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6" data-tour="runtime-action-controls">
          <Button
            variant={isPaused ? 'primary' : 'secondary'}
            size="md"
            onClick={() => (isPaused ? resume() : pause())}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </Button>
          
          {/* Extension Controls */}
          <div data-tour="runtime-extend-btn" className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => extendTask(10)} title="Add 10 minutes">
              +10m
            </Button>
            <Button variant="secondary" size="md" onClick={() => extendTask(-10)} title="Reduce 10 minutes">
              -10m
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setExtendMode('add');
                setExtendHours(0);
                setExtendMinutes(15);
                setIsCustomExtendOpen(true);
              }}
              className="flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-[#2F6FED]" />
              <span>± Custom Time</span>
            </Button>
          </div>

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
        <Card variant="surface" data-tour="runtime-queue-card" className="p-4 flex items-center justify-between bg-white dark:bg-[#18181B] border-neutral-200 dark:border-[#27272A]">
          <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
            <span className="text-sm">{nextItem.type === 'break' ? '☕' : '💻'}</span>
            <div className="truncate">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Up Next in Queue
              </span>
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate block">{nextItem.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isEditingNextDuration ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={nextHours}
                  onChange={(e) => setNextHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-10 px-1 py-0.5 text-xs font-mono font-bold rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-[10px] font-mono text-zinc-400">h</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={nextMinutes}
                  onChange={(e) => setNextMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-10 px-1 py-0.5 text-xs font-mono font-bold rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-[10px] font-mono text-zinc-400">m</span>
                <button
                  type="button"
                  onClick={() => {
                    const total = (nextHours * 60) + nextMinutes;
                    if (total > 0) {
                      updateTaskDuration(nextItem.id, total);
                    }
                    setIsEditingNextDuration(false);
                  }}
                  className="p-1 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2558BE] cursor-pointer"
                  title="Save Duration"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingNextDuration(false)}
                  className="p-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#2F6FED] font-medium">
                  {formatTaskDuration(nextItem.plannedDurationMinutes, nextItem.extensionMinutes)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNextHours(Math.floor(nextItem.plannedDurationMinutes / 60));
                    setNextMinutes(nextItem.plannedDurationMinutes % 60);
                    setIsEditingNextDuration(true);
                  }}
                  className="p-1 rounded-lg text-zinc-400 hover:text-[#2F6FED] transition-colors cursor-pointer"
                  title="Edit next task duration"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card variant="surface" data-tour="runtime-queue-card" className="p-4 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-[#18181B] border-neutral-200 dark:border-[#27272A]">
          🏁 This is the final item in today's Day Plan!
        </Card>
      )}

      {/* Custom Extension Modal */}
      <Modal
        isOpen={isCustomExtendOpen}
        onClose={() => setIsCustomExtendOpen(false)}
        title="Adjust Active Task Time"
        description="Increase or reduce the duration of the current active session."
      >
        <div className="space-y-4 pt-2">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setExtendMode('add')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                extendMode === 'add'
                  ? 'bg-white dark:bg-zinc-700 text-[#2F6FED] shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              + Add Time
            </button>
            <button
              type="button"
              onClick={() => setExtendMode('reduce')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                extendMode === 'reduce'
                  ? 'bg-white dark:bg-zinc-700 text-[#E5484D] shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              - Reduce Time
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Hours</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={extendHours}
                  onChange={(e) => setExtendHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold focus:outline-none focus:border-[#2F6FED]"
                />
                <span className="text-xs font-mono text-zinc-500">hrs</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Minutes</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={extendMinutes}
                  onChange={(e) => setExtendMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold focus:outline-none focus:border-[#2F6FED]"
                />
                <span className="text-xs font-mono text-zinc-500">mins</span>
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
            extendMode === 'add'
              ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-[#2F6FED]'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-[#E5484D]'
          }`}>
            <span>Total Time Adjustment:</span>
            <span className="font-bold">
              {extendMode === 'add' ? '+' : '-'}{extendHours > 0 ? `${extendHours}h ${extendMinutes}m` : `${extendMinutes}m`} ({extendMode === 'add' ? '+' : '-'}{(extendHours * 60) + extendMinutes} minutes)
            </span>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setIsCustomExtendOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={extendMode === 'add' ? 'primary' : 'destructive'}
              size="sm"
              onClick={() => {
                const totalMins = (extendHours * 60) + extendMinutes;
                if (totalMins > 0) {
                  extendTask(extendMode === 'add' ? totalMins : -totalMins);
                }
                setIsCustomExtendOpen(false);
              }}
            >
              {extendMode === 'add' ? 'Add Time' : 'Reduce Time'}
            </Button>
          </div>
        </div>
      </Modal>

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
