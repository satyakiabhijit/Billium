import { ipcMain } from 'electron';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import { getDashboardStats } from '../../shared/services/reports';

export const registerReportsHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('reports:stats', async () => {
    return await getDashboardStats(db);
  });
};
