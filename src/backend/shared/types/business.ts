export interface Business {
  id?: number;
  name?: string;
  shortName?: string;
  address?: string;
  email?: string;
  phone?: string;
  additional?: string;
  paymentInformation?: string;
  fileSize?: number;
  fileType?: string;
  fileName?: string;
  logo?: string | Uint8Array;
  vatCode?: string;
  peppolEndpointId?: string;
  countryCode?: string;
  code?: string;
  peppolEndpointSchemeId?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BusinessAdd = Omit<Business, 'id' | 'createdAt' | 'updatedAt'>;
export type BusinessUpdate = Omit<Business, 'createdAt' | 'updatedAt'>;
