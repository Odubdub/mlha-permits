// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Tooltip,
  Chip
} from '@mui/material';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { LocalizationProvider, MobileDateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import Page from '../../components/Page';
import ApplicationsContext from './ApplicationsContext';
import OpenApplicationsContext from './OpenApplications';
import { useTheme } from '@mui/material/styles';
import MiniReportCard from './RecordCard';
import { getFromServer } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import { getShortApplicationName } from '../Registrations/PermitTypes';
import Iconify from 'src/components/Iconify';
import { LoadingButton, DateRangePicker } from '@mui/lab';
import { fDate, formatDate, formatSimpleTime, fShortDate, fTime } from 'src/utils/formatTime';
import { Bar } from './Bar';
import DetailsTopBar from '../RegDetails/RegDetailsTopBar';
import Pie from './Pie';
import { countApplicationsByStatus } from './counter';
import { width } from '@mui/system';

const chartColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#5500FF',
  '#FF9F40',
  '#FFCD56',
  '#36A2EB',
  '#FF6384',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FFCD56',
  '#00BB5A',
  '#FF6384',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FFCD56',
  '#36A2EB',
  '#FF6384',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40'
];

export default function Reports() {
  const generateOptions = [
    {
      label: 'From 1 Week Ago',
      value: 7
    },
    {
      label: 'From 2 Weeks Ago',
      value: 14
    },
    {
      label: 'From 1 month Ago',
      value: 30
    },
    {
      label: 'From 2 months Ago',
      value: 61
    },
    {
      label: 'From 3 months Ago',
      value: 91
    },
    {
      label: 'From 4 months Ago',
      value: 122
    },
    {
      label: 'From 5 months Ago',
      value: 152
    },
    {
      label: 'From 6 months Ago',
      value: 183
    },
    {
      label: 'From 1 year Ago',
      value: 365
    }
  ];
  const [isGenerating, setIsGenerating] = useState(false);
  const { userData } = useContext(AuthContext);
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const theme = useTheme();
  const serviceRef = useRef(null);
  const [shownServices, setShownServices] = useState([]);
  const [labels, setLabels] = useState([]);

  const generateHook = useRef(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  const [statusSeries, setStatusSeries] = useState([]);

  useEffect(() => {
    getFromServer({
      path: 'authority/services/for-user',
      onComplete: (srvcs) => {
        setServices(srvcs);
        if (srvcs.length > 0) {
          setSelectedService(srvcs[0]);
        }
        fetch(srvcs);
      }
    });
  }, []);

  const fetch = (serviceCodes) => {
    getFromServer({
      path: 'statistics/all',
      params: { serviceCodes: serviceCodes },
      onComplete: (data) => {
        setReportData(data);
      },
      onError: (error) => {}
    });
  };

  const generateReport = (financeType) => {
    setGenerateOpen(false);
    setIsGenerating(true);

    let finacial = '';
    if (financeType) {
      finacial = '&financial=true';
    }

    getFromServer({
      path:
        `applications/statistics/generate?fromDate=${dates.lowerDate}&untilDate=${dates.upperDate}` +
        finacial,
      onComplete: (data) => {
        const linkSource = `data:application/pdf;base64,${data}`;
        const downloadLink = document.createElement('a');
        const fileName = `${finacial ? 'Financial' : 'General'} report-(${fShortDate(
          dates.lowerDate
        )}-${fShortDate(dates.upperDate)}).pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        setTimeout(() => {
          setIsGenerating(false);
        }, [2000]);
      },
      onError: (error) => {
        setIsGenerating(false);
      }
    });
  };

  const getReportData = () => {
    getFromServer({
      path: `applications/statistics/all?fromDate=${dates.lowerDate}&untilDate=${dates.upperDate}`,
      onComplete: (res) => {
        setAllData(res);
        setShownServices(res.map((d) => d.serviceCode));
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const setDefaultDates = () => {
    const upperDate = new Date();

    const lowerDate = new Date();
    lowerDate.setDate(lowerDate.getDate() - 7);

    const ld = formatDate(lowerDate);
    const ud = formatDate(upperDate);

    setDates({
      lowerDate: ld,
      upperDate: ud
    });
  };

  useEffect(() => {
    if (dates) {
      getReportData();
    }
  }, [dates]);

  useEffect(() => {
    setDefaultDates();
  }, []);

  useEffect(() => {
    if (allData.length) {
      const filteredData = allData.filter((d) => shownServices.includes(d.serviceCode));
      setData(filteredData);
      setStatusSeries(countApplicationsByStatus(filteredData));
      setLabels(allData[0].count.map((c) => formatSimpleTime(c.day)));
    }
  }, [setAllData, shownServices]);

  const toggleShown = (isSelected, serviceCode) => {
    if (isSelected) {
      setShownServices(shownServices.filter((s) => s !== serviceCode));
    } else {
      setShownServices([...shownServices, serviceCode]);
    }
  };

  const removeLicenseStuff = () => {
    let foundIt = false;
    var mySpans = document.getElementsByTagName('div');

    setTimeout(() => {
      for (var i = 0; i < mySpans.length; i++) {
        if (mySpans[i].innerHTML == 'MUI X: Missing license key') {
          var parent = mySpans[i];
          parent.style.opacity = 0;

          foundIt = true;
        }
      }

      if (!foundIt) {
        removeLicenseStuff();
      }
    }, 100);
  };

  useEffect(() => {
    if (dates) {
      getReportData();
    }
  }, [dates]);

  return (
    <Page title="Service Report | MLHA Permits">
      <Container maxWidth="xl">
        <DetailsTopBar>
          <Stack direction="row" justifyContent="start" alignItems="center" sx={{ pb: 3 }}>
            <Stack px={2} mb={2}>
              <Typography variant="h4">Reports</Typography>
              <Typography variant="caption">Reports on authorised services</Typography>
            </Stack>
            <Box flex={1} />
            <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: '', end: '' }}>
              <MobileDateRangePicker
                onOpen={removeLicenseStuff}
                value={[dates?.lowerDate, dates?.upperDate]}
                onChange={(newValue) => {
                  const day1 = newValue[0];
                  const lowerDate = `${day1['$y']}-${day1['$M'] + 1}-${day1['$D']}`;

                  let upperDate;
                  const day2 = newValue[1];
                  if (day2) {
                    upperDate = `${day2['$y']}-${day2['$M'] + 1}-${day2['$D']}`;
                  }

                  if (upperDate && lowerDate) {
                    setDates({ upperDate, lowerDate });
                  }
                }}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <Stack direction="row" alignItems="center">
                      {dates && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{
                            borderRadius: 3,
                            cursor: 'pointer',
                            bgcolor: '#80808020',
                            px: 1.6,
                            py: 0.5
                          }}
                          {...startProps}
                        >
                          <Iconify icon="ion:calendar-outline" />
                          <Typography sx={{ ml: 1 }} children={fShortDate(dates.lowerDate)} />
                        </Stack>
                      )}
                      <Box sx={{ mx: 2 }}> to </Box>
                      {dates && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{
                            borderRadius: 3,
                            cursor: 'pointer',
                            bgcolor: '#80808020',
                            px: 1.6,
                            py: 0.5
                          }}
                          {...endProps}
                        >
                          <Iconify icon="ion:calendar-outline" />
                          <Typography sx={{ ml: 1 }} children={fShortDate(dates.upperDate)} />
                        </Stack>
                      )}
                    </Stack>
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
            <LoadingButton
              variant="contained"
              loadingPosition="end"
              ref={generateHook}
              loading={isGenerating}
              onClick={() => setGenerateOpen(true)}
              sx={{
                mr: 1,
                ml: 2,
                boxShadow: 4,
                '&:hover': { color: '#fff', bgcolor: 'primary.main', borderColor: 'primary.main' }
              }}
              endIcon={<Iconify icon="ion:caret-down-outline" />}
            >
              Generate
            </LoadingButton>
            <Menu
              keepMounted
              anchorEl={generateHook.current}
              open={generateOpen}
              onClose={() => setGenerateOpen(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              {['Financial Report', 'General Report'].map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => generateReport(index == 0)}
                  sx={{ typography: 'body2', minWidth: 120, textAlign: 'center' }}
                >
                  {item}
                </MenuItem>
              ))}
            </Menu>
            <LoadingButton
              variant="contained"
              ref={serviceRef}
              onClick={() => setServiceMenuOpen(true)}
              sx={{
                mr: 1,
                boxShadow: 4,
                '&:hover': { color: '#fff', bgcolor: 'primary.main', borderColor: 'primary.main' }
              }}
              endIcon={<Iconify icon="ion:caret-down-outline" />}
            >
              Services
            </LoadingButton>
            {allData.length > 0 && (
              <Menu
                keepMounted
                anchorEl={serviceRef.current}
                open={serviceMenuOpen}
                onClose={() => setServiceMenuOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                {allData.map((item, index) => {
                  const isSelected = shownServices.includes(item.serviceCode);
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => toggleShown(isSelected, item.serviceCode)}
                      sx={{ typography: 'body2', minWidth: 120, textAlign: 'center' }}
                    >
                      <Stack alignItems="start" justifyContent="center" width={24} height={20}>
                        {isSelected && <Iconify icon="ic:outline-check" />}
                      </Stack>
                      {item.shortName}
                    </MenuItem>
                  );
                })}
              </Menu>
            )}
          </Stack>
        </DetailsTopBar>
        {selectedService && reportData && data.length > 0 && (
          <>
            <Grid container spacing={3} mt={8}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <MiniReportCard
                  title="Issued"
                  dates={labels}
                  cardValues={statusSeries.find((s) => s.name == 'Issued')?.data}
                  date={date}
                  fixed={(reportData.allTimeStatusResults[selectedService] || {}).issued}
                  line={reportData.periodicStatusResults.issued.filter(
                    (r) => r.serviceCode == selectedService
                  )}
                  color="#44FF44"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <MiniReportCard
                  title="Rejected"
                  cardValues={statusSeries.find((s) => s.name == 'Rejected')?.data}
                  dates={labels}
                  date={date}
                  fixed={(reportData.allTimeStatusResults[selectedService] || {}).rejected}
                  line={reportData.periodicStatusResults.rejected.filter(
                    (r) => r.serviceCode == selectedService
                  )}
                  color="#FF3C3C"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <MiniReportCard
                  title="Revoked"
                  dates={labels}
                  cardValues={statusSeries.find((s) => s.name == 'Revoked')?.data}
                  date={date}
                  fixed={(reportData.allTimeStatusResults[selectedService] || {}).revoked}
                  line={reportData.periodicStatusResults.revoked.filter(
                    (r) => r.serviceCode == selectedService
                  )}
                  color="#FF6A00"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <MiniReportCard
                  title="Returned"
                  dates={labels}
                  cardValues={statusSeries.find((s) => s.name == 'Returned')?.data}
                  date={date}
                  fixed={(reportData.allTimeStatusResults[selectedService] || {}).new}
                  line={reportData.periodicStatusResults.new.filter(
                    (r) => r.serviceCode == selectedService
                  )}
                  color="#32c5ff"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={8} mt={3}>
                <ApplicationsContext
                  key={shownServices.length}
                  title="New Applications"
                  newData={data}
                  date={date}
                  data={reportData.generalResults}
                  serviceCode={selectedService}
                />
              </Grid>
              <Grid item xs={4} sm={12} lg={4} md={12} mt={3}>
                <Pie
                  title="Closed Applications Context"
                  subheader="Cummulative share of applications by status."
                  data={data}
                  chartData={Object.keys(reportData.backlogResults).map((key) => {
                    return {
                      name: getShortApplicationName(key),
                      data: Object.values(reportData.backlogResults[key])
                    };
                  })}
                  chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} mt={1}>
              <Grid item xs={4} sm={12} md={6}>
                <OpenApplicationsContext
                  title="Open Applications Context"
                  subheader="Applications that are still being processed."
                  data={data}
                  chartData={Object.keys(reportData.backlogResults).map((key) => {
                    return {
                      name: getShortApplicationName(key),
                      data: Object.values(reportData.backlogResults[key])
                    };
                  })}
                  chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                />
              </Grid>
              <Grid item xs={8} sm={12} md={6}>
                <Bar
                  title="In Review Context"
                  subheader="Share of applications in review by status. For applications submitted in the respective date."
                  chartLabels={[
                    'Issued',
                    'Pending',
                    'Rejected',
                    'Pending Payment',
                    'Revoked',
                    'Returned'
                  ]}
                  series={statusSeries}
                  data={data}
                />
              </Grid>
            </Grid>
          </>
        )}
        {data.length == 0 && (
          <Stack height="100vh" width="100%" alignItems="center" justifyContent="center">
            <Typography variant="subtitle" fontWeight={800}>
              No Service Selected
            </Typography>
            <Typography>Select Service to view stats</Typography>
          </Stack>
        )}
      </Container>
    </Page>
  );
}
