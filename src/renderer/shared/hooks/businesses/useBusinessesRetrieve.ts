import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Business } from '../../types/business';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getBusinesses(filter)) as Response<(Business & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch businesses');
  return res.data || [];
};

export const useBusinessesRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['businesses', filter], fetcher);

  return {
    data: data || [],
    isLoading,
    error,
    mutate
  };
};
