import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { getMainWindow } from './mainWindow';
import { showWidget, hideWidget, getWidgetWindow } from './widgetWindow';
import { isSessionPaused, getCurrentTaskTitle, toggleSessionPause } from '../ipc/sessionChannels';

let tray: Tray | null = null;

function getTrayIcon(): Electron.NativeImage {
  const possiblePaths = [
    path.join(__dirname, '../../assets/trayTemplate.png'),
    path.join(__dirname, '../assets/trayTemplate.png'),
    path.join(__dirname, '../../public/trayTemplate.png'),
    path.join(__dirname, '../public/trayTemplate.png'),
    path.join(app.getAppPath(), 'assets/trayTemplate.png'),
    path.join(app.getAppPath(), 'public/trayTemplate.png'),
    path.join(process.resourcesPath, 'assets/trayTemplate.png'),
    path.join(process.resourcesPath, 'app.asar/assets/trayTemplate.png'),
    path.join(process.resourcesPath, 'app.asar/public/trayTemplate.png'),
    path.join(process.cwd(), 'assets/trayTemplate.png'),
    path.join(process.cwd(), 'apps/desktop/assets/trayTemplate.png'),
    path.join(process.cwd(), 'apps/desktop/public/trayTemplate.png'),
  ];

  for (const iconPath of possiblePaths) {
    if (fs.existsSync(iconPath)) {
      const img = nativeImage.createFromPath(iconPath);
      if (!img.isEmpty()) {
        if (process.platform === 'darwin') {
          img.setTemplateImage(true);
        }
        return img;
      }
    }
  }

  return nativeImage.createEmpty();
}

export function updateTrayMenu() {
  if (!tray) return;

  const task = getCurrentTaskTitle();
  const paused = isSessionPaused();

  let headerLabel = 'Freedom: Ready';
  if (task) {
    headerLabel = paused ? `Freedom: Paused — ${task}` : `Freedom: Executing — ${task}`;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: headerLabel,
      enabled: false,
    },
    { type: 'separator' },
    {
      label: paused ? '▶ Resume Execution' : '⏸ Pause Execution',
      enabled: !!task,
      click: () => {
        toggleSessionPause();
      },
    },
    {
      label: 'Toggle Floating Widget',
      click: () => {
        const w = getWidgetWindow();
        if (w?.isVisible()) {
          hideWidget();
        } else {
          showWidget();
        }
      },
    },
    {
      label: 'Open Freedom',
      click: () => {
        const main = getMainWindow();
        if (main && !main.isDestroyed()) {
          if (main.isMinimized()) main.restore();
          main.show();
          main.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Freedom',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

export function createTrayMenu(): Tray {
  const icon = getTrayIcon();

  tray = new Tray(icon);
  tray.setToolTip('Freedom — Automatic Execution Engine');

  updateTrayMenu();
  return tray;
}

