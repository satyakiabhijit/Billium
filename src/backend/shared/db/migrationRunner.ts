import type { DatabaseAdapter } from '../types/DatabaseAdapter';

export interface Migration {
  name: string;
  up: (db: DatabaseAdapter) => Promise<void>;
}

export const runMigrations = async (db: DatabaseAdapter, migrations: Migration[]): Promise<void> => {
  // Create migrations tracking table
  let createSql = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      appliedAt TEXT DEFAULT (datetime('now'))
    )
  `;

  if (db.type === 'postgres') {
    createSql = createSql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY');
    createSql = createSql.replace(/TEXT DEFAULT \(datetime\('now'\)\)/g, 'TIMESTAMPTZ DEFAULT NOW()');
  }

  await db.run(createSql);

  for (const migration of migrations) {
    const existing = await db.get<{ name: string }>('SELECT name FROM _migrations WHERE name = ?', [migration.name]);

    if (!existing) {
      console.log(`Running migration: ${migration.name}`);
      try {
        await migration.up(db);
        await db.run('INSERT INTO _migrations (name) VALUES (?)', [migration.name]);
        console.log(`Migration applied: ${migration.name}`);
      } catch (err) {
        console.error(`Migration failed: ${migration.name}`, err);
        throw err;
      }
    }
  }
};
