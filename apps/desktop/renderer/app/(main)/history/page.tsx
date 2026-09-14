'use client';

import React, { useState, useEffect } from 'react';
import type { DayPlan } from '@freedom/firestore-schema';
import { useSessionStore } from '../../../stores/useSessionStore';
import { useTourStore } from '../../../stores/useTourStore';
import { firestoreService } from '../../../lib/firebase';
import { Card } from '@freedom/ui';
import {
  History,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Coffee,
  Laptop,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function HistoryPage() {
  const { user } = useSessionStore();
  const { isOpen: isTourActive } = useTourStore();

  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.uid) {
      firestoreService.getUserPlans(user.uid, 180).then((fetched) => {
        // Sort newest first
        const sorted = [...fetched].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPlans(sorted);
        // Expand top 3 days by default
        const initExpanded: Record<string, boolean> = {};
        sorted.slice(0, 3).forEach((p) => {
          initExpanded[p.date] = true;
        });
        setExpandedDates(initExpanded);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  const mockTourPlans: DayPlan[] = [
    {
      id: 'mock-hist-1',
      userId: 'mock-user',
      date: '2026-09-13',
      state: 'completed',
      items: [
        { id: 'h1', type: 'task', title: '🚀 Production Deployment & Verification', plannedDurationMinutes: 60, actualMinutes: 58, extensionMinutes: 0, order: 1, state: 'completed' },
        { id: 'h2', type: 'break', title: '☕ Recovery Break', plannedDurationMinutes: 10, actualMinutes: 10, extensionMinutes: 0, order: 2, state: 'completed' },
        { id: 'h3', type: 'task', title: '💻 Codebase Refactoring & Optimization', plannedDurationMinutes: 45, actualMinutes: 45, extensionMinutes: 0, order: 3, state: 'completed' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-hist-2',
      userId: 'mock-user',
      date: '2026-09-12',
      state: 'completed',
      items: [
        { id: 'h4', type: 'task', title: '⚡ Performance Tuning & Memory Audit', plannedDurationMinutes: 45, actualMinutes: 40, extensionMinutes: 0, order: 1, state: 'completed' },
        { id: 'h5', type: 'task', title: '🎯 Firestore Security Rule Lockdown', plannedDurationMinutes: 30, actualMinutes: 30, extensionMinutes: 0, order: 2, state: 'completed' },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  const displayPlans = plans.length > 0 ? plans : isTourActive ? mockTourPlans : [];

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const filteredPlans = displayPlans.filter((plan) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesDate = plan.date.toLowerCase().includes(q);
    const matchesItem = plan.items.some((i) => i.title.toLowerCase().includes(q));
    return matchesDate || matchesItem;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2F6FED]">
            <History className="w-3.5 h-3.5" />
            <span>Archive Logs</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Task History
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Review your past daily execution queues, task outcomes, and completion metrics. (Read-Only)
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-64" data-tour="history-search-card">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by task or date..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#2F6FED]"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 font-mono">
          Loading task history archives...
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <History className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {searchQuery ? 'No matching history found' : 'No past task history recorded yet'}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
            {searchQuery
              ? 'Try searching for a different task title or date.'
              : 'As you complete your daily execution queues, your historical day plans will be archived here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4" data-tour="history-list-card">
          {filteredPlans.map((plan, planIdx) => {
            const isExpanded = expandedDates[plan.date] ?? (isTourActive || planIdx === 0);
            const completedCount = plan.items.filter((i) => i.state === 'completed').length;
            const totalCount = plan.items.length;
            const isFullyDone = totalCount > 0 && completedCount === totalCount;
            const totalPlannedMins = plan.items.reduce((acc, i) => acc + i.plannedDurationMinutes, 0);

            const dateFormatted = new Date(plan.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <Card
                key={plan.id || plan.date}
                variant="default"
                data-tour={planIdx === 0 ? "history-detail-card" : undefined}
                className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] shadow-2xs"
              >
                {/* Day Header Row */}
                <div
                  onClick={() => toggleExpand(plan.date)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors select-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2F6FED] flex items-center justify-center font-semibold text-xs shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {dateFormatted}
                        </span>
                        {isFullyDone ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-500/20">
                            {completedCount}/{totalCount} Done
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                        {totalCount} item{totalCount === 1 ? '' : 's'} · {totalPlannedMins}m planned
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Archived</span>
                    </span>
                    <button
                      type="button"
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Item List */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2 bg-zinc-50/50 dark:bg-zinc-900/30">
                    {plan.items.map((item, idx) => {
                      const isBreak = item.type === 'break';
                      const isCompleted = item.state === 'completed';
                      const isSkipped = item.state === 'skipped';

                      return (
                        <div
                          key={item.id || idx}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            isCompleted
                              ? 'bg-white dark:bg-[#18181B] border-zinc-200 dark:border-zinc-800'
                              : isSkipped
                              ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'
                              : 'bg-white dark:bg-[#18181B] border-zinc-200 dark:border-zinc-800 opacity-70'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-4">
                            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 w-5">
                              {idx + 1}.
                            </span>
                            {isBreak ? (
                              <span className="w-6 h-6 rounded-md bg-[#E8F8F0] dark:bg-emerald-950/60 text-[#1FAE6B] flex items-center justify-center shrink-0">
                                <Coffee className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="w-6 h-6 rounded-md bg-[#EAF1FE] dark:bg-blue-950/60 text-[#2F6FED] flex items-center justify-center shrink-0">
                                <Laptop className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <div className="truncate">
                              <span
                                className={`text-xs font-semibold truncate ${
                                  isCompleted
                                    ? 'text-zinc-900 dark:text-zinc-100'
                                    : 'text-zinc-500 dark:text-zinc-400 line-through'
                                }`}
                              >
                                {item.title}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              {item.plannedDurationMinutes}m
                            </span>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Done
                              </span>
                            ) : isSkipped ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-500/20">
                                <XCircle className="w-3 h-3 text-red-500" />
                                Skipped
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                Unfinished
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
