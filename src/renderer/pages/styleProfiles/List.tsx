import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Box, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { StyleProfile } from '../../../backend/shared/types/styleProfile';
import type { EntityWithCounts } from '../../../backend/shared/types/entityWithCounts';

interface ListProps {
  data: (StyleProfile & EntityWithCounts)[];
  onEdit: (item: StyleProfile) => void;
  onDelete: (id: number) => void;
}

export const List: FC<ListProps> = ({ data, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Primary Color</TableCell>
            <TableCell>Secondary Color</TableCell>
            <TableCell>Font Family</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">
                  No style profiles found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(item => (
              <TableRow key={item.id} hover>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: item.primaryColor, border: '1px solid #ccc' }} />
                    {item.primaryColor}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: item.secondaryColor, border: '1px solid #ccc' }} />
                    {item.secondaryColor}
                  </Box>
                </TableCell>
                <TableCell style={{ fontFamily: item.fontFamily }}>{item.fontFamily}</TableCell>
                <TableCell>
                  <Chip
                    label={item.isArchived ? 'Archived' : 'Active'}
                    color={item.isArchived ? 'default' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(item)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => item.id && onDelete(item.id)}
                    color="error"
                    disabled={item.invoiceCount > 0}
                  >
                    <DeleteIcon fontSize="small" />
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
