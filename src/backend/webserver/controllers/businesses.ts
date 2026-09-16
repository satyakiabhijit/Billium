import { type Express, type Request, type Response } from 'express';
import * as businessesService from '../../shared/services/businesses';
import { getDb } from './database';

export const initBusinessesController = (app: Express) => {
  app.get('/api/businesses', async (_req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await businessesService.getAllBusinesses(db);
    res.json(result);
  });

  app.get('/api/businesses/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await businessesService.getBusinessById(db, Number(req.params.id));
    res.json(result);
  });

  app.post('/api/businesses', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await businessesService.addBusiness(db, req.body);
    res.json(result);
  });

  app.put('/api/businesses', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await businessesService.updateBusiness(db, req.body);
    res.json(result);
  });

  app.delete('/api/businesses/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await businessesService.deleteBusiness(db, Number(req.params.id));
    res.json(result);
  });
};
