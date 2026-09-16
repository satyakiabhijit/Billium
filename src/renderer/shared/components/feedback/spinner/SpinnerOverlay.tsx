import { type FC } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const SpinnerOverlay: FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
    >
      <CircularProgress size={48} sx={{ color: 'white' }} />
      <Typography sx={{ mt: 2, color: 'white' }}>Loading...</Typography>
    </Box>
  );
};
