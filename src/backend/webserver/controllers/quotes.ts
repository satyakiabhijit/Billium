import { type Express, type Request, type Response } from 'express';
import { getDb } from './database';
import * as quotesService from '../../shared/services/quotes';

export const initQuotesController = (app: Express) => {
  app.get('/api/quotes', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    
    const filter = req.query.filter ? JSON.parse(req.query.filter as string) : undefined;
    const result = await quotesService.getAllQuotes(db, filter);
    res.json(result);
  });

  app.get('/api/quotes/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    
    const result = await quotesService.getQuoteById(db, Number(req.params.id));
    res.json(result);
  });

  app.post('/api/quotes', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    
    const result = await quotesService.addQuote(db, req.body);
    res.json(result);
  });

  app.put('/api/quotes', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    res.json(await quotesService.updateQuote(db, req.body));
  });

  app.delete('/api/quotes/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    res.json(await quotesService.deleteQuote(db, Number(req.params.id)));
  });
};
