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
import type { Bank, BankAdd, BankUpdate } from '../../shared/types/bank';

interface FormProps {
  initialData?: Bank;
  onSave: (data: BankAdd | BankUpdate) => void;
  onCancel: () => void;
}

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Bank>>({
    name: '',
    bankName: '',
    accountNumber: '',
    swiftCode: '',
    address: '',
    isArchived: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof Bank) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as BankAdd | BankUpdate);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Nickname"
              value={formData.name || ''}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank Name"
              value={formData.bankName || ''}
              onChange={handleChange('bankName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Number"
              value={formData.accountNumber || ''}
              onChange={handleChange('accountNumber')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SWIFT Code"
              value={formData.swiftCode || ''}
              onChange={handleChange('swiftCode')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank Address"
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
