import type { Item } from '../types/item';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const itemFields: (keyof Item)[] = [
  'name',
  'description',
  'unitPriceCents',
  'taxRate',
  'categoryId',
  'unitId',
  'isArchived'
];

const aggregation = {
  invoiceCountExpr: '0', // Items are linked via invoice_items, not at the header level
  quotesCountExpr: '0',
  joins: ''
};

export const getAllItems = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Item & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Item>(db, 'items', 'i', '', aggregation);
  return getAll(filter);
};

export const addItem = async (
  db: DatabaseAdapter,
  data: Item
): Promise<Response<Item & EntityWithCounts>> => {
  const add = handleEntity<Item>(db, 'items', 'i', itemFields, aggregation);
  return add(data, false);
};

export const updateItem = async (
  db: DatabaseAdapter,
  data: Item
): Promise<Response<Item & EntityWithCounts>> => {
  const update = handleEntity<Item>(db, 'items', 'i', itemFields, aggregation);
  return update(data, true);
};

export const deleteItem = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM items WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const getItemById = async (
  db: DatabaseAdapter,
  id: number
): Promise<Response<(Item & EntityWithCounts)>> => {
  try {
    const sql = `
      SELECT i.*,
      ${aggregation.invoiceCountExpr} AS "invoiceCount",
      ${aggregation.quotesCountExpr} AS "quotesCount"
      FROM items i
      ${aggregation.joins}
      WHERE i.id = ?
      GROUP BY i.id
    `;
    const data = await db.get<Item & EntityWithCounts>(sql, [id]);
    return { success: true, data: data ?? undefined };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
