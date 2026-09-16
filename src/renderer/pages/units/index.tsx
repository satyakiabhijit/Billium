import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useUnitAdd } from '../../shared/hooks/units/useUnitAdd';
import { useUnitDelete } from '../../shared/hooks/units/useUnitDelete';
import { useUnitsRetrieve } from '../../shared/hooks/units/useUnitsRetrieve';
import { useUnitUpdate } from '../../shared/hooks/units/useUnitUpdate';
import type { Unit, UnitAdd, UnitUpdate } from '../../shared/types/unit';
import { Form } from './Form';
import { List } from './List';

export const UnitsPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Unit | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: items, mutate } = useUnitsRetrieve();
  const add = useUnitAdd();
  const update = useUnitUpdate();
  const remove = useUnitDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (item: Unit) => {
    setEditingItem(item);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await remove(id, mutate);
    }
  };

  const handleSave = async (data: UnitAdd | UnitUpdate) => {
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
      title={t('nav.units')}
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
