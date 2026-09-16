import { useCallback } from 'react';
import { useAppDispatch } from '../../../state/configureStore';
import { addToast, disableLoading, enableLoading } from '../../../state/pageSlice';
import type { Response } from '../../types/response';

export const useAsyncAction = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    async <T>(
      action: () => Promise<Response<T>>,
      options?: {
        onSuccess?: (data: T | undefined) => void;
        successMessage?: string;
        showError?: boolean;
      }
    ) => {
      const { onSuccess, successMessage, showError = true } = options || {};
      dispatch(enableLoading());

      try {
        const response = await action();
        if (response.success) {
          if (successMessage) {
            dispatch(addToast({ type: 'success', message: successMessage }));
          }
          if (onSuccess) {
            onSuccess(response.data);
          }
        } else if (showError) {
          dispatch(
            addToast({
              type: 'error',
              message: response.message || response.key || 'An error occurred'
            })
          );
        }
        return response;
      } catch (err) {
        if (showError) {
          dispatch(addToast({ type: 'error', message: String(err) }));
        }
        return { success: false, message: String(err) };
      } finally {
        dispatch(disableLoading());
      }
    },
    [dispatch]
  );
};
