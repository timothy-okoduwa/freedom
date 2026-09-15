"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRemainingMs = calculateRemainingMs;
exports.initSessionChannels = initSessionChannels;
exports.isSessionActive = isSessionActive;
exports.getCurrentTaskTitle = getCurrentTaskTitle;
exports.isSessionPaused = isSessionPaused;
exports.toggleSessionPause = toggleSessionPause;
exports.handleSystemSuspend = handleSystemSuspend;
exports.handleSystemResume = handleSystemResume;
const electron_1 = require("electron");
const sessionStore_1 = require("../persistence/sessionStore");
const mainWindow_1 = require("../windows/mainWindow");
const widgetWindow_1 = require("../windows/widgetWindow");
const appIcon_1 = require("../utils/appIcon");
let activePlan = null;
let activeItem = null;
let tickTimer = null;
let idleWidgetTimer = null;
function scheduleIdleWidgetHide() {
    if (idleWidgetTimer)
        clearTimeout(idleWidgetTimer);
    idleWidgetTimer = setTimeout(() => {
        if (!activeItem) {
            (0, widgetWindow_1.toggleWidgetExpanded)(false);
            (0, widgetWindow_1.hideWidget)();
        }
    }, 5000);
}
function cancelIdleWidgetHide() {
    if (idleWidgetTimer) {
        clearTimeout(idleWidgetTimer);
        idleWidgetTimer = null;
    }
}
function calculateRemainingMs(state) {
    const now = state.pausedAt ? new Date(state.pausedAt).getTime() : Date.now();
    const elapsedMs = now - new Date(state.startedAt).getTime() - state.accumulatedPauseMs;
    const totalPlannedMs = (state.plannedDurationMinutes + state.extensionMinutes) * 60000;
    return totalPlannedMs - elapsedMs;
}
function broadcastSessionUpdate() {
    const main = (0, mainWindow_1.getMainWindow)();
    const widget = (0, widgetWindow_1.getWidgetWindow)();
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
    if (tickTimer)
        clearInterval(tickTimer);
    tickTimer = setInterval(() => {
        if (checkDayRollover())
            return;
        if (!activeItem)
            return;
        broadcastSessionUpdate();
        // Check if task ended - auto-advance immediately to the next task
        const remainingMs = calculateRemainingMs(activeItem);
        if (remainingMs <= 0) {
            advanceNextItem();
        }
    }, 1000);
}
function advanceNextItem() {
    if (!activePlan || !activeItem)
        return;
    const currentItemIndex = activePlan.items.findIndex((i) => i.id === activeItem?.itemId);
    if (currentItemIndex >= 0) {
        const item = activePlan.items[currentItemIndex];
        item.state = 'completed';
        item.endedAt = new Date().toISOString();
        const plannedMs = item.plannedDurationMinutes * 60000;
        item.actualMinutes = Math.round(plannedMs / 60000);
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
        sessionStore_1.sessionStore.setActiveItem(activeItem);
        sessionStore_1.sessionStore.setCurrentDayPlan(activePlan);
        // Fire native desktop notification with Freedom app icon
        const iconPath = (0, appIcon_1.getAppIconPath)();
        new electron_1.Notification({
            title: nextItem.type === 'break' ? 'Break Started' : 'Next Task Started',
            body: `Now executing: ${nextItem.title} (${nextItem.plannedDurationMinutes}m)`,
            ...(iconPath ? { icon: iconPath } : {}),
        }).show();
        broadcastSessionUpdate();
    }
    else {
        // Day plan finished! Keep widget open so auto-collapse timer (5s) transitions pill cleanly then auto-hides
        activePlan.state = 'completed';
        activePlan.completedAt = new Date().toISOString();
        activeItem = null;
        sessionStore_1.sessionStore.clearSession();
        const iconPath = (0, appIcon_1.getAppIconPath)();
        new electron_1.Notification({
            title: 'Day Complete! 🎉',
            body: 'All queued items have completed. Check your Productivity Score!',
            ...(iconPath ? { icon: iconPath } : {}),
        }).show();
        broadcastSessionUpdate();
        scheduleIdleWidgetHide();
    }
}
function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function checkDayRollover() {
    const todayStr = getLocalDateString();
    if (activePlan && activePlan.date !== todayStr) {
        // Auto-clear yesterday's plan on date rollover
        activeItem = null;
        activePlan = null;
        sessionStore_1.sessionStore.clearSession();
        scheduleIdleWidgetHide();
        broadcastSessionUpdate();
        return true;
    }
    return false;
}
function initSessionChannels() {
    // Restore persisted session from disk on startup
    const persistedItem = sessionStore_1.sessionStore.getActiveItem();
    const persistedPlan = sessionStore_1.sessionStore.getCurrentDayPlan();
    const todayStr = getLocalDateString();
    if (persistedPlan && persistedPlan.date !== todayStr) {
        // If plan is from a previous day, clear session on launch
        activeItem = null;
        activePlan = null;
        sessionStore_1.sessionStore.clearSession();
        scheduleIdleWidgetHide();
    }
    else if (persistedItem && persistedPlan) {
        activeItem = persistedItem;
        activePlan = persistedPlan;
        cancelIdleWidgetHide();
        startTicker();
        (0, widgetWindow_1.showWidget)();
    }
    else {
        scheduleIdleWidgetHide();
    }
    electron_1.ipcMain.handle('session:get-user', () => {
        return sessionStore_1.sessionStore.getUser();
    });
    electron_1.ipcMain.handle('session:set-user', (_event, user) => {
        sessionStore_1.sessionStore.setUser(user);
        return true;
    });
    electron_1.ipcMain.handle('session:get-active', () => {
        checkDayRollover();
        return {
            activeItem,
            activePlan,
            remainingMs: activeItem ? calculateRemainingMs(activeItem) : 0,
        };
    });
    electron_1.ipcMain.handle('session:start-day', (_event, plan) => {
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
        sessionStore_1.sessionStore.setActiveItem(activeItem);
        sessionStore_1.sessionStore.setCurrentDayPlan(activePlan);
        if (activeItem) {
            cancelIdleWidgetHide();
            startTicker();
            (0, widgetWindow_1.showWidget)();
        }
        else {
            scheduleIdleWidgetHide();
        }
        broadcastSessionUpdate();
        return true;
    });
    electron_1.ipcMain.handle('session:update-plan-items', (_event, updatedItems) => {
        if (!activePlan)
            return false;
        activePlan.items = updatedItems;
        sessionStore_1.sessionStore.setCurrentDayPlan(activePlan);
        broadcastSessionUpdate();
        return true;
    });
    electron_1.ipcMain.handle('session:update-task-title', (_event, payload) => {
        const cleanTitle = payload?.title?.trim();
        if (!cleanTitle || !payload?.itemId)
            return false;
        if (activeItem && activeItem.itemId === payload.itemId) {
            activeItem.title = cleanTitle;
            sessionStore_1.sessionStore.setActiveItem(activeItem);
        }
        if (activePlan) {
            const item = activePlan.items.find((i) => i.id === payload.itemId);
            if (item) {
                item.title = cleanTitle;
            }
            sessionStore_1.sessionStore.setCurrentDayPlan(activePlan);
        }
        broadcastSessionUpdate();
        return true;
    });
    electron_1.ipcMain.handle('session:extend-task', (_event, minutes) => {
        if (!activeItem)
            return false;
        activeItem.extensionMinutes += minutes;
        sessionStore_1.sessionStore.setActiveItem(activeItem);
        broadcastSessionUpdate();
        return true;
    });
    electron_1.ipcMain.handle('session:finish-task', () => {
        advanceNextItem();
        return true;
    });
    electron_1.ipcMain.handle('session:skip-task', () => {
        if (!activePlan || !activeItem)
            return false;
        const item = activePlan.items.find((i) => i.id === activeItem?.itemId);
        if (item) {
            item.state = 'skipped';
            item.endedAt = new Date().toISOString();
        }
        advanceNextItem();
        return true;
    });
    electron_1.ipcMain.handle('session:pause', () => {
        if (!activeItem || activeItem.pausedAt)
            return false;
        activeItem.pausedAt = new Date().toISOString();
        sessionStore_1.sessionStore.setActiveItem(activeItem);
        broadcastSessionUpdate();
        return true;
    });
    electron_1.ipcMain.handle('session:resume', () => {
        if (!activeItem || !activeItem.pausedAt)
            return false;
        const pauseDuration = Date.now() - new Date(activeItem.pausedAt).getTime();
        activeItem.accumulatedPauseMs += pauseDuration;
        activeItem.pausedAt = null;
        sessionStore_1.sessionStore.setActiveItem(activeItem);
        broadcastSessionUpdate();
        return true;
    });
    electron_1.ipcMain.handle('widget:toggle-expand', (_event, expand) => {
        (0, widgetWindow_1.toggleWidgetExpanded)(expand);
    });
    electron_1.ipcMain.handle('widget:show', () => {
        (0, widgetWindow_1.showWidget)();
        if (!activeItem) {
            scheduleIdleWidgetHide();
        }
        else {
            cancelIdleWidgetHide();
        }
    });
    electron_1.ipcMain.handle('widget:hide', () => {
        (0, widgetWindow_1.hideWidget)();
    });
    electron_1.ipcMain.handle('widget:move-by', (_event, deltaX, deltaY) => {
        const widget = (0, widgetWindow_1.getWidgetWindow)();
        if (widget) {
            const [x, y] = widget.getPosition();
            widget.setPosition(Math.round(x + deltaX), Math.round(y + deltaY));
        }
    });
    electron_1.ipcMain.handle('window:focus-main', () => {
        const main = (0, mainWindow_1.getMainWindow)();
        if (main && !main.isDestroyed()) {
            if (main.isMinimized())
                main.restore();
            main.show();
            main.focus();
        }
    });
}
function isSessionActive() {
    return !!activeItem;
}
function getCurrentTaskTitle() {
    return activeItem?.title ?? null;
}
function isSessionPaused() {
    return !!activeItem?.pausedAt;
}
function toggleSessionPause() {
    if (!activeItem)
        return;
    if (activeItem.pausedAt) {
        const pauseDuration = Date.now() - new Date(activeItem.pausedAt).getTime();
        activeItem.accumulatedPauseMs += pauseDuration;
        activeItem.pausedAt = null;
    }
    else {
        activeItem.pausedAt = new Date().toISOString();
    }
    sessionStore_1.sessionStore.setActiveItem(activeItem);
    broadcastSessionUpdate();
}
function handleSystemSuspend() {
    if (activeItem && !activeItem.pausedAt) {
        activeItem.pausedAt = new Date().toISOString();
        sessionStore_1.sessionStore.setActiveItem(activeItem);
    }
}
function handleSystemResume() {
    if (activeItem && activeItem.pausedAt) {
        const pauseDuration = Date.now() - new Date(activeItem.pausedAt).getTime();
        activeItem.accumulatedPauseMs += pauseDuration;
        activeItem.pausedAt = null;
        sessionStore_1.sessionStore.setActiveItem(activeItem);
        broadcastSessionUpdate();
    }
}
