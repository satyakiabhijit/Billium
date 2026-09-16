import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useBusinessAdd } from '../../shared/hooks/businesses/useBusinessAdd';
import { useBusinessDelete } from '../../shared/hooks/businesses/useBusinessDelete';
import { useBusinessesRetrieve } from '../../shared/hooks/businesses/useBusinessesRetrieve';
import { useBusinessUpdate } from '../../shared/hooks/businesses/useBusinessUpdate';
import type { Business, BusinessAdd, BusinessUpdate } from '../../shared/types/business';
import { Form } from './Form';
import { List } from './List';

export const BusinessesPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Business | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: businesses, mutate } = useBusinessesRetrieve();
  const addBusiness = useBusinessAdd();
  const updateBusiness = useBusinessUpdate();
  const deleteBusiness = useBusinessDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (business: Business) => {
    setEditingItem(business);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await deleteBusiness(id, mutate);
    }
  };

  const handleSave = async (data: BusinessAdd | BusinessUpdate) => {
    if (editingItem) {
      await updateBusiness({ ...data, id: editingItem.id }, () => {
        setIsFormMode(false);
        mutate();
      });
    } else {
      await addBusiness(data, () => {
        setIsFormMode(false);
        mutate();
      });
    }
  };

  const filteredBusinesses = useMemo(() => {
    if (!searchQuery) return businesses;
    const lowerQuery = searchQuery.toLowerCase();
    return businesses.filter(
      b =>
        b.name?.toLowerCase().includes(lowerQuery) ||
        b.email?.toLowerCase().includes(lowerQuery)
    );
  }, [businesses, searchQuery]);

  return (
    <CRUDPage
      title={t('nav.businesses')}
      isFormMode={isFormMode}
      onSetFormMode={setIsFormMode}
      onAdd={handleAddClick}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      listComponent={
        <List
          data={filteredBusinesses}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      }
      formComponent={
        <Form
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => setIsFormMode(false)}
        />
      }
    />
  );
};
