import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'nav.invoices': 'Invoices',
      'nav.quotes': 'Quotes',
      'nav.clients': 'Clients',
      'nav.items': 'Items',
      'nav.banks': 'Banks',
      'nav.businesses': 'Businesses',
      'nav.categories': 'Categories',
      'nav.units': 'Units',
      'nav.currencies': 'Currencies',
      'nav.settings': 'Settings',
      'nav.layouts': 'Layouts',
      'nav.styleProfiles': 'Style Profiles',
      'nav.presets': 'Presets',
      'nav.reports': 'Reports',
      'nav.logout': 'Log Out',
      'db.title': 'Welcome to Billium',
      'db.subtitle': 'Select or create a database to get started',
      'db.createNew': 'Create New Database',
      'db.openExisting': 'Open Existing Database',
      'db.connectPostgres': 'Connect to PostgreSQL',
      'db.testConnection': 'Test Connection',
      'db.connect': 'Connect',
      'db.host': 'Host',
      'db.port': 'Port',
      'db.user': 'Username',
      'db.password': 'Password',
      'db.database': 'Database Name',
      'db.ssl': 'Use SSL',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.add': 'Add',
      'common.search': 'Search...',
      'common.noData': 'No data available',
      'common.confirm': 'Are you sure?',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.archived': 'Archived',
      'common.active': 'Active',
      'common.close': 'Close',
      'common.view': 'View',
      'common.name': 'Name',
      'common.description': 'Description',
      'common.status': 'Status',
      'common.actions': 'Actions',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.submit': 'Submit',
      'common.reset': 'Reset',
      'common.clear': 'Clear',
      'common.select': 'Select',
      'common.optional': 'Optional',
      'common.required': 'Required'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
