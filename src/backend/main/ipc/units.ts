import { ipcMain } from 'electron';
import * as unitsService from '../../shared/services/units';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { Unit } from '../../shared/types/unit';

export const initUnitsHandlers = (db: DatabaseAdapter) => {
  ipcMain.handle('units:get-all', async (_event, filter) => {
    return unitsService.getAllUnits(db, filter);
  });

  ipcMain.handle('units:add', async (_event, data: Unit) => {
    return unitsService.addUnit(db, data);
  });

  ipcMain.handle('units:update', async (_event, data: Unit) => {
    return unitsService.updateUnit(db, data);
  });

  ipcMain.handle('units:delete', async (_event, id: number) => {
    return unitsService.deleteUnit(db, id);
  });
};
