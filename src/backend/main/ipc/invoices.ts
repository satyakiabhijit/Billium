import { ipcMain } from 'electron';
import * as invoicesService from '../../shared/services/invoices';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { InvoiceAdd } from '../../shared/types/invoice';

export const initInvoicesHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('invoices:get-all', async (_event, filter) => {
    return invoicesService.getAllInvoices(db, filter);
  });

  ipcMain.handle('invoices:get-by-id', async (_event, id: number) => {
    return invoicesService.getInvoiceById(db, id);
  });

  ipcMain.handle('invoices:add', async (_event, data: InvoiceAdd) => {
    return invoicesService.addInvoice(db, data);
  });
  ipcMain.handle('invoices:update', async (_event, data) => invoicesService.updateInvoice(db, data));
  ipcMain.handle('invoices:delete', async (_event, id: number) => invoicesService.deleteInvoice(db, id));
};
