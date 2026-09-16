import { ipcMain } from 'electron';
import * as taxesService from '../../shared/services/taxes';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Tax } from '../../shared/types/tax';

export const initTaxesHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('taxes:get-all', async (_event, filter) => {
    return taxesService.getAllTaxes(db, filter);
  });

  ipcMain.handle('taxes:add', async (_event, data: Tax) => {
    return taxesService.addTax(db, data);
  });

  ipcMain.handle('taxes:update', async (_event, data: Tax) => {
    return taxesService.updateTax(db, data);
  });

  ipcMain.handle('taxes:delete', async (_event, id: number) => {
    return taxesService.deleteTax(db, id);
  });
};
