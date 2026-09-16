import { ipcMain } from 'electron';
import * as categoriesService from '../../shared/services/categories';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Category } from '../../shared/types/category';

export const initCategoriesHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('categories:get-all', async (_event, filter) => {
    return categoriesService.getAllCategories(db, filter);
  });

  ipcMain.handle('categories:add', async (_event, data: Category) => {
    return categoriesService.addCategory(db, data);
  });

  ipcMain.handle('categories:update', async (_event, data: Category) => {
    return categoriesService.updateCategory(db, data);
  });

  ipcMain.handle('categories:delete', async (_event, id: number) => {
    return categoriesService.deleteCategory(db, id);
  });
};
