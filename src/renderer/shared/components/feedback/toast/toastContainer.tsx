import { type FC } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../state/configureStore';
import { removeToast, selectToasts, type ToastProps } from '../../../../state/pageSlice';

export const ToastContainer: FC = () => {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  return (
    <Stack
      spacing={1}
      sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9998 }}
    >
      {toasts.map((toast: ToastProps) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={4000}
          onClose={() => dispatch(removeToast(toast.id))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            key={toast.id}
            severity={toast.type}
            onClose={() => dispatch(removeToast(toast.id))}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};
