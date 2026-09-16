import { app, powerMonitor } from 'electron';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { createMainWindow } from './windows/mainWindow';
import { createWidgetWindow } from './windows/widgetWindow';
import { createTrayMenu } from './windows/trayMenu';
import { getAppIconPath } from './utils/appIcon';
import {
  initSessionChannels,
  isSessionActive,
  isSessionPaused,
  getCurrentTaskTitle,
  toggleSessionPause,
  handleSystemSuspend,
  handleSystemResume,
} from './ipc/sessionChannels';
import { initInviteChannels } from './ipc/inviteChannels';


// Set app name and identifier for OS notifications & dock branding
app.setName('Freedom');
if (process.platform === 'win32') {
  app.setAppUserModelId('com.freedom.desktop');
}

// Declare custom property on app for clean shutdown
declare global {
  namespace Electron {
    interface App {
      isQuitting?: boolean;
    }
  }
}

const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

function startProductionServer(outDir: string): Promise<string> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        let reqUrl = req.url?.split('?')[0] || '/';
        let filePath = path.join(outDir, reqUrl);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html';
        }

        if (!fs.existsSync(filePath)) {
          if (fs.existsSync(path.join(outDir, '404.html'))) {
            filePath = path.join(outDir, '404.html');
          } else {
            filePath = path.join(outDir, 'index.html');
          }
        }

        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
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
        const stream = fs.createReadStream(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        stream.pipe(res);
      } catch (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    });

    const PORT = 3001;
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        server.listen(3002, '127.0.0.1', () => {
          resolve(`http://127.0.0.1:3002`);
        });
      } else {
        resolve(`http://127.0.0.1:${PORT}`);
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      resolve(`http://127.0.0.1:${PORT}`);
    });
  });
}

let rendererUrl = 'http://localhost:3001';

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    createMainWindow(rendererUrl, isSessionActive);
  });
}

app.whenReady().then(async () => {
  if (process.platform === 'darwin') {
    const iconPath = getAppIconPath();
    if (iconPath && app.dock) {
      app.dock.setIcon(iconPath);
    }
  }

  if (isDev) {
    rendererUrl = 'http://localhost:3001';
  } else {
    const outDir = path.join(__dirname, '../renderer/out');
    rendererUrl = await startProductionServer(outDir);
  }

  // Initialize IPC channels first
  initSessionChannels();
  initInviteChannels();


  // Create windows
  createMainWindow(rendererUrl, isSessionActive);
  createWidgetWindow(rendererUrl);

  // Create system Tray
  createTrayMenu();

  // System suspend / sleep hooks (§9.2)
  powerMonitor.on('suspend', () => {
    handleSystemSuspend();
  });

  powerMonitor.on('resume', () => {
    handleSystemResume();
  });

  app.on('activate', () => {
    createMainWindow(rendererUrl, isSessionActive);
  });
});

app.on('window-all-closed', () => {
  // On macOS keep app running in tray if session is active
  if (process.platform !== 'darwin' && !isSessionActive()) {
    app.quit();
  }
});

