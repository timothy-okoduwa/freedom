import { app, powerMonitor } from 'electron';
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
const RENDERER_URL = isDev ? 'http://localhost:3001' : 'http://localhost:3001'; // or custom file protocol in prod

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const iconPath = getAppIconPath();
    if (iconPath && app.dock) {
      app.dock.setIcon(iconPath);
    }
  }

  // Initialize IPC channels first
  initSessionChannels();

  // Create windows
  createMainWindow(RENDERER_URL, isSessionActive);
  createWidgetWindow(RENDERER_URL);

  // Create system Tray
  createTrayMenu(toggleSessionPause, isSessionPaused, getCurrentTaskTitle);

  // System suspend / sleep hooks (§9.2)
  powerMonitor.on('suspend', () => {
    handleSystemSuspend();
  });

  powerMonitor.on('resume', () => {
    handleSystemResume();
  });

  app.on('activate', () => {
    createMainWindow(RENDERER_URL, isSessionActive);
  });
});

app.on('window-all-closed', () => {
  // On macOS keep app running in tray if session is active
  if (process.platform !== 'darwin' && !isSessionActive()) {
    app.quit();
  }
});
