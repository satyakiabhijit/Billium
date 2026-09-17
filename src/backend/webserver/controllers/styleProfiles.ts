import { type Express } from 'express';
import * as styleProfileService from '../../shared/services/styleProfiles';
import type { StyleProfile } from '../../shared/types/styleProfile';

export const initStyleProfilesController = (app: Express) => {
  app.get('/api/style-profiles', async (req, res) => {
    try {
      const db = (req as any).db;
      const result = await styleProfileService.getAllStyleProfiles(db);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.get('/api/style-profiles/:id', async (req, res) => {
    try {
      const db = (req as any).db;
      const result = await styleProfileService.getStyleProfileById(db, Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.post('/api/style-profiles', async (req, res) => {
    try {
      const db = (req as any).db;
      const data = req.body as StyleProfile;
      const result = await styleProfileService.addStyleProfile(db, data);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.put('/api/style-profiles/:id', async (req, res) => {
    try {
      const db = (req as any).db;
      const data = { ...req.body, id: Number(req.params.id) } as StyleProfile;
      const result = await styleProfileService.updateStyleProfile(db, data);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/style-profiles/:id', async (req, res) => {
    try {
      const db = (req as any).db;
      const result = await styleProfileService.deleteStyleProfile(db, Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });
};
