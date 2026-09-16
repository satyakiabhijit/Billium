import { ipcMain } from 'electron';
import * as businessesService from '../../shared/services/businesses';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Business } from '../../shared/types/business';

export const initBusinessesHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('businesses:get-all', async (_event, filter) => {
    return businessesService.getAllBusinesses(db, filter);
  });

  ipcMain.handle('businesses:get-by-id', async (_event, id: number) => {
    return businessesService.getBusinessById(db, id);
  });

  ipcMain.handle('businesses:add', async (_event, data: Business) => {
    return businessesService.addBusiness(db, data);
  });

  ipcMain.handle('businesses:update', async (_event, data: Business) => {
    return businessesService.updateBusiness(db, data);
  });

  ipcMain.handle('businesses:delete', async (_event, id: number) => {
    return businessesService.deleteBusiness(db, id);
  });
};
