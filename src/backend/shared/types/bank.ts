export interface Bank {
  id?: number;
  name?: string;
  bankName?: string;
  accountNumber?: string;
  swiftCode?: string;
  address?: string;
  branchCode?: string;
  type?: string;
  routingNumber?: string;
  accountHolder?: string;
  sortOrder?: string;
  upiCode?: string;
  qrCode?: string | Uint8Array;
  qrCodeFileSize?: number;
  qrCodeFileType?: string;
  qrCodeFileName?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BankAdd = Omit<Bank, 'id' | 'createdAt' | 'updatedAt'>;
export type BankUpdate = Omit<Bank, 'createdAt' | 'updatedAt'>;
