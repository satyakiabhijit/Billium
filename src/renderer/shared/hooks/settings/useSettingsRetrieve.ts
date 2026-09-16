import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { Settings } from '../../types/settings';
import type { Response } from '../../types/response';

const fetcher = async () => {
  const api = getApi();
  const res = (await api.getSettings()) as Response<Settings>;
  if (!res.success) throw new Error(res.error || res.key || 'Failed to fetch settings');
  return res.data;
};

export const useSettingsRetrieve = () => {
  const { data, error, isLoading, mutate } = useSWR('settings', fetcher);
  return { data, isLoading, error, mutate };
};
