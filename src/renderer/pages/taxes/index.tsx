import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Autocomplete, TextField, Typography, Chip, List as MuiList, ListItem,
  ListItemText, Checkbox, Divider, Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useTaxAdd } from '../../shared/hooks/taxes/useTaxAdd';
import { useTaxDelete } from '../../shared/hooks/taxes/useTaxDelete';
import { useTaxesRetrieve } from '../../shared/hooks/taxes/useTaxesRetrieve';
import { useTaxUpdate } from '../../shared/hooks/taxes/useTaxUpdate';
import { useCurrenciesRetrieve } from '../../shared/hooks/currencies/useCurrenciesRetrieve';
import type { Tax, TaxAdd, TaxUpdate } from '../../../backend/shared/types/tax';
import { Form } from './Form';
import { List } from './List';
import { WORLD_CURRENCIES, TAX_PRESETS, type TaxPreset } from '../../shared/data/worldCurrencies';

export const TaxesPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Tax | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Import dialog state
  const [importOpen, setImportOpen] = useState(false);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string | null>(null);
  const [selectedPresets, setSelectedPresets] = useState<TaxPreset[]>([]);
  const [importing, setImporting] = useState(false);

  const { data: items, mutate } = useTaxesRetrieve();
  const { data: savedCurrencies } = useCurrenciesRetrieve();
  const add = useTaxAdd();
  const update = useTaxUpdate();
  const remove = useTaxDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (item: Tax) => {
    setEditingItem(item);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await remove(id, mutate);
    }
  };

  const handleSave = async (data: TaxAdd | TaxUpdate) => {
    if (editingItem) {
      await update({ ...data, id: editingItem.id }, () => {
        setIsFormMode(false);
        mutate();
      });
    } else {
      await add(data, () => {
        setIsFormMode(false);
        mutate();
      });
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const lowerQuery = searchQuery.toLowerCase();
    return items.filter(b => b.name?.toLowerCase().includes(lowerQuery));
  }, [items, searchQuery]);

  // Presets for selected currency
  const availablePresets = useMemo(() => {
    if (!selectedCurrencyCode) return [];
    return TAX_PRESETS[selectedCurrencyCode] || [];
  }, [selectedCurrencyCode]);

  // Default to first saved currency on open
  const openImportDialog = () => {
    const firstSaved = savedCurrencies?.[0];
    const defaultCode = firstSaved?.code || null;
    setSelectedCurrencyCode(defaultCode);
    const presets = defaultCode ? (TAX_PRESETS[defaultCode] || []) : [];
    setSelectedPresets(presets);
    setImportOpen(true);
  };

  const togglePreset = (preset: TaxPreset) => {
    setSelectedPresets(prev =>
      prev.some(p => p.name === preset.name && p.rate === preset.rate)
        ? prev.filter(p => !(p.name === preset.name && p.rate === preset.rate))
        : [...prev, preset]
    );
  };

  const handleImport = async () => {
    setImporting(true);
    for (const preset of selectedPresets) {
      const exists = items.some(
        (t: Tax) => t.name === preset.name && Number(t.rate) === preset.rate
      );
      if (!exists) {
        await add({ name: preset.name, rate: preset.rate } as TaxAdd, () => {});
      }
    }
    await mutate();
    setImporting(false);
    setImportOpen(false);
  };

  // All currencies that have presets
  const currenciesWithPresets = WORLD_CURRENCIES.filter(c => TAX_PRESETS[c.code]);

  return (
    <>
      <CRUDPage
        title="Tax Slabs"
        isFormMode={isFormMode}
        onSetFormMode={setIsFormMode}
        onAdd={handleAddClick}
        customActions={
          !isFormMode && (
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={openImportDialog}>
              Import Slabs
            </Button>
          )
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        listComponent={<List data={filteredItems} onEdit={handleEditClick} onDelete={handleDeleteClick} />}
        formComponent={<Form initialData={editingItem} onSave={handleSave} onCancel={() => setIsFormMode(false)} />}
      />

      {/* Import Dialog */}
      <Dialog open={importOpen} onClose={() => setImportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DownloadIcon />
          Import Tax Slabs by Currency
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Select a currency to load its standard tax slabs, then choose which ones to import.
          </Typography>

          <Autocomplete
            options={currenciesWithPresets}
            getOptionLabel={c => `${c.code} — ${c.name}`}
            value={currenciesWithPresets.find(c => c.code === selectedCurrencyCode) || null}
            onChange={(_, newVal) => {
              const code = newVal?.code || null;
              setSelectedCurrencyCode(code);
              setSelectedPresets(code ? (TAX_PRESETS[code] || []) : []);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.code}>
                <Chip label={option.code} size="small" sx={{ mr: 1, fontWeight: 700 }} />
                {option.name}
              </li>
            )}
            renderInput={params => <TextField {...params} label="Currency" />}
            sx={{ mb: 2 }}
          />

          {/* Also show saved currencies as quick-select */}
          {savedCurrencies && savedCurrencies.length > 0 && (
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">Your saved currencies:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                {savedCurrencies.map((c: any) => (
                  <Chip
                    key={c.code}
                    label={c.code}
                    size="small"
                    clickable
                    color={selectedCurrencyCode === c.code ? 'primary' : 'default'}
                    onClick={() => {
                      setSelectedCurrencyCode(c.code);
                      setSelectedPresets(TAX_PRESETS[c.code] || []);
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          {availablePresets.length === 0 ? (
            <Alert severity="info">
              {selectedCurrencyCode
                ? `No preset tax slabs found for ${selectedCurrencyCode}. You can add custom slabs manually.`
                : 'Select a currency above to see available tax slabs.'}
            </Alert>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Available slabs ({availablePresets.length})
                </Typography>
                <Button size="small" onClick={() => setSelectedPresets(availablePresets)}>Select All</Button>
              </Box>
              <MuiList dense disablePadding>
                {availablePresets.map(preset => {
                  const checked = selectedPresets.some(
                    p => p.name === preset.name && p.rate === preset.rate
                  );
                  const alreadyExists = items.some(
                    (t: Tax) => t.name === preset.name && Number(t.rate) === preset.rate
                  );
                  return (
                    <ListItem
                      key={preset.name}
                      dense
                      disablePadding
                      sx={{ cursor: alreadyExists ? 'default' : 'pointer' }}
                      onClick={() => !alreadyExists && togglePreset(preset)}
                    >
                      <Checkbox
                        edge="start"
                        checked={checked || alreadyExists}
                        disabled={alreadyExists}
                        size="small"
                      />
                      <ListItemText
                        primary={preset.name}
                        secondary={alreadyExists ? '✓ Already imported' : `${preset.rate}%`}
                        secondaryTypographyProps={{
                          color: alreadyExists ? 'success.main' : 'text.secondary'
                        }}
                      />
                      <Chip label={`${preset.rate}%`} size="small" variant="outlined" />
                    </ListItem>
                  );
                })}
              </MuiList>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={importing || selectedPresets.length === 0}
            startIcon={<DownloadIcon />}
          >
            {importing ? 'Importing…' : `Import ${selectedPresets.length} Slab${selectedPresets.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
