import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { StyleProfileAdd } from '../../types/styleProfile';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useStyleProfileAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: StyleProfileAdd, onSuccess?: () => void) => {
      await runAsync(() => api.addStyleProfile(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
