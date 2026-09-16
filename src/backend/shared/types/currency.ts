export interface Currency {
  id?: number;
  code?: string;
  name?: string;
  symbol?: string;
  subunit?: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CurrencyAdd = Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>;
export type CurrencyUpdate = Omit<Currency, 'createdAt' | 'updatedAt'>;
