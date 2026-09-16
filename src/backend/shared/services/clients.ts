import type { Client } from '../types/client';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const clientFields: (keyof Client)[] = [
  'name',
  'shortName',
  'address',
  'email',
  'phone',
  'code',
  'additional',
  'vatCode',
  'peppolEndpointId',
  'countryCode',
  'peppolEndpointSchemeId',
  'buyerReference',
  'isArchived'
];

const aggregation = {
  invoiceCountExpr: 'COUNT(DISTINCT i.id)',
  quotesCountExpr: '0',
  joins: 'LEFT JOIN invoices i ON i.clientId = c.id AND i.invoiceType = \'invoice\''
};

export const getAllClients = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(Client & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<Client>(db, 'clients', 'c', 'i', aggregation);
  return getAll(filter);
};

export const addClient = async (db: DatabaseAdapter, data: Client): Promise<Response<Client & EntityWithCounts>> => {
  const add = handleEntity<Client>(db, 'clients', 'c', clientFields, aggregation);
  return add(data, false);
};

export const updateClient = async (db: DatabaseAdapter, data: Client): Promise<Response<Client & EntityWithCounts>> => {
  const update = handleEntity<Client>(db, 'clients', 'c', clientFields, aggregation);
  return update(data, true);
};

export const deleteClient = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM clients WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const getClientById = async (
  db: DatabaseAdapter,
  id: number
): Promise<Response<(Client & EntityWithCounts)>> => {
  try {
    const sql = `
      SELECT c.*,
      ${aggregation.invoiceCountExpr} AS "invoiceCount",
      ${aggregation.quotesCountExpr} AS "quotesCount"
      FROM clients c
      ${aggregation.joins}
      WHERE c.id = ?
      GROUP BY c.id
    `;
    const data = await db.get<Client & EntityWithCounts>(sql, [id]);
    return { success: true, data: data ?? undefined };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
