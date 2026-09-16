import { type FC, useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import { useTranslation } from 'react-i18next';
import type { Business, BusinessAdd, BusinessUpdate } from '../../shared/types/business';

interface FormProps {
  initialData?: Business;
  onSave: (data: BusinessAdd | BusinessUpdate) => void;
  onCancel: () => void;
}

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    shortName: '',
    email: '',
    phone: '',
    address: '',
    vatCode: '',
    gstNumber: '',
    logoBase64: '',
    isArchived: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ shortName: '', ...initialData });
    }
  }, [initialData]);

  const handleChange = (field: keyof Business) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(prev => ({ ...prev, logoBase64: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoBase64: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      shortName: formData.shortName ?? '',
      name: formData.name ?? ''
    } as BusinessAdd | BusinessUpdate);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 860 }}>
      {/* Logo Upload */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Business Logo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={formData.logoBase64 || undefined}
            variant="rounded"
            sx={{ width: 80, height: 80, bgcolor: 'action.hover', border: '2px dashed', borderColor: 'divider' }}
          >
            {!formData.logoBase64 && <BusinessIcon sx={{ fontSize: 36, color: 'text.disabled' }} />}
          </Avatar>
          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLogoUpload}
              id="logo-upload-input"
            />
            <label htmlFor="logo-upload-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                size="small"
                sx={{ mr: 1 }}
              >
                {formData.logoBase64 ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </label>
            {formData.logoBase64 && (
              <Tooltip title="Remove logo">
                <IconButton size="small" color="error" onClick={handleRemoveLogo}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
              PNG, JPG or SVG · Max 2 MB · Displayed on invoices & quotes
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Business Details */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Business Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Business Name"
              value={formData.name || ''}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Short Name"
              value={formData.shortName || ''}
              onChange={handleChange('shortName')}
              helperText="Abbreviation used in lists"
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
        </Grid>
      </Paper>

      {/* Tax IDs */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Tax &amp; Registration Numbers <Typography variant="caption" color="text.disabled">(Optional)</Typography>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GST Number"
              value={formData.gstNumber || ''}
              onChange={handleChange('gstNumber')}
              placeholder="e.g. 22AAAAA0000A1Z5"
              helperText="Goods and Services Tax registration number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="VAT Code"
              value={formData.vatCode || ''}
              onChange={handleChange('vatCode')}
              placeholder="e.g. GB123456789"
              helperText="Value Added Tax registration number"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Archive */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.isArchived || false}
              onChange={handleChange('isArchived')}
            />
          }
          label="Archived"
        />
      </Box>

      <Divider sx={{ mb: 2 }} />
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
