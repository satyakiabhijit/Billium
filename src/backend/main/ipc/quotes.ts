import { ipcMain } from 'electron';
import * as quotesService from '../../shared/services/quotes';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { QuoteAdd } from '../../shared/types/quote';

export const initQuotesHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('quotes:get-all', async (_event, filter) => {
    return quotesService.getAllQuotes(db, filter);
  });

  ipcMain.handle('quotes:get-by-id', async (_event, id: number) => {
    return quotesService.getQuoteById(db, id);
  });

  ipcMain.handle('quotes:add', async (_event, data: QuoteAdd) => {
    return quotesService.addQuote(db, data);
  });
  ipcMain.handle('quotes:update', async (_event, data) => quotesService.updateQuote(db, data));
  ipcMain.handle('quotes:delete', async (_event, id: number) => quotesService.deleteQuote(db, id));
};
