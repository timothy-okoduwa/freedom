'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSessionStore } from '../../../stores/useSessionStore';
import { firestoreService } from '../../../lib/firebase';
import { calculateProductivityScore } from '../../../lib/timerEngine';
import type { DayPlan } from '@freedom/firestore-schema';
import { Card, StatTile } from '@freedom/ui';
import { CalendarPlus, ArrowRight, CheckCircle2, Flame, Clock } from 'lucide-react';

export default function SummaryPage() {
  const { user, activePlan } = useSessionStore();
  const [todayPlan, setTodayPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(!activePlan);

  useEffect(() => {
    if (!activePlan && user?.uid) {
      firestoreService.getTodayPlan(user.uid).then((p) => {
        setTodayPlan(p);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [activePlan, user?.uid]);

  const plan = activePlan || todayPlan;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-xs font-mono text-neutral-400">
        Loading summary...
      </div>
    );
  }

  // If no plan has been created yet, show clean empty state (NO MOCK DATA)
  if (!plan || !plan.items || plan.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">Review</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111] dark:text-white mt-1">
            Daily Execution Summary
          </h1>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-1">
            Mathematical productivity score, variance breakdown, and streak audit.
          </p>
        </div>

        <Card variant="default" className="p-12 text-center space-y-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center">
            <CalendarPlus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#111] dark:text-white">
              No Execution Plan Found for Today
            </h3>
            <p className="text-xs text-[#888] dark:text-[#A1A1AA] max-w-sm mx-auto">
              Build your day plan and start deep work timers. Once you begin executing tasks, your real-time score and analytics will appear here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#2558BE] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Build Day Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const currentStreak = user?.publicStats?.currentStreak ?? 0;
  const { score, completionPct, planningAccuracy, breakdown } = calculateProductivityScore(
    plan,
    currentStreak
  );

  const plannedProductiveMinutes = plan.items
    .filter((i) => i.type === 'task')
    .reduce((acc, i) => acc + i.plannedDurationMinutes, 0);

  const actualProductiveMinutes = plan.items
    .filter((i) => i.type === 'task')
    .reduce((acc, i) => acc + (i.actualMinutes || (i.state === 'completed' ? i.plannedDurationMinutes : 0)), 0);

  const streakQualified = plannedProductiveMinutes > 0 && actualProductiveMinutes >= plannedProductiveMinutes * 0.75;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">Review</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111] dark:text-white mt-1">
          Daily Execution Summary
        </h1>
        <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-1">
          Formula: (Completion Rate × 40) + (Planning Accuracy × 30) + (Focus Discipline × 20) + (Streak × 10)
        </p>
      </div>

      {/* Composite Score Card */}
      <Card variant="raised" data-tour="summary-score-card" className="p-8 text-center space-y-3 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl shadow-sm">
        <span className="text-xs font-mono uppercase tracking-wider text-[#6B6B6B] dark:text-[#A1A1AA]">
          Productivity Score
        </span>
        <div className="text-7xl font-extrabold tracking-tighter text-[#111] dark:text-white font-mono">
          {score}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs">
          {streakQualified ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/40 border border-[#1FAE6B]/30 text-[#1FAE6B] dark:text-emerald-400 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Streak Maintained ({currentStreak}d)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-600 text-xs">
              Requires ≥75% Completion for Streak
            </span>
          )}
        </div>
      </Card>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="Completion Rate"
          value={`${completionPct}%`}
          subValue={`${plan.items.filter((i) => i.state === 'completed').length}/${plan.items.length} items`}
          icon="✅"
        />
        <StatTile
          label="Planning Accuracy"
          value={`${planningAccuracy}%`}
          subValue={`${actualProductiveMinutes}m actual vs ${plannedProductiveMinutes}m planned`}
          icon="🎯"
        />
        <StatTile
          label="Productive Output"
          value={`${Math.floor(actualProductiveMinutes / 60)}h ${actualProductiveMinutes % 60}m`}
          subValue={`${plan.items.filter((i) => i.type === 'task').length} focus tasks`}
          icon="⚡"
        />
      </div>

      {/* Task-by-Task Breakdown */}
      <Card variant="default" className="p-6 space-y-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <h3 className="text-sm font-bold text-[#111] dark:text-white">Item Execution Log</h3>
        <div className="space-y-2 text-xs font-mono">
          {plan.items.map((item, idx) => {
            const isCompleted = item.state === 'completed';
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30"
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span className="text-neutral-400 w-4">{idx + 1}.</span>
                  <span className={`truncate font-sans font-medium ${isCompleted ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-neutral-500">
                    {item.actualMinutes ? `${item.actualMinutes}m` : `${item.plannedDurationMinutes}m`}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1FAE6B]" />
                  ) : (
                    <span className="text-[10px] text-amber-500 font-sans font-semibold">PENDING</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
