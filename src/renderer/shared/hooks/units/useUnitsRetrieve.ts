import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Unit } from '../../types/unit';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getUnits(filter)) as Response<(Unit & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch units');
  return res.data || [];
};

export const useUnitsRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['units', filter], fetcher);
  return { data: data || [], isLoading, error, mutate };
};
