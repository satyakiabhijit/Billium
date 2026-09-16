import type { FC } from 'react';
import type { Invoice, InvoiceItem } from '../../../types/invoice';
import type { Quote } from '../../../../backend/shared/types/quote';
import { numberToWords } from '../../utils/numberToWords';
import './PrintStyles.css';

// Parsed snapshot shapes
export interface SnapshotClient {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  vatCode?: string;
}

export interface SnapshotBusiness {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  vatCode?: string;
  gstNumber?: string;
  logoBase64?: string;
  website?: string;
}

export interface SnapshotBank {
  name?: string;
  accountName?: string;
  accountNumber?: string;
  iban?: string;
  bic?: string;
  routingNumber?: string;
}

export interface SnapshotCurrency {
  code?: string;
  symbol?: string;
  name?: string;
}

export interface InvoiceTemplateData {
  invoice: Invoice | Quote;
  items: InvoiceItem[];
  client: SnapshotClient;
  business: SnapshotBusiness;
  bank: SnapshotBank;
  currency: SnapshotCurrency;
  docType: 'invoice' | 'quote';
}

interface InvoiceTemplateProps {
  data: InvoiceTemplateData;
}

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatAmount = (cents: number | string | undefined, symbol: string): string => {
  if (cents === undefined || cents === null) return `${symbol}0.00`;
  const amount = Number(cents) / 100;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const statusClass = (status: string): string => {
  const s = status?.toLowerCase();
  if (['paid', 'accepted'].includes(s)) return 'paid';
  if (['unpaid', 'pending'].includes(s)) return 'unpaid';
  if (s === 'overdue') return 'overdue';
  if (s === 'draft') return 'draft';
  if (s === 'sent') return 'sent';
  if (s === 'rejected') return 'rejected';
  return 'draft';
};

export const InvoiceTemplate: FC<InvoiceTemplateProps> = ({ data }) => {
  const { invoice, items, client, business, bank, currency, docType } = data;

  const sym = currency.symbol || currency.code || '';
  const issuedAt = (invoice as Invoice).issuedAt || (invoice as any).date;
  const dueDate = invoice.dueDate;

  return (
    <div className="invoice-template">
      {/* HEADER */}
      <header className="inv-header">
        <div className="inv-header-left">
          {business.logoBase64 && (
            <img
              src={business.logoBase64}
              alt="Business Logo"
              style={{ maxHeight: 56, maxWidth: 140, objectFit: 'contain', marginBottom: 8, display: 'block' }}
            />
          )}
          <p className="inv-doc-type">{docType === 'quote' ? 'Quotation' : 'Invoice'}</p>
          <p className="inv-number">
            #{(invoice as any).invoiceNumber || (invoice as any).sequenceNumber || invoice.id}
          </p>
        </div>
        <div className="inv-header-right">
          <p className="inv-business-name">{business.name || 'Your Business'}</p>
          {business.address && <p className="inv-business-detail">{business.address}</p>}
          {business.email && <p className="inv-business-detail">{business.email}</p>}
          {business.phone && <p className="inv-business-detail">{business.phone}</p>}
          {business.vatCode && <p className="inv-business-detail">VAT: {business.vatCode}</p>}
          {business.gstNumber && <p className="inv-business-detail">GST: {business.gstNumber}</p>}
        </div>
      </header>

      {/* META BAR */}
      <div className="inv-meta">
        <div className="inv-meta-item">
          <div className="inv-meta-label">Date Issued</div>
          <div className="inv-meta-value">{formatDate(issuedAt)}</div>
        </div>
        {dueDate && (
          <div className="inv-meta-item">
            <div className="inv-meta-label">Due Date</div>
            <div className="inv-meta-value">{formatDate(dueDate)}</div>
          </div>
        )}
        <div className="inv-meta-item">
          <div className="inv-meta-label">Status</div>
          <div className="inv-meta-value">
            <span className={`inv-status-badge ${statusClass(String(invoice.status))}`}>
              {String(invoice.status)}
            </span>
          </div>
        </div>
        {currency.code && (
          <div className="inv-meta-item">
            <div className="inv-meta-label">Currency</div>
            <div className="inv-meta-value">{currency.code}</div>
          </div>
        )}
      </div>

      {/* PARTIES */}
      <div className="inv-parties">
        <div className="inv-party">
          <div className="inv-party-label">Billed To</div>
          <p className="inv-party-name">{client.name || '—'}</p>
          {client.address && <p className="inv-party-detail">{client.address}</p>}
          {client.email && <p className="inv-party-detail">{client.email}</p>}
          {client.phone && <p className="inv-party-detail">{client.phone}</p>}
          {client.vatCode && <p className="inv-party-detail">VAT: {client.vatCode}</p>}
        </div>
        <div className="inv-party">
          <div className="inv-party-label">From</div>
          <p className="inv-party-name">{business.name || '—'}</p>
          {business.address && <p className="inv-party-detail">{business.address}</p>}
          {business.website && <p className="inv-party-detail">{business.website}</p>}
        </div>
      </div>

      {/* LINE ITEMS TABLE */}
      <div className="inv-items">
        <table className="inv-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Description</th>
              <th className="center">Qty</th>
              <th className="right">Unit Price</th>
              <th className="center">Tax %</th>
              <th className="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="center" style={{ padding: '20px', color: '#8a93b0' }}>
                  No items
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id ?? idx}>
                  <td>
                    <div className="inv-item-name">{item.name}</div>
                    {item.description && (
                      <div className="inv-item-desc">{item.description}</div>
                    )}
                  </td>
                  <td className="center">{item.quantity}</td>
                  <td className="right">{formatAmount(item.unitPriceCents, sym)}</td>
                  <td className="center">{item.taxRate ? `${item.taxRate}%` : '—'}</td>
                  <td className="right">{formatAmount(item.totalCents, sym)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="inv-totals-section">
        <div className="inv-totals">
          <div className="inv-total-row">
            <span>Subtotal</span>
            <span>{formatAmount((invoice as any).subtotalCents, sym)}</span>
          </div>
          {Number((invoice as any).discountTotalCents) > 0 && (
            <div className="inv-total-row">
              <span>Discount{(invoice as any).discountType === 'percentage' ? ` (${(invoice as any).discountPercent}%)` : ''}</span>
              <span>− {formatAmount((invoice as any).discountTotalCents, sym)}</span>
            </div>
          )}
          <div className="inv-total-row">
            <span>Tax</span>
            <span>{formatAmount((invoice as any).taxTotalCents, sym)}</span>
          </div>
          <div className="inv-total-row grand divider">
            <span>Grand Total</span>
            <span>{formatAmount((invoice as any).grandTotalCents, sym)}</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#8a93b0', marginTop: '4px', fontStyle: 'italic' }}>
            {currency.code} {numberToWords(Number((invoice as any).grandTotalCents) / 100, currency.code)}
          </div>
        </div>
      </div>

      {/* BANK DETAILS */}
      {(bank.accountName || bank.iban || bank.accountNumber) && (
        <div className="inv-bank">
          <div className="inv-bank-label">Payment Details</div>
          <div className="inv-bank-grid">
            {bank.name && (
              <div className="inv-bank-field">
                <div className="inv-bank-field-label">Bank</div>
                <div className="inv-bank-field-value">{bank.name}</div>
              </div>
            )}
            {bank.accountName && (
              <div className="inv-bank-field">
                <div className="inv-bank-field-label">Account Name</div>
                <div className="inv-bank-field-value">{bank.accountName}</div>
              </div>
            )}
            {bank.accountNumber && (
              <div className="inv-bank-field">
                <div className="inv-bank-field-label">Account No.</div>
                <div className="inv-bank-field-value">{bank.accountNumber}</div>
              </div>
            )}
            {bank.iban && (
              <div className="inv-bank-field">
                <div className="inv-bank-field-label">IBAN</div>
                <div className="inv-bank-field-value">{bank.iban}</div>
              </div>
            )}
            {bank.bic && (
              <div className="inv-bank-field">
                <div className="inv-bank-field-label">BIC / SWIFT</div>
                <div className="inv-bank-field-value">{bank.bic}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOTES & TERMS */}
      {((invoice as any).customerNotes || (invoice as any).notes || (invoice as any).termsConditionNotes || (invoice as any).terms) && (
        <div className="inv-notes">
          {((invoice as any).customerNotes || (invoice as any).notes) && (
            <div className="inv-notes-block">
              <div className="inv-notes-label">Notes</div>
              <div className="inv-notes-text">
                {(invoice as any).customerNotes || (invoice as any).notes}
              </div>
            </div>
          )}
          {((invoice as any).termsConditionNotes || (invoice as any).terms) && (
            <div className="inv-notes-block">
              <div className="inv-notes-label">Terms & Conditions</div>
              <div className="inv-notes-text">
                {(invoice as any).termsConditionNotes || (invoice as any).terms}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="inv-footer">
        Thank you for your business — {business.name}
        {business.email ? ` · ${business.email}` : ''}
      </footer>
    </div>
  );
};
