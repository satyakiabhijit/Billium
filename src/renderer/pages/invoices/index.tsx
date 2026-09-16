import { type FC, useState, useMemo } from 'react';
import { getApi } from '../../shared/api/restApi';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useInvoiceAdd } from '../../shared/hooks/invoices/useInvoiceAdd';
import { useInvoiceDelete } from '../../shared/hooks/invoices/useInvoiceDelete';
import { useInvoicesRetrieve } from '../../shared/hooks/invoices/useInvoicesRetrieve';
import { useInvoiceUpdate } from '../../shared/hooks/invoices/useInvoiceUpdate';
import type { Invoice, InvoiceAdd, InvoiceUpdate } from '../../../backend/shared/types/invoice';
import { Form } from './Form';
import { List } from './List';

export const InvoicesPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Invoice | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: invoices, mutate } = useInvoicesRetrieve();
  const addInvoice = useInvoiceAdd();
  const updateInvoice = useInvoiceUpdate();
  const deleteInvoice = useInvoiceDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = async (invoice: Invoice) => {
    const res = await getApi().getInvoiceById(invoice.id!);
    if (res.success && res.data) {
      setEditingItem(res.data);
      setIsFormMode(true);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await deleteInvoice(id, mutate);
    }
  };

  const handleSave = async (data: InvoiceAdd | InvoiceUpdate) => {
    if (editingItem) {
      await updateInvoice({ ...data, id: editingItem.id }, () => {
        setIsFormMode(false);
        mutate();
      });
    } else {
      await addInvoice(data, () => {
        setIsFormMode(false);
        mutate();
      });
    }
  };

  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    if (!searchQuery) return invoices || [];
    const lowerQuery = searchQuery.toLowerCase();
    return invoices.filter(
      b =>
        b.invoiceNumber?.toLowerCase().includes(lowerQuery) ||
        b.status?.toLowerCase().includes(lowerQuery)
    );
  }, [invoices, searchQuery]);

  return (
    <CRUDPage
      title={t('nav.invoices')}
      isFormMode={isFormMode}
      onSetFormMode={setIsFormMode}
      onAdd={handleAddClick}
      onExport={() => getApi().exportToXlsx('invoices')}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      listComponent={
        <List
          data={filteredInvoices}
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
