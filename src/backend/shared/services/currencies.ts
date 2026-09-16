import type { Currency } from '../types/currency';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const currencyFields: (keyof Currency)[] = ['code', 'name', 'symbol', 'subunit', 'isArchived'];

const aggregation = {
  invoiceCountExpr: 'COUNT(DISTINCT i.id)',
  quotesCountExpr: '0',
  joins: 'LEFT JOIN invoices i ON i.currencyId = c.id AND i.invoiceType = \'invoice\''
};

export const getAllCurrencies = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Currency & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Currency>(db, 'currencies', 'c', 'i', aggregation);
  return getAll(filter);
};

export const addCurrency = async (
  db: DatabaseAdapter,
  data: Currency
): Promise<Response<Currency & EntityWithCounts>> => {
  const add = handleEntity<Currency>(db, 'currencies', 'c', currencyFields, aggregation);
  return add(data, false);
};

export const updateCurrency = async (
  db: DatabaseAdapter,
  data: Currency
): Promise<Response<Currency & EntityWithCounts>> => {
  const update = handleEntity<Currency>(db, 'currencies', 'c', currencyFields, aggregation);
  return update(data, true);
};

export const deleteCurrency = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM currencies WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
