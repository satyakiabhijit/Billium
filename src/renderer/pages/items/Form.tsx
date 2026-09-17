import { type FC, useState, useEffect } from 'react';
import { Box, Button, TextField, FormControlLabel, Switch, Grid, Paper, Autocomplete, createFilterOptions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Item, ItemAdd, ItemUpdate } from '../../shared/types/item';
import { useCategoriesRetrieve } from '../../shared/hooks/categories/useCategoriesRetrieve';
import { useUnitsRetrieve } from '../../shared/hooks/units/useUnitsRetrieve';
import { getApi } from '../../shared/api/restApi';
import { useAppDispatch } from '../../state/configureStore';
import { enableLoading, disableLoading } from '../../state/pageSlice';

interface FormProps {
  initialData?: Item;
  onSave: (data: ItemAdd | ItemUpdate) => void;
  onCancel: () => void;
}

const filter = createFilterOptions<any>();

export const Form: FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Partial<Item>>({ isArchived: false });
  const [categoryInput, setCategoryInput] = useState<any>(null);
  const [unitInput, setUnitInput] = useState<any>(null);

  const { data: categories, mutate: mutateCategories } = useCategoriesRetrieve();
  const { data: units, mutate: mutateUnits } = useUnitsRetrieve();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.categoryId) {
        const cat = categories.find(c => c.id === initialData.categoryId);
        if (cat) setCategoryInput(cat);
      }
      if (initialData.unitId) {
        const un = units.find(u => u.id === initialData.unitId);
        if (un) setUnitInput(un);
      }
    }
  }, [initialData, categories, units]);

  const handleChange = (field: keyof Item) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(enableLoading());
    const api = getApi();
    
    let finalCategoryId = formData.categoryId;
    let finalUnitId = formData.unitId;

    try {
      // Process Category
      if (categoryInput && categoryInput.inputValue) {
        const res = await api.addCategory({ name: categoryInput.inputValue });
        if (res.success && res.data) {
          finalCategoryId = res.data;
          mutateCategories();
        }
      } else if (categoryInput && categoryInput.id) {
        finalCategoryId = categoryInput.id;
      } else if (!categoryInput) {
        finalCategoryId = undefined;
      }

      // Process Unit
      if (unitInput && unitInput.inputValue) {
        const res = await api.addUnit({ name: unitInput.inputValue, shortName: unitInput.inputValue });
        if (res.success && res.data) {
          finalUnitId = res.data;
          mutateUnits();
        }
      } else if (unitInput && unitInput.id) {
        finalUnitId = unitInput.id;
      } else if (!unitInput) {
        finalUnitId = undefined;
      }

      onSave({
        ...formData,
        categoryId: finalCategoryId,
        unitId: finalUnitId,
      } as any);

    } finally {
      dispatch(disableLoading());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" value={formData.name || ''} onChange={handleChange('name')} required />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Unit Price" value={formData.unitPriceCents || ''} onChange={handleChange('unitPriceCents')} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={categoryInput}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setCategoryInput({ inputValue: newValue, name: newValue });
                } else if (newValue && newValue.inputValue) {
                  setCategoryInput({ inputValue: newValue.inputValue, name: newValue.inputValue });
                } else {
                  setCategoryInput(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if (params.inputValue !== '') {
                  filtered.push({
                    inputValue: params.inputValue,
                    name: `Add "${params.inputValue}"`,
                  });
                }
                return filtered;
              }}
              options={categories}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                if (option.inputValue) return option.inputValue;
                return option.name || '';
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => <li {...props} key={option.id || option.inputValue}>{option.name}</li>}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Category (Optional)" />}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={unitInput}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setUnitInput({ inputValue: newValue, name: newValue });
                } else if (newValue && newValue.inputValue) {
                  setUnitInput({ inputValue: newValue.inputValue, name: newValue.inputValue });
                } else {
                  setUnitInput(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if (params.inputValue !== '') {
                  filtered.push({
                    inputValue: params.inputValue,
                    name: `Add "${params.inputValue}"`,
                  });
                }
                return filtered;
              }}
              options={units}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                if (option.inputValue) return option.inputValue;
                return option.name || '';
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => <li {...props} key={option.id || option.inputValue}>{option.name}</li>}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Unit (e.g. kg, hours)" />}
            />
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
