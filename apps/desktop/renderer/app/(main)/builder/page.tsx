'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DayPlan, DayPlanItem } from '@freedom/firestore-schema';
import { useSessionStore } from '../../../stores/useSessionStore';
import { firestoreService, getLocalDateString } from '../../../lib/firebase';
import { Card, Button, Modal } from '@freedom/ui';
import {
  GripVertical,
  Coffee,
  Laptop,
  Plus,
  Trash2,
  Rocket,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function BuilderPage() {
  const router = useRouter();
  const { user, activePlan, activeItem, startDay, updatePlanItems } = useSessionStore();

  const [items, setItems] = useState<DayPlanItem[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddBreakOpen, setIsAddBreakOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(25);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInitialLoadedRef = React.useRef(false);
  const isSessionRunning = Boolean(activePlan && activePlan.state === 'running');

  // Load initial plan ONCE on mount to prevent live session ticks from overwriting/duplicating local items
  useEffect(() => {
    if (isInitialLoadedRef.current) return;

    if (activePlan && activePlan.items && activePlan.items.length > 0) {
      setItems(activePlan.items);
      isInitialLoadedRef.current = true;
    } else if (user?.uid) {
      firestoreService.getTodayPlan(user.uid).then((existingPlan) => {
        if (existingPlan && existingPlan.items && existingPlan.items.length > 0) {
          setItems(existingPlan.items);
        }
        isInitialLoadedRef.current = true;
      });
    }
  }, [user?.uid, activePlan]);

  const totalMinutes = items.reduce((acc, item) => acc + item.plannedDurationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const isOver24h = totalMinutes > 24 * 60;

  const isRanBefore = (item: DayPlanItem) => item.state === 'completed' || item.state === 'skipped';
  const isRunningNow = (item: DayPlanItem) => Boolean(activeItem && activeItem.itemId === item.id);

  const isAllCompleted = items.length > 0 && items.every((i) => i.state === 'completed' || i.state === 'skipped');

  // Helper to sync items in real-time with background runtime engine
  const syncItems = async (updatedItems: DayPlanItem[]) => {
    setItems(updatedItems);
    await updatePlanItems(updatedItems);
    if (activePlan) {
      await firestoreService.saveDayPlan({ ...activePlan, items: updatedItems });
    }
  };

  // Drag and Drop reordering logic:
  // Strictly prevent moving items that have already ran before (completed/skipped) down to re-run,
  // and prevent moving currently running items. Only pending/future items can be reordered.
  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const movedItem = items[fromIndex];
    const targetItem = items[toIndex];

    // Prohibit moving an item that has already ran before
    if (isRanBefore(movedItem)) return;

    // Prohibit moving currently running item
    if (isRunningNow(movedItem)) return;

    // Prohibit moving an item before or into completed/running slots
    if (isRanBefore(targetItem) || isRunningNow(targetItem)) return;

    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const normalized = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    syncItems(normalized);
  };

  const removeItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    // Cannot delete if currently running or has already ran before
    if (isRunningNow(target) || isRanBefore(target)) return;
    const filtered = items.filter((i) => i.id !== id).map((item, idx) => ({ ...item, order: idx + 1 }));
    syncItems(filtered);
  };

  const handleAddItem = async (type: 'task' | 'break') => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newItem: DayPlanItem = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type,
        title: trimmedTitle,
        order: items.length + 1,
        plannedDurationMinutes: Math.max(1, newDuration),
        actualMinutes: 0,
        extensionMinutes: 0,
        state: 'pending',
      };
      const updated = [...items, newItem];
      await syncItems(updated);
      setNewTitle('');
      setNewDuration(type === 'break' ? 10 : 25);
      setIsAddTaskOpen(false);
      setIsAddBreakOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDay = async () => {
    if (items.length === 0 || isOver24h || isSessionRunning || isAllCompleted) return;
    const uid = user?.uid || 'user-active';
    const existingToday = user?.uid ? await firestoreService.getTodayPlan(user.uid) : null;
    const planId = activePlan?.id || existingToday?.id || `plan-${Date.now()}`;

    const plan: DayPlan = {
      id: planId,
      userId: uid,
      date: getLocalDateString(),
      state: 'running',
      items,
      createdAt: activePlan?.createdAt || existingToday?.createdAt || new Date().toISOString(),
      startedAt: new Date().toISOString(),
    };

    await firestoreService.saveDayPlan(plan);
    await startDay(plan);
    router.push('/runtime');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Day Plan Builder</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {isSessionRunning
              ? 'Your workday is active. Reorder upcoming tasks or add new ones — past and running tasks are locked.'
              : 'Hold and drag any task to reorder steps. Freedom will execute each item in sequence.'}
          </p>
        </div>

        {/* Total Time & Cap Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-500 block">
              Planned Total
            </span>
            <span
              className={`text-base font-mono font-bold ${
                isOver24h ? 'text-[#E5484D]' : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {totalHours}h ({totalMinutes}m) / 24h
            </span>
          </div>

          {isSessionRunning ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push('/runtime')}
              className="flex items-center gap-2 bg-[#1FAE6B] hover:bg-[#188C56] text-white shadow-md"
            >
              <span>Session Running</span>
              <Rocket className="w-4 h-4" />
            </Button>
          ) : isAllCompleted ? (
            <Button
              variant="secondary"
              size="md"
              disabled
              className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-zinc-300 dark:border-zinc-700 shadow-2xs opacity-75"
            >
              <span>Day Completed ✓</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              disabled={items.length === 0 || isOver24h}
              onClick={handleStartDay}
              className="flex items-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white shadow-md"
            >
              <span>Start Day</span>
              <Rocket className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {isOver24h && (
        <div className="p-3 rounded-xl bg-[#FDECEE] dark:bg-red-950/40 border border-[#E5484D]/30 text-xs text-[#E5484D] dark:text-red-300 font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Plan exceeds 24-hour daily cap. Please adjust item durations before starting.</span>
        </div>
      )}

      {/* Action Buttons: Add Task / Add Break */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setNewDuration(25);
            setIsAddTaskOpen(true);
          }}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setNewDuration(10);
            setIsAddBreakOpen(true);
          }}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Break</span>
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="py-14 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <Laptop className="w-9 h-9 text-zinc-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No tasks in your day plan yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            Add tasks or break intervals to build your structured workday routine.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setNewDuration(25);
                setIsAddTaskOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add First Task
            </Button>
          </div>
        </div>
      )}

      {/* Ordered Queue Cards with Drag & Drop */}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const isBreak = item.type === 'break';
          const runningNow = isRunningNow(item);
          const ranBefore = isRanBefore(item);
          const canDrag = !runningNow && !ranBefore;
          const isBeingDragged = draggedIndex === index;
          const isDragTarget = dragOverIndex === index;

          return (
            <div
              key={item.id}
              draggable={canDrag}
              onDragStart={(e) => {
                if (!canDrag) {
                  e.preventDefault();
                  return;
                }
                setDraggedIndex(index);
                e.dataTransfer.setData('text/plain', index.toString());
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                if (!canDrag) return; // Do not allow dropping on completed or running tasks
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverIndex !== index) {
                  setDragOverIndex(index);
                }
              }}
              onDragLeave={() => {
                if (dragOverIndex === index) {
                  setDragOverIndex(null);
                }
              }}
              onDrop={(e) => {
                if (!canDrag) return;
                e.preventDefault();
                const fromIdx = Number(e.dataTransfer.getData('text/plain'));
                if (!isNaN(fromIdx)) {
                  handleReorder(fromIdx, index);
                }
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`transition-all ${
                isBeingDragged ? 'opacity-40 scale-[0.98]' : 'opacity-100'
              } ${isDragTarget ? 'border-2 border-dashed border-[#2F6FED] rounded-2xl' : ''}`}
            >
              <Card
                variant="default"
                className={`p-3.5 flex items-center justify-between shadow-2xs hover:shadow-sm transition-all ${
                  ranBefore
                    ? 'bg-zinc-100/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 opacity-70'
                    : runningNow
                    ? 'border-l-4 border-l-[#2F6FED] bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                    : isBreak
                    ? 'bg-[#FAFDF9] dark:bg-emerald-950/20 border-[#1FAE6B]/30 dark:border-emerald-800/40'
                    : 'bg-white dark:bg-[#18181B]'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  {/* Drag Grip Handle or Completed Indicator */}
                  <div
                    className={`p-1 ${
                      ranBefore
                        ? 'cursor-not-allowed text-emerald-500'
                        : runningNow
                        ? 'cursor-not-allowed opacity-30 text-zinc-400'
                        : 'cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-700 dark:hover:text-zinc-200'
                    }`}
                    title={
                      ranBefore
                        ? 'Completed tasks cannot be moved or re-run'
                        : runningNow
                        ? 'Running tasks cannot be reordered'
                        : 'Drag to reorder'
                    }
                  >
                    {ranBefore ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <GripVertical className="w-4 h-4" />
                    )}
                  </div>

                  <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 w-5">{index + 1}.</span>

                  {isBreak ? (
                    <span className="w-7 h-7 rounded-lg bg-[#E8F8F0] dark:bg-emerald-950/60 text-[#1FAE6B] dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Coffee className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-lg bg-[#EAF1FE] dark:bg-blue-950/60 text-[#2F6FED] dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Laptop className="w-4 h-4" />
                    </span>
                  )}

                  <div className="truncate flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold truncate ${
                        ranBefore ? 'line-through text-zinc-500 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'
                      }`}>
                        {item.title}
                      </span>
                      {ranBefore ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      ) : runningNow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-400/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED] animate-pulse" />
                          Running Now
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{item.plannedDurationMinutes} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ranBefore ? (
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1">
                      Done
                    </span>
                  ) : runningNow ? (
                    <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-medium px-2 py-1">
                      Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      title="Delete item"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E5484D] hover:bg-[#FDECEE] dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        title="Add Task to Queue"
        description="Specify task title and duration."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Task Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem('task');
                }
              }}
              placeholder="e.g. Finish Core Database Schema"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              Duration Preset
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[15, 25, 45, 60, 90, 120].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setNewDuration(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    newDuration === d
                      ? 'bg-[#2F6FED] text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>

            {/* Custom Duration Input */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Custom Duration:</span>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#2F6FED]"
                />
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">minutes</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleAddItem('task')}>
              Add Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Break Modal */}
      <Modal
        isOpen={isAddBreakOpen}
        onClose={() => setIsAddBreakOpen(false)}
        title="Add Recovery Break"
        description="Breaks transition automatically when your task completes."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Break Activity</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem('break');
                }
              }}
              placeholder="e.g. Quick Stretch & Water"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              Duration Preset
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[5, 10, 15, 20, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setNewDuration(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    newDuration === d
                      ? 'bg-[#1FAE6B] text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>

            {/* Custom Break Duration Input */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Custom Duration:</span>
              <input
                type="number"
                min="1"
                max="120"
                value={newDuration}
                onChange={(e) => setNewDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#1FAE6B]"
              />
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">minutes</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddBreakOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleAddItem('break')}>
              Add Break
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
