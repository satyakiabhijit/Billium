import { config } from 'dotenv';
import { app, BrowserWindow } from 'electron';
import { join, resolve } from 'path';
import { APP_CONFIG } from './config';
import { initDBDialogsHandlers } from './ipc/dbDialogs';

config();

const isDev = !app.isPackaged;
const devServer = APP_CONFIG.FE_SERVER_URL;
const mainAssetsPath = isDev
  ? join(resolve(), 'public')
  : join(app.getAppPath(), 'dist-fe');
const preloadPath = isDev
  ? join(resolve(), 'dist-be/preload/preload.cjs')
  : join(app.getAppPath(), 'dist-be/preload/preload.cjs');
const indexHtmlPath = isDev ? devServer : join(app.getAppPath(), 'dist-fe/index.html');

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: join(mainAssetsPath, 'billium logo ico.ico'),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  // Register IPC handlers for database dialogs
  initDBDialogsHandlers(mainWindow);

  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    const levelName = ['verbose', 'info', 'warning', 'error'][level] ?? String(level);
    console[level === 3 ? 'error' : 'log'](`[renderer:${levelName}] ${sourceId}:${line} ${message}`);
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`Renderer failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
  });

  if (isDev) {
    mainWindow.loadURL(indexHtmlPath);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(indexHtmlPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
