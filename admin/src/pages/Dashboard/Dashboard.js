// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TimePeriods } from 'src/helper';
// components
import Page from '../../components/Page';
import Activity from './Activity';
import OfficesStats from './OfficeStats';
import PermitRegistrations from './Registrations';
import NameChange from './NameChange';
import NoticeboardTimeline from './RegStatus';
import PropertyInstr from './PropertyInstr';
import RegistrationShare from './RegistrationShare';
import WeeklySales from './Totals';
import { IsSalesContext } from './IsSalesContext';
import RegistrationStatus from './RegStatus';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [period, setPeriod] = useState(TimePeriods.daily);

  const [isSales, setIsSales] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {
    const path = `admin/dashboard?date=${date}&period=${period}`;
    // fetchData({path: path, onComplete: d=>{

    //   setData(d)
    //   console.log('Got the datad')
    // }, onError: err=>{

    //   console.log('Error ',err.message)
    // }})
  };

  return (
    <Page title="Report | MLHA Permits">
      <Container maxWidth="xl" onClick={() => setIsSales(!isSales)}>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Report Summary</Typography>
        </Box>
        <IsSalesContext.Provider value={isSales}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              {data != null && <WeeklySales data={data} />}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {data != null && <PermitRegistrations data={data} />}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {data != null && <PropertyInstr data={data} />}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {data && <NameChange data={data} />}
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              {data && <Activity data={data} date={date} />}
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              {data && <RegistrationShare data={data} />}
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              {data && <RegistrationStatus data={data} />}
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              {data && <OfficesStats offices={data.offices} />}
            </Grid>
          </Grid>
        </IsSalesContext.Provider>
      </Container>
    </Page>
  );
}
