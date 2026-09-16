import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { ClientUpdate } from '../../types/client';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useClientUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: ClientUpdate, onSuccess?: () => void) => {
      await runAsync(() => api.updateClient(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
