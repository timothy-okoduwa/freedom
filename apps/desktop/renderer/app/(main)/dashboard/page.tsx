'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import type { DayPlan } from '@freedom/firestore-schema';
import { useSessionStore } from '../../../stores/useSessionStore';
import { firestoreService, getLocalDateString } from '../../../lib/firebase';
import { Card } from '@freedom/ui';
import {
  Flame,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  CalendarPlus,
  Coffee,
  Laptop,
  CheckCircle2,
  Moon,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, activeItem, activePlan } = useSessionStore();
  const [todayPlan, setTodayPlan] = useState<DayPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      firestoreService.getTodayPlan(user.uid).then((plan) => {
        setTodayPlan(plan);
        setLoadingPlan(false);
      });
    } else {
      setLoadingPlan(false);
    }
  }, [user?.uid]);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const todayLocalDate = getLocalDateString();
  const isTodayActivePlan = activePlan?.date === todayLocalDate;
  const currentPlan = isTodayActivePlan ? activePlan : todayPlan;

  const isPlanCompleted =
    currentPlan &&
    currentPlan.items &&
    currentPlan.items.length > 0 &&
    currentPlan.items.every((i) => i.state === 'completed' || i.state === 'skipped');

  const isLayoverTask = activeItem && activePlan && activePlan.date !== todayLocalDate;

  // Real-time Productive Time computation for Today
  const todayProductiveMinutes = useMemo(() => {
    if (!currentPlan || !currentPlan.items) return 0;
    return currentPlan.items
      .filter((i) => i.type === 'task' && i.state === 'completed')
      .reduce((sum, i) => sum + (i.actualMinutes || i.plannedDurationMinutes || 0), 0);
  }, [currentPlan]);

  const totalMinutes = Math.max(user?.publicStats?.totalProductiveMinutes ?? 0, todayProductiveMinutes);
  const productiveHours = Math.floor(totalMinutes / 60);
  const productiveRemainingMinutes = totalMinutes % 60;

  // Streak computation (minimum 1 day if today's plan is completed)
  const baseStreak = user?.publicStats?.currentStreak ?? 0;
  const streak = isPlanCompleted ? Math.max(baseStreak, 1) : baseStreak;

  // Real planning accuracy computation
  const { accuracyDisplay, accuracySubtext } = useMemo(() => {
    if (!currentPlan || !currentPlan.items) {
      return { accuracyDisplay: '--', accuracySubtext: 'Complete tasks to measure' };
    }
    const completedTasks = currentPlan.items.filter(
      (i) => i.type === 'task' && i.state === 'completed'
    );
    if (completedTasks.length === 0) {
      return { accuracyDisplay: '--', accuracySubtext: '0 tasks completed today' };
    }
    let accuracySum = 0;
    completedTasks.forEach((task) => {
      const planned = task.plannedDurationMinutes;
      const actual = task.actualMinutes || planned;
      const variance = Math.abs(planned - actual) / Math.max(1, planned);
      accuracySum += Math.max(0, 1 - variance) * 100;
    });
    const avg = Math.round(accuracySum / completedTasks.length);
    return {
      accuracyDisplay: `${avg}%`,
      accuracySubtext: `${completedTasks.length} task${completedTasks.length === 1 ? '' : 's'} completed today`,
    };
  }, [currentPlan]);

  const goalMinutes = user?.dailyGoalMinutes || 240;
  const goalHours = Math.floor(goalMinutes / 60);
  const goalMins = goalMinutes % 60;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">
            {todayStr}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111] dark:text-white mt-1">
            {greeting}, {user?.displayName || 'Timothy'}
          </h1>
        </div>

        {/* Adaptive Action CTA */}
        {activeItem ? (
          <Link
            href="/runtime"
            className="px-6 py-2.5 rounded-xl bg-[#2F6FED] text-white text-xs font-semibold shadow-md hover:bg-[#2558BE] transition-all flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>View Active Session ({activeItem.title})</span>
          </Link>
        ) : (
          <Link
            href="/builder"
            className="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-semibold shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Build Day Plan</span>
          </Link>
        )}
      </div>

      {/* Overview Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="surface" className="p-5 flex flex-col justify-between space-y-2 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6B6B] dark:text-[#A1A1AA]">
              Current Streak
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-[#111] dark:text-white">
            {streak} <span className="text-sm font-sans font-normal text-[#6B6B6B] dark:text-[#A1A1AA]">days</span>
          </div>
          <div className="text-[11px] text-[#1FAE6B] dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>Threshold: ≥75% daily completion</span>
          </div>
        </Card>

        <Card variant="surface" className="p-5 flex flex-col justify-between space-y-2 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6B6B] dark:text-[#A1A1AA]">
              Planning Accuracy
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2F6FED] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-[#111] dark:text-white">
            {accuracyDisplay}
          </div>
          <div className="text-[11px] text-[#1FAE6B] dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>{accuracySubtext}</span>
          </div>
        </Card>

        <Card variant="surface" className="p-5 flex flex-col justify-between space-y-2 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6B6B] dark:text-[#A1A1AA]">
              Productive Time
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-[#111] dark:text-white">
            {productiveHours}h {productiveRemainingMinutes}m
          </div>
          <div className="text-[11px] text-[#1FAE6B] dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>Daily Goal: {goalHours}h {goalMins > 0 ? `${goalMins}m` : '00m'}</span>
          </div>
        </Card>
      </div>

      {/* Layover Task Banner */}
      {isLayoverTask && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Layover Session Active (Carried Over)</div>
              <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">
                &ldquo;{activeItem?.title}&rdquo; started yesterday and is continuing into today.
              </div>
            </div>
          </div>
          <Link
            href="/runtime"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-700 transition-colors shrink-0"
          >
            View Session
          </Link>
        </div>
      )}

      {/* Day Plan Completed Celebration Banner */}
      {isPlanCompleted && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-[#1FAE6B] dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-emerald-950 dark:text-emerald-100">Day Plan Completed! 🎉</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                All {currentPlan.items.length} tasks scheduled for today have been completed.
              </div>
            </div>
          </div>
          <Link
            href="/summary"
            className="px-4 py-2 rounded-xl bg-[#1FAE6B] text-white font-semibold text-xs hover:bg-emerald-600 transition-colors shrink-0 shadow-xs"
          >
            View Daily Summary
          </Link>
        </div>
      )}

      {/* Today's Execution Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#111] dark:text-white">
            Today&apos;s Execution Queue
          </h2>
          <Link
            href="/builder"
            className="text-xs text-[#2F6FED] font-medium hover:underline flex items-center gap-1"
          >
            <span>Edit Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingPlan ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] text-center text-xs text-[#888] dark:text-[#A1A1AA]">
            Loading today&apos;s queue...
          </div>
        ) : currentPlan && currentPlan.items.length > 0 ? (
          <div className="space-y-2.5">
            {currentPlan.items.map((item, idx) => {
              const isCurrent = activeItem?.itemId === item.id;
              const isBreak = item.type === 'break';
              const isDone = item.state === 'completed';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#EAF1FE] dark:bg-[#2F6FED]/20 border-[#2F6FED]/40 shadow-xs'
                      : isDone
                      ? 'bg-neutral-50 dark:bg-neutral-800/40 border-[#E5E5E5] dark:border-[#27272A]'
                      : 'bg-white dark:bg-[#18181B] border-[#E5E5E5] dark:border-[#27272A]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <span className="font-mono text-xs text-[#888] dark:text-[#71717A] w-5">{idx + 1}.</span>
                    {isBreak ? (
                      <span className="w-7 h-7 rounded-lg bg-[#E8F8F0] dark:bg-emerald-950/40 text-[#1FAE6B] dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Coffee className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-lg bg-[#EAF1FE] dark:bg-blue-950/40 text-[#2F6FED] flex items-center justify-center shrink-0">
                        <Laptop className="w-4 h-4" />
                      </span>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-[#111] dark:text-white truncate">{item.title}</div>
                      {isCurrent ? (
                        <div className="text-[10px] text-[#2F6FED] font-mono font-semibold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED] animate-ping" />
                          <span>Active Session Running</span>
                        </div>
                      ) : isDone ? (
                        <div className="text-[10px] text-[#1FAE6B] font-mono font-semibold flex items-center gap-1 mt-0.5">
                          <span>Completed</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-[#777] dark:text-[#A1A1AA]">
                      {item.plannedDurationMinutes}m
                    </span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-[#1FAE6B]" />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card variant="default" className="p-8 text-center space-y-3 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
            <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#111] dark:text-white">No Plan Created Yet for Today</div>
              <p className="text-xs text-[#888] dark:text-[#A1A1AA] mt-0.5">
                Build your Day Plan to start tracking execution with mathematical precision.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/builder"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] text-white text-xs font-semibold hover:bg-[#2558BE] transition-colors"
              >
                <span>Build Today&apos;s Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
