import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { TaxUpdate } from '../../../backend/shared/types/tax';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useTaxUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: TaxUpdate, onSuccess?: () => void) => {
      await runAsync(() => api.updateTax(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
