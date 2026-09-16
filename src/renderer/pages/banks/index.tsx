import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useBankAdd } from '../../shared/hooks/banks/useBankAdd';
import { useBankDelete } from '../../shared/hooks/banks/useBankDelete';
import { useBanksRetrieve } from '../../shared/hooks/banks/useBanksRetrieve';
import { useBankUpdate } from '../../shared/hooks/banks/useBankUpdate';
import type { Bank, BankAdd, BankUpdate } from '../../shared/types/bank';
import { Form } from './Form';
import { List } from './List';

export const BanksPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Bank | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: banks, mutate } = useBanksRetrieve();
  const addBank = useBankAdd();
  const updateBank = useBankUpdate();
  const deleteBank = useBankDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = (bank: Bank) => {
    setEditingItem(bank);
    setIsFormMode(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await deleteBank(id, mutate);
    }
  };

  const handleSave = async (data: BankAdd | BankUpdate) => {
    if (editingItem) {
      await updateBank({ ...data, id: editingItem.id }, () => {
        setIsFormMode(false);
        mutate();
      });
    } else {
      await addBank(data, () => {
        setIsFormMode(false);
        mutate();
      });
    }
  };

  const filteredBanks = useMemo(() => {
    if (!searchQuery) return banks;
    const lowerQuery = searchQuery.toLowerCase();
    return banks.filter(
      b =>
        (b.name?.toLowerCase().includes(lowerQuery)) ||
        (b.bankName?.toLowerCase().includes(lowerQuery))
    );
  }, [banks, searchQuery]);

  return (
    <CRUDPage
      title={t('nav.banks')}
      isFormMode={isFormMode}
      onSetFormMode={setIsFormMode}
      onAdd={handleAddClick}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      listComponent={
        <List
          data={filteredBanks}
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
