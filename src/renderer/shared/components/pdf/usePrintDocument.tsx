import { useState, useCallback, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { getApi } from '../../api/restApi';
import {
  InvoiceTemplate,
  type InvoiceTemplateData,
  type SnapshotClient,
  type SnapshotBusiness,
  type SnapshotBank,
  type SnapshotCurrency,
} from './InvoiceTemplate';
import type { Invoice, InvoiceItem } from '../../types/invoice';

type DocType = 'invoice' | 'quote';

const parseSnapshot = <T,>(raw: unknown): T => {
  if (!raw) return {} as T;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return {} as T;
    }
  }
  return raw as T;
};

const safeFetchData = async (docType: DocType, id: number): Promise<InvoiceTemplateData> => {
  const api = getApi();

  const result = docType === 'invoice'
    ? await api.getInvoiceById(id)
    : await api.getQuoteById(id);

  const res = result as { success: boolean; data?: unknown };
  if (!res.success || !res.data) {
    throw new Error(`Failed to fetch ${docType} #${id}`);
  }

  const raw = res.data as Invoice & { items?: InvoiceItem[] };
  const items: InvoiceItem[] = (raw.items ?? []) as InvoiceItem[];

  const client = parseSnapshot<SnapshotClient>(raw.clientSnapshot);
  const business = parseSnapshot<SnapshotBusiness>(raw.businessSnapshot);
  const bank = parseSnapshot<SnapshotBank>(raw.bankSnapshot);
  const currency = parseSnapshot<SnapshotCurrency>(raw.currencySnapshot);


  let styleProfile: any = undefined;
  if (raw.styleProfilesId) {
    try {
      const spRes = await api.getStyleProfileById(raw.styleProfilesId) as { success: boolean; data?: any };
      if (spRes.success) styleProfile = spRes.data;
    } catch (e) {
      console.warn('Failed to load style profile', e);
    }
  }

  return { invoice: raw, items, client, business, bank, currency, styleProfile, docType };
};

/**
 * Renders the InvoiceTemplate into a hidden portal div, then triggers window.print().
 * The @media print CSS in PrintStyles.css hides all other DOM and shows only the portal.
 * Uses createElement instead of JSX so this file can stay as a .ts file.
 */
const printData = (data: InvoiceTemplateData): void => {
  let portal = document.getElementById('invoice-print-portal');
  if (!portal) {
    portal = document.createElement('div');
    portal.id = 'invoice-print-portal';
    portal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;background:white;z-index:99999;overflow:auto;';
    document.body.appendChild(portal);
  }

  // Use createElement instead of JSX — no JSX transform needed
  const root = createRoot(portal);
  root.render(createElement(InvoiceTemplate, { data }));

  setTimeout(() => {
    portal!.style.display = 'block';
    window.print();
    setTimeout(() => {
      portal!.style.display = 'none';
      root.unmount();
    }, 500);
  }, 150);
};

// ── Hook ─────────────────────────────────────────────────────────────

export interface UsePrintDocumentReturn {
  isPrinting: boolean;
  printError: string | null;
  triggerPrint: (id: number) => Promise<void>;
  downloadPdf: (id: number) => Promise<void>;
}

export const usePrintDocument = (docType: DocType): UsePrintDocumentReturn => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  const triggerPrint = useCallback(async (id: number) => {
    setIsPrinting(true);
    setPrintError(null);
    try {
      const data = await safeFetchData(docType, id);
      printData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Print failed';
      setPrintError(msg);
      console.error('[usePrintDocument]', err);
    } finally {
      setIsPrinting(false);
    }
  }, [docType]);

  const downloadPdf = useCallback(async (id: number) => {
    setIsPrinting(true);
    setPrintError(null);
    try {
      const data = await safeFetchData(docType, id);
      
      // We lazily import html2pdf so it doesn't block initial load
      const html2pdf = (await import('html2pdf.js')).default;
      
      let portal = document.getElementById('invoice-download-portal');
      if (!portal) {
        portal = document.createElement('div');
        portal.id = 'invoice-download-portal';
        // Position off-screen but visible to html2canvas
        portal.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;background:white;z-index:-9999;';
        document.body.appendChild(portal);
      }

      const root = createRoot(portal);
      root.render(createElement(InvoiceTemplate, { data }));

      // Wait for React to render and images to load
      await new Promise(r => setTimeout(r, 500));

      const opt = {
        margin: 0,
        filename: `${data.invoice.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(portal).save();
      root.unmount();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Download failed';
      setPrintError(msg);
      console.error('[usePrintDocument]', err);
    } finally {
      setIsPrinting(false);
    }
  }, [docType]);

  return { isPrinting, printError, triggerPrint, downloadPdf };
};
