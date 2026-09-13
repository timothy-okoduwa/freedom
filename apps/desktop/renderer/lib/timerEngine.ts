import type { ActiveItemState, DayPlan, DayPlanItem, DailyStats } from '@freedom/firestore-schema';

/**
 * Pure, stateless remaining time calculator (§9.1 of specification).
 * Uses absolute timestamps; navigating between renderer pages will NEVER alter timer truth!
 */
export function getRemainingMs(state: ActiveItemState, currentTimeMs?: number): number {
  const now = state.pausedAt
    ? new Date(state.pausedAt).getTime()
    : (currentTimeMs ?? Date.now());
  const elapsedMs = now - new Date(state.startedAt).getTime() - state.accumulatedPauseMs;
  const totalPlannedMs = (state.plannedDurationMinutes + state.extensionMinutes) * 60000;
  return totalPlannedMs - elapsedMs;
}

export function formatRemainingTime(ms: number): { formatted: string; isOvertime: boolean } {
  const isOvertime = ms < 0;
  const absMs = Math.abs(ms);
  const totalSeconds = Math.floor(absMs / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const formatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return {
    formatted: isOvertime ? `+${formatted}` : formatted,
    isOvertime,
  };
}

/**
 * Composite Productivity Score Formula (§15.2 of specification).
 */
export function calculateProductivityScore(
  plan: DayPlan,
  currentStreak: number
): {
  score: number;
  completionPct: number;
  planningAccuracy: number;
  breakdown: DailyStats['scoreBreakdown'];
} {
  const totalTasks = plan.items.filter((i) => i.type === 'task').length;
  if (totalTasks === 0) {
    return {
      score: 0,
      completionPct: 0,
      planningAccuracy: 0,
      breakdown: {
        completionComponent: 0,
        accuracyComponent: 0,
        streakBonusComponent: 0,
        failurePenalty: 0,
      },
    };
  }

  const tasksCompleted = plan.items.filter((i) => i.type === 'task' && i.state === 'completed').length;
  const tasksFailed = plan.items.filter((i) => i.type === 'task' && (i.state === 'failed' || i.state === 'skipped')).length;

  const completionPct = (tasksCompleted / totalTasks) * 100;

  // Planning accuracy calculation
  let totalAccuracyError = 0;
  let evaluatedItems = 0;

  plan.items.forEach((item) => {
    if (item.type === 'task' && item.state === 'completed') {
      const planned = item.plannedDurationMinutes;
      const actual = item.actualMinutes || planned;
      const errorRatio = Math.abs(actual - planned) / Math.max(1, planned);
      totalAccuracyError += errorRatio;
      evaluatedItems++;
    }
  });

  const avgError = evaluatedItems > 0 ? totalAccuracyError / evaluatedItems : 0;
  const planningAccuracy = Math.max(0, Math.min(100, (1 - avgError) * 100));

  const failurePenalty = Math.min(20, tasksFailed * 5);
  const streakBonus = Math.min(10, currentStreak);

  const completionComponent = completionPct * 0.4;
  const accuracyComponent = planningAccuracy * 0.35;
  const streakBonusComponent = streakBonus * 0.1;
  const baseFailAdjust = Math.max(0, 10 - failurePenalty * 0.5);

  const rawScore = completionComponent + accuracyComponent + streakBonusComponent + baseFailAdjust;
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  return {
    score,
    completionPct: Math.round(completionPct),
    planningAccuracy: Math.round(planningAccuracy),
    breakdown: {
      completionComponent: Math.round(completionComponent),
      accuracyComponent: Math.round(accuracyComponent),
      streakBonusComponent: Math.round(streakBonusComponent),
      failurePenalty: Math.round(failurePenalty),
    },
  };
}
