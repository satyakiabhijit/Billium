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
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import type { Quote } from '../../../backend/shared/types/quote';
import { centsToDecimal } from '../../shared/utils/financials';
import { usePrintDocument } from '../../shared/components/pdf/usePrintDocument';

interface ListProps {
  data: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (id: number) => void;
}

export const List: FC<ListProps> = ({ data, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { isPrinting, triggerPrint, downloadPdf } = usePrintDocument('quote');

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell>Sequence No</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                {t('common.noData')}
              </TableCell>
            </TableRow>
          ) : (
            data?.map(row => (
              <TableRow 
                key={row.id} 
                hover
                onClick={() => onEdit(row)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  {row.invoiceNumber}
                </TableCell>
                <TableCell>{row.issuedAt}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell align="right">
                  {centsToDecimal(row.grandTotalCents || '0').toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.status || 'Draft'}
                    color={row.status === 'paid' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Print">
                    <span>
                      <IconButton
                        color="default"
                        onClick={() => row.id && triggerPrint(row.id)}
                        size="small"
                        disabled={isPrinting}
                      >
                        {isPrinting ? <CircularProgress size={16} /> : <PrintIcon fontSize="small" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Download PDF">
                    <span>
                      <IconButton
                        color="default"
                        onClick={() => row.id && downloadPdf(row.id)}
                        size="small"
                        disabled={isPrinting}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
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
