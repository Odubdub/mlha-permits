import {
  Box,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  List,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { getFromServer } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import DynamicField from './DynamicField';

export const toDateInput = (dateStr) => {
  var date = dateStr != undefined ? new Date(dateStr) : new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  return year + '-' + month + '-' + day;
};

const calculateValidUntil = (validFrom, duration) => {
  const start = new Date(validFrom);
  const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  return end;
};

export default function Generate({
  isDisabled = false,
  config,
  setCertificateGenData,
  data,
  certificateGenData,
  errors
}) {
  const [conditionsData, setConditionsData] = useState({
    title: '',
    caption: '',
    show: false
  });
  const conditionFields = [
    {
      fieldName: 'title',
      defaultValue: '',
      fieldLabel: 'Conditions title',
      enabled: false,
      fieldType: 'ShortText',
      fieldDescription: '',
      options: [],
      mandatory: true
    },
    {
      fieldName: 'caption',
      defaultValue: '',
      fieldLabel: 'Overleaf Conditions',
      enabled: false,
      fieldType: 'LongText',
      fieldDescription: '',
      options: [],
      mandatory: true
    }
  ];

  const { userData } = useContext(AuthContext);

  useEffect(() => {
    updateValidity();
  }, [certificateGenData.validFrom]);

  const updateValidity = (validFrom) => {
    //Default Fields
    const fieldData = {};
    if (config.fields) {
      config.fields.forEach((field) => {
        fieldData[field.fieldName] = field.defaultValue || '';
      });
    }

    const validityData = {};
    if (config.hasValidity) {
      const validUntil = calculateValidUntil(certificateGenData.validFrom, config.validity || 14);

      validityData.validFrom = certificateGenData.validFrom;
      validityData.validUntil = toDateInput(validUntil);
    }

    const data = {
      ...certificateGenData,
      ...fieldData,
      ...validityData,
      conditions: conditionsData.show
    };
    //Set default values
    setCertificateGenData(data);
  };

  useEffect(() => {
    getFromServer({
      path: `certificate/conditions/${data.service}`,
      onComplete: (conditions) => {
        if (conditions) {
          const data = { ...certificateGenData, conditions: true };
          setConditionsData({ ...conditions, show: true });
          setCertificateGenData(data);
        } else {
          const data = { ...certificateGenData, conditions: false };
          setCertificateGenData(data);
          setConditionsData({ title: '', caption: '', show: false });
        }
        updateValidity();
      },
      onError: (err) => {
        console.log(err);
        const data = { ...certificateGenData, conditions: false };
        setCertificateGenData(data);
        setConditionsData({ title: '', caption: '', show: false });
      }
    });
  }, []);

  return (
    <Stack sx={{ width: '100%', maxHeight: 500, display: 'flex', justifyContent: 'left' }}>
      <Typography id="m-title" variant="h4" ml={2} mt={1} component="h2">
        {`${data.certificate ? 'Regenerate' : 'Generate'} ${config.type}`}
      </Typography>
      <Typography
        marginBottom="0.5em"
        variant="h6"
        color="#808080"
        fontWeight="normal"
        fontSize={14}
        ml={2}
        component="h2"
      >
        {config.title}
      </Typography>
      <Divider />
      <Paper style={{ maxHeight: '80vh', overflow: 'auto' }}>
        <List>
          <Stack>
            <Box display="flex" flexDirection="row" my={1}>
              <Grid container>
                <Grid item xs={3} sm={6} md={8}>
                  <Stack flex={1} ml={2} mt={2} mr={2}>
                    <Typography fontWeight="bold" mb={1}>
                      {`Additional Details`}
                    </Typography>
                    <Stack direction="column">
                      <Stack direction="row">
                        {certificateGenData.validFrom != null && (
                          <Stack flex={1}>
                            <TextField
                              id="dateInput"
                              InputProps={{
                                style: {
                                  "'&:input:focus": {
                                    border: '2px solid #555',
                                    color: 'red'
                                  },
                                  color: '#ffffff00',
                                  unSelectable: 'on'
                                },
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Chip
                                      sx={{ fontSize: 14 }}
                                      label={moment(certificateGenData.validFrom).format(
                                        'D MMM YYYY '
                                      )}
                                    />
                                  </InputAdornment>
                                )
                              }}
                              error={errors.validFrom}
                              onChange={(e) =>
                                setCertificateGenData({
                                  ...certificateGenData,
                                  validFrom: e.target.value
                                })
                              }
                              disabled={isDisabled}
                              name="validFrom"
                              fullWidth
                              type="date"
                              value={certificateGenData.validFrom}
                              label="Valid From"
                              placeholder="30"
                              sx={{ mt: 1, mr: 1, flex: 1 }}
                              variant="outlined"
                            />
                          </Stack>
                        )}
                        {config.hasValidity &&
                          certificateGenData.validUntil &&
                          certificateGenData.validUntil != null && (
                            <Stack flex={1}>
                              <TextField
                                id="dateOutput"
                                error={errors.validUntil}
                                InputProps={{
                                  style: { color: '#ffffff' },
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Chip
                                        sx={{ fontSize: 14 }}
                                        label={moment(certificateGenData.validUntil).format(
                                          'D MMM YYYY '
                                        )}
                                      />
                                    </InputAdornment>
                                  )
                                }}
                                disabled={true}
                                name="validUntil"
                                value={''}
                                label="Valid Until"
                                sx={{ mt: 1, ml: 1, flex: 1 }}
                                variant="outlined"
                              />
                            </Stack>
                          )}
                      </Stack>
                      {config.conditions &&
                        conditionFields.map((field, index) => (
                          <DynamicField
                            field={field}
                            fieldData={conditionsData}
                            errors={errors}
                            setFieldData={setCertificateGenData}
                            isDisabled={true}
                            key={index}
                          />
                        ))}
                    </Stack>
                    <Stack bgcolor="#80808010"></Stack>
                  </Stack>
                </Grid>
                <Grid item xs={3} sm={6} md={4}>
                  <Stack flex={1} ml={2} mt={2} mr={2}>
                    <Typography fontWeight="bold" mb={2}>
                      {`Validity`}
                    </Typography>
                    <Divider />
                    <Stack direction="row" mb={1}>
                      <Box width={150} minWidth={150}>
                        <Typography fontWeight="normal">Duration</Typography>
                      </Box>
                      <p fontWeight="medium">{config.validity}</p>
                    </Stack>
                    <Stack direction="row" mb={1}>
                      <Box width={150} minWidth={150}>
                        <Typography fontWeight="normal">Period</Typography>
                      </Box>
                      <p fontWeight="medium">{config.period}</p>
                    </Stack>
                    <Typography fontWeight="bold" mt={1}>
                      {`Generated by`}
                    </Typography>
                    <Divider />
                    <Stack direction="row" mb={1}>
                      <Box width={150} minWidth={150}>
                        <Typography fontWeight="normal">Designation</Typography>
                      </Box>
                      <p fontWeight="medium">{userData.designation}</p>
                    </Stack>
                    <Stack direction="row" mb={1}>
                      <Box width={150} minWidth={150}>
                        <Typography fontWeight="normal">Name</Typography>
                      </Box>
                      <p fontWeight="medium">{`${userData.foreNames} ${userData.lastName}`}</p>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            <Divider />
          </Stack>
        </List>
      </Paper>
    </Stack>
  );
}
