// material
import {
  Stack,
  Card,
  CardHeader,
  Collapse,
  IconButton,
  Typography,
  Divider,
  Box,
  TextField,
  Grid,
  Tooltip,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/Iconify';
import axios from 'axios';
import { AllServices as LocalServices } from './registry/registry';
import { generateRendererConfig } from './registry/output';
import { getFromServer, patch, postToServer, serviceRegistryHost } from 'src/ApiService';
import { allKeys, someKeys } from './registry/pseudo_value';
import NewService from './NewService';
import DebugService from './DebugServices';
import { LoadingButton } from '@mui/lab';
import { AllServices } from './meta/services';

export const cleanString = (str) => {
  //remove prefix of 'MTI_007_12_' if exists
  if (str.includes('MTI_007_12_')) {
    str = str.replace('MTI_007_12_', '');
  } else if (str.includes('MLGRD_008_10_')) {
    str = str.replace('MLGRD_008_10_', '');
  }

  //remove occurances of '_'
  str = str.replace(/_/g, ' ');

  //capitalize first letter of each word
  str = str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  //Swap first word with last word
  const arr = str.split(' ');
  const last = arr[arr.length - 1];

  //remove last word
  arr.pop();

  //remove last word of string
  str = [last, ...arr].join(' ');

  return str;
};

export default function Services({
  newServices,
  setNewServices,
  setShowNewServices,
  showNewServices
}) {
  // const [enableBtns, setShowList] = useState(true)
  const [allServices, setAllServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [registeredCodes, setRegisteredCodes] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [output, setOutput] = useState({});
  const [formMode, setFormMode] = useState(false);
  const [reload, setReload] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [showDebugService, setShowDebugService] = useState(false);

  const buttonStyle = {
    '&:hover': { backgroundColor: '#00D9FF98' },
    '&:disabled': { bgcolor: '#80808040' }
  };

  const host = serviceRegistryHost;
  // const host = 'https://serviceregistry.gov.bw/'
  // const host = 'http://localhost:3005/'
  // const host = 'http://192.168.1.145:3005/'

  const logTestPayloads = () => {
    console.log(allKeys);
    console.log(someKeys);
  };

  const createRenderConfig = () => {
    setOutput(generateRendererConfig(selectedService));
  };

  const update = () => {
    const service = LocalServices.find((service) => service.id === selectedService.registry._id);

    axios
      .patch(serviceRegistryHost + `services/config/form/${selectedService.registry._id}`, {
        fields: service.formField,
        profileData: [
          'first_name',
          'middle_name',
          'surname',
          'date_of_birth',
          'gender',
          'country_of_birth',
          'nationality',
          'primary_phone',
          'primary_postal',
          'primary_email',
          'citizenship'
        ]
      })
      .then((res) => {
        console.log(res.data);
        patch({
          path: `authority/services-config/form/${selectedService._id}`,
          params: service.formField,
          onComplete: (data) => {
            console.log(data);
          },
          onError: (err) => {
            'Error updating form on CPMS';
          }
        });
        refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const refresh = () => {
    setReload(reload + 1);
  };

  const activate = () => {
    axios
      .patch(serviceRegistryHost + `services/status?id=${selectedService._id}&status=ACTIVATED`)
      .then((res) => {
        refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showRemoteReg = () => {
    axios
      .get(serviceRegistryHost + `services/single/${selectedService.code}`)
      .then((res) => {
        setSelectedService(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showLocalReg = () => {
    setSelectedService(allServices.find((service) => service.code === selectedService.code));
  };

  const getNewServices = (SRServices, configuredServices) => {
    //
    const configuredServicesCodes = configuredServices.map((service) => service.code);
    const newServices = SRServices.filter(
      (service) => !configuredServicesCodes.includes(service.serviceCode)
    );
    return newServices;
  };

  const getServiceConfigs = (onComplete) => {
    getFromServer({
      path: 'authority/services-config/',
      onComplete: (data) => {
        onComplete(data);
      },
      onError: (err) => {
        console.log('The error is: ', err);
      }
    });
  };

  useEffect(() => {
    getServiceConfigs((configuredServices) => {
      setAllServices(configuredServices);
      setSelectedService(configuredServices[0]);
      const nServices = getNewServices(AllServices, configuredServices);
      setNewServices(nServices);
    });

    //
    setServices(AllServices);

    setRegisteredCodes(AllServices.map((s) => s.serviceCode));
    setRegisteredIds(AllServices.map((s) => s._id));
  }, [reload]);

  useEffect(() => {
    if (selectedService != null) {
      selectedService.code = selectedService.code.toUpperCase();

      let isActive = false;
      services
        .filter((s) => s.code === selectedService.code)
        .forEach((s) => {
          if (s.status == 'ACTIVATED') {
            isActive = true;
          }
        });
      setIsActivated(isActive);
    }
  }, [selectedService, reload]);

  return (
    <Card sx={{ pb: 2, display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        onClick={logTestPayloads}
        title={'Services'}
        sx={{ mb: 2 }}
        subheader="Mexilkute'r"
        action={`${services.filter((s) => s.status === 'ACTIVATED').length} Active`}
      />
      <NewService
        refresh={refresh}
        newServices={newServices}
        setShowNewServices={setShowNewServices}
        open={showNewServices}
      />
      {selectedService != null && (
        <>
          <DebugService
            key={showDebugService}
            host={host}
            open={showDebugService}
            selectedService={selectedService.registry}
            onClose={() => setShowDebugService(false)}
            newServices={newServices}
            setShowNewServices={setShowNewServices}
          />
          <Stack>
            {allServices.map((service) => (
              <Stack
                key={service.code}
                onClick={() => setSelectedService(service)}
                sx={{
                  border: selectedService.code == service.code ? 1 : 0,
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  px: 2,
                  py: 0.5,
                  mx: 2,
                  my: 0.5
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ py: 1 }}>
                    {service.shortName}
                    {/* <Iconify sx={{color: selectedService.code == service.code ? '#fff' : '#000'}} icon={registeredCodes.includes(service.code) ? 'charm:tick' : 'gg:unavailable'}/> */}
                  </Typography>
                  {selectedService.code == service.code && (
                    <LoadingButton
                      variant="contained"
                      onClick={() => setShowDebugService(true)}
                      startIcon={<Iconify icon="carbon:debug" />}
                      endIcon={<Iconify icon="ic:round-navigate-next" />}
                    >
                      Debug
                    </LoadingButton>
                  )}
                </Stack>
                {selectedService.code == service.code && (
                  <Box>
                    <Divider />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Stack direction="row" justifyContent="start" my={1}>
                          {/* <IconButton sx={{bgcolor: 'primary.main', ml: 1, '&:disabled':{bgcolor:'#80808040'}}} disabled={output.data != undefined} aria-label="settings" onClick={testSubmission}>
                                                            <Iconify sx={{color: '#fff'}} icon={'eva:monitor-outline'}/>
                                                        </IconButton>
                                                        <IconButton sx={{bgcolor: 'primary.main', ml: 1, '&:disabled':{bgcolor:'#80808040'}}} disabled={output.data == undefined} aria-label="settings" onClick={()=>testSubmit()}>
                                                            <Iconify sx={{color: '#fff'}} icon={'bi:send-check-fill'}/>
                                                        </IconButton>
                                                        <IconButton sx={{bgcolor: 'primary.main', ml: 1}} aria-label="settings" onClick={()=>createRenderConfig()}>
                                                            <Iconify sx={{color: '#fff'}} icon={'gg:ui-kit'}/>
                                                        </IconButton> */}
                          <Tooltip title="Show Form">
                            <IconButton
                              sx={{
                                bgcolor: 'primary.main',
                                ml: 1,
                                '&:disabled': { bgcolor: '#80808040' }
                              }}
                              aria-label="settings"
                              disabled={formMode}
                              onClick={() => setFormMode(true)}
                            >
                              <Iconify sx={{ color: '#fff' }} icon={'fluent:form-20-filled'} />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            sx={{ bgcolor: 'primary.main', ml: 1, ...buttonStyle }}
                            aria-label="settings"
                            disabled={!formMode}
                            onClick={() => setFormMode(false)}
                          >
                            <Iconify sx={{ color: '#fff' }} icon={'carbon:service-id'} />
                          </IconButton>
                          {selectedService.registry._id != undefined && (
                            <IconButton
                              sx={{ bgcolor: 'primary.main', ml: 1 }}
                              aria-label="settings"
                              onClick={() => update()}
                            >
                              <Iconify sx={{ color: '#fff' }} icon={'akar-icons:arrow-right'} />
                            </IconButton>
                          )}
                          {!isActivated &&
                            registeredCodes.includes(service.code) &&
                            selectedService._id != undefined && (
                              <IconButton
                                sx={{ bgcolor: 'primary.main', ml: 1 }}
                                aria-label="settings"
                                onClick={() => activate()}
                              >
                                <Iconify sx={{ color: '#fff' }} icon="codicon:layers-active" />
                              </IconButton>
                            )}
                          {registeredCodes.includes(service.code) && (
                            <IconButton
                              sx={{ bgcolor: 'primary.main', ml: 1 }}
                              aria-label="settings"
                              onClick={() =>
                                selectedService._id != undefined ? showLocalReg() : showRemoteReg()
                              }
                            >
                              <Iconify
                                sx={{ color: '#fff' }}
                                icon={
                                  selectedService._id != undefined
                                    ? 'mdi:web-remove'
                                    : 'mdi:web-check'
                                }
                              />
                            </IconButton>
                          )}
                        </Stack>
                        {/* <TextField id="outlined-basic" rows={16} fullWidth multiline sx={{mt:1, input: { color: '#fff' }, fontSize: 10}} disabled={true} value={JSON.stringify(formMode ? selectedService.formField : selectedService, null, 2)} label="Service" width='100%' variant="outlined" /> */}
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        {/* <TextField id="outlined-basic" rows={16} fullWidth multiline sx={{mt:1, input: { color: '#fff' }, fontSize: 12}} disabled={true} value={JSON.stringify(output == null ? services : output, null, 2)} label="Output" width='100%' variant="outlined" /> */}
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
}
