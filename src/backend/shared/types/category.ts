export interface Category {
  id?: number;
  name?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryAdd = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryUpdate = Omit<Category, 'createdAt' | 'updatedAt'>;
