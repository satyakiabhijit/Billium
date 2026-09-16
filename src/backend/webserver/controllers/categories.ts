import { type Express, type Request, type Response } from 'express';
import * as categoriesService from '../../shared/services/categories';
import { getDb } from './database';

export const initCategoriesController = (app: Express) => {
  app.get('/api/categories', async (_req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await categoriesService.getAllCategories(db);
    res.json(result);
  });

  app.post('/api/categories', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await categoriesService.addCategory(db, req.body);
    res.json(result);
  });

  app.put('/api/categories', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await categoriesService.updateCategory(db, req.body);
    res.json(result);
  });

  app.delete('/api/categories/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await categoriesService.deleteCategory(db, Number(req.params.id));
    res.json(result);
  });
};
