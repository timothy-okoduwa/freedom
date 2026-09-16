import { ipcMain, Notification } from 'electron';
import type { DayPlan, DayPlanItem, ActiveItemState } from '@freedom/firestore-schema';
import { sessionStore } from '../persistence/sessionStore';
import { getMainWindow } from '../windows/mainWindow';
import { getWidgetWindow, showWidget, hideWidget, toggleWidgetExpanded } from '../windows/widgetWindow';
import { getAppIconPath } from '../utils/appIcon';

let activePlan: DayPlan | null = null;
let activeItem: ActiveItemState | null = null;
let tickTimer: NodeJS.Timeout | null = null;
let idleWidgetTimer: NodeJS.Timeout | null = null;

function scheduleIdleWidgetHide() {
  if (idleWidgetTimer) clearTimeout(idleWidgetTimer);
  idleWidgetTimer = setTimeout(() => {
    if (!activeItem) {
      toggleWidgetExpanded(false);
      hideWidget();
    }
  }, 5000);
}

function cancelIdleWidgetHide() {
  if (idleWidgetTimer) {
    clearTimeout(idleWidgetTimer);
    idleWidgetTimer = null;
  }
}

export function calculateRemainingMs(state: ActiveItemState): number {
  const now = state.pausedAt ? new Date(state.pausedAt).getTime() : Date.now();
  const elapsedMs = now - new Date(state.startedAt).getTime() - state.accumulatedPauseMs;
  const totalPlannedMs = (state.plannedDurationMinutes + state.extensionMinutes) * 60000;
  return totalPlannedMs - elapsedMs;
}

function broadcastSessionUpdate() {
  const main = getMainWindow();
  const widget = getWidgetWindow();

  const payload = {
    activeItem,
    activePlan,
    remainingMs: activeItem ? calculateRemainingMs(activeItem) : 0,
  };

  if (main && !main.isDestroyed()) {
    main.webContents.send('session:tick', payload);
  }
  if (widget && !widget.isDestroyed()) {
    widget.webContents.send('session:tick', payload);
  }
}

function startTicker() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    if (checkDayRollover()) return;
    if (!activeItem) return;

    broadcastSessionUpdate();

    // Check if task ended - auto-advance immediately to the next task
    const remainingMs = calculateRemainingMs(activeItem);
    if (remainingMs <= 0) {
      advanceNextItem();
    }
  }, 1000);
}

function advanceNextItem() {
  if (!activePlan || !activeItem) return;

  const currentItemIndex = activePlan.items.findIndex((i) => i.id === activeItem?.itemId);
  if (currentItemIndex >= 0) {
    const item = activePlan.items[currentItemIndex];
    item.state = 'completed';
    item.endedAt = new Date().toISOString();
    const ext = activeItem.extensionMinutes || item.extensionMinutes || 0;
    item.extensionMinutes = ext;
    item.actualMinutes = item.plannedDurationMinutes + ext;
  }

  // Find next pending item
  const nextItem = activePlan.items.find((i) => i.state === 'pending');
  if (nextItem) {
    cancelIdleWidgetHide();
    nextItem.state = 'running';
    nextItem.startedAt = new Date().toISOString();

    activeItem = {
      dayPlanId: activePlan.id,
      itemId: nextItem.id,
      itemType: nextItem.type,
      title: nextItem.title,
      plannedDurationMinutes: nextItem.plannedDurationMinutes,
      startedAt: nextItem.startedAt,
      extensionMinutes: 0,
      pausedAt: null,
      accumulatedPauseMs: 0,
    };

    sessionStore.setActiveItem(activeItem);
    sessionStore.setCurrentDayPlan(activePlan);

    // Fire native desktop notification with Freedom app icon
    const iconPath = getAppIconPath();
    new Notification({
      title: nextItem.type === 'break' ? 'Break Started' : 'Next Task Started',
      body: `Now executing: ${nextItem.title} (${nextItem.plannedDurationMinutes}m)`,
      ...(iconPath ? { icon: iconPath } : {}),
    }).show();

    broadcastSessionUpdate();
  } else {
    // Day plan finished! Keep widget open so auto-collapse timer (5s) transitions pill cleanly then auto-hides
    activePlan.state = 'completed';
    activePlan.completedAt = new Date().toISOString();
    activeItem = null;
    sessionStore.clearSession();

    const iconPath = getAppIconPath();
    new Notification({
      title: 'Day Complete! 🎉',
      body: 'All queued items have completed. Check your Productivity Score!',
      ...(iconPath ? { icon: iconPath } : {}),
    }).show();

    broadcastSessionUpdate();
    scheduleIdleWidgetHide();
  }
}

function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function checkDayRollover(): boolean {
  const todayStr = getLocalDateString();
  if (activePlan && activePlan.date !== todayStr) {
    // Auto-clear yesterday's plan on date rollover
    activeItem = null;
    activePlan = null;
    sessionStore.clearSession();
    scheduleIdleWidgetHide();
    broadcastSessionUpdate();
    return true;
  }
  return false;
}

export function initSessionChannels() {
  // Restore persisted session from disk on startup
  const persistedItem = sessionStore.getActiveItem();
  const persistedPlan = sessionStore.getCurrentDayPlan();
  const todayStr = getLocalDateString();

  if (persistedPlan && persistedPlan.date !== todayStr) {
    // If plan is from a previous day, clear session on launch
    activeItem = null;
    activePlan = null;
    sessionStore.clearSession();
    scheduleIdleWidgetHide();
  } else if (persistedItem && persistedPlan) {
    activeItem = persistedItem;
    activePlan = persistedPlan;
    cancelIdleWidgetHide();
    startTicker();
    showWidget();
  } else {
    scheduleIdleWidgetHide();
  }

  ipcMain.handle('session:get-user', () => {
    return sessionStore.getUser();
  });

  ipcMain.handle('session:set-user', (_event, user: any) => {
    sessionStore.setUser(user);
    return true;
  });

  ipcMain.handle('session:get-active', () => {
    checkDayRollover();
    return {
      activeItem,
      activePlan,
      remainingMs: activeItem ? calculateRemainingMs(activeItem) : 0,
    };
  });

  ipcMain.handle('session:start-day', (_event, plan: DayPlan) => {
    activePlan = plan;
    activePlan.state = 'running';
    activePlan.startedAt = new Date().toISOString();

    // Start from the first UNCOMPLETED / PENDING task in the queue, not index 0!
    const targetItem = activePlan.items.find((i) => i.state === 'pending' || (i.state !== 'completed' && i.state !== 'skipped')) || activePlan.items[0];
    if (targetItem) {
      targetItem.state = 'running';
      targetItem.startedAt = new Date().toISOString();

      activeItem = {
        dayPlanId: activePlan.id,
        itemId: targetItem.id,
        itemType: targetItem.type,
        title: targetItem.title,
        plannedDurationMinutes: targetItem.plannedDurationMinutes,
        startedAt: targetItem.startedAt,
        extensionMinutes: 0,
        pausedAt: null,
        accumulatedPauseMs: 0,
      };
    }

    sessionStore.setActiveItem(activeItem);
    sessionStore.setCurrentDayPlan(activePlan);

    if (activeItem) {
      cancelIdleWidgetHide();
      startTicker();
      showWidget();
    } else {
      scheduleIdleWidgetHide();
    }
    broadcastSessionUpdate();
    return true;
  });

  ipcMain.handle('session:update-plan-items', (_event, updatedItems: DayPlanItem[]) => {
    if (!activePlan) return false;
    activePlan.items = updatedItems;
    sessionStore.setCurrentDayPlan(activePlan);
    broadcastSessionUpdate();
    return true;
  });

  ipcMain.handle('session:update-task-title', (_event, payload: { itemId: string; title: string }) => {
    const cleanTitle = payload?.title?.trim();
    if (!cleanTitle || !payload?.itemId) return false;

    if (activeItem && activeItem.itemId === payload.itemId) {
      activeItem.title = cleanTitle;
      sessionStore.setActiveItem(activeItem);
    }

    if (activePlan) {
      const item = activePlan.items.find((i) => i.id === payload.itemId);
      if (item) {
        item.title = cleanTitle;
      }
      sessionStore.setCurrentDayPlan(activePlan);
    }

    broadcastSessionUpdate();
    return true;
  });

  ipcMain.handle(
    'session:update-task-duration',
    (_event, payload: { itemId: string; durationMinutes: number }) => {
      const newDuration = Math.max(1, payload?.durationMinutes || 1);
      if (!payload?.itemId) return false;

      if (activeItem && activeItem.itemId === payload.itemId) {
        activeItem.plannedDurationMinutes = newDuration;
        sessionStore.setActiveItem(activeItem);
      }

      if (activePlan) {
        const item = activePlan.items.find((i) => i.id === payload.itemId);
        if (item) {
          item.plannedDurationMinutes = newDuration;
        }
        sessionStore.setCurrentDayPlan(activePlan);
      }

      broadcastSessionUpdate();
      return true;
    }
  );

  ipcMain.handle('session:extend-task', (_event, minutes: number) => {
    if (!activeItem) return false;
    activeItem.extensionMinutes = Math.max(0, activeItem.extensionMinutes + minutes);
    if (activePlan) {
      const item = activePlan.items.find((i) => i.id === activeItem?.itemId);
      if (item) {
        item.extensionMinutes = activeItem.extensionMinutes;
      }
      sessionStore.setCurrentDayPlan(activePlan);
    }
    sessionStore.setActiveItem(activeItem);
    broadcastSessionUpdate();
    return true;
  });

  ipcMain.handle('session:finish-task', () => {
    advanceNextItem();
    return true;
  });

  ipcMain.handle('session:skip-task', () => {
    if (!activePlan || !activeItem) return false;
    const item = activePlan.items.find((i) => i.id === activeItem?.itemId);
    if (item) {
      item.state = 'skipped';
      item.endedAt = new Date().toISOString();
    }
    advanceNextItem();
    return true;
  });

  ipcMain.handle('session:pause', () => {
    if (!activeItem || activeItem.pausedAt) return false;
    activeItem.pausedAt = new Date().toISOString();
    sessionStore.setActiveItem(activeItem);
    broadcastSessionUpdate();
    return true;
  });

  ipcMain.handle('session:resume', () => {
    if (!activeItem || !activeItem.pausedAt) return false;
    const pauseDuration = Date.now() - new Date(activeItem.pausedAt).getTime();
    activeItem.accumulatedPauseMs += pauseDuration;
    activeItem.pausedAt = null;
    sessionStore.setActiveItem(activeItem);
    broadcastSessionUpdate();
    return true;
  });

  ipcMain.handle('widget:toggle-expand', (_event, expand?: boolean) => {
    toggleWidgetExpanded(expand);
  });

  ipcMain.handle('widget:show', () => {
    showWidget();
    if (!activeItem) {
      scheduleIdleWidgetHide();
    } else {
      cancelIdleWidgetHide();
    }
  });

  ipcMain.handle('widget:hide', () => {
    hideWidget();
  });

  ipcMain.handle('widget:move-by', (_event, deltaX: number, deltaY: number) => {
    const widget = getWidgetWindow();
    if (widget) {
      const [x, y] = widget.getPosition();
      widget.setPosition(Math.round(x + deltaX), Math.round(y + deltaY));
    }
  });

  ipcMain.handle('window:focus-main', () => {
    const main = getMainWindow();
    if (main && !main.isDestroyed()) {
      if (main.isMinimized()) main.restore();
      main.show();
      main.focus();
    }
  });
}

export function isSessionActive(): boolean {
  return !!activeItem;
}

export function getCurrentTaskTitle(): string | null {
  return activeItem?.title ?? null;
}

export function isSessionPaused(): boolean {
  return !!activeItem?.pausedAt;
}

export function toggleSessionPause() {
  if (!activeItem) return;
  if (activeItem.pausedAt) {
    const pauseDuration = Date.now() - new Date(activeItem.pausedAt).getTime();
    activeItem.accumulatedPauseMs += pauseDuration;
    activeItem.pausedAt = null;
  } else {
    activeItem.pausedAt = new Date().toISOString();
  }
  sessionStore.setActiveItem(activeItem);
  broadcastSessionUpdate();
}

export function handleSystemSuspend() {
  if (activeItem && !activeItem.pausedAt) {
    activeItem.pausedAt = new Date().toISOString();
    sessionStore.setActiveItem(activeItem);
  }
}

export function handleSystemResume() {
  if (activeItem && activeItem.pausedAt) {
    const pauseDuration = Date.now() - new Date(activeItem.pausedAt).getTime();
    activeItem.accumulatedPauseMs += pauseDuration;
    activeItem.pausedAt = null;
    sessionStore.setActiveItem(activeItem);
    broadcastSessionUpdate();
  }
}
