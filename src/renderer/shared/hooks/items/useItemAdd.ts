import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { ItemAdd } from '../../types/item';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useItemAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: ItemAdd, onSuccess?: () => void) => {
    await runAsync(() => api.addItem(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
