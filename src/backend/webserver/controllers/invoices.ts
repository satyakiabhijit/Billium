import { type Express, type Request, type Response } from 'express';
import { getDb } from './database';
import * as invoicesService from '../../shared/services/invoices';

export const initInvoicesController = (app: Express) => {
  app.get('/api/invoices', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    
    const filter = req.query.filter ? JSON.parse(req.query.filter as string) : undefined;
    const result = await invoicesService.getAllInvoices(db, filter);
    res.json(result);
  });

  app.get('/api/invoices/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    
    const result = await invoicesService.getInvoiceById(db, Number(req.params.id));
    res.json(result);
  });

  app.post('/api/invoices', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    
    const result = await invoicesService.addInvoice(db, req.body);
    res.json(result);
  });

  app.put('/api/invoices', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    res.json(await invoicesService.updateInvoice(db, req.body));
  });

  app.delete('/api/invoices/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, error: 'Database not initialized' });
    res.json(await invoicesService.deleteInvoice(db, Number(req.params.id)));
  });
};
