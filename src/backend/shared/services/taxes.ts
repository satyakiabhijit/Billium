import type { Tax } from '../types/tax';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';
import type { FilterData } from '../types/invoiceFilter';

const taxFields: (keyof Tax)[] = ['name', 'rate', 'isArchived'];

const aggregation = {
  invoiceCountExpr: '0',
  quotesCountExpr: '0',
  joins: ''
};

export const getAllTaxes = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Tax & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Tax>(db, 'taxes', 't', 'i', aggregation);
  return getAll(filter);
};

export const addTax = async (db: DatabaseAdapter, data: Tax): Promise<Response<Tax & EntityWithCounts>> => {
  const add = handleEntity<Tax>(db, 'taxes', 't', taxFields, aggregation);
  return add(data, false);
};

export const updateTax = async (db: DatabaseAdapter, data: Tax): Promise<Response<Tax & EntityWithCounts>> => {
  const update = handleEntity<Tax>(db, 'taxes', 't', taxFields, aggregation);
  return update(data, true);
};

export const deleteTax = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM taxes WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
