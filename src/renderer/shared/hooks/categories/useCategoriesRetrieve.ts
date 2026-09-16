import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Category } from '../../types/category';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getCategories(filter)) as Response<(Category & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch categories');
  return res.data || [];
};

export const useCategoriesRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['categories', filter], fetcher);
  return { data: data || [], isLoading, error, mutate };
};
