import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useCategoryAdd } from '../../shared/hooks/categories/useCategoryAdd';
import { useCategoryDelete } from '../../shared/hooks/categories/useCategoryDelete';
import { useCategoriesRetrieve } from '../../shared/hooks/categories/useCategoriesRetrieve';
import { useCategoryUpdate } from '../../shared/hooks/categories/useCategoryUpdate';
import type { Category, CategoryAdd, CategoryUpdate } from '../../shared/types/category';
import { Form } from './Form';
import { List } from './List';

export const CategoriesPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: items, mutate } = useCategoriesRetrieve();
  const add = useCategoryAdd();
  const update = useCategoryUpdate();
  const remove = useCategoryDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (item: Category) => {
    setEditingItem(item);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await remove(id, mutate);
    }
  };

  const handleSave = async (data: CategoryAdd | CategoryUpdate) => {
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
      title={t('nav.categories')}
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
