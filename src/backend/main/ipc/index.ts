import type { BrowserWindow } from 'electron';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import { initDBDialogsHandlers } from './dbDialogs';

import { initBanksHandlers } from './banks';
import { initBusinessesHandlers } from './businesses';
import { initClientsHandlers } from './clients';
import { initCategoriesHandlers } from './categories';
import { initUnitsHandlers } from './units';
import { initCurrenciesHandlers } from './currencies';
import { initItemsHandlers } from './items';
import { initSettingsHandlers } from './settings';

export const initIpcHandlers = (db: DatabaseAdapter, mainWindow: BrowserWindow) => {
  // Phase 2 Entities:
  initBanksHandlers(db);
  initBusinessesHandlers(db);
  initClientsHandlers(db);
  initCategoriesHandlers(db);
  initUnitsHandlers(db);
  initCurrenciesHandlers(db);
  initItemsHandlers(db);
  initSettingsHandlers(db);

  // Remaining phases:
  // initInvoicesHandlers(db);
  // initLayoutsHandlers(db);
  // initStyleProfilesHandlers(db);
  // initPresetsHandlers(db);
  // initImportExportHandlers(db, mainWindow);

  console.log('IPC handlers initialized');
};
