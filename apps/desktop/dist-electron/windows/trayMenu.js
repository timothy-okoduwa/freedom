"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrayMenu = createTrayMenu;
const electron_1 = require("electron");
const mainWindow_1 = require("./mainWindow");
const widgetWindow_1 = require("./widgetWindow");
let tray = null;
function createTrayMenu(onTogglePause, isPaused, currentTaskTitle) {
    // Create a clean default 16x16 icon for the tray
    const icon = electron_1.nativeImage.createEmpty();
    tray = new electron_1.Tray(icon);
    tray.setToolTip('Freedom — Automatic Execution Engine');
    const updateMenu = () => {
        const task = currentTaskTitle();
        const paused = isPaused();
        const contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: task ? `Active: ${task}` : 'Freedom: Ready',
                enabled: false,
            },
            { type: 'separator' },
            {
                label: paused ? '▶ Resume Execution' : '⏸ Pause Execution',
                enabled: !!task,
                click: onTogglePause,
            },
            {
                label: 'Toggle Floating Widget',
                click: () => {
                    const w = (0, widgetWindow_1.getWidgetWindow)();
                    if (w?.isVisible()) {
                        (0, widgetWindow_1.hideWidget)();
                    }
                    else {
                        (0, widgetWindow_1.showWidget)();
                    }
                },
            },
            {
                label: 'Open Freedom',
                click: () => {
                    const main = (0, mainWindow_1.getMainWindow)();
                    if (main) {
                        main.show();
                        main.focus();
                    }
                },
            },
            { type: 'separator' },
            {
                label: 'Quit Freedom',
                click: () => {
                    electron_1.app.isQuitting = true;
                    electron_1.app.quit();
                },
            },
        ]);
        tray?.setContextMenu(contextMenu);
    };
    updateMenu();
    return tray;
}
