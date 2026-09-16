import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Quote } from '../../../../backend/shared/types/quote';

const fetcher = async ([_key, filter]: [string, any]) => {
  const res = await getApi().getQuotes(filter);
  if (!res.success) throw new Error(res.error || 'Failed to fetch');
  return res.data as Quote[];
};

export const useQuotesRetrieve = (filter?: any) => {
  return useSWR<Quote[]>(['quotes', filter], fetcher, { fallbackData: [] });
};