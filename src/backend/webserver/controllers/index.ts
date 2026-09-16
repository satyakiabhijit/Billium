import { type Express } from 'express';

import { initBanksController } from './banks';
import { initBusinessesController } from './businesses';
import { initCategoriesController } from './categories';
import { initTaxesController } from './taxes';
import { initClientsController } from './clients';
import { initCurrenciesController } from './currencies';
import { initItemsController } from './items';
import { initUnitsController } from './units';
import { initSettingsController } from './settings';
import { initExportController } from './export';
import { initInvoicesController } from './invoices';
import { initQuotesController } from './quotes';

export const initControllers = (app: Express) => {
  // Phase 2 Entities:
  initBanksController(app);
  initBusinessesController(app);
  initCategoriesController(app);
  initTaxesController(app);
  initClientsController(app);
  initCurrenciesController(app);
  initItemsController(app);
  initUnitsController(app);
  initSettingsController(app);

  // Phase 3
  initExportController(app);
  initInvoicesController(app);
  initQuotesController(app);

  // Remaining phases:
  // initInvoicesController(app);
  // initLayoutsController(app);
  // initStyleProfilesController(app);
  // initPresetsController(app);
  // initImportExportController(app);
};
