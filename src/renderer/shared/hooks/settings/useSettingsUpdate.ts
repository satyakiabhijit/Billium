import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../api/restApi';
import type { SettingsUpdate } from '../../types/settings';
import { useAsyncAction } from '../asyncAction/useAsyncAction';

export const useSettingsUpdate = () => {
  const { t } = useTranslation();
  const runAsync = useAsyncAction();
  const api = getApi();

  return useCallback(async (data: SettingsUpdate, onSuccess?: () => void) => {
    await runAsync(() => api.updateSettings(data), {
      successMessage: t('common.success'),
      onSuccess
    });
  }, [api, runAsync, t]);
};
