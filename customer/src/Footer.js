import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Approval } from './Approval';
import Iconify from './bundle/Iconify';

export const Footer = () => {
  return (
    <Stack
      direction="row"
      justifyContent="end"
      alignItems="center"
      sx={{ my: 2 }}
      children={
        <>
          <Approval />
          <Box flex={1} />
          <LoadingButton
            children="Cancel Editing"
            variant="contained"
            // onClick={cancelEditing}
            sx={{
              bgcolor: '#ff6000',
              color: '#fff',
              ml: 1,
              '&:hover': { bgcolor: '#FF00006A' }
            }}
            startIcon={<Iconify icon="pajamas:cancel" />}
          />
          <LoadingButton
            children="Edit"
            sx={{ ml: 1 }}
            // onClick={startEdit}
            variant="contained"
            startIcon={<Iconify icon="ic:round-edit" />}
          />
          <LoadingButton
            children="Update"
            sx={{ ml: 1 }}
            // onClick={() => update()}
            variant="contained"
            startIcon={<Iconify icon="ph:upload-simple-bold" />}
          />
          <LoadingButton
            children="Save"
            sx={{ ml: 1 }}
            // loading={isLoading}
            // onClick={() => publish()}
            variant="contained"
            endIcon={<Iconify icon="ic:round-send" />}
          />
        </>
      }
    />
  );
};
