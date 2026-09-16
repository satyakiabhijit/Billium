import type { Category } from '../types/category';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const categoryFields: (keyof Category)[] = ['name', 'isArchived'];

const aggregation = {
  invoiceCountExpr: '0',
  quotesCountExpr: '0',
  joins: '' // Categories don't directly tie to invoices at the header level
};

export const getAllCategories = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Category & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Category>(db, 'categories', 'c', '', aggregation);
  return getAll(filter);
};

export const addCategory = async (
  db: DatabaseAdapter,
  data: Category
): Promise<Response<Category & EntityWithCounts>> => {
  const add = handleEntity<Category>(db, 'categories', 'c', categoryFields, aggregation);
  return add(data, false);
};

export const updateCategory = async (
  db: DatabaseAdapter,
  data: Category
): Promise<Response<Category & EntityWithCounts>> => {
  const update = handleEntity<Category>(db, 'categories', 'c', categoryFields, aggregation);
  return update(data, true);
};

export const deleteCategory = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM categories WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
