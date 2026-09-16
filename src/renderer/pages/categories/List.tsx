import { type FC } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../shared/types/category';

interface ListProps {
  data: Category[];
  onEdit: (item: Category) => void;
  onDelete: (id: number) => void;
}

export const List: FC<ListProps> = ({ data, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={3} align="center" sx={{ py: 4 }}>{t('common.noData')}</TableCell></TableRow>
          ) : (
            data.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
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
