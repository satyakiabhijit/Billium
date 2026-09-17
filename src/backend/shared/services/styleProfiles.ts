import type { StyleProfile } from '../types/styleProfile';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { EntityWithCounts } from '../types/entityWithCounts';
import type { FilterData } from '../types/invoiceFilter';
import type { Response } from '../types/response';
import { getAllEntities, handleEntity } from '../utils/entitiesFunctions';
import { mapDatabaseError } from '../utils/errorFunctions';

const styleProfileFields: (keyof StyleProfile)[] = ['name', 'templateName', 'primaryColor', 'secondaryColor', 'fontFamily', 'isArchived'];
const aggregation = {
  invoiceCountExpr: 'COUNT(DISTINCT i.id)',
  quotesCountExpr: '0',
  joins: 'LEFT JOIN invoices i ON i.styleProfilesId = sp.id AND i.invoiceType = \'invoice\''
};

export const getAllStyleProfiles = async (
  db: DatabaseAdapter,
  filter?: FilterData[]
): Promise<Response<(StyleProfile & EntityWithCounts)[]>> => {
  const getAll = getAllEntities<StyleProfile>(db, 'style_profiles', 'sp', 'i', aggregation);
  return getAll(filter);
};

export const getStyleProfileById = async (
  db: DatabaseAdapter,
  id: number
): Promise<Response<StyleProfile & EntityWithCounts>> => {
  try {
    const res = await db.query<(StyleProfile & EntityWithCounts)[]>(`
      SELECT sp.*, ${aggregation.invoiceCountExpr} as invoiceCount
      FROM style_profiles sp
      ${aggregation.joins}
      WHERE sp.id = ?
      GROUP BY sp.id
    `, [id]);
    if (res.length === 0) return { success: false, message: 'Style Profile not found' };
    return { success: true, data: res[0] };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};

export const addStyleProfile = async (db: DatabaseAdapter, data: StyleProfile): Promise<Response<StyleProfile & EntityWithCounts>> => {
  const add = handleEntity<StyleProfile>(db, 'style_profiles', 'sp', styleProfileFields, aggregation);
  return add(data, false);
};

export const updateStyleProfile = async (db: DatabaseAdapter, data: StyleProfile): Promise<Response<StyleProfile & EntityWithCounts>> => {
  const update = handleEntity<StyleProfile>(db, 'style_profiles', 'sp', styleProfileFields, aggregation);
  return update(data, true);
};

export const deleteStyleProfile = async (db: DatabaseAdapter, id: number): Promise<Response<void>> => {
  try {
    await db.run('DELETE FROM style_profiles WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
