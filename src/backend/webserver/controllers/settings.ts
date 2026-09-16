import { type Express, type Request, type Response } from 'express';
import * as settingsService from '../../shared/services/settings';
import { getDb } from './database';

export const initSettingsController = (app: Express) => {
  app.get('/api/settings', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await settingsService.getSettings(db);
    res.json(result);
  });

  app.put('/api/settings', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) return res.json({ success: false, error: 'error.databaseNotConnected' });
    const result = await settingsService.updateSettings(db, req.body);
    res.json(result);
  });
};
