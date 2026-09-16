import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { BusinessAdd } from '../../types/business';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useBusinessAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: BusinessAdd, onSuccess?: () => void) => {
      await runAsync(() => api.addBusiness(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
