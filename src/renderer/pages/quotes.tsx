import { type FC } from 'react';
import { Typography, Box } from '@mui/material';

export const QuotesPage: FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom fontWeight={600}>Quotes</Typography>
    <Typography color="text.secondary">Quote management will be built in Phase 4.</Typography>
  </Box>
);
