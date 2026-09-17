import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { StyleProfile } from '../../types/styleProfile';
import type { EntityWithCounts } from '../../types/entityWithCounts';
import type { FilterData } from '../../types/invoiceFilter';
import type { Response } from '../../types/response';

const fetcher = async ([_key, filter]: [string, FilterData[] | undefined]) => {
  const api = getApi();
  const res = (await api.getStyleProfiles(filter)) as Response<(StyleProfile & EntityWithCounts)[]>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch styleProfiles');
  return res.data || [];
};

export const useStyleProfilesRetrieve = (filter?: FilterData[]) => {
  const { data, error, isLoading, mutate } = useSWR(['styleProfiles', filter], fetcher);

  return {
    data: data || [],
    isLoading,
    error,
    mutate
  };
};
