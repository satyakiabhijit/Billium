import type { InvoiceStatus } from '../enums/invoiceStatus';

export interface Invoice {
  id?: number;
  sequenceNumber?: string;
  invoiceNumber: string;
  date?: string; // keeping date for backward compatibility if used, otherwise setup.ts uses issuedAt
  issuedAt: string;
  dueDate?: string;
  status: InvoiceStatus | string;
  
  // Snapshots (Historical Immutability)
  clientSnapshot: string; // JSON stringified Client
  businessSnapshot: string; // JSON stringified Business
  bankSnapshot: string; // JSON stringified Bank
  currencySnapshot: string; // JSON stringified Currency

  // Foreign keys for relational integrity / tracking (Not strictly required for PDF, but for app logic)
  clientId: number;
  businessId: number;
  bankId?: number;
  currencyId: number;
  layoutId?: number;
  styleProfilesId?: number;

  // Financials
  discountType?: 'amount' | 'percentage';
  discountAmountCents?: string;
  discountPercent?: number;
  isTaxInclusive: boolean;
  subtotalCents: number;
  taxTotalCents: number;
  discountTotalCents: number;
  grandTotalCents: number;

  notes?: string;
  terms?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceAdd extends Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'clientSnapshot' | 'businessSnapshot' | 'bankSnapshot' | 'currencySnapshot'> {
  items: InvoiceItemAdd[];
}

export interface InvoiceUpdate extends Omit<InvoiceAdd, 'sequenceNumber'> {
  id: number;
}

export interface InvoiceItem {
  id?: number;
  invoiceId: number;
  itemId?: number; // Optional reference to catalog item
  name: string;
  description?: string;
  quantity: number;
  unitPriceCents: number;
  taxRate: number;
  totalCents: number;
}

export interface InvoiceItemAdd extends Omit<InvoiceItem, 'id' | 'invoiceId'> {}
