import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { CategoryAdd } from '../../types/category';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useCategoryAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: CategoryAdd, onSuccess?: () => void) => {
    await runAsync(() => api.addCategory(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
