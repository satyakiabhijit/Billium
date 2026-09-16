export interface Client {
  id?: number;
  name?: string;
  shortName?: string;
  address?: string;
  email?: string;
  phone?: string;
  code?: string;
  additional?: string;
  vatCode?: string;
  peppolEndpointId?: string;
  countryCode?: string;
  peppolEndpointSchemeId?: string;
  buyerReference?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ClientAdd = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type ClientUpdate = Omit<Client, 'createdAt' | 'updatedAt'>;
