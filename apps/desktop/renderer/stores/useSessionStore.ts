import { create } from 'zustand';
import type { DayPlan, DayPlanItem, ActiveItemState, User } from '@freedom/firestore-schema';
import { calculateProductivityScore } from '../lib/timerEngine';
import { soundManager } from '../lib/soundManager';
import { firestoreService } from '../lib/firebase';

interface SessionStore {
  user: User | null;
  activeItem: ActiveItemState | null;
  activePlan: DayPlan | null;
  remainingMs: number;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  loadActiveSession: () => Promise<void>;
  startDay: (plan: DayPlan) => Promise<boolean>;
  updatePlanItems: (items: DayPlanItem[]) => Promise<boolean>;
  extendTask: (minutes: number) => Promise<boolean>;
  finishTask: () => Promise<boolean>;
  skipTask: () => Promise<boolean>;
  pause: () => Promise<boolean>;
  resume: () => Promise<boolean>;
}

// Global Freedom IPC interface on window
declare global {
  interface Window {
    freedom?: {
      platform: string;
      session: {
        getUser: () => Promise<User | null>;
        setUser: (user: User | null) => Promise<boolean>;
        getActive: () => Promise<{
          activeItem: ActiveItemState | null;
          activePlan: DayPlan | null;
          remainingMs: number;
        }>;
        startDay: (plan: DayPlan) => Promise<boolean>;
        updatePlanItems: (items: DayPlanItem[]) => Promise<boolean>;
        extendTask: (minutes: number) => Promise<boolean>;
        finishTask: () => Promise<boolean>;
        skipTask: () => Promise<boolean>;
        pause: () => Promise<boolean>;
        resume: () => Promise<boolean>;
        focusMainWindow: () => Promise<void>;
        onTick: (callback: (data: any) => void) => () => void;
      };
      widget: {
        show: () => Promise<void>;
        hide: () => Promise<void>;
        toggleExpand: (expand?: boolean) => Promise<void>;
        moveBy: (deltaX: number, deltaY: number) => Promise<void>;
      };
      invite?: {
        sendEmail: (payload: any) => Promise<{ success: boolean; message: string }>;
      };
    };
  }
}


export const useSessionStore = create<SessionStore>((set, get) => ({
  user: null,
  activeItem: null,
  activePlan: null,
  remainingMs: 0,
  isLoading: true,

  setUser: (user) => set({ user }),

  loadActiveSession: async () => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      const data = await window.freedom.session.getActive();
      set({
        activeItem: data.activeItem,
        activePlan: data.activePlan,
        remainingMs: data.remainingMs,
        isLoading: false,
      });

      // Subscribe to continuous live ticks from Electron main process
      window.freedom.session.onTick((data) => {
        const prevItem = get().activeItem;
        // When a task finishes and auto-advances, play soothing completion sound and sync completed state to Firebase
        if (prevItem && (!data.activeItem || data.activeItem.itemId !== prevItem.itemId)) {
          soundManager.playSound();
          if (data.activePlan) {
            firestoreService.saveDayPlan(data.activePlan);
          }
        }

        set({
          activeItem: data.activeItem,
          activePlan: data.activePlan,
          remainingMs: data.remainingMs,
        });
      });
    } else {
      set({ isLoading: false });
    }
  },

  startDay: async (plan: DayPlan) => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      const success = await window.freedom.session.startDay(plan);
      if (success) {
        const targetItem = plan.items.find((i) => i.state !== 'completed' && i.state !== 'skipped') || plan.items[0];
        set({ activePlan: plan, activeItem: targetItem ? {
          dayPlanId: plan.id,
          itemId: targetItem.id,
          itemType: targetItem.type,
          title: targetItem.title,
          plannedDurationMinutes: targetItem.plannedDurationMinutes,
          startedAt: new Date().toISOString(),
          extensionMinutes: 0,
          pausedAt: null,
          accumulatedPauseMs: 0,
        } : null });
      }
      return success;
    }
    return false;
  },

  updatePlanItems: async (items: DayPlanItem[]) => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      const success = await window.freedom.session.updatePlanItems(items);
      if (success) {
        const plan = get().activePlan;
        if (plan) {
          set({ activePlan: { ...plan, items } });
        }
      }
      return success;
    }
    return false;
  },

  extendTask: async (minutes: number) => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      return await window.freedom.session.extendTask(minutes);
    }
    return false;
  },

  finishTask: async () => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      soundManager.playSound();
      const success = await window.freedom.session.finishTask();
      const plan = get().activePlan;
      const currentUser = get().user;
      if (plan) {
        await firestoreService.saveDayPlan(plan);
        if (currentUser?.uid) {
          const stats = await firestoreService.syncUserStats(currentUser.uid);
          if (stats) {
            set({ user: { ...currentUser, publicStats: stats } });
          }
        }
      }
      return success;
    }
    return false;
  },


  skipTask: async () => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      const success = await window.freedom.session.skipTask();
      const plan = get().activePlan;
      if (plan) {
        firestoreService.saveDayPlan(plan);
      }
      return success;
    }
    return false;
  },

  pause: async () => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      return await window.freedom.session.pause();
    }
    return false;
  },

  resume: async () => {
    if (typeof window !== 'undefined' && window.freedom?.session) {
      return await window.freedom.session.resume();
    }
    return false;
  },
}));
