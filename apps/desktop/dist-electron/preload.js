"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('freedom', {
    platform: process.platform,
    session: {
        getActive: () => electron_1.ipcRenderer.invoke('session:get-active'),
        startDay: (plan) => electron_1.ipcRenderer.invoke('session:start-day', plan),
        updatePlanItems: (items) => electron_1.ipcRenderer.invoke('session:update-plan-items', items),
        extendTask: (minutes) => electron_1.ipcRenderer.invoke('session:extend-task', minutes),
        finishTask: () => electron_1.ipcRenderer.invoke('session:finish-task'),
        skipTask: () => electron_1.ipcRenderer.invoke('session:skip-task'),
        pause: () => electron_1.ipcRenderer.invoke('session:pause'),
        resume: () => electron_1.ipcRenderer.invoke('session:resume'),
        focusMainWindow: () => electron_1.ipcRenderer.invoke('window:focus-main'),
        onTick: (callback) => {
            const handler = (_event, data) => callback(data);
            electron_1.ipcRenderer.on('session:tick', handler);
            return () => electron_1.ipcRenderer.removeListener('session:tick', handler);
        },
    },
    widget: {
        show: () => electron_1.ipcRenderer.invoke('widget:show'),
        hide: () => electron_1.ipcRenderer.invoke('widget:hide'),
        toggleExpand: (expand) => electron_1.ipcRenderer.invoke('widget:toggle-expand', expand),
        moveBy: (deltaX, deltaY) => electron_1.ipcRenderer.invoke('widget:move-by', deltaX, deltaY),
    },
});
