import type { InvoiceStatus } from '../enums/invoiceStatus'; // Reusing invoice status or you could have QuoteStatus

export interface Quote {
  id?: number;
  sequenceNumber?: string;
  invoiceNumber: string; // quotes are saved in invoices table, so they use the same fields
  date?: string;
  issuedAt: string;
  dueDate?: string;
  status: InvoiceStatus | string;
  
  // Snapshots (Historical Immutability)
  clientSnapshot: string; 
  businessSnapshot: string; 
  bankSnapshot: string; 
  currencySnapshot: string; 

  clientId: number;
  businessId: number;
  bankId?: number;
  currencyId: number;

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

export interface QuoteAdd extends Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'clientSnapshot' | 'businessSnapshot' | 'bankSnapshot' | 'currencySnapshot'> {
  items: QuoteItemAdd[];
}

export interface QuoteUpdate extends Omit<QuoteAdd, 'sequenceNumber'> {
  id: number;
}

export interface QuoteItem {
  id?: number;
  quoteId: number;
  itemId?: number; 
  name: string;
  description?: string;
  quantity: number;
  unitPriceCents: number;
  taxRate: number;
  totalCents: number;
}

export interface QuoteItemAdd extends Omit<QuoteItem, 'id' | 'quoteId'> {}
