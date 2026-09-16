import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Invoice } from '../../../../backend/shared/types/invoice';

const fetcher = async ([_key, filter]: [string, any]) => {
  const res = await getApi().getInvoices(filter);
  if (!res.success) throw new Error(res.error || 'Failed to fetch');
  return res.data as Invoice[];
};

export const useInvoicesRetrieve = (filter?: any) => {
  return useSWR<Invoice[]>(['invoices', filter], fetcher, { fallbackData: [] });
};