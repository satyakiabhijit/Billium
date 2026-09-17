import { type FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Button, TextField, FormControlLabel, Switch, Grid, MenuItem, Typography, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import type { StyleProfile, StyleProfileAdd, StyleProfileUpdate } from '../../../backend/shared/types/styleProfile';
import { InvoiceTemplate } from '../../shared/components/pdf/InvoiceTemplate';
import type { Invoice, InvoiceItem } from '../../../backend/shared/types/invoice';

const FONTS = [
  'sans-serif', 'serif', 'monospace', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display'
];

const TEMPLATES = [
  { id: 'standard', name: 'Standard Layout' },
  { id: 'modern', name: 'Modern Layout' },
  { id: 'minimalist', name: 'Minimalist Layout' }
];

interface FormProps {
  initialData?: StyleProfile;
  onSave: (data: StyleProfileAdd | StyleProfileUpdate) => void;
  onCancel: () => void;
}

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Partial<StyleProfile>>({
    name: '',
    templateName: 'standard',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'sans-serif',
    isArchived: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof StyleProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData as any);
  };

  // Mock data for live preview
  const mockInvoice: Invoice = {
    id: 999,
    invoiceNumber: 'INV-SAMPLE-001',
    businessId: 1,
    clientId: 1,
    currencyId: 1,
    date: '2023-10-25',
    dueDate: '2023-11-25',
    issuedAt: '2023-10-25',
    status: 'unpaid',
    subtotalCents: '150000',
    taxTotalCents: '15000',
    grandTotalCents: '165000',
    isTaxInclusive: false,
    invoiceType: 'invoice'
  };

  const mockItems: InvoiceItem[] = [
    { id: 1, invoiceId: 999, name: 'Web Design Services', quantity: 1, unitPriceCents: '100000', taxRate: 10, totalCents: '110000', sortOrder: 0 },
    { id: 2, invoiceId: 999, name: 'Hosting (1 Year)', quantity: 1, unitPriceCents: '50000', taxRate: 10, totalCents: '55000', sortOrder: 1 },
  ];

  const mockData = {
    invoice: mockInvoice,
    items: mockItems,
    client: { name: 'Acme Corp', email: 'billing@acme.com', address: '123 Business Rd' } as any,
    business: { name: 'My Agency LLC', email: 'hello@agency.com', address: '456 Agency Blvd' } as any,
    currency: { code: 'USD', symbol: '$', name: 'US Dollar', subunit: 100 } as any,
    bank: undefined as any,
    styleProfile: formData,
    docType: 'invoice' as const
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, height: '100%', alignItems: 'flex-start' }}>
      {/* Form Side */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: 450, flexShrink: 0 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Profile Name"
              fullWidth
              required
              value={formData.name || ''}
              onChange={handleChange('name')}
              autoFocus
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Invoice Template"
              fullWidth
              required
              value={formData.templateName || 'standard'}
              onChange={handleChange('templateName')}
            >
              {TEMPLATES.map(tmpl => (
                <MenuItem key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="color"
              label="Primary Color"
              fullWidth
              required
              value={formData.primaryColor || '#000000'}
              onChange={handleChange('primaryColor')}
              InputLabelProps={{ shrink: true }}
              sx={{ '& input': { height: 40, cursor: 'pointer' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="color"
              label="Secondary Color"
              fullWidth
              required
              value={formData.secondaryColor || '#ffffff'}
              onChange={handleChange('secondaryColor')}
              InputLabelProps={{ shrink: true }}
              sx={{ '& input': { height: 40, cursor: 'pointer' } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Font Family"
              fullWidth
              required
              value={formData.fontFamily || 'sans-serif'}
              onChange={handleChange('fontFamily')}
            >
              {FONTS.map(font => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={!!formData.isArchived} 
                  onChange={handleChange('isArchived')} 
                />
              }
              label={t('common.archived')}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={!formData.name}
              >
                {t('common.save')}
              </Button>
              <Button onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Preview Side */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Live Preview
        </Typography>
        <Paper elevation={3} sx={{ 
          width: '100%', 
          maxWidth: '210mm', 
          aspectRatio: '1 / 1.414', 
          overflow: 'hidden', 
          bgcolor: 'white',
          transform: 'scale(0.85)',
          transformOrigin: 'top center',
          mb: -10 // Compensate for scale
        }}>
          <Box sx={{ pointerEvents: 'none' }}>
            <InvoiceTemplate data={mockData} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
