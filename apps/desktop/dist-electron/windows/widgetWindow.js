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
        width: 46,
        height: 94,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
        hasShadow: false,
        focusable: false, // Prevents stealing focus from the user's active apps!
        show: false,
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    widgetWindow.setAlwaysOnTop(true, 'floating');
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    widgetWindow.loadURL(`${rendererUrl}/widget`);
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
    widgetWindow?.showInactive(); // show without focusing
}
function hideWidget() {
    widgetWindow?.hide();
}
function toggleWidgetExpanded(expand) {
    if (!widgetWindow)
        return;
    isExpanded = expand !== undefined ? expand : !isExpanded;
    if (isExpanded) {
        widgetWindow.setSize(280, 140);
    }
    else {
        widgetWindow.setSize(46, 94);
    }
}
function getWidgetWindow() {
    return widgetWindow;
}
