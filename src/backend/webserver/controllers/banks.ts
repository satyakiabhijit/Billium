import { type Express, type Request, type Response } from 'express';
import * as banksService from '../../shared/services/banks';
import { getDb } from './database';

export const initBanksController = (app: Express) => {
  app.get('/api/banks', async (_req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await banksService.getAllBanks(db);
    res.json(result);
  });

  app.get('/api/banks/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await banksService.getBankById(db, Number(req.params.id));
    res.json(result);
  });

  app.post('/api/banks', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await banksService.addBank(db, req.body);
    res.json(result);
  });

  app.put('/api/banks', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await banksService.updateBank(db, req.body);
    res.json(result);
  });

  app.delete('/api/banks/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await banksService.deleteBank(db, Number(req.params.id));
    res.json(result);
  });
};
