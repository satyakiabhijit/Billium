import { DatabaseType } from '../enums/databaseType';

const BOOLEAN_FIELDS = [
  'isArchived',
  'labelUpperCase',
  'showQuantity',
  'showUnit',
  'showRowNo',
  'ssl',
  'enableReceipt',
  'enableReports',
  'enableStyleProfiles',
  'enablePresets',
  'enableQuotes',
  'enablePeppol',
  'enableXRechnung'
];

const DATE_FIELDS = ['createdAt', 'updatedAt', 'issuedAt', 'dueDate', 'paidAt', 'closedAt'];

export const boolToInt = (val?: boolean): number => (val ? 1 : 0);

export const convertBooleanFields = (row: Record<string, unknown>): Record<string, unknown> => {
  const result = { ...row };
  for (const field of BOOLEAN_FIELDS) {
    if (field in result) {
      result[field] = result[field] === 1 || result[field] === true;
    }
  }
  return result;
};

export const convertBooleanFieldsArray = <T>(rows: T[]): T[] => {
  return rows.map(row => convertBooleanFields(row as Record<string, unknown>) as T);
};

export const convertDateFields = (row: Record<string, unknown>): Record<string, unknown> => {
  const result = { ...row };
  for (const field of DATE_FIELDS) {
    if (field in result && result[field]) {
      const val = result[field];
      if (val instanceof Date) {
        result[field] = val.toISOString();
      }
    }
  }
  return result;
};

export const convertDateFieldsArray = <T>(rows: T[]): T[] => {
  return rows.map(row => convertDateFields(row as Record<string, unknown>) as T);
};

export const getColumnType = (dbType: DatabaseType, columnType: 'text' | 'integer' | 'real' | 'boolean' | 'blob') => {
  if (dbType === DatabaseType.postgres) {
    switch (columnType) {
      case 'text':
        return 'TEXT';
      case 'integer':
        return 'INTEGER';
      case 'real':
        return 'DOUBLE PRECISION';
      case 'boolean':
        return 'BOOLEAN';
      case 'blob':
        return 'BYTEA';
      default:
        return 'TEXT';
    }
  }
  // SQLite
  switch (columnType) {
    case 'boolean':
      return 'INTEGER';
    case 'blob':
      return 'BLOB';
    default:
      return columnType.toUpperCase();
  }
};

export const getDefaultValue = (dbType: DatabaseType, val: boolean): string => {
  if (dbType === DatabaseType.postgres) {
    return val ? 'TRUE' : 'FALSE';
  }
  return val ? '1' : '0';
};

export const insertOrIgnore = (dbType: DatabaseType): string => {
  if (dbType === DatabaseType.postgres) {
    return 'INSERT INTO';
  }
  return 'INSERT OR IGNORE INTO';
};
