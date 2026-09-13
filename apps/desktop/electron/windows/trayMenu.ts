import { Tray, Menu, nativeImage, app } from 'electron';
import { getMainWindow } from './mainWindow';
import { showWidget, hideWidget, getWidgetWindow } from './widgetWindow';

let tray: Tray | null = null;

export function createTrayMenu(
  onTogglePause: () => void,
  isPaused: () => boolean,
  currentTaskTitle: () => string | null
): Tray {
  // Create a clean default 16x16 icon for the tray
  const icon = nativeImage.createEmpty();

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
