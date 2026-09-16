import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useClientAdd } from '../../shared/hooks/clients/useClientAdd';
import { useClientDelete } from '../../shared/hooks/clients/useClientDelete';
import { useClientsRetrieve } from '../../shared/hooks/clients/useClientsRetrieve';
import { useClientUpdate } from '../../shared/hooks/clients/useClientUpdate';
import type { Client, ClientAdd, ClientUpdate } from '../../shared/types/client';
import { Form } from './Form';
import { List } from './List';

export const ClientsPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Client | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: clients, mutate } = useClientsRetrieve();
  const addClient = useClientAdd();
  const updateClient = useClientUpdate();
  const deleteClient = useClientDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (client: Client) => {
    setEditingItem(client);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await deleteClient(id, mutate);
    }
  };

  const handleSave = async (data: ClientAdd | ClientUpdate) => {
    if (editingItem) {
      await updateClient({ ...data, id: editingItem.id }, () => {
        setIsFormMode(false);
        mutate();
      });
    } else {
      await addClient(data, () => {
        setIsFormMode(false);
        mutate();
      });
    }
  };

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const lowerQuery = searchQuery.toLowerCase();
    return clients.filter(
      b =>
        b.name?.toLowerCase().includes(lowerQuery) ||
        b.email?.toLowerCase().includes(lowerQuery)
    );
  }, [clients, searchQuery]);

  return (
    <CRUDPage
      title={t('nav.clients')}
      isFormMode={isFormMode}
      onSetFormMode={setIsFormMode}
      onAdd={handleAddClick}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      listComponent={
        <List
          data={filteredClients}
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
