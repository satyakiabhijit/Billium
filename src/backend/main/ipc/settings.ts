import { ipcMain } from 'electron';
import * as settingsService from '../../shared/services/settings';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Settings } from '../../shared/types/settings';

export const initSettingsHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('settings:get', async () => {
    return settingsService.getSettings(db);
  });

  ipcMain.handle('settings:update', async (_event, data: Settings) => {
    return settingsService.updateSettings(db, data);
  });
};
