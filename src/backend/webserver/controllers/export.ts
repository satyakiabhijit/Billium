import { type Express, type Request, type Response } from 'express';
import { getDb } from './database';
import { exportToExcel } from '../../shared/services/export';
import type { FilterData } from '../../shared/types/invoiceFilter';

export const initExportController = (app: Express) => {
  app.get('/api/export/excel/:entity', async (req: Request, res: Response) => {
    const db = getDb();
    if (!db) {
      res.status(500).json({ success: false, error: 'Database not initialized' });
      return;
    }

    try {
      const entity = Array.isArray(req.params.entity) ? req.params.entity[0] : req.params.entity;
      const filtersParam = req.query.filter as string;
      const filters: FilterData[] | undefined = filtersParam ? JSON.parse(filtersParam) : undefined;
      
      const buffer = await exportToExcel(db, entity, filters);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${entity}-export.xlsx"`);
      res.send(buffer);
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });
};
