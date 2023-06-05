import * as React from 'react';
import { Box, Fade, Modal, Stack } from '@mui/material';
import { CompanyInfo } from './CompanyInfo';
import { IndividualInfo } from './IndividualInfo';

export default function MoreInfo({ open, onClose, regNo, info }) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropProps={{ timeout: 500 }}
    >
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Fade in={open}>
          <Box>
            {info.infoType.includes('company') ? (
              <CompanyInfo info={info} regNo={regNo} onClose={onClose} />
            ) : (
              <IndividualInfo regNo={regNo} onClose={onClose} />
            )}
          </Box>
        </Fade>
      </Stack>
    </Modal>
  );
}
