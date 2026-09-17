import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useStyleProfileAdd } from '../../shared/hooks/styleProfiles/useStyleProfileAdd';
import { useStyleProfileDelete } from '../../shared/hooks/styleProfiles/useStyleProfileDelete';
import { useStyleProfilesRetrieve } from '../../shared/hooks/styleProfiles/useStyleProfilesRetrieve';
import { useStyleProfileUpdate } from '../../shared/hooks/styleProfiles/useStyleProfileUpdate';
import type { StyleProfile, StyleProfileAdd, StyleProfileUpdate } from '../../../backend/shared/types/styleProfile';
import { Form } from './Form';
import { List } from './List';

export const StyleProfilesPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<StyleProfile | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: items, mutate } = useStyleProfilesRetrieve();
  const add = useStyleProfileAdd();
  const update = useStyleProfileUpdate();
  const remove = useStyleProfileDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (item: StyleProfile) => {
    setEditingItem(item);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await remove(id, mutate);
    }
  };

  const handleSave = async (data: StyleProfileAdd | StyleProfileUpdate) => {
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

  return (
    <CRUDPage
      title="Style Profiles"
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
