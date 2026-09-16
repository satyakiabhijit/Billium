import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { Quote, QuoteAdd, QuoteUpdate } from '../types/quote';
import type { Response } from '../types/response';
import type { FilterData } from '../types/invoiceFilter';
import { addInvoice, deleteInvoice, updateInvoice } from './invoices';

export const getAllQuotes = async (
  db: DatabaseAdapter,
  _filter?: FilterData[]
): Promise<Response<Quote[]>> => {
  try {
    const data = await db.all<Quote>('SELECT * FROM invoices WHERE invoiceType = ?', ['quote']);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: String(error) };
  }
};

export const getQuoteById = async (
  db: DatabaseAdapter,
  id: number
): Promise<Response<Quote & { items: any[] }>> => {
  try {
    const quote = await db.get<Quote>('SELECT * FROM invoices WHERE id = ? AND invoiceType = ?', [id, 'quote']);
    if (!quote) return { success: true, data: undefined };
    
    const items = await db.all('SELECT * FROM invoice_items WHERE invoiceId = ?', [id]);
    return { success: true, data: { ...quote, items } };
  } catch (error) {
    return { success: false, message: String(error) };
  }
};

export const updateQuote = async (db: DatabaseAdapter, data: QuoteUpdate): Promise<Response<void>> =>
  updateInvoice(db, data as unknown as import('../types/invoice').InvoiceUpdate, 'quote');

export const deleteQuote = async (db: DatabaseAdapter, id: number): Promise<Response<void>> =>
  deleteInvoice(db, id, 'quote');

export const addQuote = async (
  db: DatabaseAdapter,
  data: QuoteAdd
): Promise<Response<Quote>> => {
  const result = await addInvoice(db, data as unknown as any, 'quote');
  return result as unknown as Response<Quote>;
};
