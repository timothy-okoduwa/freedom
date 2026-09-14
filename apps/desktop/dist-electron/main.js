"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
function startProductionServer(outDir) {
    return new Promise((resolve) => {
        const server = http_1.default.createServer((req, res) => {
            try {
                let reqUrl = req.url?.split('?')[0] || '/';
                let filePath = path_1.default.join(outDir, reqUrl);
                if (fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isDirectory()) {
                    filePath = path_1.default.join(filePath, 'index.html');
                }
                if (!fs_1.default.existsSync(filePath) && fs_1.default.existsSync(filePath + '.html')) {
                    filePath = filePath + '.html';
                }
                if (!fs_1.default.existsSync(filePath)) {
                    if (fs_1.default.existsSync(path_1.default.join(outDir, '404.html'))) {
                        filePath = path_1.default.join(outDir, '404.html');
                    }
                    else {
                        filePath = path_1.default.join(outDir, 'index.html');
                    }
                }
                const ext = path_1.default.extname(filePath).toLowerCase();
                const mimeTypes = {
                    '.html': 'text/html; charset=utf-8',
                    '.js': 'text/javascript; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.json': 'application/json; charset=utf-8',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml',
                    '.ico': 'image/x-icon',
                    '.woff': 'font/woff',
                    '.woff2': 'font/woff2',
                    '.ttf': 'font/ttf',
                    '.mp3': 'audio/mpeg',
                    '.wav': 'audio/wav',
                    '.txt': 'text/plain; charset=utf-8',
                };
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                const stream = fs_1.default.createReadStream(filePath);
                res.writeHead(200, { 'Content-Type': contentType });
                stream.pipe(res);
            }
            catch (err) {
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
        const PORT = 3001;
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                server.listen(3002, '127.0.0.1', () => {
                    resolve(`http://127.0.0.1:3002`);
                });
            }
            else {
                resolve(`http://127.0.0.1:${PORT}`);
            }
        });
        server.listen(PORT, '127.0.0.1', () => {
            resolve(`http://127.0.0.1:${PORT}`);
        });
    });
}
let rendererUrl = 'http://localhost:3001';
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', () => {
        (0, mainWindow_1.createMainWindow)(rendererUrl, sessionChannels_1.isSessionActive);
    });
}
electron_1.app.whenReady().then(async () => {
    if (process.platform === 'darwin') {
        const iconPath = (0, appIcon_1.getAppIconPath)();
        if (iconPath && electron_1.app.dock) {
            electron_1.app.dock.setIcon(iconPath);
        }
    }
    if (isDev) {
        rendererUrl = 'http://localhost:3001';
    }
    else {
        const outDir = path_1.default.join(__dirname, '../renderer/out');
        rendererUrl = await startProductionServer(outDir);
    }
    // Initialize IPC channels first
    (0, sessionChannels_1.initSessionChannels)();
    // Create windows
    (0, mainWindow_1.createMainWindow)(rendererUrl, sessionChannels_1.isSessionActive);
    (0, widgetWindow_1.createWidgetWindow)(rendererUrl);
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
        (0, mainWindow_1.createMainWindow)(rendererUrl, sessionChannels_1.isSessionActive);
    });
});
electron_1.app.on('window-all-closed', () => {
    // On macOS keep app running in tray if session is active
    if (process.platform !== 'darwin' && !(0, sessionChannels_1.isSessionActive)()) {
        electron_1.app.quit();
    }
});
