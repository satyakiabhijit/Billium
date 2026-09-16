import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { BankUpdate } from '../../types/bank';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useBankUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: BankUpdate, onSuccess?: () => void) => {
      await runAsync(() => api.updateBank(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
