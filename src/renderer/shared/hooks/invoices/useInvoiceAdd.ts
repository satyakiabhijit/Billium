import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { InvoiceAdd } from '../../../../backend/shared/types/invoice';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useInvoiceAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: InvoiceAdd, onSuccess?: () => void) => {
      await runAsync(() => api.addInvoice(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};