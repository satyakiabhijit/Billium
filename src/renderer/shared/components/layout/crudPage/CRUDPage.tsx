import { type FC, type ReactNode } from 'react';
import { Box, Button, Typography, IconButton, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

export interface CRUDPageProps {
  title: string;
  isFormMode: boolean;
  onSetFormMode: (isForm: boolean) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onAdd: () => void;
  listComponent: ReactNode;
  formComponent: ReactNode;
  hideAddButton?: boolean;
}

export const CRUDPage: FC<CRUDPageProps> = ({
  title,
  isFormMode,
  onSetFormMode,
  searchQuery,
  onSearchChange,
  onAdd,
  listComponent,
  formComponent,
  hideAddButton
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isFormMode && (
            <IconButton onClick={() => onSetFormMode(false)} edge="start">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
        </Box>
        {!isFormMode && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {onSearchChange && (
              <TextField
                size="small"
                placeholder={t('common.search')}
                value={searchQuery || ''}
                onChange={e => onSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            )}
            {!hideAddButton && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
                {t('common.add')}
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {isFormMode ? formComponent : listComponent}
      </Box>
    </Box>
  );
};
