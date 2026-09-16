"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrayMenu = updateTrayMenu;
exports.createTrayMenu = createTrayMenu;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mainWindow_1 = require("./mainWindow");
const widgetWindow_1 = require("./widgetWindow");
const sessionChannels_1 = require("../ipc/sessionChannels");
let tray = null;
function getTrayIcon() {
    const possiblePaths = [
        path_1.default.join(__dirname, '../../assets/trayTemplate.png'),
        path_1.default.join(__dirname, '../assets/trayTemplate.png'),
        path_1.default.join(__dirname, '../../public/trayTemplate.png'),
        path_1.default.join(__dirname, '../public/trayTemplate.png'),
        path_1.default.join(electron_1.app.getAppPath(), 'assets/trayTemplate.png'),
        path_1.default.join(electron_1.app.getAppPath(), 'public/trayTemplate.png'),
        path_1.default.join(process.resourcesPath, 'assets/trayTemplate.png'),
        path_1.default.join(process.resourcesPath, 'app.asar/assets/trayTemplate.png'),
        path_1.default.join(process.resourcesPath, 'app.asar/public/trayTemplate.png'),
        path_1.default.join(process.cwd(), 'assets/trayTemplate.png'),
        path_1.default.join(process.cwd(), 'apps/desktop/assets/trayTemplate.png'),
        path_1.default.join(process.cwd(), 'apps/desktop/public/trayTemplate.png'),
    ];
    for (const iconPath of possiblePaths) {
        if (fs_1.default.existsSync(iconPath)) {
            const img = electron_1.nativeImage.createFromPath(iconPath);
            if (!img.isEmpty()) {
                if (process.platform === 'darwin') {
                    img.setTemplateImage(true);
                }
                return img;
            }
        }
    }
    return electron_1.nativeImage.createEmpty();
}
function updateTrayMenu() {
    if (!tray)
        return;
    const task = (0, sessionChannels_1.getCurrentTaskTitle)();
    const paused = (0, sessionChannels_1.isSessionPaused)();
    let headerLabel = 'Freedom: Ready';
    if (task) {
        headerLabel = paused ? `Freedom: Paused — ${task}` : `Freedom: Executing — ${task}`;
    }
    const contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: headerLabel,
            enabled: false,
        },
        { type: 'separator' },
        {
            label: paused ? '▶ Resume Execution' : '⏸ Pause Execution',
            enabled: !!task,
            click: () => {
                (0, sessionChannels_1.toggleSessionPause)();
            },
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
                if (main && !main.isDestroyed()) {
                    if (main.isMinimized())
                        main.restore();
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
    tray.setContextMenu(contextMenu);
}
function createTrayMenu() {
    const icon = getTrayIcon();
    tray = new electron_1.Tray(icon);
    tray.setToolTip('Freedom — Automatic Execution Engine');
    updateTrayMenu();
    return tray;
}
