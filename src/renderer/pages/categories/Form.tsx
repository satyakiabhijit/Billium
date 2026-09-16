import { type FC, useState, useEffect } from 'react';
import { Box, Button, TextField, FormControlLabel, Switch, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Category, CategoryAdd, CategoryUpdate } from '../../shared/types/category';

interface FormProps {
  initialData?: Category;
  onSave: (data: CategoryAdd | CategoryUpdate) => void;
  onCancel: () => void;
}

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Category>>({ isArchived: false });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof Category) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box component="form" onSubmit={e => { e.preventDefault(); onSave(formData as any); }} sx={{ maxWidth: 800 }}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" value={formData.name || ''} onChange={handleChange('name')} />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel control={<Switch checked={formData.isArchived || false} onChange={handleChange('isArchived')} />} label="Archived" />
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
