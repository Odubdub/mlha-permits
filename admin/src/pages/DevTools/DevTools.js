// material
import { LoadingButton } from '@mui/lab';
import { Box, Grid, Container, Typography, Stack, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/Iconify';
import Page from '../../components/Page';
import Services from '../Config/Services';
import { ServiceUpdateScheduler } from '../Config/ServiceUpdateScheduler';

export default function DevTools() {
  const [isSales, setIsSales] = useState(true);

  const [newServices, setNewServices] = useState([]);

  const [showNewServices, setShowNewServices] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  return (
    <Page title="Service Settings | MLHA Permits">
      <Container maxWidth="xl" onClick={() => setIsSales(!isSales)}>
        <Stack direction="row" justifyContent="space-between" sx={{ pb: 5 }}>
          <Typography variant="h4">Service Tools</Typography>
          <Stack direction="row">
            {newServices.length > 0 && (
              <LoadingButton
                loadingPosition="end"
                variant="contained"
                onClick={() => setShowNewServices(true)}
                endIcon={<Iconify icon="icon-park-outline:setting-config" />}
              >
                {`Configure ${newServices.length} New`}
              </LoadingButton>
            )}
            <LoadingButton
              loadingPosition="end"
              variant="contained"
              sx={{ ml: 2 }}
              onClick={() => setShowScheduler(true)}
              endIcon={<Iconify icon="bytesize:clock" />}
            >
              {newServices.length > 1 ? 'CRM Updates' : 'Configure New Service'}
            </LoadingButton>
          </Stack>
        </Stack>
        <Services
          newServices={newServices}
          setNewServices={setNewServices}
          setShowNewServices={setShowNewServices}
          showNewServices={showNewServices}
        />
        <ServiceUpdateScheduler open={showScheduler} onClose={() => setShowScheduler(false)} />
      </Container>
    </Page>
  );
}
