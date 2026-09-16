import type { Settings } from '../types/settings';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { Response } from '../types/response';
import { mapDatabaseError } from '../utils/errorFunctions';
import { getDefaultValue } from '../utils/dbHelper';

const settingsFields: (keyof Settings)[] = [
  'language',
  'dateFormat',
  'amountFormat',
  'invoicePrefix',
  'invoiceSuffix',
  'quotePrefix',
  'quoteSuffix',
  'enableReceipt',
  'enableReports',
  'enableStyleProfiles',
  'enablePresets',
  'enableQuotes',
  'enablePeppol',
  'enableXRechnung',
  'pdfFileNameFormat'
];

export const getSettings = async (db: DatabaseAdapter): Promise<Response<Settings>> => {
  try {
    const data = await db.get<Settings>('SELECT * FROM settings WHERE id = 1');
    if (!data) return { success: false, key: 'error.settingsNotFound' };
    return { success: true, data };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const updateSettings = async (
  db: DatabaseAdapter,
  data: Settings
): Promise<Response<Settings>> => {
  try {
    const params = settingsFields.map(key => (data[key] ?? null) as unknown);
    const setClause =
      settingsFields.map(f => `"${String(f)}" = ?`).join(', ') +
      `, "updatedAt" = ${getDefaultValue(db.type, true) === 'TRUE' ? 'NOW()' : "(datetime('now'))"}`;
    
    await db.run(`UPDATE settings SET ${setClause} WHERE id = 1`, params);

    const updated = await db.get<Settings>('SELECT * FROM settings WHERE id = 1');
    return { success: true, data: updated ?? undefined };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
