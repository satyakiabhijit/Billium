import { type FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { Bank } from '../../shared/types/bank';

interface ListProps {
  data: Bank[];
  onEdit: (bank: Bank) => void;
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
            <TableCell>Bank Name</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>SWIFT</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                {t('common.noData')}
              </TableCell>
            </TableRow>
          ) : (
            data.map(row => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" fontWeight={500}>
                  {row.name}
                </TableCell>
                <TableCell>{row.bankName}</TableCell>
                <TableCell>{row.accountNumber}</TableCell>
                <TableCell>{row.swiftCode}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.isArchived ? 'Archived' : 'Active'}
                    color={row.isArchived ? 'default' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => onEdit(row)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => row.id && onDelete(row.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
