import useSWR from 'swr';
import { getApi } from '../../api/restApi';
import type { DashboardStats } from '../../../backend/shared/services/reports';

export const useReportsRetrieve = () => {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data?: DashboardStats }>(
    'reports:stats',
    async () => {
      const res = await getApi().getDashboardStats();
      return res as { success: boolean; data?: DashboardStats };
    },
    { revalidateOnFocus: true }
  );

  return {
    data: data?.success ? data.data : undefined,
    error,
    isLoading,
    mutate
  };
};
