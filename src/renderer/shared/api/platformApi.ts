const API_BASE = (window as unknown as { __API_ORIGIN__?: string }).__API_ORIGIN__ ||
  import.meta.env.VITE_API_URL ||
  '';

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export interface Api {
  // Database
  createSqliteDb: (name?: string) => Promise<{ success: boolean; error?: string }>;
  openSqliteDb: (name?: string) => Promise<{ success: boolean; error?: string }>;
  testPostgresConnection: (config: unknown) => Promise<{ success: boolean; error?: string }>;
  openPostgresDb: (config: unknown) => Promise<{ success: boolean; error?: string }>;
  closeDb: () => Promise<{ success: boolean }>;
  listDatabases: () => Promise<{ success: boolean; data?: string[] }>;

  // App
  getAppVersion: () => Promise<string>;
  ping: () => void;

  // Banks — Phase 2
  getBanks: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getBankById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addBank: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateBank: (data: unknown) => Promise<{ success: boolean }>;
  deleteBank: (id: number) => Promise<{ success: boolean }>;

  // Businesses — Phase 2
  getBusinesses: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getBusinessById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addBusiness: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateBusiness: (data: unknown) => Promise<{ success: boolean }>;
  deleteBusiness: (id: number) => Promise<{ success: boolean }>;

  // Clients — Phase 2
  getClients: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getClientById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addClient: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateClient: (data: unknown) => Promise<{ success: boolean }>;
  deleteClient: (id: number) => Promise<{ success: boolean }>;

  // Categories — Phase 2
  getCategories: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getCategoryById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addCategory: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateCategory: (data: unknown) => Promise<{ success: boolean }>;
  deleteCategory: (id: number) => Promise<{ success: boolean }>;

  // Taxes
  getTaxes: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  addTax: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateTax: (data: unknown) => Promise<{ success: boolean }>;
  deleteTax: (id: number) => Promise<{ success: boolean }>;

  // Units — Phase 2
  getUnits: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  addUnit: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateUnit: (data: unknown) => Promise<{ success: boolean }>;
  deleteUnit: (id: number) => Promise<{ success: boolean }>;

  // Currencies — Phase 2
  getCurrencies: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  addCurrency: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateCurrency: (data: unknown) => Promise<{ success: boolean }>;
  deleteCurrency: (id: number) => Promise<{ success: boolean }>;

  // Items — Phase 2
  getItems: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getItemById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addItem: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateItem: (data: unknown) => Promise<{ success: boolean }>;
  deleteItem: (id: number) => Promise<{ success: boolean }>;

  // Invoices — Phase 4
  getInvoices: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getInvoiceById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addInvoice: (data: unknown) => Promise<{ success: boolean; data?: unknown }>;
  updateInvoice: (data: unknown) => Promise<{ success: boolean }>;
  deleteInvoice: (id: number) => Promise<{ success: boolean }>;
  getNextSequence: (invoiceType: string) => Promise<{ success: boolean; data?: { nextSequence: number; formattedSequence: string } }>;

  // Quotes — Phase 4
  getQuotes: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getQuoteById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addQuote: (data: unknown) => Promise<{ success: boolean; data?: unknown }>;
  updateQuote: (data: unknown) => Promise<{ success: boolean }>;
  deleteQuote: (id: number) => Promise<{ success: boolean }>;

  // Settings — Phase 2
  getSettings: () => Promise<{ success: boolean; data?: unknown }>;
  updateSettings: (data: unknown) => Promise<{ success: boolean }>;

  // Layouts — Phase 5
  getLayouts: () => Promise<{ success: boolean; data?: unknown[] }>;
  getLayoutById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addLayout: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateLayout: (data: unknown) => Promise<{ success: boolean }>;
  deleteLayout: (id: number) => Promise<{ success: boolean }>;

  // Style Profiles — Phase 5
  getStyleProfiles: (filter?: unknown) => Promise<{ success: boolean; data?: unknown[] }>;
  getStyleProfileById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addStyleProfile: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updateStyleProfile: (data: unknown) => Promise<{ success: boolean }>;
  deleteStyleProfile: (id: number) => Promise<{ success: boolean }>;

  // Presets — Phase 6
  getPresets: () => Promise<{ success: boolean; data?: unknown[] }>;
  getPresetById: (id: number) => Promise<{ success: boolean; data?: unknown }>;
  addPreset: (data: unknown) => Promise<{ success: boolean; data?: number }>;
  updatePreset: (data: unknown) => Promise<{ success: boolean }>;
  deletePreset: (id: number) => Promise<{ success: boolean }>;

  // Import/Export — Phase 3
  exportToJson: () => Promise<{ success: boolean }>;
  importFromJson: (data: unknown) => Promise<{ success: boolean }>;
  exportToXlsx: (entity: string) => Promise<{ success: boolean }>;
  backupDatabase: () => Promise<{ success: boolean }>;
  restoreDatabase: () => Promise<{ success: boolean }>;

  // Receipt — Phase 5
  printReceipt: (data: unknown) => Promise<{ success: boolean }>;

  // Other
  openExternal: (url: string) => Promise<void>;
  checkForUpdate: () => Promise<unknown>;
}

export const webApi: Api = {
  // Database
  createSqliteDb: (name?: string) => request('/api/database/sqlite/create', { method: 'POST', body: JSON.stringify({ name: name || 'billium.db' }) }),
  openSqliteDb: (name?: string) => request('/api/database/sqlite/open', { method: 'POST', body: JSON.stringify({ name: name || 'billium.db' }) }),
  testPostgresConnection: (config) => request('/api/database/postgres/test', { method: 'POST', body: JSON.stringify(config) }),
  openPostgresDb: (config) => request('/api/database/postgres/open', { method: 'POST', body: JSON.stringify(config) }),
  closeDb: () => request('/api/database/close', { method: 'POST' }),
  listDatabases: () => request('/api/databases'),

  // App
  getAppVersion: () => request('/api/version').then((r: unknown) => (r as { version: string }).version),
  ping: () => console.log('pong'),

  // Banks
  getBanks: (filter) => request(`/api/banks${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  getBankById: (id) => request(`/api/banks/${id}`),
  addBank: (data) => request('/api/banks', { method: 'POST', body: JSON.stringify(data) }),
  updateBank: (data) => request('/api/banks', { method: 'PUT', body: JSON.stringify(data) }),
  deleteBank: (id) => request(`/api/banks/${id}`, { method: 'DELETE' }),

  // Businesses
  getBusinesses: (filter) => request(`/api/businesses${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  getBusinessById: (id) => request(`/api/businesses/${id}`),
  addBusiness: (data) => request('/api/businesses', { method: 'POST', body: JSON.stringify(data) }),
  updateBusiness: (data) => request('/api/businesses', { method: 'PUT', body: JSON.stringify(data) }),
  deleteBusiness: (id) => request(`/api/businesses/${id}`, { method: 'DELETE' }),

  // Clients
  getClients: (filter) => request(`/api/clients${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  getClientById: (id) => request(`/api/clients/${id}`),
  addClient: (data) => request('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (data) => request('/api/clients', { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id) => request(`/api/clients/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: (filter) => request(`/api/categories${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  getCategoryById: (id) => request(`/api/categories/${id}`),
  addCategory: (data) => request('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (data) => request('/api/categories', { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  // Taxes
  getTaxes: (filter) => request(`/api/taxes${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  addTax: (data) => request('/api/taxes', { method: 'POST', body: JSON.stringify(data) }),
  updateTax: (data) => request('/api/taxes', { method: 'PUT', body: JSON.stringify(data) }),
  deleteTax: (id) => request(`/api/taxes/${id}`, { method: 'DELETE' }),

  // Units
  getUnits: (filter) => request(`/api/units${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  addUnit: (data) => request('/api/units', { method: 'POST', body: JSON.stringify(data) }),
  updateUnit: (data) => request('/api/units', { method: 'PUT', body: JSON.stringify(data) }),
  deleteUnit: (id) => request(`/api/units/${id}`, { method: 'DELETE' }),

  // Currencies
  getCurrencies: (filter) => request(`/api/currencies${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  addCurrency: (data) => request('/api/currencies', { method: 'POST', body: JSON.stringify(data) }),
  updateCurrency: (data) => request('/api/currencies', { method: 'PUT', body: JSON.stringify(data) }),
  deleteCurrency: (id) => request(`/api/currencies/${id}`, { method: 'DELETE' }),

  // Items
  getItems: (filter) => request(`/api/items${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  getItemById: (id) => request(`/api/items/${id}`),
  addItem: (data) => request('/api/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (data) => request('/api/items', { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id) => request(`/api/items/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request('/api/settings'),
  updateSettings: (data) => request('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Invoices - Phase 4
  getInvoices: (filter) => request(`/api/invoices${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  getInvoiceById: (id) => request(`/api/invoices/${id}`),
  addInvoice: (data) => request('/api/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (data) => request('/api/invoices', { method: 'PUT', body: JSON.stringify(data) }),
  deleteInvoice: (id) => request(`/api/invoices/${id}`, { method: 'DELETE' }),
  getNextSequence: (invoiceType) => request(`/api/invoices/next-sequence/${invoiceType}`),

  // Quotes - Phase 4
  getQuotes: (filter) => request(`/api/quotes${filter ? '?filter=' + JSON.stringify(filter) : ''}`),
  getQuoteById: (id) => request(`/api/quotes/${id}`),
  addQuote: (data) => request('/api/quotes', { method: 'POST', body: JSON.stringify(data) }),
  updateQuote: (data) => request('/api/quotes', { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuote: (id) => request(`/api/quotes/${id}`, { method: 'DELETE' }),

  getLayouts: () => Promise.resolve({ success: true, data: [] }),
  getLayoutById: () => Promise.resolve({ success: true, data: undefined }),
  addLayout: () => Promise.resolve({ success: true }),
  updateLayout: () => Promise.resolve({ success: true }),
  deleteLayout: () => Promise.resolve({ success: true }),

  getStyleProfiles: () => Promise.resolve({ success: true, data: [] }),
  getStyleProfileById: () => Promise.resolve({ success: true, data: undefined }),
  addStyleProfile: () => Promise.resolve({ success: true }),
  updateStyleProfile: () => Promise.resolve({ success: true }),
  deleteStyleProfile: () => Promise.resolve({ success: true }),

  getPresets: () => Promise.resolve({ success: true, data: [] }),
  getPresetById: () => Promise.resolve({ success: true, data: undefined }),
  addPreset: () => Promise.resolve({ success: true }),
  updatePreset: () => Promise.resolve({ success: true }),
  deletePreset: () => Promise.resolve({ success: true }),

  exportToJson: () => Promise.resolve({ success: true }),
  importFromJson: () => Promise.resolve({ success: true }),
  exportToXlsx: (entity) => {
    window.open(`${API_BASE}/api/export/excel/${entity}`, '_blank');
    return Promise.resolve({ success: true });
  },
  backupDatabase: () => Promise.resolve({ success: true }),
  restoreDatabase: () => Promise.resolve({ success: true }),

  printReceipt: () => Promise.resolve({ success: true }),
  openExternal: () => Promise.resolve(),
  checkForUpdate: () => Promise.resolve(null)
};
