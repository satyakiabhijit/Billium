import { ipcMain } from 'electron';
import * as clientsService from '../../shared/services/clients';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Client } from '../../shared/types/client';

export const initClientsHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('clients:get-all', async (_event, filter) => {
    return clientsService.getAllClients(db, filter);
  });

  ipcMain.handle('clients:get-by-id', async (_event, id: number) => {
    return clientsService.getClientById(db, id);
  });

  ipcMain.handle('clients:add', async (_event, data: Client) => {
    return clientsService.addClient(db, data);
  });

  ipcMain.handle('clients:update', async (_event, data: Client) => {
    return clientsService.updateClient(db, data);
  });

  ipcMain.handle('clients:delete', async (_event, id: number) => {
    return clientsService.deleteClient(db, id);
  });
};
