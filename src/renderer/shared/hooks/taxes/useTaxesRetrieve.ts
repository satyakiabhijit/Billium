import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Tax } from '../../../backend/shared/types/tax';
import type { EntityWithCounts } from '../../../backend/shared/types/entityWithCounts';
import type { FilterData } from '../../../backend/shared/types/invoiceFilter';
import type { Response } from '../../../backend/shared/types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getTaxes(filter)) as Response<(Tax & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch taxes');
  return res.data || [];
};

export const useTaxesRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['taxes', filter], fetcher);
  return { data: data || [], isLoading, error, mutate };
};
