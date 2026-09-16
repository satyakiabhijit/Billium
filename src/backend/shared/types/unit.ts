export interface Unit {
  id?: number;
  name?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UnitAdd = Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>;
export type UnitUpdate = Omit<Unit, 'createdAt' | 'updatedAt'>;
