import { BrowserWindow, dialog, ipcMain } from 'electron';
import { openSqlLite, openPostgreSql, testPostgresConnection } from '../../shared/db/setup';
import { initDatabase } from '../database';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { PostgresConfig } from '../../shared/types/postgresConfig';
import { initIpcHandlers } from './index';

let currentDb: DatabaseAdapter | null = null;

export const initDBDialogsHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.handle('db:create-sqlite', async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Create New Database',
      defaultPath: 'billium.db',
      filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }]
    });

    if (result.canceled || !result.filePath) return { success: false };

    try {
      const { db } = await openSqlLite({ fullPath: result.filePath, createIfMissing: true });
      await initDatabase(db);
      currentDb = db;
      initIpcHandlers(db, mainWindow);
      return { success: true, path: result.filePath };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('db:open-sqlite', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Open Database',
      filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }],
      properties: ['openFile']
    });

    if (result.canceled || result.filePaths.length === 0) return { success: false };

    try {
      const { db } = await openSqlLite({ fullPath: result.filePaths[0], createIfMissing: false });
      await initDatabase(db);
      currentDb = db;
      initIpcHandlers(db, mainWindow);
      return { success: true, path: result.filePaths[0] };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('db:test-postgres', async (_event, config: PostgresConfig) => {
    try {
      await testPostgresConnection(config);
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('db:open-postgres', async (_event, config: PostgresConfig) => {
    try {
      const { db } = await openPostgreSql(config);
      await initDatabase(db);
      currentDb = db;
      initIpcHandlers(db, mainWindow);
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('db:close', async () => {
    if (currentDb) {
      await currentDb.close();
      currentDb = null;
    }
    return { success: true };
  });

  ipcMain.handle('get-app-version', () => {
    const { app } = require('electron');
    return app.getVersion();
  });

  ipcMain.handle('ping', () => 'pong');
};
