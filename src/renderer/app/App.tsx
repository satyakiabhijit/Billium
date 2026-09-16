import { type FC } from 'react';
import { useAppSelector } from '../state/configureStore';
import { selectDbReady, selectIsLoading } from '../state/pageSlice';
import { SpinnerOverlay } from '../shared/components/feedback/spinner/SpinnerOverlay';
import { ToastContainer } from '../shared/components/feedback/toast/toastContainer';
import { AppLayout } from './AppLayout';
import { DatabaseChooser } from './DatabaseChooser';

export const App: FC = () => {
  const dbReady = useAppSelector(selectDbReady);
  const isLoading = useAppSelector(selectIsLoading);

  return (
    <>
      {isLoading && <SpinnerOverlay />}
      <ToastContainer />
      {dbReady ? <AppLayout /> : <DatabaseChooser />}
    </>
  );
};
