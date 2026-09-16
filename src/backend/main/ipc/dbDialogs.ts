import { BrowserWindow, dialog, ipcMain } from 'electron';
import { openSqlLite, openPostgreSql, testPostgresConnection } from '../../shared/db/setup';
import { initDatabase } from '../database';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { PostgresConfig } from '../../shared/types/postgresConfig';
import { initIpcHandlers } from './index';

let currentDb: DatabaseAdapter | null = null;

export const initDBDialogsHandlers = (mainWindow: BrowserWindow) => {
  // Remove any stale handlers before re-registering (safety for HMR rebuilds)
  const dbChannels = ['db:create-sqlite', 'db:open-sqlite', 'db:test-postgres', 'db:open-postgres', 'db:close', 'get-app-version', 'ping'];
  for (const ch of dbChannels) ipcMain.removeHandler(ch);

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

  ipcMain.handle('db:open-sqlite', async (_event, filePath?: string) => {
    let targetPath = filePath;

    if (!targetPath) {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Open Database',
        filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }],
        properties: ['openFile']
      });

      if (result.canceled || result.filePaths.length === 0) return { success: false };
      targetPath = result.filePaths[0];
    }

    try {
      const { db } = await openSqlLite({ fullPath: targetPath, createIfMissing: false });
      await initDatabase(db);
      currentDb = db;
      initIpcHandlers(db, mainWindow);
      return { success: true, path: targetPath };
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
