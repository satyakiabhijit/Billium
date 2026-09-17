import type { Express } from 'express';
import { getDashboardStats } from '../../shared/services/reports';

export const initReportsController = (app: Express) => {
  app.get('/api/reports/stats', async (req, res) => {
    try {
      const db = (req as any).db;
      const stats = await getDashboardStats(db);
      res.json(stats);
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });
};
