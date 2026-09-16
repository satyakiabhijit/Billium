import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import { exportToExcel } from '../../shared/services/export';
import type { FilterData } from '../../shared/types/invoiceFilter';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';

export const initExportHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('export:excel', async (_event, entityName: string, filters?: FilterData[]) => {
    if (!db) return { success: false, error: 'Database not initialized' };
    
    try {
      const buffer = await exportToExcel(db, entityName, filters);
      
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: `Export ${entityName} to Excel`,
        defaultPath: `${entityName}-export.xlsx`,
        filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }]
      });

      if (canceled || !filePath) {
        return { success: true, canceled: true };
      }

      fs.writeFileSync(filePath, buffer);
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });
};
