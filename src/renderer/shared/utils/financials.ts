import type { InvoiceItem } from '../types/invoice';

export const centsToDecimal = (cents: string | number): number => {
  return Number(cents) / 100;
};

export const decimalToCents = (decimal: number): string => {
  return Math.round(decimal * 100).toString();
};

export interface CalculatedTotals {
  subtotalCents: number;
  taxTotalCents: number;
  discountTotalCents: number;
  grandTotalCents: number;
}

export const calculateInvoiceTotals = (
  items: InvoiceItem[],
  discountPercent: number = 0,
  discountAmountCents: string = '0',
  isTaxInclusive: boolean = false
): CalculatedTotals => {
  let subtotal = 0;
  let taxTotal = 0;

  for (const item of items) {
    const itemTotalCents = Number(item.totalCents || 0);
    const taxRate = item.taxRate || 0;

    if (isTaxInclusive) {
      // If inclusive, the itemTotalCents ALREADY includes tax.
      // taxAmount = total - (total / (1 + taxRate/100))
      const taxAmount = itemTotalCents - itemTotalCents / (1 + taxRate / 100);
      taxTotal += taxAmount;
      subtotal += itemTotalCents - taxAmount; // subtotal is the amount without tax
    } else {
      // If exclusive, itemTotalCents is just quantity * unitPriceCents (tax not included)
      subtotal += itemTotalCents;
      taxTotal += itemTotalCents * (taxRate / 100);
    }
  }

  // Handle Discounts
  let discountTotal = Number(discountAmountCents);
  if (discountPercent > 0) {
    discountTotal += subtotal * (discountPercent / 100);
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountTotal);

  let grandTotal = 0;
  if (isTaxInclusive) {
    // If tax inclusive, subtotalAfterDiscount is the net. Grand total is net + taxTotal.
    // Wait, if it's inclusive, the tax is already baked in, but discount reduces the total.
    // A simpler way:
    grandTotal = subtotalAfterDiscount + taxTotal;
  } else {
    // If tax exclusive, we add the tax on top of the discounted subtotal
    grandTotal = subtotalAfterDiscount + taxTotal;
  }

  return {
    subtotalCents: Math.round(subtotal),
    taxTotalCents: Math.round(taxTotal),
    discountTotalCents: Math.round(discountTotal),
    grandTotalCents: Math.round(grandTotal)
  };
};
