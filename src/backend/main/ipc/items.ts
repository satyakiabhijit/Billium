import { ipcMain } from 'electron';
import * as itemsService from '../../shared/services/items';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Item } from '../../shared/types/item';

export const initItemsHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('items:get-all', async (_event, filter) => {
    return itemsService.getAllItems(db, filter);
  });

  ipcMain.handle('items:get-by-id', async (_event, id: number) => {
    return itemsService.getItemById(db, id);
  });

  ipcMain.handle('items:add', async (_event, data: Item) => {
    return itemsService.addItem(db, data);
  });

  ipcMain.handle('items:update', async (_event, data: Item) => {
    return itemsService.updateItem(db, data);
  });

  ipcMain.handle('items:delete', async (_event, id: number) => {
    return itemsService.deleteItem(db, id);
  });
};
