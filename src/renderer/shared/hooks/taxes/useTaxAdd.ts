import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { TaxAdd } from '../../../backend/shared/types/tax';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useTaxAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: TaxAdd, onSuccess?: () => void) => {
      await runAsync(() => api.addTax(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};
