import { ipcMain } from 'electron';
import * as currenciesService from '../../shared/services/currencies';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Currency } from '../../shared/types/currency';

export const initCurrenciesHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('currencies:get-all', async (_event, filter) => {
    return currenciesService.getAllCurrencies(db, filter);
  });

  ipcMain.handle('currencies:add', async (_event, data: Currency) => {
    return currenciesService.addCurrency(db, data);
  });

  ipcMain.handle('currencies:update', async (_event, data: Currency) => {
    return currenciesService.updateCurrency(db, data);
  });

  ipcMain.handle('currencies:delete', async (_event, id: number) => {
    return currenciesService.deleteCurrency(db, id);
  });
};
