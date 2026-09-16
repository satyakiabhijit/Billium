import ExcelJS from 'exceljs';

import type { FilterData } from '../types/invoiceFilter';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';

export const exportToExcel = async (db: DatabaseAdapter, entityName: string, _filters?: FilterData[]): Promise<Buffer> => {
  if (!db) throw new Error('Database not initialized');

  const tables: Record<string, { table: string; where?: string }> = {
    clients: { table: 'clients' }, businesses: { table: 'businesses' },
    items: { table: 'items' }, banks: { table: 'banks' },
    categories: { table: 'categories' }, units: { table: 'units' },
    currencies: { table: 'currencies' }, invoices: { table: 'invoices', where: "invoiceType = 'invoice'" },
    quotes: { table: 'invoices', where: "invoiceType = 'quote'" }
  };
  const target = tables[entityName];
  if (!target) throw new Error('Unsupported export entity');

  const data = await db.all<Record<string, unknown>>(
    `SELECT * FROM ${target.table}${target.where ? ` WHERE ${target.where}` : ''} ORDER BY createdAt DESC`
  );

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(entityName);

  if (data.length > 0) {
    // Generate columns based on the keys of the first item
    const keys = Object.keys(data[0]);
    worksheet.columns = keys.map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 20
    }));

    // Add rows
    worksheet.addRows(data);
  } else {
    worksheet.columns = [{ header: 'No Data', key: 'nodata', width: 20 }];
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
