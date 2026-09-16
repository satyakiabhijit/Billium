import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { UnitAdd } from '../../types/unit';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useUnitAdd = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: UnitAdd, onSuccess?: () => void) => {
    await runAsync(() => api.addUnit(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
