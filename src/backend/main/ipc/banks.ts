import { ipcMain } from 'electron';
import * as banksService from '../../shared/services/banks';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Bank } from '../../shared/types/bank';

export const initBanksHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('banks:get-all', async (_event, filter) => {
    return banksService.getAllBanks(db, filter);
  });

  ipcMain.handle('banks:get-by-id', async (_event, id: number) => {
    return banksService.getBankById(db, id);
  });

  ipcMain.handle('banks:add', async (_event, data: Bank) => {
    return banksService.addBank(db, data);
  });

  ipcMain.handle('banks:update', async (_event, data: Bank) => {
    return banksService.updateBank(db, data);
  });

  ipcMain.handle('banks:delete', async (_event, id: number) => {
    return banksService.deleteBank(db, id);
  });
};
