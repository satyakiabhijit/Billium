import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { ItemUpdate } from '../../types/item';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useItemUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: ItemUpdate, onSuccess?: () => void) => {
    await runAsync(() => api.updateItem(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
