"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWidgetWindow = createWidgetWindow;
exports.showWidget = showWidget;
exports.hideWidget = hideWidget;
exports.toggleWidgetExpanded = toggleWidgetExpanded;
exports.getWidgetWindow = getWidgetWindow;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const sessionStore_1 = require("../persistence/sessionStore");
let widgetWindow = null;
let isExpanded = false;
function createWidgetWindow(rendererUrl) {
    const savedPos = sessionStore_1.sessionStore.getWidgetPosition();
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const { width: screenW, height: screenH } = primaryDisplay.workAreaSize;
    // Default position: top right corner with padding
    const initialX = savedPos?.x ?? screenW - 80;
    const initialY = savedPos?.y ?? 100;
    widgetWindow = new electron_1.BrowserWindow({
        x: initialX,
        y: initialY,
        width: 160,
        height: 52,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        alwaysOnTop: true,
        resizable: true,
        skipTaskbar: true,
        hasShadow: false,
        focusable: false, // Prevents stealing focus from the user's active apps!
        show: false,
        type: 'panel', // macOS floating panel type: floats across all spaces & full screen apps
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (process.platform === 'darwin') {
        widgetWindow.setAlwaysOnTop(true, 'screen-saver', 1);
        widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
        widgetWindow.setHiddenInMissionControl(true);
    }
    else {
        widgetWindow.setAlwaysOnTop(true, 'floating', 1);
        widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }
    widgetWindow.loadURL(`${rendererUrl}/widget`);
    widgetWindow.once('ready-to-show', () => {
        const activeItem = sessionStore_1.sessionStore.getActiveItem();
        if (activeItem) {
            showWidget();
        }
    });
    widgetWindow.on('moved', () => {
        if (widgetWindow) {
            const [x, y] = widgetWindow.getPosition();
            sessionStore_1.sessionStore.setWidgetPosition({ x, y });
        }
    });
    widgetWindow.on('closed', () => {
        widgetWindow = null;
    });
    return widgetWindow;
}
function showWidget() {
    if (!widgetWindow)
        return;
    if (process.platform === 'darwin') {
        widgetWindow.setAlwaysOnTop(true, 'screen-saver', 1);
        widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
        widgetWindow.setHiddenInMissionControl(true);
    }
    else {
        widgetWindow.setAlwaysOnTop(true, 'floating', 1);
        widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }
    widgetWindow.showInactive(); // show without focusing
    if (process.platform === 'darwin') {
        widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
        widgetWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    }
}
function hideWidget() {
    widgetWindow?.hide();
}
function toggleWidgetExpanded(expand) {
    if (!widgetWindow)
        return;
    isExpanded = expand !== undefined ? expand : !isExpanded;
    if (isExpanded) {
        widgetWindow.setSize(340, 160);
    }
    else {
        widgetWindow.setSize(160, 52);
    }
}
function getWidgetWindow() {
    return widgetWindow;
}
