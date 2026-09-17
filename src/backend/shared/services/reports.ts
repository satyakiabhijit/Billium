import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { Response } from '../types/response';
import { mapDatabaseError } from '../utils/errorFunctions';

export interface DashboardStats {
  totalRevenueCents: string;
  outstandingBalanceCents: string;
  invoiceCount: number;
  quotesCount: number;
  revenueByMonth: { month: string; revenueCents: string }[];
  invoicesByStatus: { status: string; count: number }[];
}

export const getDashboardStats = async (db: DatabaseAdapter): Promise<Response<DashboardStats>> => {
  try {
    const stats: DashboardStats = {
      totalRevenueCents: '0',
      outstandingBalanceCents: '0',
      invoiceCount: 0,
      quotesCount: 0,
      revenueByMonth: [],
      invoicesByStatus: []
    };

    // 1. Total Revenue (Paid Invoices)
    const totalRev = await db.get<{ total: number }>('SELECT SUM(grandTotalCents) as total FROM invoices WHERE invoiceType = ? AND status = ?', ['invoice', 'paid']);
    stats.totalRevenueCents = String(totalRev?.total || 0);

    // 2. Outstanding Balance (Unpaid or Overdue Invoices)
    const outstanding = await db.get<{ total: number }>('SELECT SUM(grandTotalCents) as total FROM invoices WHERE invoiceType = ? AND status IN (?, ?)', ['invoice', 'unpaid', 'overdue']);
    stats.outstandingBalanceCents = String(outstanding?.total || 0);

    // 3. Counts
    const counts = await db.get<{ invoices: number, quotes: number }>(`
      SELECT 
        SUM(CASE WHEN invoiceType = 'invoice' THEN 1 ELSE 0 END) as invoices,
        SUM(CASE WHEN invoiceType = 'quote' THEN 1 ELSE 0 END) as quotes
      FROM invoices
    `, []);
    stats.invoiceCount = counts?.invoices || 0;
    stats.quotesCount = counts?.quotes || 0;

    // 4. Invoices by Status
    const statusCounts = await db.all<{ status: string, count: number }>(`
      SELECT status, COUNT(*) as count 
      FROM invoices 
      WHERE invoiceType = 'invoice' 
      GROUP BY status
    `, []);
    stats.invoicesByStatus = statusCounts || [];

    // 5. Revenue by Month (Current Year, Paid only)
    const currentYear = new Date().getFullYear();
    const monthQuery = `
      SELECT strftime('%m', issuedAt) as month, SUM(grandTotalCents) as revenueCents
      FROM invoices 
      WHERE invoiceType = 'invoice' AND status = 'paid' AND strftime('%Y', issuedAt) = ?
      GROUP BY month
      ORDER BY month ASC
    `;
    const monthlyRev = await db.all<{ month: string, revenueCents: number }>(monthQuery, [String(currentYear)]);
    stats.revenueByMonth = monthlyRev?.map(m => ({ month: m.month, revenueCents: String(m.revenueCents) })) || [];

    return { success: true, data: stats };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
