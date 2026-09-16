import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { QuoteUpdate } from '../../../../backend/shared/types/quote';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useQuoteUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(
    async (data: QuoteUpdate, onSuccess?: () => void) => {
      await runAsync(() => api.updateQuote(data), {
        successMessage: t('common.success'),
        onSuccess
      });
    },
    [api, runAsync, t]
  );
};