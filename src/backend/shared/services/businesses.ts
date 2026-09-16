import type { Business } from '../types/business';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const businessFields: (keyof Business)[] = [
  'name',
  'shortName',
  'address',
  'email',
  'phone',
  'additional',
  'paymentInformation',
  'fileSize',
  'fileType',
  'fileName',
  'logo',
  'vatCode',
  'peppolEndpointId',
  'countryCode',
  'code',
  'peppolEndpointSchemeId',
  'isArchived'
];

const aggregation = {
  invoiceCountExpr: 'COUNT(DISTINCT i.id)',
  quotesCountExpr: '0',
  joins: 'LEFT JOIN invoices i ON i.businessId = b.id AND i.invoiceType = \'invoice\''
};

export const getAllBusinesses = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Business & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Business>(db, 'businesses', 'b', 'i', aggregation);
  return getAll(filter);
};

export const addBusiness = async (db: DatabaseAdapter, data: Business): Promise<Response<Business & EntityWithCounts>> => {
  const add = handleEntity<Business>(db, 'businesses', 'b', businessFields, aggregation);
  return add(data, false);
};

export const updateBusiness = async (db: DatabaseAdapter, data: Business): Promise<Response<Business & EntityWithCounts>> => {
  const update = handleEntity<Business>(db, 'businesses', 'b', businessFields, aggregation);
  return update(data, true);
};

export const deleteBusiness = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM businesses WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const getBusinessById = async (
  db: DatabaseAdapter,
  id: number
): Promise<Response<(Business & EntityWithCounts)>> => {
  try {
    const sql = `
      SELECT b.*,
      ${aggregation.invoiceCountExpr} AS "invoiceCount",
      ${aggregation.quotesCountExpr} AS "quotesCount"
      FROM businesses b
      ${aggregation.joins}
      WHERE b.id = ?
      GROUP BY b.id
    `;
    const data = await db.get<Business & EntityWithCounts>(sql, [id]);
    return { success: true, data: data ?? undefined };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
