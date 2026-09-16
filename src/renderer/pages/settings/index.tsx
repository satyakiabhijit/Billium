import { type FC, useState, useEffect } from 'react';
import { Box, Button, TextField, FormControlLabel, Switch, Grid, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSettingsRetrieve } from '../../shared/hooks/settings/useSettingsRetrieve';
import { useSettingsUpdate } from '../../shared/hooks/settings/useSettingsUpdate';
import type { Settings } from '../../shared/types/settings';

export const SettingsPage: FC = () => {
  const { t } = useTranslation();
  const { data, mutate } = useSettingsRetrieve();
  const updateSettings = useSettingsUpdate();
  const [formData, setFormData] = useState<Partial<Settings>>({});

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (field: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData as Settings, mutate);
  };

  return (
    <Box component="form" onSubmit={handleSave} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={3}>{t('nav.settings')}</Typography>
      <Paper sx={{ p: 3, mb: 3, maxWidth: 800 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Language" value={formData.language || ''} onChange={handleChange('language')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Date Format" value={formData.dateFormat || ''} onChange={handleChange('dateFormat')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Invoice Prefix" value={formData.invoicePrefix || ''} onChange={handleChange('invoicePrefix')} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch checked={formData.enableQuotes || false} onChange={handleChange('enableQuotes')} />} label="Enable Quotes" />
          </Grid>
        </Grid>
      </Paper>
      <Button variant="contained" type="submit">{t('common.save')}</Button>
    </Box>
  );
};
