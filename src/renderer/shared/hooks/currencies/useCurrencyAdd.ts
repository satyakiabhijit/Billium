import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { CurrencyAdd } from '../../types/currency';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useCurrencyAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: CurrencyAdd, onSuccess?: () => void) => {
    await runAsync(() => api.addCurrency(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
