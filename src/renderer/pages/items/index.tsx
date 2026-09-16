import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useItemAdd } from '../../shared/hooks/items/useItemAdd';
import { useItemDelete } from '../../shared/hooks/items/useItemDelete';
import { useItemsRetrieve } from '../../shared/hooks/items/useItemsRetrieve';
import { useItemUpdate } from '../../shared/hooks/items/useItemUpdate';
import type { Item, ItemAdd, ItemUpdate } from '../../shared/types/item';
import { Form } from './Form';
import { List } from './List';

export const ItemsPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: items, mutate } = useItemsRetrieve();
  const add = useItemAdd();
  const update = useItemUpdate();
  const remove = useItemDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await remove(id, mutate);
    }
  };

  const handleSave = async (data: ItemAdd | ItemUpdate) => {
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
      title={t('nav.items')}
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
