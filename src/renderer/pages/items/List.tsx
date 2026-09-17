import { type FC, useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, TableSortLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { Item } from '../../shared/types/item';
import { useCategoriesRetrieve } from '../../shared/hooks/categories/useCategoriesRetrieve';

interface ListProps {
  data: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

type Order = 'asc' | 'desc';

export const List: FC<ListProps> = ({ data, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { data: categories } = useCategoriesRetrieve();
  
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Item>('name');

  const handleRequestSort = (property: keyof Item) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return '-';
    return categories.find(c => c.id === categoryId)?.name || '-';
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let valA: any = a[orderBy];
      let valB: any = b[orderBy];

      if (orderBy === 'categoryId') {
        valA = getCategoryName(a.categoryId);
        valB = getCategoryName(b.categoryId);
      } else if (orderBy === 'unitPriceCents') {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy, categories]);

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell>
              <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active={orderBy === 'categoryId'} direction={orderBy === 'categoryId' ? order : 'asc'} onClick={() => handleRequestSort('categoryId')}>
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active={orderBy === 'unitPriceCents'} direction={orderBy === 'unitPriceCents' ? order : 'asc'} onClick={() => handleRequestSort('unitPriceCents')}>
                Unit Price
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel active={orderBy === 'isArchived'} direction={orderBy === 'isArchived' ? order : 'asc'} onClick={() => handleRequestSort('isArchived')}>
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>{t('common.noData')}</TableCell></TableRow>
          ) : (
            sortedData.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{getCategoryName(row.categoryId)}</TableCell>
                <TableCell>{row.unitPriceCents ? (Number(row.unitPriceCents) / 100).toFixed(2) : '0.00'}</TableCell>
                <TableCell align="center">
                  <Chip label={row.isArchived ? 'Archived' : 'Active'} color={row.isArchived ? 'default' : 'success'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => onEdit(row)} size="small"><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => row.id && onDelete(row.id)} size="small"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
