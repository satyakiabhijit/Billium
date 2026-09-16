export interface Tax {
  id?: number;
  name: string;
  rate: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TaxAdd = Omit<Tax, 'id' | 'createdAt' | 'updatedAt'>;
export type TaxUpdate = Omit<Tax, 'createdAt' | 'updatedAt'>;
