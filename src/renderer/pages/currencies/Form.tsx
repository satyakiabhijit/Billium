import { type FC, useState, useEffect } from 'react';
import {
  Box, Button, FormControlLabel, Switch, Grid, Paper,
  Autocomplete, TextField, Typography, Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Currency, CurrencyAdd, CurrencyUpdate } from '../../shared/types/currency';
import { WORLD_CURRENCIES } from '../../shared/data/worldCurrencies';

interface FormProps {
  initialData?: Currency;
  onSave: (data: CurrencyAdd | CurrencyUpdate) => void;
  onCancel: () => void;
}

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Currency>>({ isArchived: false });
  const [selectedWorld, setSelectedWorld] = useState<typeof WORLD_CURRENCIES[0] | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const found = WORLD_CURRENCIES.find(c => c.code === initialData.code);
      setSelectedWorld(found || null);
    }
  }, [initialData]);

  const handleWorldSelect = (currency: typeof WORLD_CURRENCIES[0] | null) => {
    setSelectedWorld(currency);
    if (currency) {
      setFormData(prev => ({
        ...prev,
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
      }));
    }
  };

  const handleChange = (field: keyof Currency) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box component="form" onSubmit={e => { e.preventDefault(); onSave(formData as any); }} sx={{ maxWidth: 800 }}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Search and select from all world currencies — details will auto-fill.
        </Typography>
        <Grid container spacing={3}>
          {/* World currency selector */}
          <Grid item xs={12}>
            <Autocomplete
              options={WORLD_CURRENCIES}
              getOptionLabel={option => `${option.code} — ${option.name} (${option.symbol})`}
              value={selectedWorld}
              onChange={(_, newValue) => handleWorldSelect(newValue)}
              renderOption={(props, option) => (
                <li {...props} key={option.code}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={option.code} size="small" sx={{ fontWeight: 700, minWidth: 52 }} />
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{option.symbol}</Typography>
                    </Box>
                  </Box>
                </li>
              )}
              renderInput={params => (
                <TextField {...params} label="Search World Currencies" placeholder="Type currency name or code..." />
              )}
            />
          </Grid>

          {/* Code (auto-filled, editable) */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Code" value={formData.code || ''} onChange={handleChange('code')} required />
          </Grid>

          {/* Name (auto-filled, editable) */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Name" value={formData.name || ''} onChange={handleChange('name')} required />
          </Grid>

          {/* Symbol (auto-filled, editable) */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Symbol" value={formData.symbol || ''} onChange={handleChange('symbol')} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={formData.isArchived || false} onChange={handleChange('isArchived')} />}
              label="Archived"
            />
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button variant="contained" type="submit">{t('common.save')}</Button>
      </Box>
    </Box>
  );
};
