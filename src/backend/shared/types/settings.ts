export interface Settings {
  id?: number;
  language?: string;
  dateFormat?: string;
  amountFormat?: string;
  invoicePrefix?: string;
  invoiceSuffix?: string;
  quotePrefix?: string;
  quoteSuffix?: string;
  enableReceipt?: boolean;
  enableReports?: boolean;
  enableStyleProfiles?: boolean;
  enablePresets?: boolean;
  enableQuotes?: boolean;
  enablePeppol?: boolean;
  enableXRechnung?: boolean;
  pdfFileNameFormat?: string;
  defaultCurrencyId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SettingsUpdate = Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>;
