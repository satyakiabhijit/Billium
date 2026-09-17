import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useStyleProfileDelete = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (id: number, onSuccess?: () => void) => {
      await runAsync(() => api.deleteStyleProfile(id), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
