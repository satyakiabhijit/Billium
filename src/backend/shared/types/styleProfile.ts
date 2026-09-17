export interface StyleProfile {
  id?: number;
  name?: string;
  templateName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type StyleProfileAdd = Omit<StyleProfile, 'id' | 'createdAt' | 'updatedAt'>;
export type StyleProfileUpdate = Required<Pick<StyleProfile, 'id'>> & Partial<Omit<StyleProfile, 'id'>>;
