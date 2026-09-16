import type { DatabaseAdapter } from '../shared/types/DatabaseAdapter';
import { createSchema } from '../shared/db/setup';
import { runMigrations } from '../shared/db/migrationRunner';

export const initDatabase = async (db: DatabaseAdapter): Promise<void> => {
  await createSchema(db);
  await runMigrations(db, []);
};
