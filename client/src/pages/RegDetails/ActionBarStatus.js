import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

function ActionBarStatus({ title, subtitle, next }) {
  return (
    <Stack>
      <Typography variant="title" sx={{ fontWeight: 900, fontSize: 18 }}>
        {title}
      </Typography>
      <Stack direction="row">
        <Box height="100%" sx={{ borderRadius: 2, width: 4, mr: 1, bgcolor: 'primary.main' }} />
        <Stack>
          <Typography variant="subtitle">{subtitle}</Typography>
          <Stack direction="row" alignItems="center">
            <Typography color="primary.main" variant="caption" fontWeight="900">
              Next Step:
            </Typography>
            <Typography variant="caption" ml={1}>
              {next}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ActionBarStatus;
