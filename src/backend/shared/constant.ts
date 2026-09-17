export const IPC_CHANNELS = {
  // Database
  DB_OPEN_SQLITE: 'db:open-sqlite',
  DB_CREATE_SQLITE: 'db:create-sqlite',
  DB_OPEN_POSTGRES: 'db:open-postgres',
  DB_TEST_POSTGRES: 'db:test-postgres',
  DB_CLOSE: 'db:close',
  DB_LIST_DATABASES: 'db:list-databases',

  // Banks
  BANKS_GET_ALL: 'banks:get-all',
  BANKS_GET_BY_ID: 'banks:get-by-id',
  BANKS_ADD: 'banks:add',
  BANKS_UPDATE: 'banks:update',
  BANKS_DELETE: 'banks:delete',

  // Businesses
  BUSINESSES_GET_ALL: 'businesses:get-all',
  BUSINESSES_GET_BY_ID: 'businesses:get-by-id',
  BUSINESSES_ADD: 'businesses:add',
  BUSINESSES_UPDATE: 'businesses:update',
  BUSINESSES_DELETE: 'businesses:delete',

  // Clients
  CLIENTS_GET_ALL: 'clients:get-all',
  CLIENTS_GET_BY_ID: 'clients:get-by-id',
  CLIENTS_ADD: 'clients:add',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',

  // Items
  ITEMS_GET_ALL: 'items:get-all',
  ITEMS_GET_BY_ID: 'items:get-by-id',
  ITEMS_ADD: 'items:add',
  ITEMS_UPDATE: 'items:update',
  ITEMS_DELETE: 'items:delete',

  // Categories
  CATEGORIES_GET_ALL: 'categories:get-all',
  CATEGORIES_ADD: 'categories:add',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',

  // Units
  UNITS_GET_ALL: 'units:get-all',
  UNITS_ADD: 'units:add',
  UNITS_UPDATE: 'units:update',
  UNITS_DELETE: 'units:delete',

  // Currencies
  CURRENCIES_GET_ALL: 'currencies:get-all',
  CURRENCIES_ADD: 'currencies:add',
  CURRENCIES_UPDATE: 'currencies:update',
  CURRENCIES_DELETE: 'currencies:delete',

  // Invoices
  INVOICES_GET_ALL: 'invoices:get-all',
  INVOICES_GET_BY_ID: 'invoices:get-by-id',
  INVOICES_ADD: 'invoices:add',
  INVOICES_UPDATE: 'invoices:update',
  INVOICES_DELETE: 'invoices:delete',
  INVOICES_NEXT_SEQUENCE: 'invoices:next-sequence',

  // Settings
  SETTINGS_GET: 'settings:get',
  SETTINGS_UPDATE: 'settings:update',


  // Style Profiles
  STYLE_PROFILES_GET_ALL: 'style-profiles:get-all',
  STYLE_PROFILES_GET_BY_ID: 'style-profiles:get-by-id',
  STYLE_PROFILES_ADD: 'style-profiles:add',
  STYLE_PROFILES_UPDATE: 'style-profiles:update',
  STYLE_PROFILES_DELETE: 'style-profiles:delete',


  // Import/Export
  IMPORT_EXPORT_JSON: 'import-export:json',
  IMPORT_EXPORT_XLSX: 'import-export:xlsx',
  IMPORT_EXPORT_BACKUP: 'import-export:backup',
  IMPORT_EXPORT_RESTORE: 'import-export:restore',

  // App
  APP_GET_VERSION: 'app:get-version',
  APP_OPEN_EXTERNAL: 'app:open-external',
  APP_CHECK_UPDATE: 'app:check-update',

  // Receipt
  RECEIPT_PRINT: 'receipt:print'
} as const;
