import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { InvoiceUpdate } from '../../../../backend/shared/types/invoice';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useInvoiceUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: InvoiceUpdate, onSuccess?: () => void) => {
      await runAsync(() => api.updateInvoice(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};