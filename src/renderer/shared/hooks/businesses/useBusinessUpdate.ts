import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { BusinessUpdate } from '../../types/business';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useBusinessUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: BusinessUpdate, onSuccess?: () => void) => {
      await runAsync(() => api.updateBusiness(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
