import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { UnitUpdate } from '../../types/unit';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useUnitUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: UnitUpdate, onSuccess?: () => void) => {
    await runAsync(() => api.updateUnit(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
