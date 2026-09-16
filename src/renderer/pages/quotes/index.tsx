import { type FC, useState, useMemo } from 'react';
import { getApi } from '../../shared/api/restApi';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../shared/components/layout/crudPage/CRUDPage';
import { useQuoteAdd } from '../../shared/hooks/quotes/useQuoteAdd';
import { useQuoteDelete } from '../../shared/hooks/quotes/useQuoteDelete';
import { useQuotesRetrieve } from '../../shared/hooks/quotes/useQuotesRetrieve';
import { useQuoteUpdate } from '../../shared/hooks/quotes/useQuoteUpdate';
import type { Quote, QuoteAdd, QuoteUpdate } from '../../../backend/shared/types/quote';
import { Form } from './Form';
import { List } from './List';

export const QuotesPage: FC = () => {
  const { t } = useTranslation();
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Quote | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: quotes, mutate } = useQuotesRetrieve();
  const addQuote = useQuoteAdd();
  const updateQuote = useQuoteUpdate();
  const deleteQuote = useQuoteDelete();

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormMode(true);
  };

  const handleEditClick = async (quote: any) => {
    const res = await getApi().getQuoteById(quote.id!);
    if (res.success && res.data) {
      setEditingItem(res.data);
      setIsFormMode(true);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(t('common.confirm'))) {
      await deleteQuote(id, mutate);
    }
  };

  const handleSave = async (data: QuoteAdd | QuoteUpdate) => {
    if (editingItem) {
      await updateQuote({ ...data, id: editingItem.id }, () => {
        setIsFormMode(false);
        mutate();
      });
    } else {
      await addQuote(data, () => {
        setIsFormMode(false);
        mutate();
      });
    }
  };

  const filteredQuotes = useMemo(() => {
    if (!quotes) return [];
    if (!searchQuery) return quotes || [];
    const lowerQuery = searchQuery.toLowerCase();
    return quotes.filter(
      b =>
        b.invoiceNumber?.toLowerCase().includes(lowerQuery) ||
        b.status?.toLowerCase().includes(lowerQuery)
    );
  }, [quotes, searchQuery]);

  return (
    <CRUDPage
      title={t('nav.quotes')}
      isFormMode={isFormMode}
      onSetFormMode={setIsFormMode}
      onAdd={handleAddClick}
      onExport={() => getApi().exportToXlsx('quotes')}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      listComponent={
        <List
          data={filteredQuotes}
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
