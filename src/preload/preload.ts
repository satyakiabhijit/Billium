import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => console.log('pong'),

  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Database operations
  createSqliteDb: () => ipcRenderer.invoke('db:create-sqlite'),
  openSqliteDb: (name?: string) => ipcRenderer.invoke('db:open-sqlite', name),
  testPostgresConnection: (config: unknown) => ipcRenderer.invoke('db:test-postgres', config),
  openPostgresDb: (config: unknown) => ipcRenderer.invoke('db:open-postgres', config),
  closeDb: () => ipcRenderer.invoke('db:close'),

  // Banks — Phase 2
  getBanks: (_filter?: unknown) => ipcRenderer.invoke('banks:get-all', _filter),
  getBankById: (id: number) => ipcRenderer.invoke('banks:get-by-id', id),
  addBank: (data: unknown) => ipcRenderer.invoke('banks:add', data),
  updateBank: (data: unknown) => ipcRenderer.invoke('banks:update', data),
  deleteBank: (id: number) => ipcRenderer.invoke('banks:delete', id),

  // Businesses — Phase 2
  getBusinesses: (_filter?: unknown) => ipcRenderer.invoke('businesses:get-all', _filter),
  getBusinessById: (id: number) => ipcRenderer.invoke('businesses:get-by-id', id),
  addBusiness: (data: unknown) => ipcRenderer.invoke('businesses:add', data),
  updateBusiness: (data: unknown) => ipcRenderer.invoke('businesses:update', data),
  deleteBusiness: (id: number) => ipcRenderer.invoke('businesses:delete', id),

  // Clients — Phase 2
  getClients: (_filter?: unknown) => ipcRenderer.invoke('clients:get-all', _filter),
  getClientById: (id: number) => ipcRenderer.invoke('clients:get-by-id', id),
  addClient: (data: unknown) => ipcRenderer.invoke('clients:add', data),
  updateClient: (data: unknown) => ipcRenderer.invoke('clients:update', data),
  deleteClient: (id: number) => ipcRenderer.invoke('clients:delete', id),

  // Categories — Phase 2
  getCategories: (_filter?: unknown) => ipcRenderer.invoke('categories:get-all', _filter),
  addCategory: (data: unknown) => ipcRenderer.invoke('categories:add', data),
  updateCategory: (data: unknown) => ipcRenderer.invoke('categories:update', data),
  deleteCategory: (id: number) => ipcRenderer.invoke('categories:delete', id),

  // Taxes
  getTaxes: (_filter?: unknown) => ipcRenderer.invoke('taxes:get-all', _filter),
  addTax: (data: unknown) => ipcRenderer.invoke('taxes:add', data),
  updateTax: (data: unknown) => ipcRenderer.invoke('taxes:update', data),
  deleteTax: (id: number) => ipcRenderer.invoke('taxes:delete', id),

  // Units — Phase 2
  getUnits: (_filter?: unknown) => ipcRenderer.invoke('units:get-all', _filter),
  addUnit: (data: unknown) => ipcRenderer.invoke('units:add', data),
  updateUnit: (data: unknown) => ipcRenderer.invoke('units:update', data),
  deleteUnit: (id: number) => ipcRenderer.invoke('units:delete', id),

  // Currencies — Phase 2
  getCurrencies: (_filter?: unknown) => ipcRenderer.invoke('currencies:get-all', _filter),
  addCurrency: (data: unknown) => ipcRenderer.invoke('currencies:add', data),
  updateCurrency: (data: unknown) => ipcRenderer.invoke('currencies:update', data),
  deleteCurrency: (id: number) => ipcRenderer.invoke('currencies:delete', id),

  // Items — Phase 2
  getItems: (_filter?: unknown) => ipcRenderer.invoke('items:get-all', _filter),
  getItemById: (id: number) => ipcRenderer.invoke('items:get-by-id', id),
  addItem: (data: unknown) => ipcRenderer.invoke('items:add', data),
  updateItem: (data: unknown) => ipcRenderer.invoke('items:update', data),
  deleteItem: (id: number) => ipcRenderer.invoke('items:delete', id),

  // Invoices — Phase 4
  getInvoices: (_filter?: unknown) => ipcRenderer.invoke('invoices:get-all', _filter),
  getInvoiceById: (id: number) => ipcRenderer.invoke('invoices:get-by-id', id),
  addInvoice: (data: unknown) => ipcRenderer.invoke('invoices:add', data),
  updateInvoice: (data: unknown) => ipcRenderer.invoke('invoices:update', data),
  deleteInvoice: (id: number) => ipcRenderer.invoke('invoices:delete', id),
  getNextSequence: (invoiceType: string) => ipcRenderer.invoke('invoices:next-sequence', invoiceType),

  // Quotes - Phase 4
  getQuotes: (_filter?: unknown) => ipcRenderer.invoke('quotes:get-all', _filter),
  getQuoteById: (id: number) => ipcRenderer.invoke('quotes:get-by-id', id),
  addQuote: (data: unknown) => ipcRenderer.invoke('quotes:add', data),
  updateQuote: (data: unknown) => ipcRenderer.invoke('quotes:update', data),
  deleteQuote: (id: number) => ipcRenderer.invoke('quotes:delete', id),

  // Settings — Phase 2
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (data: unknown) => ipcRenderer.invoke('settings:update', data),

  // Style Profiles — Phase 5
  getStyleProfiles: (_filter?: unknown) => ipcRenderer.invoke('style-profiles:get-all', _filter),
  getStyleProfileById: (id: number) => ipcRenderer.invoke('style-profiles:get-by-id', id),
  addStyleProfile: (data: unknown) => ipcRenderer.invoke('style-profiles:add', data),
  updateStyleProfile: (data: unknown) => ipcRenderer.invoke('style-profiles:update', data),
  deleteStyleProfile: (id: number) => ipcRenderer.invoke('style-profiles:delete', id),

  // Import/Export — Phase 3
  exportToJson: () => ipcRenderer.invoke('import-export:json'),
  importFromJson: (data: unknown) => ipcRenderer.invoke('import-export:json', data),
  
  // Reports
  getDashboardStats: () => ipcRenderer.invoke('reports:stats'),
  exportToXlsx: (entity: string) => ipcRenderer.invoke('export:excel', entity),
  backupDatabase: () => ipcRenderer.invoke('import-export:backup'),
  restoreDatabase: () => ipcRenderer.invoke('import-export:restore'),

  // App
  openExternal: (url: string) => ipcRenderer.invoke('app:open-external', url),
  checkForUpdate: () => ipcRenderer.invoke('app:check-update'),

  // Receipt — Phase 5
  printReceipt: (data: unknown) => ipcRenderer.invoke('receipt:print', data)
});
