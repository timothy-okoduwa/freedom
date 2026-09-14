'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSessionStore } from '../../../stores/useSessionStore';
import { firestoreService } from '../../../lib/firebase';
import type { DayPlan } from '@freedom/firestore-schema';
import { Card, HeatmapGrid, type HeatmapDay } from '@freedom/ui';

export default function HeatmapPage() {
  const { user, activePlan } = useSessionStore();
  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      firestoreService.getUserPlans(user.uid, 180).then((data) => {
        setPlans(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  // Combine fetched historical plans with today's live activePlan
  const allPlans = useMemo(() => {
    const map = new Map<string, DayPlan>();
    plans.forEach((p) => map.set(p.date, p));
    if (activePlan?.date) {
      map.set(activePlan.date, activePlan);
    }
    return map;
  }, [plans, activePlan]);

  // Build the real past 126 days (18 weeks) calendar activity
  const heatmapDays = useMemo<HeatmapDay[]>(() => {
    const days: HeatmapDay[] = [];
    const today = new Date();

    for (let i = 126; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const plan = allPlans.get(dateStr);
      if (plan && plan.items.length > 0) {
        const tasks = plan.items.filter((item) => item.type === 'task');
        const completed = tasks.filter((item) => item.state === 'completed').length;
        const total = tasks.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        days.push({
          date: dateStr,
          completionPct: pct,
          tasksCompleted: completed,
          tasksTotal: total,
        });
      } else {
        // Real empty past day: 0% completion
        days.push({
          date: dateStr,
          completionPct: 0,
          tasksCompleted: 0,
          tasksTotal: 0,
        });
      }
    }
    return days;
  }, [allPlans]);

  // Real Metric Computations
  const activeFocusDays = useMemo(
    () => heatmapDays.filter((d) => d.completionPct > 0).length,
    [heatmapDays]
  );

  const perfectDays = useMemo(
    () => heatmapDays.filter((d) => d.completionPct === 100).length,
    [heatmapDays]
  );

  const averageCompletion = useMemo(() => {
    const active = heatmapDays.filter((d) => (d.tasksTotal ?? 0) > 0);
    if (active.length === 0) return 0;
    const sum = active.reduce((acc, d) => acc + d.completionPct, 0);
    return Math.round(sum / active.length);
  }, [heatmapDays]);

  const currentStreak = user?.publicStats?.currentStreak ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">Consistency</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111] dark:text-white mt-1">
          Execution Heatmap
        </h1>
        <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-1">
          Real mathematical tracking reflecting your true daily execution percentage.
        </p>
      </div>

      <Card variant="default" className="p-8 space-y-6 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#27272A] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#111] dark:text-white">Daily Completion Activity</h3>
            <p className="text-xs text-[#888] dark:text-[#A1A1AA]">Past 18 weeks (Live Account Telemetry)</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#1FAE6B] dark:text-emerald-400 font-semibold">
              {averageCompletion}% Average Completion
            </span>
          </div>
        </div>

        {/* Heatmap Grid Component */}
        <div className="overflow-visible py-2">
          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono">
              Loading execution history...
            </div>
          ) : (
            <HeatmapGrid days={heatmapDays} weeksCount={18} />
          )}
        </div>
      </Card>

      {/* Heatmap Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="surface" className="p-4 text-center bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-xl shadow-2xs">
          <div className="text-2xl font-bold font-mono text-[#111] dark:text-white">
            {activeFocusDays}
          </div>
          <div className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-0.5">Active Focus Days</div>
        </Card>
        <Card variant="surface" className="p-4 text-center bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-xl shadow-2xs">
          <div className="text-2xl font-bold font-mono text-[#2F6FED]">
            {perfectDays}
          </div>
          <div className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-0.5">Perfect 100% Days</div>
        </Card>
        <Card variant="surface" className="p-4 text-center bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-xl shadow-2xs">
          <div className="text-2xl font-bold font-mono text-[#1FAE6B] dark:text-emerald-400">
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </div>
          <div className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-0.5">Current Unbroken Streak</div>
        </Card>
      </div>
    </div>
  );
}
