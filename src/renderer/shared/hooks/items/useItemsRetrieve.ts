import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Item } from '../../types/item';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getItems(filter)) as Response<(Item & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch items');
  return res.data || [];
};

export const useItemsRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['items', filter], fetcher);
  return { data: data || [], isLoading, error, mutate };
};
