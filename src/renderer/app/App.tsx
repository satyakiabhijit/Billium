import { type FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../state/configureStore';
import { selectDbReady, selectIsLoading, setDbReady, enableLoading, disableLoading, addToast } from '../state/pageSlice';
import { getApi, isWebMode } from '../shared/api/restApi';
import { SpinnerOverlay } from '../shared/components/feedback/spinner/SpinnerOverlay';
import { ToastContainer } from '../shared/components/feedback/toast/toastContainer';
import { AppLayout } from './AppLayout';
import { DatabaseChooser } from './DatabaseChooser';

export const App: FC = () => {
  const dbReady = useAppSelector(selectDbReady);
  const isLoading = useAppSelector(selectIsLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const autoConnect = async () => {
      const savedDb = localStorage.getItem('billium_db');
      if (!savedDb || dbReady) return;

      try {
        const config = JSON.parse(savedDb);
        const api = getApi();
        dispatch(enableLoading());

        if (config.type === 'sqlite') {
          const result = await api.openSqliteDb(isWebMode() ? config.name : config.path);
          if (result?.success) {
            dispatch(setDbReady(true));
          } else {
            localStorage.removeItem('billium_db');
            dispatch(addToast({ message: 'Auto-connect failed. Please choose database.', type: 'error' }));
          }
        } else if (config.type === 'postgres') {
          const result = await api.openPostgresDb(config.config);
          if (result?.success) {
            dispatch(setDbReady(true));
          } else {
            localStorage.removeItem('billium_db');
            dispatch(addToast({ message: 'Auto-connect failed. Please choose database.', type: 'error' }));
          }
        }
      } catch (err) {
        localStorage.removeItem('billium_db');
      } finally {
        dispatch(disableLoading());
      }
    };

    autoConnect();
  }, []);

  return (
    <>
      {isLoading && <SpinnerOverlay />}
      <ToastContainer />
      {dbReady ? <AppLayout /> : <DatabaseChooser />}
    </>
  );
};
