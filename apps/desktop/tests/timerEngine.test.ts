import { describe, it, expect } from 'vitest';
import { getRemainingMs, calculateProductivityScore } from '../renderer/lib/timerEngine';
import type { ActiveItemState, DayPlan } from '@freedom/firestore-schema';

describe('Timer Engine: getRemainingMs', () => {
  it('calculates exact remaining time at fresh start', () => {
    const startTime = 1700000000000;
    const state: ActiveItemState = {
      dayPlanId: 'plan-1',
      itemId: 'task-1',
      itemType: 'task',
      title: 'Deep Work',
      plannedDurationMinutes: 25,
      startedAt: new Date(startTime).toISOString(),
      extensionMinutes: 0,
      pausedAt: null,
      accumulatedPauseMs: 0,
    };

    // Exactly at start time
    const remaining = getRemainingMs(state, startTime);
    expect(remaining).toBe(25 * 60 * 1000);
  });

  it('calculates remaining time correctly 10 minutes into task', () => {
    const startTime = 1700000000000;
    const state: ActiveItemState = {
      dayPlanId: 'plan-1',
      itemId: 'task-1',
      itemType: 'task',
      title: 'Deep Work',
      plannedDurationMinutes: 25,
      startedAt: new Date(startTime).toISOString(),
      extensionMinutes: 0,
      pausedAt: null,
      accumulatedPauseMs: 0,
    };

    const tenMinutesLater = startTime + 10 * 60 * 1000;
    const remaining = getRemainingMs(state, tenMinutesLater);
    expect(remaining).toBe(15 * 60 * 1000);
  });

  it('correctly includes extensions without mutating planned duration', () => {
    const startTime = 1700000000000;
    const state: ActiveItemState = {
      dayPlanId: 'plan-1',
      itemId: 'task-1',
      itemType: 'task',
      title: 'Deep Work',
      plannedDurationMinutes: 25,
      startedAt: new Date(startTime).toISOString(),
      extensionMinutes: 10, // extended by 10m
      pausedAt: null,
      accumulatedPauseMs: 0,
    };

    // 25 minutes in (would normally be 0, but with extension has 10m remaining)
    const twentyFiveMinutesLater = startTime + 25 * 60 * 1000;
    const remaining = getRemainingMs(state, twentyFiveMinutesLater);
    expect(remaining).toBe(10 * 60 * 1000);
  });

  it('excludes paused time from elapsed calculation (sleep/pause resilience)', () => {
    const startTime = 1700000000000;
    const fiveMinutesMs = 5 * 60 * 1000;
    const state: ActiveItemState = {
      dayPlanId: 'plan-1',
      itemId: 'task-1',
      itemType: 'task',
      title: 'Deep Work',
      plannedDurationMinutes: 25,
      startedAt: new Date(startTime).toISOString(),
      extensionMinutes: 0,
      pausedAt: null,
      accumulatedPauseMs: fiveMinutesMs, // spent 5m asleep/paused
    };

    // 15 minutes of clock time have passed, but 5m were paused -> 10m active work
    const fifteenMinutesClock = startTime + 15 * 60 * 1000;
    const remaining = getRemainingMs(state, fifteenMinutesClock);
    // 25m planned - 10m active work = 15m remaining
    expect(remaining).toBe(15 * 60 * 1000);
  });
});

describe('Productivity Score Formula (§15.2)', () => {
  it('computes near 100 score for perfect day plan execution', () => {
    const plan: DayPlan = {
      id: 'plan-test',
      userId: 'user-1',
      date: '2026-09-13',
      state: 'completed',
      items: [
        {
          id: '1',
          type: 'task',
          title: 'Task 1',
          order: 1,
          plannedDurationMinutes: 30,
          actualMinutes: 30,
          extensionMinutes: 0,
          state: 'completed',
        },
        {
          id: '2',
          type: 'task',
          title: 'Task 2',
          order: 2,
          plannedDurationMinutes: 30,
          actualMinutes: 30,
          extensionMinutes: 0,
          state: 'completed',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const result = calculateProductivityScore(plan, 5); // 5-day streak
    expect(result.completionPct).toBe(100);
    expect(result.planningAccuracy).toBe(100);
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it('penalizes incomplete or failed tasks', () => {
    const plan: DayPlan = {
      id: 'plan-test-fail',
      userId: 'user-1',
      date: '2026-09-13',
      state: 'completed',
      items: [
        {
          id: '1',
          type: 'task',
          title: 'Task 1',
          order: 1,
          plannedDurationMinutes: 30,
          actualMinutes: 30,
          extensionMinutes: 0,
          state: 'completed',
        },
        {
          id: '2',
          type: 'task',
          title: 'Task 2',
          order: 2,
          plannedDurationMinutes: 30,
          actualMinutes: 0,
          extensionMinutes: 0,
          state: 'failed',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const result = calculateProductivityScore(plan, 0);
    expect(result.completionPct).toBe(50);
    expect(result.score).toBeLessThan(70);
  });
});
