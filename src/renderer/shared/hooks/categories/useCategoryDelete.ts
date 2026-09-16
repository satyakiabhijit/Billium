import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useCategoryDelete = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (id: number, onSuccess?: () => void) => {
    await runAsync(() => api.deleteCategory(id), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
