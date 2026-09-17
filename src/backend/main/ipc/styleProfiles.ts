import { ipcMain } from 'electron';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { FilterData } from '../../shared/types/invoiceFilter';
import type { StyleProfile } from '../../shared/types/styleProfile';
import * as styleProfileService from '../../shared/services/styleProfiles';
// Wait, I need to define STYLEPROFILES constants in constant.ts or just hardcode string here
// since I don't know if they are already in constant.ts.
// In the grep output earlier I saw:
// ipcRenderer.invoke('style-profiles:get-all', _filter)
// so the strings are 'style-profiles:get-all', 'style-profiles:get-by-id', 'style-profiles:add', 'style-profiles:update', 'style-profiles:delete'

export const registerStyleProfileHandlers = (db: DatabaseAdapter): void => {
  ipcMain.handle('style-profiles:get-all', async (_, filter?: FilterData[]) => {
    return styleProfileService.getAllStyleProfiles(db, filter);
  });

  ipcMain.handle('style-profiles:get-by-id', async (_, id: number) => {
    return styleProfileService.getStyleProfileById(db, id);
  });

  ipcMain.handle('style-profiles:add', async (_, data: StyleProfile) => {
    return styleProfileService.addStyleProfile(db, data);
  });

  ipcMain.handle('style-profiles:update', async (_, data: StyleProfile) => {
    return styleProfileService.updateStyleProfile(db, data);
  });

  ipcMain.handle('style-profiles:delete', async (_, id: number) => {
    return styleProfileService.deleteStyleProfile(db, id);
  });
};
