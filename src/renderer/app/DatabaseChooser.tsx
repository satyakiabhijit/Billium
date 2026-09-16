import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useAppDispatch } from '../state/configureStore';
import { setDbReady, enableLoading, disableLoading, addToast } from '../state/pageSlice';
import { getApi, isWebMode } from '../shared/api/restApi';

export const DatabaseChooser: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showPostgres, setShowPostgres] = useState(false);
  const [pgConfig, setPgConfig] = useState({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'billium',
    ssl: false
  });
  const [error, setError] = useState<string | null>(null);
  const [dbName, setDbName] = useState('billium.db');

  const api = getApi();

  const handleCreateSqlite = async () => {
    dispatch(enableLoading());
    setError(null);
    try {
      if (isWebMode()) {
        const result = await api.createSqliteDb(dbName);
        if (result?.success) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', name: dbName }));
          dispatch(setDbReady(true));
        } else {
          setError(result?.error || 'Failed to create database');
        }
      } else {
        const result = await api.createSqliteDb();
        if (result?.success && (result as any).path) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', path: (result as any).path }));
          dispatch(setDbReady(true));
        } else {
          setError(result?.error || 'Cancelled');
        }
      }
    } catch (err) {
      setError(String(err));
    } finally {
      dispatch(disableLoading());
    }
  };

  const handleOpenSqlite = async () => {
    dispatch(enableLoading());
    setError(null);
    try {
      if (isWebMode()) {
        const result = await api.openSqliteDb(dbName);
        if (result?.success) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', name: dbName }));
          dispatch(setDbReady(true));
        } else {
          setError(result?.error || 'Failed to open database');
        }
      } else {
        const result = await api.openSqliteDb();
        if (result?.success && (result as any).path) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', path: (result as any).path }));
          dispatch(setDbReady(true));
        } else {
          setError(result?.error || 'Cancelled');
        }
      }
    } catch (err) {
      setError(String(err));
    } finally {
      dispatch(disableLoading());
    }
  };

  const handleTestPostgres = async () => {
    dispatch(enableLoading());
    setError(null);
    try {
      const result = await api.testPostgresConnection(pgConfig);
      if (result?.success) {
        dispatch(addToast({ message: 'Connection successful!', type: 'success' }));
      } else {
        setError(result?.error || 'Connection failed');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      dispatch(disableLoading());
    }
  };

  const handleConnectPostgres = async () => {
    dispatch(enableLoading());
    setError(null);
    try {
      const result = await api.openPostgresDb(pgConfig);
      if (result?.success) {
        localStorage.setItem('billium_db', JSON.stringify({ type: 'postgres', config: pgConfig }));
        dispatch(setDbReady(true));
      } else {
        setError(result?.error || 'Failed to connect');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      dispatch(disableLoading());
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <StorageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" gutterBottom fontWeight={700}>
              {t('db.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('db.subtitle')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* SQLite Section */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            {isWebMode() && (
              <TextField
                label="Database Name"
                value={dbName}
                onChange={e => setDbName(e.target.value)}
                size="small"
                fullWidth
              />
            )}
            <Button
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
              onClick={handleCreateSqlite}
              fullWidth
              size="large"
            >
              {t('db.createNew')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<FolderOpenIcon />}
              onClick={handleOpenSqlite}
              fullWidth
              size="large"
            >
              {t('db.openExisting')}
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }}>or</Divider>

          {/* PostgreSQL Section */}
          <Button
            variant="text"
            onClick={() => setShowPostgres(!showPostgres)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {t('db.connectPostgres')}
          </Button>

          {showPostgres && (
            <Stack spacing={2}>
              <TextField
                label={t('db.host')}
                value={pgConfig.host}
                onChange={e => setPgConfig(prev => ({ ...prev, host: e.target.value }))}
                size="small"
                fullWidth
              />
              <TextField
                label={t('db.port')}
                type="number"
                value={pgConfig.port}
                onChange={e => setPgConfig(prev => ({ ...prev, port: Number(e.target.value) }))}
                size="small"
                fullWidth
              />
              <TextField
                label={t('db.user')}
                value={pgConfig.user}
                onChange={e => setPgConfig(prev => ({ ...prev, user: e.target.value }))}
                size="small"
                fullWidth
              />
              <TextField
                label={t('db.password')}
                type="password"
                value={pgConfig.password}
                onChange={e => setPgConfig(prev => ({ ...prev, password: e.target.value }))}
                size="small"
                fullWidth
              />
              <TextField
                label={t('db.database')}
                value={pgConfig.database}
                onChange={e => setPgConfig(prev => ({ ...prev, database: e.target.value }))}
                size="small"
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={pgConfig.ssl}
                    onChange={e => setPgConfig(prev => ({ ...prev, ssl: e.target.checked }))}
                  />
                }
                label={t('db.ssl')}
              />
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={handleTestPostgres} sx={{ flex: 1 }}>
                  {t('db.testConnection')}
                </Button>
                <Button variant="contained" onClick={handleConnectPostgres} sx={{ flex: 1 }}>
                  {t('db.connect')}
                </Button>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
