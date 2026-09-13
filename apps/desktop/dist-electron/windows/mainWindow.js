"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainWindow = createMainWindow;
exports.getMainWindow = getMainWindow;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const appIcon_1 = require("../utils/appIcon");
let mainWindow = null;
function createMainWindow(rendererUrl, isSessionActive) {
    const iconPath = (0, appIcon_1.getAppIconPath)();
    mainWindow = new electron_1.BrowserWindow({
        width: 1120,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        show: false,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#FFFFFF',
        ...(iconPath ? { icon: iconPath } : {}),
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.loadURL(`${rendererUrl}/dashboard`);
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });
    // Support OAuth popups (Firebase Auth Google / GitHub sign-in)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https://accounts.google.com') ||
            url.startsWith('https://github.com/login') ||
            url.includes('.firebaseapp.com/__/auth/') ||
            url.includes('google.com')) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    width: 520,
                    height: 680,
                    autoHideMenuBar: true,
                    webPreferences: {
                        nodeIntegration: false,
                        contextIsolation: true,
                    },
                },
            };
        }
        return { action: 'deny' };
    });
    // When user clicks close on main window:
    // If session is running, minimize to tray per §6.3 / FR-25.4
    mainWindow.on('close', (event) => {
        if (!electron_1.app.isQuitting && isSessionActive()) {
            event.preventDefault();
            mainWindow?.hide();
        }
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    return mainWindow;
}
function getMainWindow() {
    return mainWindow;
}
