import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Client } from '../../types/client';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getClients(filter)) as Response<(Client & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch clients');
  return res.data || [];
};

export const useClientsRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['clients', filter], fetcher);

  return {
    data: data || [],
    isLoading,
    error,
    mutate
  };
};
