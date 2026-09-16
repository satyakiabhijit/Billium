import type { Unit } from '../types/unit';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const unitFields: (keyof Unit)[] = ['name', 'isArchived'];

const aggregation = {
  invoiceCountExpr: '0',
  quotesCountExpr: '0',
  joins: ''
};

export const getAllUnits = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Unit & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Unit>(db, 'units', 'u', '', aggregation);
  return getAll(filter);
};

export const addUnit = async (
  db: DatabaseAdapter,
  data: Unit
): Promise<Response<Unit & EntityWithCounts>> => {
  const add = handleEntity<Unit>(db, 'units', 'u', unitFields, aggregation);
  return add(data, false);
};

export const updateUnit = async (
  db: DatabaseAdapter,
  data: Unit
): Promise<Response<Unit & EntityWithCounts>> => {
  const update = handleEntity<Unit>(db, 'units', 'u', unitFields, aggregation);
  return update(data, true);
};

export const deleteUnit = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM units WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
