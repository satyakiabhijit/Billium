import type { Bank } from '../types/bank';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const bankFields: (keyof Bank)[] = [
  'name',
  'bankName',
  'accountNumber',
  'swiftCode',
  'address',
  'branchCode',
  'type',
  'routingNumber',
  'accountHolder',
  'sortOrder',
  'upiCode',
  'qrCode',
  'qrCodeFileSize',
  'qrCodeFileType',
  'qrCodeFileName',
  'isArchived'
];

const aggregation = {
  invoiceCountExpr: 'COUNT(DISTINCT i.id)',
  quotesCountExpr: '0',
  joins: 'LEFT JOIN invoices i ON i.bankId = b.id AND i.invoiceType = \'invoice\''
};

export const getAllBanks = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Bank & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Bank>(db, 'banks', 'b', 'i', aggregation);
  return getAll(filter);
};

export const addBank = async (db: DatabaseAdapter, data: Bank): Promise<Response<Bank & EntityWithCounts>> => {
  const add = handleEntity<Bank>(db, 'banks', 'b', bankFields, aggregation);
  return add(data, false);
};

export const updateBank = async (db: DatabaseAdapter, data: Bank): Promise<Response<Bank & EntityWithCounts>> => {
  const update = handleEntity<Bank>(db, 'banks', 'b', bankFields, aggregation);
  return update(data, true);
};

export const deleteBank = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM banks WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const getBankById = async (
  db: DatabaseAdapter,
  id: number
): Promise<Response<(Bank & EntityWithCounts)>> => {
  try {
    const sql = `
      SELECT b.*,
      ${aggregation.invoiceCountExpr} AS "invoiceCount",
      ${aggregation.quotesCountExpr} AS "quotesCount"
      FROM banks b
      ${aggregation.joins}
      WHERE b.id = ?
      GROUP BY b.id
    `;
    const data = await db.get<Bank & EntityWithCounts>(sql, [id]);
    return { success: true, data: data ?? undefined };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
