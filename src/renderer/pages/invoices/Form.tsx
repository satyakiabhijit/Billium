import { type FC, useState, useEffect, useMemo } from 'react';
import {
  Box, Button, TextField, FormControlLabel, Switch, Grid, Paper,
  MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Typography,
  Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { getApi } from '../../shared/api/restApi';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import type { Invoice, InvoiceAdd, InvoiceUpdate, InvoiceItemAdd } from '../../../backend/shared/types/invoice';
import { useClientsRetrieve } from '../../shared/hooks/clients/useClientsRetrieve';
import { useBusinessesRetrieve } from '../../shared/hooks/businesses/useBusinessesRetrieve';
import { useBanksRetrieve } from '../../shared/hooks/banks/useBanksRetrieve';
import { useCurrenciesRetrieve } from '../../shared/hooks/currencies/useCurrenciesRetrieve';
import { useItemsRetrieve } from '../../shared/hooks/items/useItemsRetrieve';
import { useTaxesRetrieve } from '../../shared/hooks/taxes/useTaxesRetrieve';
import { useSettingsRetrieve } from '../../shared/hooks/settings/useSettingsRetrieve';
import { useStyleProfilesRetrieve } from '../../shared/hooks/styleProfiles/useStyleProfilesRetrieve';
import { calculateInvoiceTotals, centsToDecimal, decimalToCents } from '../../shared/utils/financials';
import { InvoiceTemplate, type InvoiceTemplateData } from '../../shared/components/pdf/InvoiceTemplate';

interface FormProps {
  initialData?: Invoice & { items?: any[] };
  onSave: (data: InvoiceAdd | InvoiceUpdate) => void;
  onCancel: () => void;
}

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const filter = createFilterOptions<any>();

  const { data: clients } = useClientsRetrieve();
  const { data: businesses } = useBusinessesRetrieve();
  const { data: banks } = useBanksRetrieve();
  const { data: currencies } = useCurrenciesRetrieve();
  const { data: taxes } = useTaxesRetrieve();
  const { data: catalogItems } = useItemsRetrieve();
  const { data: settings } = useSettingsRetrieve();
  const { data: styleProfiles } = useStyleProfilesRetrieve();

  const [formData, setFormData] = useState<Partial<InvoiceAdd>>({
    clientId: undefined,
    businessId: undefined,
    currencyId: undefined,
    bankId: undefined,
    styleProfilesId: undefined,
    date: new Date().toISOString().split('T')[0],
    issuedAt: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    status: 'unpaid',
    isTaxInclusive: false,
    discountType: 'amount',
    discountAmountCents: '0',
    discountPercent: 0,
    items: [],
    notes: '',
  });

  const [items, setItems] = useState<Partial<InvoiceItemAdd>[]>([]);
  const [clientInputValue, setClientInputValue] = useState<string>('');

  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [newClientDetails, setNewClientDetails] = useState({ name: '', email: '', phone: '', vatCode: '' });

  // Per-row local string states for unit price and total (to avoid leading zero bug)
  const [unitPriceInputs, setUnitPriceInputs] = useState<string[]>([]);
  const [totalInputs, setTotalInputs] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, date: initialData.date ?? initialData.issuedAt } as any);
      if (initialData.items) {
        setItems(initialData.items);
        setUnitPriceInputs(
          initialData.items.map((it: any) =>
            it.unitPriceCents ? centsToDecimal(it.unitPriceCents).toString() : ''
          )
        );
        setTotalInputs(
          initialData.items.map((it: any) =>
            it.totalCents ? centsToDecimal(it.totalCents).toString() : ''
          )
        );
      }
      if (initialData.clientId && clients) {
        const c = clients.find((x: any) => x.id === initialData.clientId);
        if (c) setClientInputValue(c.name);
      }
    } else {
      if (businesses && businesses.length > 0 && !formData.businessId) {
        setFormData((prev) => ({ ...prev, businessId: businesses[0].id }));
      }
      if (currencies && currencies.length > 0 && settings !== undefined && !formData.currencyId) {
        const defaultId = settings.defaultCurrencyId || currencies[0].id;
        setFormData((prev) => ({ ...prev, currencyId: defaultId }));
      }
    }
  }, [initialData, businesses, currencies, clients, settings]);

  const handleChange = (field: keyof InvoiceAdd) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItemAdd, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const quantity = Number(newItems[index].quantity || 0);

    if (formData.isTaxInclusive) {
      // Total is truth (inclusive), recalculate unit price as EXCLUSIVE
      const totalCents = Number(newItems[index].totalCents || 0);
      const taxRate = Number(newItems[index].taxRate || 0);
      const factor = quantity * (1 + taxRate / 100);
      newItems[index].unitPriceCents = factor > 0 ? Math.round(totalCents / factor) : 0;
      
      const newUpInputs = [...unitPriceInputs];
      newUpInputs[index] = centsToDecimal(newItems[index].unitPriceCents!).toString();
      setUnitPriceInputs(newUpInputs);
    } else {
      // Unit price is truth, recalculate total
      const unitPrice = Number(newItems[index].unitPriceCents || 0);
      newItems[index].totalCents = Math.round(quantity * unitPrice);

      const newTInputs = [...totalInputs];
      newTInputs[index] = centsToDecimal(newItems[index].totalCents!).toString();
      setTotalInputs(newTInputs);
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, unitPriceCents: 0, taxRate: 0, totalCents: 0 }]);
    setUnitPriceInputs([...unitPriceInputs, '']);
    setTotalInputs([...totalInputs, '']);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    const newInputs = [...unitPriceInputs];
    newInputs.splice(index, 1);
    setUnitPriceInputs(newInputs);
  };

  const totals = calculateInvoiceTotals(
    items as any,
    formData.discountType === 'percentage' ? Number(formData.discountPercent || 0) : 0,
    formData.discountType === 'amount'
      ? decimalToCents(Number(formData.discountAmountCents ? centsToDecimal(formData.discountAmountCents) : 0))
      : '0',
    formData.isTaxInclusive
  );

  const previewData: InvoiceTemplateData | null = useMemo(() => {
    if (!formData.businessId || (!formData.clientId && !clientInputValue) || !formData.currencyId) return null;

    const selectedClient = clients?.find((c: any) => c.id === formData.clientId) || { name: clientInputValue };
    const selectedBusiness = businesses?.find((b: any) => b.id === formData.businessId) || {};
    const selectedBank = banks?.find((b: any) => b.id === formData.bankId) || {};
    const selectedCurrency = currencies?.find((c: any) => c.id === formData.currencyId) || {};

    return {
      docType: 'invoice',
      invoice: {
        ...formData,
        invoiceNumber: formData.invoiceNumber || 'INV-PREVIEW',
        subtotalCents: totals.subtotalCents,
        taxTotalCents: totals.taxTotalCents,
        discountTotalCents: totals.discountTotalCents,
        grandTotalCents: totals.grandTotalCents,
      } as any,
      items: items as any,
      client: selectedClient,
      business: selectedBusiness,
      bank: selectedBank,
      currency: selectedCurrency,
    };
  }, [formData, items, clients, businesses, banks, currencies, totals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalItems = [...items];
    for (let i = 0; i < finalItems.length; i++) {
      const it = finalItems[i];
      if (it.name && it.name.trim() !== '') {
        const existing = catalogItems?.find(
          (ci: any) => ci.name.toLowerCase() === it.name!.trim().toLowerCase()
        );
        if (existing) {
          it.itemId = existing.id;
        } else {
          try {
            const res = await getApi().addItem({
              name: it.name.trim(),
              unitPriceCents: String(it.unitPriceCents || 0),
              taxRate: it.taxRate || 0,
            });
            if (res.success && res.data) {
              it.itemId = res.data.id;
            }
          } catch (err) {
            console.error('Failed to auto-create item', err);
          }
        }
      }
    }

    let finalClientId = formData.clientId;
    if (clientInputValue && clientInputValue.trim() !== '') {
      const existing = clients?.find(
        (c: any) => c.name.toLowerCase() === clientInputValue.toLowerCase().trim()
      );
      if (existing) {
        finalClientId = existing.id;
      } else {
        try {
          const res = await getApi().addClient({ name: clientInputValue.trim(), shortName: '' });
          if (res.success && res.data) {
            finalClientId = res.data.id;
          }
        } catch (err) {
          console.error('Failed to auto-create client', err);
        }
      }
    }

    onSave({
      ...formData,
      issuedAt: formData.date || formData.issuedAt || '',
      clientId: finalClientId,
      items: finalItems as InvoiceItemAdd[],
      subtotalCents: totals.subtotalCents,
      taxTotalCents: totals.taxTotalCents,
      discountTotalCents: totals.discountTotalCents,
      grandTotalCents: totals.grandTotalCents,
    } as InvoiceAdd);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              select fullWidth label="Business"
              value={formData.businessId || ''}
              onChange={handleChange('businessId')}
              required
            >
              {businesses?.map((b: any) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              freeSolo
              options={clients || []}
              getOptionLabel={(option: any) => {
                if (typeof option === 'string') return option;
                if (option.inputValue) return option.inputValue;
                return option.name;
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if (params.inputValue !== '') {
                  filtered.push({ inputValue: params.inputValue, name: `Add "${params.inputValue}"` });
                }
                return filtered;
              }}
              inputValue={clientInputValue}
              onInputChange={(_, newInputValue) => setClientInputValue(newInputValue)}
              onChange={(_, newValue: any) => {
                if (typeof newValue === 'string') {
                  setClientInputValue(newValue);
                  setFormData(prev => ({ ...prev, clientId: undefined }));
                } else if (newValue && newValue.inputValue) {
                  setNewClientDetails({ name: newValue.inputValue, email: '', phone: '', vatCode: '' });
                  setIsClientDialogOpen(true);
                } else if (newValue) {
                  setFormData(prev => ({ ...prev, clientId: newValue.id }));
                  setClientInputValue(newValue.name);
                } else {
                  setFormData(prev => ({ ...prev, clientId: undefined }));
                  setClientInputValue('');
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Client" 
                  required={!formData.clientId && !clientInputValue} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select fullWidth label="Currency"
              value={formData.currencyId || ''}
              onChange={handleChange('currencyId')}
              required
            >
              {currencies?.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.code}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select fullWidth label="Bank (Optional)"
              value={formData.bankId || ''}
              onChange={handleChange('bankId')}
            >
              <MenuItem value="">None</MenuItem>
              {banks?.map((b: any) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select fullWidth label="Status"
              value={formData.status || 'unpaid'}
              onChange={handleChange('status')}
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} />
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Issue Date" InputLabelProps={{ shrink: true }}
              value={formData.date || ''} onChange={handleChange('date')} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }}
              value={formData.dueDate || ''} onChange={handleChange('dueDate')} required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select fullWidth label="Style Profile (Optional)"
              value={formData.styleProfilesId || ''}
              onChange={handleChange('styleProfilesId')}
            >
              <MenuItem value="">Default</MenuItem>
              {styleProfiles?.map((sp: any) => <MenuItem key={sp.id} value={sp.id}>{sp.name}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Line Items */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Typography variant="h6" mb={2}>Line Items</Typography>
        <FormControlLabel
          control={<Switch checked={formData.isTaxInclusive || false} onChange={handleChange('isTaxInclusive')} />}
          label="Tax Inclusive Pricing"
        />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell width="100">Qty</TableCell>
                <TableCell width="150">Unit Price</TableCell>
                <TableCell width="150">Tax %</TableCell>
                <TableCell width="150">Total</TableCell>
                <TableCell width="50" />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Autocomplete
                      freeSolo size="small"
                      options={catalogItems || []}
                      getOptionLabel={(option: any) => typeof option === 'string' ? option : option.name || ''}
                      inputValue={item.name || ''}
                      onChange={(_, newValue: any) => {
                        if (typeof newValue === 'string') {
                          handleItemChange(idx, 'name', newValue);
                        } else if (newValue && newValue.name) {
                          handleItemChange(idx, 'name', newValue.name);
                          if (newValue.unitPriceCents) {
                            handleItemChange(idx, 'unitPriceCents', Number(newValue.unitPriceCents));
                            const newInputs = [...unitPriceInputs];
                            newInputs[idx] = centsToDecimal(newValue.unitPriceCents).toString();
                            setUnitPriceInputs(newInputs);
                          }
                          if (newValue.taxRate !== undefined) {
                            handleItemChange(idx, 'taxRate', newValue.taxRate);
                          }
                        } else {
                          handleItemChange(idx, 'name', '');
                        }
                      }}
                      onInputChange={(_, newInputValue) => handleItemChange(idx, 'name', newInputValue)}
                      renderInput={(params) => <TextField {...params} placeholder="Item name" required />}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number" fullWidth size="small"
                      value={item.quantity ?? 1}
                      inputProps={{ min: 0 }}
                      onChange={e => handleItemChange(idx, 'quantity', e.target.value === '' ? 1 : Number(e.target.value))}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    {formData.isTaxInclusive ? (
                      <Typography sx={{ px: 1 }}>{centsToDecimal(item.unitPriceCents || 0).toFixed(2)}</Typography>
                    ) : (
                      <TextField
                        fullWidth size="small"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={unitPriceInputs[idx] ?? ''}
                        onChange={e => {
                          const raw = e.target.value;
                          const newInputs = [...unitPriceInputs];
                          newInputs[idx] = raw;
                          setUnitPriceInputs(newInputs);
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            handleItemChange(idx, 'unitPriceCents', Number(decimalToCents(num)));
                          } else {
                            handleItemChange(idx, 'unitPriceCents', 0);
                          }
                        }}
                        required
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      freeSolo size="small"
                      options={taxes || []}
                      getOptionLabel={(option: any) => {
                        if (typeof option === 'string' || typeof option === 'number') return String(option);
                        return `${option.name} (${option.rate}%)`;
                      }}
                      inputValue={item.taxRate == null ? '' : String(item.taxRate)}
                      onChange={(_, newValue: any) => {
                        if (typeof newValue === 'object' && newValue && newValue.rate !== undefined) {
                          handleItemChange(idx, 'taxRate', newValue.rate);
                        } else {
                          handleItemChange(idx, 'taxRate', newValue ?? '');
                        }
                      }}
                      onInputChange={(_, newInputValue, reason) => {
                        if (reason === 'input' || reason === 'clear') {
                          handleItemChange(idx, 'taxRate', newInputValue);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {formData.isTaxInclusive ? (
                      <TextField
                        fullWidth size="small"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={totalInputs[idx] ?? ''}
                        onChange={e => {
                          const raw = e.target.value;
                          const newInputs = [...totalInputs];
                          newInputs[idx] = raw;
                          setTotalInputs(newInputs);
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            handleItemChange(idx, 'totalCents', Number(decimalToCents(num)));
                          } else {
                            handleItemChange(idx, 'totalCents', 0);
                          }
                        }}
                        required
                      />
                    ) : (
                      centsToDecimal(item.totalCents || 0).toFixed(2)
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => removeItem(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={addItem}>Add Line Item</Button>

        {/* Totals */}
        <Box sx={{ mt: 4, ml: 'auto', width: 320 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}><Typography align="right">Subtotal:</Typography></Grid>
            <Grid item xs={6}><Typography align="right">{centsToDecimal(totals.subtotalCents).toFixed(2)}</Typography></Grid>

            <Grid item xs={6}><Typography align="right">Tax:</Typography></Grid>
            <Grid item xs={6}><Typography align="right">{centsToDecimal(totals.taxTotalCents).toFixed(2)}</Typography></Grid>

            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
              <TextField
                select size="small"
                value={formData.discountType || 'amount'}
                onChange={handleChange('discountType')}
                sx={{ width: '80px' }}
              >
                <MenuItem value="amount">$</MenuItem>
                <MenuItem value="percentage">%</MenuItem>
              </TextField>
              <Typography align="right">Discount:</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth size="small"
                inputMode="decimal"
                placeholder="0"
                value={
                  formData.discountType === 'percentage'
                    ? (formData.discountPercent || '')
                    : (Number(formData.discountAmountCents) ? centsToDecimal(formData.discountAmountCents!).toString() : '')
                }
                onChange={e => {
                  const val = e.target.value;
                  if (formData.discountType === 'percentage') {
                    setFormData(prev => ({ ...prev, discountPercent: val === '' ? 0 : Number(val) }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      discountAmountCents: val === '' ? '0' : String(decimalToCents(Number(val))),
                    }));
                  }
                }}
              />
            </Grid>

            <Grid item xs={6}><Typography align="right" variant="h6">Total:</Typography></Grid>
            <Grid item xs={6}><Typography align="right" variant="h6">{centsToDecimal(totals.grandTotalCents).toFixed(2)}</Typography></Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Notes */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <TextField
          fullWidth multiline rows={3} label="Notes"
          value={formData.notes || ''}
          onChange={handleChange('notes')}
        />
      </Paper>

      {/* Live Preview */}
      {previewData && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{t('Live Preview') || 'Live Preview'}</Typography>
          <Paper elevation={0} variant="outlined" sx={{
            p: 0,
            overflow: 'hidden',
            bgcolor: '#e0e0e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            borderRadius: 2,
            pt: 4,
            pb: 4
          }}>
            <Box sx={{
              width: '100%',
              maxWidth: '800px', // Standard A4 width ratio in pixels usually ~794px
              transform: { xs: 'scale(0.5)', sm: 'scale(0.7)', md: 'scale(0.9)', lg: 'scale(1)' },
              transformOrigin: 'top center',
              height: { xs: '600px', sm: '800px', md: '1000px', lg: 'auto' },
              bgcolor: 'white',
              boxShadow: 3,
            }}>
              <InvoiceTemplate data={previewData} />
            </Box>
          </Paper>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button variant="contained" type="submit">{t('common.save')}</Button>
      </Box>
      {/* New Client Dialog */}
      <Dialog open={isClientDialogOpen} onClose={() => setIsClientDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Name" required fullWidth
            value={newClientDetails.name}
            onChange={(e) => setNewClientDetails({ ...newClientDetails, name: e.target.value })}
          />
          <TextField
            label="Email (Optional)" fullWidth type="email"
            value={newClientDetails.email}
            onChange={(e) => setNewClientDetails({ ...newClientDetails, email: e.target.value })}
          />
          <TextField
            label="Phone (Optional)" fullWidth
            value={newClientDetails.phone}
            onChange={(e) => setNewClientDetails({ ...newClientDetails, phone: e.target.value })}
          />
          <TextField
            label="VAT Code (Optional)" fullWidth
            value={newClientDetails.vatCode}
            onChange={(e) => setNewClientDetails({ ...newClientDetails, vatCode: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsClientDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!newClientDetails.name.trim()} onClick={async () => {
            try {
              const res = await getApi().addClient(newClientDetails);
              if (res.success && res.data) {
                setClientInputValue(res.data.name);
                setFormData(prev => ({ ...prev, clientId: res.data.id }));
              }
            } catch (err) {
              console.error('Failed to create client from dialog', err);
            }
            setIsClientDialogOpen(false);
          }}>
            Add Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
