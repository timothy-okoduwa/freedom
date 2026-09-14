'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSessionStore } from '../../../stores/useSessionStore';
import { firestoreService } from '../../../lib/firebase';
import type { DayPlan } from '@freedom/firestore-schema';
import { Card, StatTile } from '@freedom/ui';

export default function StatsPage() {
  const { user, activePlan } = useSessionStore();
  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      firestoreService.getUserPlans(user.uid, 90).then((data) => {
        setPlans(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  // Combine fetched plans with today's live activePlan
  const allPlans = useMemo(() => {
    const list = [...plans];
    if (activePlan && !list.some((p) => p.id === activePlan.id || p.date === activePlan.date)) {
      list.push(activePlan);
    }
    return list;
  }, [plans, activePlan]);

  // Real aggregate computations
  const totalProductiveMinutes = user?.publicStats?.totalProductiveMinutes ?? 0;
  const totalProductiveHours = (totalProductiveMinutes / 60).toFixed(1);
  const totalSessionsCount = allPlans.length;

  const { completedTasksCount, totalTasksCount, skippedOverrunCount, accuracyAvg } = useMemo(() => {
    let completed = 0;
    let total = 0;
    let overrunOrSkipped = 0;
    let accuracySum = 0;
    let accuracySamples = 0;

    allPlans.forEach((plan) => {
      plan.items.forEach((item) => {
        if (item.type === 'task') {
          total++;
          if (item.state === 'completed') {
            completed++;
            const planned = item.plannedDurationMinutes;
            const actual = item.actualMinutes || planned;
            const variance = Math.abs(planned - actual) / planned;
            const acc = Math.max(0, 1 - variance) * 100;
            accuracySum += acc;
            accuracySamples++;
          } else if (item.state === 'skipped' || item.state === 'failed') {
            overrunOrSkipped++;
          }
        }
      });
    });

    const avg = accuracySamples > 0 ? (accuracySum / accuracySamples).toFixed(1) : null;

    return {
      completedTasksCount: completed,
      totalTasksCount: total,
      skippedOverrunCount: overrunOrSkipped,
      accuracyAvg: avg,
    };
  }, [allPlans]);

  const completionPercentage =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const currentStreak = user?.publicStats?.currentStreak ?? 0;
  const longestStreak = user?.publicStats?.longestStreak ?? currentStreak;

  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Earliest week threshold (account creation week or earliest plan date)
  const earliestMonday = useMemo(() => {
    let earliestTime = user?.createdAt ? new Date(user.createdAt).getTime() : Date.now();
    allPlans.forEach((p) => {
      if (p.date) {
        const t = new Date(p.date).getTime();
        if (!isNaN(t) && t < earliestTime) {
          earliestTime = t;
        }
      }
    });

    const d = new Date(earliestTime);
    const dayOfWeek = d.getDay(); // 0 is Sun, 1 is Mon
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, [user?.createdAt, allPlans]);

  // Check if current target week's monday is <= earliestMonday
  const isEarliestWeek = useMemo(() => {
    const target = new Date();
    target.setDate(target.getDate() + (weekOffset - 1) * 7);
    const dayOfWeek = target.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const prevWeekMonday = new Date(target);
    prevWeekMonday.setDate(target.getDate() + mondayOffset);
    prevWeekMonday.setHours(0, 0, 0, 0);

    return prevWeekMonday.getTime() < earliestMonday.getTime();
  }, [weekOffset, earliestMonday]);

  // Real Weekly Output Breakdown (Supported for current and past weeks)
  const { weeklyDayBreakdown, weekRangeLabel, totalWeeklyMinutes } = useMemo(() => {
    const target = new Date();
    target.setDate(target.getDate() + weekOffset * 7);
    const dayOfWeek = target.getDay(); // 0 is Sun, 1 is Mon
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(target);
    monday.setDate(target.getDate() + mondayOffset);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatShort = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const rangeLabel =
      weekOffset === 0
        ? `This Week (${formatShort(monday)} - ${formatShort(sunday)})`
        : weekOffset === -1
        ? `Last Week (${formatShort(monday)} - ${formatShort(sunday)})`
        : `${formatShort(monday)} - ${formatShort(sunday)}, ${monday.getFullYear()}`;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let totalWeeklyMins = 0;

    const breakdown = days.map((dayLabel, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const dateStr = d.toISOString().split('T')[0];

      const matchedPlan = allPlans.find((p) => p.date === dateStr);
      let dayMinutes = 0;
      if (matchedPlan) {
        matchedPlan.items.forEach((item) => {
          if (item.type === 'task' && item.state === 'completed') {
            dayMinutes += item.actualMinutes || item.plannedDurationMinutes;
          }
        });
      }
      totalWeeklyMins += dayMinutes;

      const hours = Math.floor(dayMinutes / 60);
      const mins = dayMinutes % 60;
      const pct = Math.min(100, Math.round((dayMinutes / 240) * 100)); // normalized to 4h daily goal

      return {
        day: dayLabel,
        dateStr,
        minutes: dayMinutes,
        display: `${hours}h ${mins}m`,
        pct,
      };
    });

    return {
      weeklyDayBreakdown: breakdown,
      weekRangeLabel: rangeLabel,
      totalWeeklyMinutes: totalWeeklyMins,
    };
  }, [allPlans, weekOffset]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">Analytics</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111] dark:text-white mt-1">
          Historical Statistics
        </h1>
        <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-1">
          True execution metrics and planning discipline verified directly from your account.
        </p>
      </div>

      {/* High Level Real Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="Total Productive Hours"
          value={`${totalProductiveHours}h`}
          subValue={totalSessionsCount === 1 ? 'Across 1 day plan' : `Across ${totalSessionsCount} day plans`}
          icon="⚡"
        />
        <StatTile
          label="Planning Accuracy"
          value={accuracyAvg ? `${accuracyAvg}%` : '--'}
          subValue={accuracyAvg ? 'Based on completed tasks' : 'Complete tasks to measure'}
          icon="🎯"
        />
        <StatTile
          label="Longest Streak"
          value={`${longestStreak} ${longestStreak === 1 ? 'day' : 'days'}`}
          subValue={`Current: ${currentStreak}d`}
          icon="🔥"
        />
      </div>

      {/* Task Completion Ratios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="default" className="p-6 space-y-3 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
          <h3 className="text-sm font-bold text-[#111] dark:text-white">Execution Reliability</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#555] dark:text-[#A1A1AA]">
              <span>Completed Tasks</span>
              <span className="font-mono font-bold text-[#111] dark:text-white">
                {completedTasksCount} ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full bg-[#E5E5E5] dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1FAE6B] h-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-[#555] dark:text-[#A1A1AA] pt-2">
              <span>Overrun or Skipped</span>
              <span className="font-mono font-bold text-[#111] dark:text-white">
                {skippedOverrunCount}
              </span>
            </div>
            <div className="w-full bg-[#E5E5E5] dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E8A33D] h-full transition-all duration-300"
                style={{
                  width: `${totalTasksCount > 0 ? Math.round((skippedOverrunCount / totalTasksCount) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-6 space-y-5 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
          {/* Card Title & Total Hours */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#27272A] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#111] dark:text-white">Weekly Output</h3>
              <p className="text-xs text-[#2F6FED] font-mono font-semibold mt-0.5">{weekRangeLabel}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#1FAE6B] dark:text-emerald-400">
                {(totalWeeklyMinutes / 60).toFixed(1)}h total
              </span>
            </div>
          </div>

          {/* Week Navigation Bar */}
          <div className="flex items-center justify-between bg-neutral-50 dark:bg-[#202024] p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
            <button
              onClick={() => setWeekOffset((prev) => prev - 1)}
              disabled={isEarliestWeek}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
              title={isEarliestWeek ? 'Reached account creation week' : 'Previous Week'}
            >
              ← Prev Week
            </button>

            {weekOffset !== 0 ? (
              <button
                onClick={() => setWeekOffset(0)}
                className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#2F6FED] text-white hover:bg-[#2558BE] transition-all shadow-2xs"
                title="Jump to current week"
              >
                Current Week
              </button>
            ) : (
              <span className="text-[11px] font-mono text-zinc-400 font-medium">Viewing Current Week</span>
            )}

            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              disabled={weekOffset >= 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
              title="Next Week"
            >
              Next Week →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {weeklyDayBreakdown.map((item) => (
              <div key={item.day} className="flex items-center justify-between">
                <span className="font-mono text-[#777] dark:text-[#A1A1AA] w-10">{item.day}</span>
                <div className="flex-1 mx-3 bg-[#E5E5E5] dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2F6FED] h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="font-mono font-semibold text-[#111] dark:text-white min-w-14 text-right">
                  {item.display}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
