import { contextBridge, ipcRenderer } from 'electron';
import type { DayPlan, DayPlanItem } from '@freedom/firestore-schema';

contextBridge.exposeInMainWorld('freedom', {
  platform: process.platform,
  session: {
    getUser: () => ipcRenderer.invoke('session:get-user'),
    setUser: (user: any) => ipcRenderer.invoke('session:set-user', user),
    getActive: () => ipcRenderer.invoke('session:get-active'),
    startDay: (plan: DayPlan) => ipcRenderer.invoke('session:start-day', plan),
    updatePlanItems: (items: DayPlanItem[]) => ipcRenderer.invoke('session:update-plan-items', items),
    updateTaskTitle: (itemId: string, title: string) => ipcRenderer.invoke('session:update-task-title', { itemId, title }),
    updateTaskDuration: (itemId: string, durationMinutes: number) => ipcRenderer.invoke('session:update-task-duration', { itemId, durationMinutes }),
    extendTask: (minutes: number) => ipcRenderer.invoke('session:extend-task', minutes),
    finishTask: () => ipcRenderer.invoke('session:finish-task'),
    skipTask: () => ipcRenderer.invoke('session:skip-task'),
    pause: () => ipcRenderer.invoke('session:pause'),
    resume: () => ipcRenderer.invoke('session:resume'),
    focusMainWindow: () => ipcRenderer.invoke('window:focus-main'),
    onTick: (callback: (data: any) => void) => {
      const handler = (_event: any, data: any) => callback(data);
      ipcRenderer.on('session:tick', handler);
      return () => ipcRenderer.removeListener('session:tick', handler);
    },
  },
  widget: {
    show: () => ipcRenderer.invoke('widget:show'),
    hide: () => ipcRenderer.invoke('widget:hide'),
    toggleExpand: (expand?: boolean) => ipcRenderer.invoke('widget:toggle-expand', expand),
    moveBy: (deltaX: number, deltaY: number) => ipcRenderer.invoke('widget:move-by', deltaX, deltaY),
  },
  invite: {
    sendEmail: (payload: any) => ipcRenderer.invoke('invite:send-email', payload),
  },
});

