import { Pool } from 'pg';
import sqlite3 from 'sqlite3';
import { DatabaseType } from '../enums/databaseType';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import {
  convertBooleanFields,
  convertBooleanFieldsArray,
  convertDateFields,
  convertDateFieldsArray
} from '../utils/dbHelper';

const convertQuestionToDollar = (sql: string) => {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

export const createSqliteAdapter = (db: sqlite3.Database): DatabaseAdapter => {
  return {
    type: DatabaseType.sqlite,
    run: (sql: string, params: unknown[] = [], returningId = false) =>
      new Promise<number>((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve(returningId ? this.lastID : -1);
        });
      }),
    get: <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
      new Promise<T | null>((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(null);
          const convertedRow = convertBooleanFields(row as Record<string, unknown>);
          resolve(convertedRow as T);
        });
      }),
    all: <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
      new Promise<T[]>((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          const converted = convertBooleanFieldsArray(rows as Record<string, unknown>[]);
          resolve(converted as T[]);
        });
      }),
    close: () =>
      new Promise<void>((resolve, reject) => {
        db.close(err => {
          if (err) return reject(err);
          resolve();
        });
      })
  };
};

export const createPostgresAdapter = async (connectionString: string): Promise<DatabaseAdapter> => {
  const pool = new Pool({ connectionString });

  return {
    type: DatabaseType.postgres,
    run: async (sql: string, params: unknown[] = [], returningId = false) => {
      const pgSql = returningId
        ? convertQuestionToDollar(sql) + ' RETURNING id'
        : convertQuestionToDollar(sql);
      const result = await pool.query(pgSql, params);
      return returningId && result.rows.length > 0 ? (result.rows[0].id as number) : -1;
    },
    get: async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
      const pgSql = convertQuestionToDollar(sql);
      const result = await pool.query(pgSql, params);
      if (result.rows.length === 0) return null;
      const row = convertBooleanFields(result.rows[0] as Record<string, unknown>);
      const convertedRow = convertDateFields(row);
      return convertedRow as T;
    },
    all: async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
      const pgSql = convertQuestionToDollar(sql);
      const result = await pool.query(pgSql, params);
      const rows = convertBooleanFieldsArray(result.rows as Record<string, unknown>[]);
      const convertedRows = convertDateFieldsArray(rows);
      return convertedRows as T[];
    },
    close: async () => {
      await pool.end();
    }
  };
};
