import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Bank } from '../../types/bank';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getBanks(filter)) as Response<(Bank & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch banks');
  return res.data || [];
};

export const useBanksRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['banks', filter], fetcher);

  return {
    data: data || [],
    isLoading,
    error,
    mutate
  };
};
