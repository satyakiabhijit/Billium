import { FilterType } from '../enums/filterType';
import type { FilterData } from '../types/invoiceFilter';
import { DatabaseType } from '../enums/databaseType';

const daysAgo = (dbType: DatabaseType, days: number): string =>
  dbType === DatabaseType.postgres ? `NOW() - INTERVAL '${days} days'` : `datetime('now', '-${days} days')`;

export const getWhereClauseFromFilters = (data: {
  filters: FilterData[];
  archivedColumn?: string;
  clientNameSnapshotColumn?: string;
  businessNameSnapshotColumn?: string;
  issuedAtColumn?: string;
  statusColumn?: string;
}): string => {
  const {
    filters,
    archivedColumn,
    clientNameSnapshotColumn,
    businessNameSnapshotColumn,
    issuedAtColumn,
    statusColumn
  } = data;

  const clauses: string[] = [];

  filters.forEach(({ type, value }) => {
    switch (type) {
      case FilterType.Active:
        if (archivedColumn) clauses.push(`${archivedColumn} = 0`);
        break;
      case FilterType.Archived:
        if (archivedColumn) clauses.push(`${archivedColumn} = 1`);
        break;
      case FilterType.Client:
        if (clientNameSnapshotColumn && value)
          clauses.push(`${clientNameSnapshotColumn} = '${value.replace(/'/g, "''")}'`);
        break;
      case FilterType.Business:
        if (businessNameSnapshotColumn && value)
          clauses.push(`${businessNameSnapshotColumn} = '${value.replace(/'/g, "''")}'`);
        break;
      case FilterType.Date:
        if (issuedAtColumn && value) {
          const dates = value.split(',');
          if (dates.length === 2) clauses.push(`${issuedAtColumn} BETWEEN '${dates[0]}' AND '${dates[1]}'`);
        }
        break;
      case FilterType.Status:
        if (statusColumn && value) clauses.push(`${statusColumn} = '${value.replace(/'/g, "''")}'`);
        break;
      case FilterType.All:
      default:
        break;
    }
  });

  return clauses.length ? clauses.join(' AND ') : '1=1';
};

export const getHavingClauseFromFilters = (data: {
  dbType: DatabaseType;
  filters: FilterData[];
  invoiceUpdatedAtColumn?: string;
  invoiceIdColumn?: string;
  archivedColumn?: string;
  clientNameSnapshotColumn?: string;
  businessNameSnapshotColumn?: string;
  issuedAtColumn?: string;
  statusColumn?: string;
}): string => {
  const {
    filters,
    dbType,
    invoiceUpdatedAtColumn,
    issuedAtColumn,
    invoiceIdColumn,
    archivedColumn,
    businessNameSnapshotColumn,
    clientNameSnapshotColumn,
    statusColumn
  } = data;

  if (!filters?.length) return '';

  const clauses: string[] = [];

  filters.forEach(({ type, value }) => {
    switch (type) {
      case FilterType.NoInvoices30:
        if (invoiceUpdatedAtColumn)
          clauses.push(
            `(MAX(${invoiceUpdatedAtColumn}) IS NULL OR MAX(${invoiceUpdatedAtColumn}) < ${daysAgo(dbType, 30)})`
          );
        break;
      case FilterType.NoInvoices60:
        if (invoiceUpdatedAtColumn)
          clauses.push(
            `(MAX(${invoiceUpdatedAtColumn}) IS NULL OR MAX(${invoiceUpdatedAtColumn}) < ${daysAgo(dbType, 60)})`
          );
        break;
      case FilterType.NoInvoices90:
        if (invoiceUpdatedAtColumn)
          clauses.push(
            `(MAX(${invoiceUpdatedAtColumn}) IS NULL OR MAX(${invoiceUpdatedAtColumn}) < ${daysAgo(dbType, 90)})`
          );
        break;
      case FilterType.NoInvoices:
        if (invoiceIdColumn) clauses.push(`(COUNT(${invoiceIdColumn}) = 0)`);
        break;
      case FilterType.AtLeastOneInvoice:
        if (invoiceIdColumn) clauses.push(`(COUNT(${invoiceIdColumn}) > 0)`);
        break;
      case FilterType.Active:
        if (archivedColumn) clauses.push(`(${archivedColumn} = 0)`);
        break;
      case FilterType.Archived:
        if (archivedColumn) clauses.push(`(${archivedColumn} = 1)`);
        break;
      case FilterType.Client:
        if (clientNameSnapshotColumn) clauses.push(`${clientNameSnapshotColumn} = '${value.replace(/'/g, "''")}'`);
        break;
      case FilterType.Business:
        if (businessNameSnapshotColumn) clauses.push(`${businessNameSnapshotColumn} = '${value.replace(/'/g, "''")}'`);
        break;
      case FilterType.Date:
        const dates = value.split(',');
        if (dates.length === 2 && issuedAtColumn) {
          clauses.push(`${issuedAtColumn} BETWEEN '${dates[0]}' AND '${dates[1]}'`);
        }
        break;
      case FilterType.Status:
        if (statusColumn) clauses.push(`${statusColumn} = '${value.replace(/'/g, "''")}'`);
        break;
      case FilterType.All:
      default:
        break;
    }
  });

  if (!clauses.length) return '';

  return `HAVING ${clauses.join(' AND ')}`;
};
