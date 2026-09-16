export interface Item {
  id?: number;
  name?: string;
  description?: string;
  unitPriceCents?: string;
  taxRate?: number;
  categoryId?: number;
  unitId?: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ItemAdd = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
export type ItemUpdate = Omit<Item, 'createdAt' | 'updatedAt'>;
