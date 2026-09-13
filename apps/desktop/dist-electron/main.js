"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const mainWindow_1 = require("./windows/mainWindow");
const widgetWindow_1 = require("./windows/widgetWindow");
const trayMenu_1 = require("./windows/trayMenu");
const appIcon_1 = require("./utils/appIcon");
const sessionChannels_1 = require("./ipc/sessionChannels");
// Set app name and identifier for OS notifications & dock branding
electron_1.app.setName('Freedom');
if (process.platform === 'win32') {
    electron_1.app.setAppUserModelId('com.freedom.desktop');
}
const isDev = process.env.NODE_ENV !== 'production' && !electron_1.app.isPackaged;
const RENDERER_URL = isDev ? 'http://localhost:3001' : 'http://localhost:3001'; // or custom file protocol in prod
electron_1.app.whenReady().then(() => {
    if (process.platform === 'darwin') {
        const iconPath = (0, appIcon_1.getAppIconPath)();
        if (iconPath && electron_1.app.dock) {
            electron_1.app.dock.setIcon(iconPath);
        }
    }
    // Initialize IPC channels first
    (0, sessionChannels_1.initSessionChannels)();
    // Create windows
    (0, mainWindow_1.createMainWindow)(RENDERER_URL, sessionChannels_1.isSessionActive);
    (0, widgetWindow_1.createWidgetWindow)(RENDERER_URL);
    // Create system Tray
    (0, trayMenu_1.createTrayMenu)(sessionChannels_1.toggleSessionPause, sessionChannels_1.isSessionPaused, sessionChannels_1.getCurrentTaskTitle);
    // System suspend / sleep hooks (§9.2)
    electron_1.powerMonitor.on('suspend', () => {
        (0, sessionChannels_1.handleSystemSuspend)();
    });
    electron_1.powerMonitor.on('resume', () => {
        (0, sessionChannels_1.handleSystemResume)();
    });
    electron_1.app.on('activate', () => {
        (0, mainWindow_1.createMainWindow)(RENDERER_URL, sessionChannels_1.isSessionActive);
    });
});
electron_1.app.on('window-all-closed', () => {
    // On macOS keep app running in tray if session is active
    if (process.platform !== 'darwin' && !(0, sessionChannels_1.isSessionActive)()) {
        electron_1.app.quit();
    }
});
