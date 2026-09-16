import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import sqlite3 from 'sqlite3';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import type { PostgresConfig } from '../types/postgresConfig';
import { createPostgresAdapter, createSqliteAdapter } from './client';

const sanitizeDatabaseName = (database: string): string => {
  if (typeof database !== 'string' || database.trim().length === 0) {
    throw new Error('error.invalidDBName');
  }
  const trimmed = database.trim();
  const maxLength = 63;
  if (trimmed.length > maxLength) {
    throw new Error('error.databaseNameTooLong');
  }
  if (!/^[A-Za-z0-9_]+$/.test(trimmed)) {
    throw new Error('error.databaseNameInvalid');
  }
  return trimmed;
};

export const testPostgresConnection = async (data?: PostgresConfig): Promise<void> => {
  if (!data) throw new Error('error.connectionFailed');

  const { host, port, user, password, ssl } = data;

  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
    ssl
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
  } catch {
    throw new Error('error.connectionFailed');
  } finally {
    await client.end().catch(() => {});
  }
};

export const openPostgreSql = async (data: PostgresConfig): Promise<{ db: DatabaseAdapter }> => {
  const { host, port, user, password, database, ssl } = data;
  const safeDatabase = sanitizeDatabaseName(database);

  const authPart = password
    ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
    : encodeURIComponent(user);
  const sslPart = ssl ? '?sslmode=require' : '';
  const connectionString = `postgresql://${authPart}@${host}:${port}/${safeDatabase}${sslPart}`;

  try {
    const tempClient = new Client({
      host,
      port,
      user,
      password,
      database: 'postgres',
      ssl
    });
    await tempClient.connect();
    const res = await tempClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [safeDatabase]);
    if (res.rowCount === 0) {
      await tempClient.query(`CREATE DATABASE "${safeDatabase}"`);
    }
    await tempClient.end();
  } catch {
    throw new Error('error.databaseCreationFailed');
  }

  const adapter = await createPostgresAdapter(connectionString);

  return { db: adapter };
};

export const openSqlLite = async (data: {
  fullPath?: string;
  createIfMissing: boolean;
}): Promise<{ db: DatabaseAdapter }> => {
  const { fullPath, createIfMissing } = data;

  if (!fullPath) throw new Error('error.databasePathInvalid');

  const folder = path.dirname(fullPath);
  fs.mkdirSync(folder, { recursive: true });

  if (!createIfMissing && !fs.existsSync(fullPath)) {
    throw new Error('error.databaseNotFound');
  }

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(fullPath, err => {
      if (err) return reject(err);
      db.run('PRAGMA journal_mode=WAL', () => {
        db.run('PRAGMA foreign_keys=ON', () => {
          resolve({ db: createSqliteAdapter(db) });
        });
      });
    });
  });
};

export const createSchema = async (db: DatabaseAdapter): Promise<void> => {
  // Settings table
  await db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      language TEXT DEFAULT 'en',
      dateFormat TEXT DEFAULT 'YYYY-MM-DD',
      amountFormat TEXT DEFAULT '1,234.10',
      invoicePrefix TEXT DEFAULT '',
      invoiceSuffix TEXT DEFAULT '',
      quotePrefix TEXT DEFAULT '',
      quoteSuffix TEXT DEFAULT '',
      enableReceipt INTEGER DEFAULT 0,
      enableReports INTEGER DEFAULT 0,
      enableStyleProfiles INTEGER DEFAULT 0,
      enablePresets INTEGER DEFAULT 0,
      enableQuotes INTEGER DEFAULT 1,
      enablePeppol INTEGER DEFAULT 0,
      enableXRechnung INTEGER DEFAULT 0,
      pdfFileNameFormat TEXT DEFAULT '',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Businesses table
  await db.run(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      shortName TEXT NOT NULL DEFAULT '',
      address TEXT DEFAULT '',
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      additional TEXT DEFAULT '',
      paymentInformation TEXT DEFAULT '',
      fileSize INTEGER DEFAULT 0,
      fileType TEXT DEFAULT '',
      fileName TEXT DEFAULT '',
      logo BLOB,
      vatCode TEXT DEFAULT '',
      peppolEndpointId TEXT DEFAULT '',
      countryCode TEXT DEFAULT '',
      code TEXT DEFAULT '',
      peppolEndpointSchemeId TEXT DEFAULT '',
      isArchived INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Clients table
  await db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      shortName TEXT NOT NULL DEFAULT '',
      address TEXT DEFAULT '',
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      code TEXT DEFAULT '',
      additional TEXT DEFAULT '',
      vatCode TEXT DEFAULT '',
      peppolEndpointId TEXT DEFAULT '',
      countryCode TEXT DEFAULT '',
      peppolEndpointSchemeId TEXT DEFAULT '',
      buyerReference TEXT DEFAULT '',
      isArchived INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Categories table
  await db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      isArchived INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Units table
  await db.run(`
    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      isArchived INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Currencies table
  await db.run(`
    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL DEFAULT '',
      subunit INTEGER DEFAULT 100,
      isArchived INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Items table
  await db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      unitPriceCents TEXT DEFAULT '0',
      taxRate REAL DEFAULT 0,
      categoryId INTEGER,
      unitId INTEGER,
      isArchived INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (categoryId) REFERENCES categories(id),
      FOREIGN KEY (unitId) REFERENCES units(id)
    )
  `);

  // Banks table
  await db.run(`
    CREATE TABLE IF NOT EXISTS banks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      bankName TEXT DEFAULT '',
      accountNumber TEXT DEFAULT '',
      swiftCode TEXT DEFAULT '',
      address TEXT DEFAULT '',
      branchCode TEXT DEFAULT '',
      type TEXT DEFAULT '',
      routingNumber TEXT DEFAULT '',
      accountHolder TEXT DEFAULT '',
      sortOrder TEXT DEFAULT '',
      upiCode TEXT DEFAULT '',
      qrCodeFileSize INTEGER DEFAULT 0,
      qrCodeFileType TEXT DEFAULT '',
      qrCodeFileName TEXT DEFAULT '',
      qrCode BLOB,
      isArchived INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Invoice sequences table
  await db.run(`
    CREATE TABLE IF NOT EXISTS invoice_sequences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceType TEXT NOT NULL,
      nextSequence INTEGER DEFAULT 1,
      UNIQUE(invoiceType)
    )
  `);

  // Invoices table
  await db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceType TEXT NOT NULL DEFAULT 'invoice',
      convertedFromQuotationId INTEGER,
      invoiceNumber TEXT NOT NULL DEFAULT '',
      invoicePrefix TEXT DEFAULT '',
      invoiceSuffix TEXT DEFAULT '',
      businessId INTEGER NOT NULL,
      bankId INTEGER,
      clientId INTEGER NOT NULL,
      layoutId INTEGER,
      currencyId INTEGER NOT NULL,
      status TEXT DEFAULT 'unpaid',
      isArchived INTEGER DEFAULT 0,
      issuedAt TEXT DEFAULT (datetime('now')),
      dueDate TEXT,
      customerNotes TEXT DEFAULT '',
      thanksNotes TEXT DEFAULT '',
      termsConditionNotes TEXT DEFAULT '',
      discountName TEXT DEFAULT '',
      discountType TEXT,
      discountAmountCents TEXT DEFAULT '0',
      discountPercent REAL DEFAULT 0,
      surchargeType TEXT,
      surchargeAmountCents TEXT DEFAULT '0',
      surchargePercent REAL DEFAULT 0,
      surchargeName TEXT DEFAULT '',
      shippingFeeCents TEXT DEFAULT '0',
      taxName TEXT DEFAULT '',
      taxRate REAL DEFAULT 0,
      taxType TEXT,
      currencyFormat TEXT DEFAULT '',
      language TEXT DEFAULT 'en',
      signatureData BLOB,
      signatureSize INTEGER DEFAULT 0,
      signatureType TEXT DEFAULT '',
      signatureName TEXT DEFAULT '',
      styleProfilesId INTEGER,
      paidAt TEXT,
      closedAt TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Insert default settings row
  await db.run(`INSERT OR IGNORE INTO settings (id) VALUES (1)`);

  // Insert default invoice sequences
  await db.run(`INSERT OR IGNORE INTO invoice_sequences (invoiceType, nextSequence) VALUES ('invoice', 1)`);
  await db.run(`INSERT OR IGNORE INTO invoice_sequences (invoiceType, nextSequence) VALUES ('quote', 1)`);
};
