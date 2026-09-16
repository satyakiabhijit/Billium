import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { QuoteAdd } from '../../../../backend/shared/types/quote';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useQuoteAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: QuoteAdd, onSuccess?: () => void) => {
      await runAsync(() => api.addQuote(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};