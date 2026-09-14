import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { sessionStore } from '../persistence/sessionStore';

let widgetWindow: BrowserWindow | null = null;
let isExpanded = false;

export function createWidgetWindow(rendererUrl: string): BrowserWindow {
  const savedPos = sessionStore.getWidgetPosition();
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenW, height: screenH } = primaryDisplay.workAreaSize;

  // Default position: top right corner with padding
  const initialX = savedPos?.x ?? screenW - 80;
  const initialY = savedPos?.y ?? 100;

  widgetWindow = new BrowserWindow({
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
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.platform === 'darwin') {
    widgetWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
    widgetWindow.setHiddenInMissionControl(true);
  } else {
    widgetWindow.setAlwaysOnTop(true, 'floating', 1);
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }

  widgetWindow.loadURL(`${rendererUrl}/widget`);

  widgetWindow.on('moved', () => {
    if (widgetWindow) {
      const [x, y] = widgetWindow.getPosition();
      sessionStore.setWidgetPosition({ x, y });
    }
  });

  widgetWindow.on('closed', () => {
    widgetWindow = null;
  });

  return widgetWindow;
}

export function showWidget() {
  if (!widgetWindow) return;
  if (process.platform === 'darwin') {
    widgetWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
    widgetWindow.setHiddenInMissionControl(true);
  } else {
    widgetWindow.setAlwaysOnTop(true, 'floating', 1);
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }
  widgetWindow.showInactive(); // show without focusing
  if (process.platform === 'darwin') {
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
    widgetWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  }
}

export function hideWidget() {
  widgetWindow?.hide();
}

export function toggleWidgetExpanded(expand?: boolean) {
  if (!widgetWindow) return;
  isExpanded = expand !== undefined ? expand : !isExpanded;

  if (isExpanded) {
    widgetWindow.setSize(340, 160);
  } else {
    widgetWindow.setSize(160, 52);
  }
}

export function getWidgetWindow(): BrowserWindow | null {
  return widgetWindow;
}
