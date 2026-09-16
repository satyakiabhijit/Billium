import { type Express } from 'express';

import { initBanksController } from './banks';
import { initBusinessesController } from './businesses';
import { initCategoriesController } from './categories';
import { initClientsController } from './clients';
import { initCurrenciesController } from './currencies';
import { initItemsController } from './items';
import { initUnitsController } from './units';
import { initSettingsController } from './settings';

export const initControllers = (app: Express) => {
  // Phase 2 Entities:
  initBanksController(app);
  initBusinessesController(app);
  initCategoriesController(app);
  initClientsController(app);
  initCurrenciesController(app);
  initItemsController(app);
  initUnitsController(app);
  initSettingsController(app);

  // Remaining phases:
  // initInvoicesController(app);
  // initLayoutsController(app);
  // initStyleProfilesController(app);
  // initPresetsController(app);
  // initImportExportController(app);
};
