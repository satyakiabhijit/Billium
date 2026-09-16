import { type Express, type Request, type Response } from 'express';
import * as taxesService from '../../shared/services/taxes';
import { getDb } from './database';

export const initTaxesController = (app: Express) => {
  app.get('/api/taxes', async (_req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await taxesService.getAllTaxes(db);
    res.json(result);
  });

  app.post('/api/taxes', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await taxesService.addTax(db, req.body);
    res.json(result);
  });

  app.put('/api/taxes', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await taxesService.updateTax(db, req.body);
    res.json(result);
  });

  app.delete('/api/taxes/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await taxesService.deleteTax(db, Number(req.params.id));
    res.json(result);
  });
};
