import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { CurrencyUpdate } from '../../types/currency';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useCurrencyUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: CurrencyUpdate, onSuccess?: () => void) => {
    await runAsync(() => api.updateCurrency(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
