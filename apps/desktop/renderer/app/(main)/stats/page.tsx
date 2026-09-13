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

  // Real Current Week Breakdown (Monday - Sunday)
  const weeklyDayBreakdown = useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return days.map((dayLabel, index) => {
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

      const hours = Math.floor(dayMinutes / 60);
      const mins = dayMinutes % 60;
      const pct = Math.min(100, Math.round((dayMinutes / 240) * 100)); // normalized to 4h goal

      return {
        day: dayLabel,
        minutes: dayMinutes,
        display: `${hours}h ${mins}m`,
        pct,
      };
    });
  }, [allPlans]);

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

        <Card variant="default" className="p-6 space-y-3 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
          <h3 className="text-sm font-bold text-[#111] dark:text-white">This Week&apos;s Output</h3>
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
