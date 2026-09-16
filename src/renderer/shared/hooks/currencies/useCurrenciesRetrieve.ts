import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Currency } from '../../types/currency';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getCurrencies(filter)) as Response<(Currency & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch currencies');
  return res.data || [];
};

export const useCurrenciesRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['currencies', filter], fetcher);
  return { data: data || [], isLoading, error, mutate };
};
