import { type Express, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { openSqlLite, openPostgreSql, testPostgresConnection } from '../../shared/db/setup';
import { createSchema } from '../../shared/db/setup';
import { runMigrations } from '../../shared/db/migrationRunner';
import type { DatabaseAdapter } from '../../shared/types/DatabaseAdapter';
import type { PostgresConfig } from '../../shared/types/postgresConfig';
import { APP_CONFIG } from '../config';

let currentDb: DatabaseAdapter | null = null;

export const getDb = (): DatabaseAdapter | null => currentDb;

const initDb = async (db: DatabaseAdapter) => {
  await createSchema(db);
  await runMigrations(db, []);
  currentDb = db;
};

export const initDatabaseController = (app: Express) => {
  // List available SQLite databases in the data directory
  app.get('/api/databases', (_req: Request, res: Response) => {
    const dataDir = path.resolve(APP_CONFIG.DB_DIRECTORY);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.db') || f.endsWith('.sqlite'));
    res.json({ success: true, data: files });
  });

  // Create a new SQLite database
  app.post('/api/database/sqlite/create', async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const fullPath = path.resolve(APP_CONFIG.DB_DIRECTORY, name);
      const { db } = await openSqlLite({ fullPath, createIfMissing: true });
      await initDb(db);
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, error: String(err) });
    }
  });

  // Open an existing SQLite database
  app.post('/api/database/sqlite/open', async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const fullPath = path.resolve(APP_CONFIG.DB_DIRECTORY, name);
      const { db } = await openSqlLite({ fullPath, createIfMissing: false });
      await initDb(db);
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, error: String(err) });
    }
  });

  // Test PostgreSQL connection
  app.post('/api/database/postgres/test', async (req: Request, res: Response) => {
    try {
      const config: PostgresConfig = req.body;
      await testPostgresConnection(config);
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, error: String(err) });
    }
  });

  // Open PostgreSQL database
  app.post('/api/database/postgres/open', async (req: Request, res: Response) => {
    try {
      const config: PostgresConfig = req.body;
      const { db } = await openPostgreSql(config);
      await initDb(db);
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, error: String(err) });
    }
  });

  // Close current database
  app.post('/api/database/close', async (_req: Request, res: Response) => {
    try {
      if (currentDb) {
        await currentDb.close();
        currentDb = null;
      }
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, error: String(err) });
    }
  });
};
