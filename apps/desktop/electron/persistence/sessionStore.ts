import Store from 'electron-store';
import type { DayPlan, ActiveItemState, User } from '@freedom/firestore-schema';

export interface PersistedSession {
  activeItemState: ActiveItemState | null;
  currentDayPlan: DayPlan | null;
  user: User | null;
  widgetPosition: { x: number; y: number } | null;
  lastPersistedAt: string;
}

const store = new Store<PersistedSession>({
  name: 'freedom-session',
  defaults: {
    activeItemState: null,
    currentDayPlan: null,
    user: null,
    widgetPosition: null,
    lastPersistedAt: new Date().toISOString(),
  },
});

export const sessionStore = {
  getActiveItem(): ActiveItemState | null {
    return store.get('activeItemState');
  },
  setActiveItem(state: ActiveItemState | null) {
    store.set('activeItemState', state);
    store.set('lastPersistedAt', new Date().toISOString());
  },
  getCurrentDayPlan(): DayPlan | null {
    return store.get('currentDayPlan');
  },
  setCurrentDayPlan(plan: DayPlan | null) {
    store.set('currentDayPlan', plan);
    store.set('lastPersistedAt', new Date().toISOString());
  },
  getUser(): User | null {
    return store.get('user');
  },
  setUser(user: User | null) {
    store.set('user', user);
  },
  getWidgetPosition(): { x: number; y: number } | null {
    return store.get('widgetPosition');
  },
  setWidgetPosition(pos: { x: number; y: number }) {
    store.set('widgetPosition', pos);
  },
  clearSession() {
    store.set('activeItemState', null);
    store.set('currentDayPlan', null);
    store.set('lastPersistedAt', new Date().toISOString());
  },
};
