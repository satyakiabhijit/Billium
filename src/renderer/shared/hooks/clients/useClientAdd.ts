import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { ClientAdd } from '../../types/client';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useClientAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: ClientAdd, onSuccess?: () => void) => {
      await runAsync(() => api.addClient(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
