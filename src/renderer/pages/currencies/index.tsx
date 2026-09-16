import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useCurrencyAdd } from '../../shared/hooks/currencies/useCurrencyAdd';
import { useCurrencyDelete } from '../../shared/hooks/currencies/useCurrencyDelete';
import { useCurrenciesRetrieve } from '../../shared/hooks/currencies/useCurrenciesRetrieve';
import { useCurrencyUpdate } from '../../shared/hooks/currencies/useCurrencyUpdate';
import type { Currency, CurrencyAdd, CurrencyUpdate } from '../../shared/types/currency';
import { Form } from './Form';
import { List } from './List';

export const CurrenciesPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Currency | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: items, mutate } = useCurrenciesRetrieve();
  const add = useCurrencyAdd();
  const update = useCurrencyUpdate();
  const remove = useCurrencyDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (item: Currency) => {
    setEditingItem(item);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await remove(id, mutate);
    }
  };

  const handleSave = async (data: CurrencyAdd | CurrencyUpdate) => {
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
    return items.filter(
      b => b.name?.toLowerCase().includes(lowerQuery)
    );
  }, [items, searchQuery]);

  return (
    <CRUDPage
      title={t('nav.currencies')}
      isFormMode={isFormMode}
      onSetFormMode={setIsFormMode}
      onAdd={handleAddClick}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      listComponent={<List data={filteredItems} onEdit={handleEditClick} onDelete={handleDeleteClick} />}
      formComponent={<Form initialData={editingItem} onSave={handleSave} onCancel={() => setIsFormMode(false)} />}
    />
  );
};
