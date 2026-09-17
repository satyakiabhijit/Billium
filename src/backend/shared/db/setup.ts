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
      defaultCurrencyId INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Idempotent column additions for settings
  await db.run(`ALTER TABLE settings ADD COLUMN defaultCurrencyId INTEGER`).catch(() => {});

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

  // Add new columns to businesses if they don't exist (idempotent ALTER TABLE)
  await db.run(`ALTER TABLE businesses ADD COLUMN gstNumber TEXT DEFAULT ''`).catch(() => {});
  await db.run(`ALTER TABLE businesses ADD COLUMN logoBase64 TEXT DEFAULT ''`).catch(() => {});


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

  // Taxes table
  await db.run(`
    CREATE TABLE IF NOT EXISTS taxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rate REAL NOT NULL,
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



  // Style Profiles table
  await db.run(`
    CREATE TABLE IF NOT EXISTS style_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      templateName TEXT DEFAULT 'standard',
      primaryColor TEXT DEFAULT '#000000',
      secondaryColor TEXT DEFAULT '#ffffff',
      fontFamily TEXT DEFAULT 'sans-serif',
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

  // Invoices table (handles both invoices and quotes via invoiceType)
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
      clientSnapshot TEXT,
      businessSnapshot TEXT,
      bankSnapshot TEXT,
      currencySnapshot TEXT,
      subtotalCents TEXT DEFAULT '0',
      taxTotalCents TEXT DEFAULT '0',
      discountTotalCents TEXT DEFAULT '0',
      grandTotalCents TEXT DEFAULT '0',
      isTaxInclusive INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Invoice Items table
  await db.run(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceId INTEGER NOT NULL,
      itemId INTEGER,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      quantity REAL NOT NULL DEFAULT 1,
      unitPriceCents TEXT NOT NULL DEFAULT '0',
      taxRate REAL NOT NULL DEFAULT 0,
      totalCents TEXT NOT NULL DEFAULT '0',
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (invoiceId) REFERENCES invoices(id) ON DELETE CASCADE
    )
  `);

  // Insert default settings row
  await db.run(`INSERT OR IGNORE INTO settings (id) VALUES (1)`);

  // Insert default invoice sequences
  await db.run(`INSERT OR IGNORE INTO invoice_sequences (invoiceType, nextSequence) VALUES ('invoice', 1)`);
  await db.run(`INSERT OR IGNORE INTO invoice_sequences (invoiceType, nextSequence) VALUES ('quote', 1)`);

  // Seed world currencies
  const worldCurrencies = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'AE' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', country: 'AF' },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', country: 'AL' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', country: 'AM' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ', country: 'AN' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', country: 'AO' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', country: 'AR' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'AU' },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ', country: 'AW' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', country: 'AZ' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM', country: 'BA' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', country: 'BB' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', country: 'BD' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', country: 'BG' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', country: 'BH' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'Fr', country: 'BI' },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: '$', country: 'BM' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', country: 'BN' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', country: 'BO' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'BR' },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$', country: 'BS' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu', country: 'BT' },
  { code: 'BWP', name: 'Botswanan Pula', symbol: 'P', country: 'BW' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', country: 'BY' },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$', country: 'BZ' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', country: 'CA' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'Fr', country: 'CD' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', country: 'CH' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', country: 'CL' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'CN' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', country: 'CO' },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', country: 'CR' },
  { code: 'CUP', name: 'Cuban Peso', symbol: '$', country: 'CU' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', country: 'CV' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', country: 'CZ' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fr', country: 'DJ' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'DK' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', country: 'DO' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', country: 'DZ' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'EG' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', country: 'ER' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'ET' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'EU' },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', country: 'FJ' },
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'GB' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', country: 'GE' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', country: 'GH' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', country: 'GM' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'Fr', country: 'GN' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', country: 'GT' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'GY$', country: 'GY' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', country: 'HK' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', country: 'HN' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', country: 'HR' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', country: 'HT' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'HU' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'ID' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', country: 'IL' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'IN' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', country: 'IQ' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', country: 'IR' },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', country: 'IS' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', country: 'JM' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', country: 'JO' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'JP' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'KE' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'лв', country: 'KG' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', country: 'KH' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'Fr', country: 'KM' },
  { code: 'KPW', name: 'North Korean Won', symbol: '₩', country: 'KP' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'KR' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', country: 'KW' },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$', country: 'KY' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', country: 'KZ' },
  { code: 'LAK', name: 'Laotian Kip', symbol: '₭', country: 'LA' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£', country: 'LB' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', country: 'LK' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', country: 'LR' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', country: 'LS' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD', country: 'LY' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', country: 'MA' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', country: 'MD' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', country: 'MG' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', country: 'MK' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', country: 'MM' },
  { code: 'MNT', name: 'Mongolian Tögrög', symbol: '₮', country: 'MN' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'P', country: 'MO' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', country: 'MR' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: 'Rs', country: 'MU' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', country: 'MV' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', country: 'MW' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'MX' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'MY' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', country: 'MZ' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', country: 'NA' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'NG' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', country: 'NI' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'NO' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', country: 'NP' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'NZ' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', country: 'OM' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', country: 'PA' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.', country: 'PE' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', country: 'PG' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', country: 'PH' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', country: 'PK' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', country: 'PL' },
  { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲', country: 'PY' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', country: 'QA' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'RO' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'din', country: 'RS' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', country: 'RU' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'Fr', country: 'RW' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', country: 'SA' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$', country: 'SB' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'Rs', country: 'SC' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'LS', country: 'SD' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'SE' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'SG' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', country: 'SL' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh', country: 'SO' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', country: 'SR' },
  { code: 'STN', name: 'São Tomé & Príncipe Dobra', symbol: 'Db', country: 'ST' },
  { code: 'SVC', name: 'Salvadoran Colón', symbol: '₡', country: 'SV' },
  { code: 'SYP', name: 'Syrian Pound', symbol: 'LS', country: 'SY' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L', country: 'SZ' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', country: 'TH' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM', country: 'TJ' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', country: 'TM' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', country: 'TN' },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$', country: 'TO' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'TR' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar', symbol: 'TT$', country: 'TT' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', country: 'TW' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'Sh', country: 'TZ' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', country: 'UA' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'Sh', country: 'UG' },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'US' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', country: 'UY' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'лв', country: 'UZ' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.', country: 'VE' },
  { code: 'VND', name: 'Vietnamese Đồng', symbol: '₫', country: 'VN' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'Vt', country: 'VU' },
  { code: 'WST', name: 'Samoan Tālā', symbol: 'WS$', country: 'WS' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'Fr', country: 'XA' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'Fr', country: 'XO' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', country: 'YE' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'ZA' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', country: 'ZM' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$', country: 'ZW' },
];
  for (const c of worldCurrencies) {
    await db.run(
      'INSERT OR IGNORE INTO currencies (code, name, symbol, subunit, isArchived) VALUES (?, ?, ?, 100, 0)',
      [c.code, c.name, c.symbol]
    );
  }

};
