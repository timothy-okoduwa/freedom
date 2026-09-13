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
      preload: path.join(__dirname, '../preload.js'),
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
      sessionStore.setWidgetPosition({ x, y });
    }
  });

  widgetWindow.on('closed', () => {
    widgetWindow = null;
  });

  return widgetWindow;
}

export function showWidget() {
  widgetWindow?.showInactive(); // show without focusing
}

export function hideWidget() {
  widgetWindow?.hide();
}

export function toggleWidgetExpanded(expand?: boolean) {
  if (!widgetWindow) return;
  isExpanded = expand !== undefined ? expand : !isExpanded;

  if (isExpanded) {
    widgetWindow.setSize(280, 140);
  } else {
    widgetWindow.setSize(46, 94);
  }
}

export function getWidgetWindow(): BrowserWindow | null {
  return widgetWindow;
}
