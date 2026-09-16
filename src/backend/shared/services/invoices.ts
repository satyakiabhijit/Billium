import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { Invoice, InvoiceAdd, InvoiceItem, InvoiceUpdate } from '../types/invoice';
import type { Response } from '../types/response';
import type { FilterData } from '../types/invoiceFilter';
import { mapDatabaseError } from '../utils/errorFunctions';
import { getClientById } from './clients';
import { getBusinessById } from './businesses';
import { getBankById } from './banks';

export const getAllInvoices = async (
  db: DatabaseAdapter,
  _filter?: FilterData[]
): Promise<Response<Invoice[]>> => {
  try {
    const data = await db.all<Invoice>('SELECT * FROM invoices WHERE invoiceType = ?', ['invoice']);
    return { success: true, data };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const getInvoiceById = async (
  db: DatabaseAdapter,
  id: number
): Promise<Response<Invoice & { items: InvoiceItem[] }>> => {
  try {
    const invoice = await db.get<Invoice>('SELECT * FROM invoices WHERE id = ? AND invoiceType = ?', [id, 'invoice']);
    if (!invoice) return { success: true, data: undefined };
    
    const items = await db.all<InvoiceItem>('SELECT * FROM invoice_items WHERE invoiceId = ?', [id]);
    return { success: true, data: { ...invoice, date: invoice.issuedAt, items } };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const addInvoice = async (
  db: DatabaseAdapter,
  data: InvoiceAdd,
  invoiceType: 'invoice' | 'quote' = 'invoice'
): Promise<Response<Invoice>> => {
  try {
    // 1. Fetch current entities for snapshotting
    const clientRes = await getClientById(db, data.clientId);
    const businessRes = await getBusinessById(db, data.businessId);
    const bankRes = data.bankId ? await getBankById(db, data.bankId) : { data: null };
    
    // We don't have getCurrencyById implemented yet in currencies service, but assume it exists or fetch manually
    const currency = await db.get('SELECT * FROM currencies WHERE id = ?', [data.currencyId || 1]); // fallback id=1

    const clientSnapshot = JSON.stringify(clientRes.data || {});
    const businessSnapshot = JSON.stringify(businessRes.data || {});
    const bankSnapshot = JSON.stringify(bankRes.data || {});
    const currencySnapshot = JSON.stringify(currency || {});

    // Prepare insert
    const insertFields = [
      'invoiceType', 'invoiceNumber', 'businessId', 'bankId', 'clientId', 'currencyId', 
      'status', 'issuedAt', 'dueDate', 'customerNotes', 'clientSnapshot', 'businessSnapshot', 
      'bankSnapshot', 'currencySnapshot', 'subtotalCents', 'taxTotalCents', 'discountTotalCents', 
      'grandTotalCents', 'isTaxInclusive', 'discountType', 'discountAmountCents', 'discountPercent'
    ];
    
    // Generate sequence number based on current month (e.g. INV-202609-0001)
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const prefix = `${invoiceType === 'quote' ? 'QUO' : 'INV'}-${year}${month}-`;
    
    const countRes = await db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM invoices WHERE invoiceNumber LIKE ?`,
      [`${prefix}%`]
    );
    const count = (countRes?.count || 0) + 1;
    const paddedCount = String(count).padStart(4, '0');

    const invoiceNumber = data.sequenceNumber || `${prefix}${paddedCount}`;

    const values = [
      invoiceType, invoiceNumber, data.businessId, data.bankId || null, data.clientId, data.currencyId || 1,
      data.status, data.date ?? data.issuedAt, data.dueDate, data.notes || '', clientSnapshot, businessSnapshot,
      bankSnapshot, currencySnapshot, data.subtotalCents, data.taxTotalCents, data.discountTotalCents,
      data.grandTotalCents, data.isTaxInclusive ? 1 : 0, data.discountType || null, data.discountAmountCents || '0', data.discountPercent || 0
    ];

    const placeholders = insertFields.map(() => '?').join(', ');
    const sql = `INSERT INTO invoices (${insertFields.join(', ')}) VALUES (${placeholders})`;

    // SQLite doesn't natively support returning id in generic run(), wait DatabaseAdapter has it:
    const invoiceId = await db.run(sql, values, true);

    // 2. Insert items
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        await db.run(
          `INSERT INTO invoice_items (invoiceId, itemId, name, description, quantity, unitPriceCents, taxRate, totalCents)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [invoiceId, item.itemId || null, item.name, item.description || '', item.quantity, item.unitPriceCents, item.taxRate, item.totalCents || '0']
        );
      }
    }

    // Fetch and return the newly created invoice
    const newInvoice = await getInvoiceById(db, invoiceId);
    return { success: true, data: newInvoice.data };
  } catch (error) {
    console.error(error);
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const updateInvoice = async (
  db: DatabaseAdapter,
  data: InvoiceUpdate,
  invoiceType: 'invoice' | 'quote' = 'invoice'
): Promise<Response<void>> => {
  try {
    const fields = ['businessId', 'bankId', 'clientId', 'currencyId', 'status', 'issuedAt', 'dueDate', 'customerNotes', 'isTaxInclusive', 'subtotalCents', 'taxTotalCents', 'discountTotalCents', 'grandTotalCents', 'discountType', 'discountAmountCents', 'discountPercent'] as const;
    const values = [
      data.businessId, data.bankId ?? null, data.clientId, data.currencyId, data.status,
      data.date ?? data.issuedAt, data.dueDate ?? null, data.notes ?? '', data.isTaxInclusive ? 1 : 0,
      data.subtotalCents, data.taxTotalCents, data.discountTotalCents, data.grandTotalCents,
      data.discountType || null, data.discountAmountCents || '0', data.discountPercent || 0
    ];
    await db.run(
      `UPDATE invoices SET ${fields.map(field => `${field} = ?`).join(', ')}, updatedAt = datetime('now') WHERE id = ? AND invoiceType = ?`,
      [...values, data.id, invoiceType]
    );
    await db.run('DELETE FROM invoice_items WHERE invoiceId = ?', [data.id]);
    for (const [sortOrder, item] of data.items.entries()) {
      const totalCents = item.totalCents ?? Math.round(item.quantity * item.unitPriceCents);
      await db.run(
        'INSERT INTO invoice_items (invoiceId, itemId, name, description, quantity, unitPriceCents, taxRate, totalCents, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.id, item.itemId ?? null, item.name, item.description ?? '', item.quantity, item.unitPriceCents, item.taxRate, totalCents, sortOrder]
      );
    }
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const deleteInvoice = async (
  db: DatabaseAdapter,
  id: number,
  invoiceType: 'invoice' | 'quote' = 'invoice'
): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM invoices WHERE id = ? AND invoiceType = ?', [id, invoiceType]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
