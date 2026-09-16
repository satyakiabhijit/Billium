import { type FC, useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Business, BusinessAdd, BusinessUpdate } from '../../shared/types/business';

interface FormProps {
  initialData?: Business;
  onSave: (data: BusinessAdd | BusinessUpdate) => void;
  onCancel: () => void;
}

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    vatCode: '',
    isArchived: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof Business) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as BusinessAdd | BusinessUpdate);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Business Name *"
              value={formData.name || ''}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="VAT Code"
              value={formData.vatCode || ''}
              onChange={handleChange('vatCode')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange('email')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone || ''}
              onChange={handleChange('phone')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={formData.address || ''}
              onChange={handleChange('address')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isArchived || false}
                  onChange={handleChange('isArchived')}
                />
              }
              label="Archived"
            />
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" type="submit">
          {t('common.save')}
        </Button>
      </Box>
    </Box>
  );
};
