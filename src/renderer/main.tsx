import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import { App } from './app/App';
import './globalErrorHandlers';
import './i18n';
import { BanksPage } from './pages/banks';
import { BusinessesPage } from './pages/businesses';
import { CategoriesPage } from './pages/categories';
import { ClientsPage } from './pages/clients';
import { CurrenciesPage } from './pages/currencies';
import { InvoicesPage } from './pages/invoices';
import { ItemsPage } from './pages/items';
import { QuotesPage } from './pages/quotes';
import { ReportsPage } from './pages/reports';
import { SettingsPage } from './pages/settings';
import { StyleProfilesPage } from './pages/styleProfiles';
import { UnitsPage } from './pages/units';
import { TaxesPage } from './pages/taxes';
import { store } from './state/configureStore';

const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/invoices" replace /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'quotes', element: <QuotesPage /> },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'items', element: <ItemsPage /> },
      { path: 'banks', element: <BanksPage /> },
      { path: 'businesses', element: <BusinessesPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'units', element: <UnitsPage /> },
      { path: 'taxes', element: <TaxesPage /> },
      { path: 'currencies', element: <CurrenciesPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'style-profiles', element: <StyleProfilesPage /> },
      { path: 'reports', element: <ReportsPage /> }
    ]
  }
];

const router = isElectron ? createHashRouter(routes) : createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
