import { BrowserWindow, app } from 'electron';
import path from 'path';
import { getAppIconPath } from '../utils/appIcon';

let mainWindow: BrowserWindow | null = null;

export function createMainWindow(rendererUrl: string, isSessionActive: () => boolean): BrowserWindow {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    return mainWindow;
  }

  const iconPath = getAppIconPath();
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#FFFFFF',
    ...(iconPath ? { icon: iconPath } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
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
    if (
      url.startsWith('https://accounts.google.com') ||
      url.startsWith('https://github.com/login') ||
      url.includes('.firebaseapp.com/__/auth/') ||
      url.includes('google.com')
    ) {
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
    if (!app.isQuitting && isSessionActive()) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}
