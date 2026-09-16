import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { getMainWindow } from './mainWindow';
import { showWidget, hideWidget, getWidgetWindow } from './widgetWindow';

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

export function createTrayMenu(
  onTogglePause: () => void,
  isPaused: () => boolean,
  currentTaskTitle: () => string | null
): Tray {
  const icon = getTrayIcon();

  tray = new Tray(icon);
  tray.setToolTip('Freedom — Automatic Execution Engine');

  const updateMenu = () => {
    const task = currentTaskTitle();
    const paused = isPaused();

    const contextMenu = Menu.buildFromTemplate([
      {
        label: task ? `Active: ${task}` : 'Freedom: Ready',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: paused ? '▶ Resume Execution' : '⏸ Pause Execution',
        enabled: !!task,
        click: onTogglePause,
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
          if (main) {
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

    tray?.setContextMenu(contextMenu);
  };

  updateMenu();
  return tray;
}
