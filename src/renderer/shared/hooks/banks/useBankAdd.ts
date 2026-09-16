import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { BankAdd } from '../../types/bank';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useBankAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: BankAdd, onSuccess?: () => void) => {
      await runAsync(() => api.addBank(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
