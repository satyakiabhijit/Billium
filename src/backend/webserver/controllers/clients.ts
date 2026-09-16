import { type Express, type Request, type Response } from 'express';
import * as clientsService from '../../shared/services/clients';
import { getDb } from './database';

export const initClientsController = (app: Express) => {
  app.get('/api/clients', async (_req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await clientsService.getAllClients(db);
    res.json(result);
  });

  app.get('/api/clients/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await clientsService.getClientById(db, Number(req.params.id));
    res.json(result);
  });

  app.post('/api/clients', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await clientsService.addClient(db, req.body);
    res.json(result);
  });

  app.put('/api/clients', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await clientsService.updateClient(db, req.body);
    res.json(result);
  });

  app.delete('/api/clients/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await clientsService.deleteClient(db, Number(req.params.id));
    res.json(result);
  });
};
