import { type Express, type Request, type Response } from 'express';
import * as currenciesService from '../../shared/services/currencies';
import { getDb } from './database';

export const initCurrenciesController = (app: Express) => {
  app.get('/api/currencies', async (_req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await currenciesService.getAllCurrencies(db);
    res.json(result);
  });

  app.post('/api/currencies', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await currenciesService.addCurrency(db, req.body);
    res.json(result);
  });

  app.put('/api/currencies', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await currenciesService.updateCurrency(db, req.body);
    res.json(result);
  });

  app.delete('/api/currencies/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await currenciesService.deleteCurrency(db, Number(req.params.id));
    res.json(result);
  });
};
