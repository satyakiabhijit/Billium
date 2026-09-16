import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { CategoryUpdate } from '../../types/category';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useCategoryUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: CategoryUpdate, onSuccess?: () => void) => {
    await runAsync(() => api.updateCategory(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
