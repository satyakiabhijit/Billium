import { type Express, type Request, type Response } from 'express';
import * as itemsService from '../../shared/services/items';
import { getDb } from './database';

export const initItemsController = (app: Express) => {
  app.get('/api/items', async (_req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await itemsService.getAllItems(db);
    res.json(result);
  });

  app.get('/api/items/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await itemsService.getItemById(db, Number(req.params.id));
    res.json(result);
  });

  app.post('/api/items', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await itemsService.addItem(db, req.body);
    res.json(result);
  });

  app.put('/api/items', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await itemsService.updateItem(db, req.body);
    res.json(result);
  });

  app.delete('/api/items/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await itemsService.deleteItem(db, Number(req.params.id));
    res.json(result);
  });
};
