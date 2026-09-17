import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';

import { initBanksHandlers } from './banks';
import { initBusinessesHandlers } from './businesses';
import { initClientsHandlers } from './clients';
import { initCategoriesHandlers } from './categories';
import { initTaxesHandlers } from './taxes';
import { initUnitsHandlers } from './units';
import { initCurrenciesHandlers } from './currencies';
import { initItemsHandlers } from './items';
import { initSettingsHandlers } from './settings';
import { initExportHandlers } from './export';
import { initInvoicesHandlers } from './invoices';
import { initQuotesHandlers } from './quotes';
import { registerStyleProfileHandlers } from './styleProfiles';
import { registerReportsHandlers } from './reports';

// All channels registered by initIpcHandlers — must be removed before re-registering
// to prevent "Attempted to register a second handler" errors on DB re-open / HMR reload.
const ALL_CHANNELS = [
  // Banks
  'banks:get-all', 'banks:get-by-id', 'banks:add', 'banks:update', 'banks:delete',
  // Businesses
  'businesses:get-all', 'businesses:get-by-id', 'businesses:add', 'businesses:update', 'businesses:delete',
  // Clients
  'clients:get-all', 'clients:get-by-id', 'clients:add', 'clients:update', 'clients:delete',
  // Categories
  'categories:get-all', 'categories:add', 'categories:update', 'categories:delete',
  // Taxes
  'taxes:get-all', 'taxes:add', 'taxes:update', 'taxes:delete',
  // Units
  'units:get-all', 'units:add', 'units:update', 'units:delete',
  // Currencies
  'currencies:get-all', 'currencies:add', 'currencies:update', 'currencies:delete',
  // Items
  'items:get-all', 'items:get-by-id', 'items:add', 'items:update', 'items:delete',
  // Settings
  'settings:get', 'settings:update',
  // Export
  'export:excel',
  // Invoices
  'invoices:get-all', 'invoices:get-by-id', 'invoices:add', 'invoices:update', 'invoices:delete', 'invoices:next-sequence',
  // Quotes
  'quotes:get-all', 'quotes:get-by-id', 'quotes:add', 'quotes:update', 'quotes:delete',
  // Style Profiles
  'style-profiles:get-all', 'style-profiles:get-by-id', 'style-profiles:add', 'style-profiles:update', 'style-profiles:delete',
  // Reports
  'reports:stats',
];

export const initIpcHandlers = (db: DatabaseAdapter, _mainWindow: BrowserWindow) => {
  // Remove any existing handlers first to allow safe re-registration
  // (triggered on DB re-open or Electron HMR rebuild)
  for (const channel of ALL_CHANNELS) {
    ipcMain.removeHandler(channel);
  }

  // Phase 2 Entities:
  initBanksHandlers(db);
  initBusinessesHandlers(db);
  initClientsHandlers(db);
  initCategoriesHandlers(db);
  initTaxesHandlers(db);
  initUnitsHandlers(db);
  initCurrenciesHandlers(db);
  initItemsHandlers(db);
  initSettingsHandlers(db);
  registerStyleProfileHandlers(db);

  // Phase 3 & 4
  initExportHandlers(db);
  initInvoicesHandlers(db);
  initQuotesHandlers(db);
  registerReportsHandlers(db);

  console.log('IPC handlers initialized');
};
