import { type Express, type Request, type Response } from 'express';
import * as unitsService from '../../shared/services/units';
import { getDb } from './database';

export const initUnitsController = (app: Express) => {
  app.get('/api/units', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await unitsService.getAllUnits(db);
    res.json(result);
  });

  app.post('/api/units', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await unitsService.addUnit(db, req.body);
    res.json(result);
  });

  app.put('/api/units', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await unitsService.updateUnit(db, req.body);
    res.json(result);
  });

  app.delete('/api/units/:id', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await unitsService.deleteUnit(db, Number(req.params.id));
    res.json(result);
  });
};
