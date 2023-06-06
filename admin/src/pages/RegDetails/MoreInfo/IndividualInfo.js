import React, { useEffect, useRef, useState } from 'react';
import { Box, Divider, Fade, IconButton, List, Paper, Stack, Typography } from '@mui/material';
import Row from '../Row';
import omang from './omang.png';
import Iconify from 'src/components/Iconify';
import { getAge } from 'src/utils/formatTime';
import { FieldType } from '../DetailFields/FieldType';
import { getFromServer } from 'src/ApiService';
import Loader from 'src/components/Loader/loader';

export const IndividualInfo = ({ onClose, regNo }) => {
  const [data, setData] = useState(null);
  const [hasFailed, setHasFailed] = useState(false);

  const stop = useRef();
  const start = useRef();
  const stopWithCheck = useRef();
  const stopWithError = useRef();

  useEffect(() => {
    if (start.current != null && start.current != undefined && !hasFailed) {
      setTimeout(() => {
        start.current();
        getFromServer({
          path: `validations/omang/${regNo}`,
          onComplete: (d) => {
            console.log(d);
            if (d.success) {
              setTimeout(() => {
                stopWithCheck.current();
                setHasFailed(false);
                setTimeout(() => {
                  setData(d.data);
                }, 1500);
              }, 1000);
            } else {
              setHasFailed(true);
              stopWithError.current();
            }
          },
          onError: (err) => {
            console.log('err => ', err);
            setHasFailed(true);
            stopWithError.current();
          }
        });
      }, 1000);
    }
  }, [start.current]);

  return (
    <Box bgcolor="#fff" borderRadius={2} py={2} px={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" pb={1}>
        <Typography variant="h6" mb={0} gutterBottom>
          {'Identity Information'}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="clarity:close-line" />
        </IconButton>
      </Stack>
      <Divider />
      <Paper style={{ maxHeight: '70vh', minHeight: 200, minWidth: 500, overflow: 'auto' }}>
        {data != null ? (
          <>
            {data.message != null && Object.keys(data.data).length == 0 ? (
              <Stack p={2} height="100%" alignItems="center" justifyContent="center">
                <Iconify
                  sx={{ fontSize: 30, mt: 5, color: '#009500' }}
                  icon="mdi:tick-all"
                  fontSize="small"
                />
                <Typography variant="h6" mb={0} mt={1} gutterBottom>
                  {data.message.includes('Omang found')
                    ? 'Validation Success'
                    : 'Validation Failed'}
                </Typography>
              </Stack>
            ) : (
              <List>
                <Row
                  desc="ID Number"
                  rightComponent={
                    <Stack direction="row" alignItems="center" mt="2px">
                      <Typography variant="subtitle1" sx={{ fontSize: 16, ml: 2 }}>
                        {data.ID_NO}
                      </Typography>
                      <Iconify
                        fontSize={20}
                        sx={{ color: data != null ? 'green' : 'red', ml: 2 }}
                        icon={
                          data != null ? 'akar-icons:circle-check-fill' : 'ep:circle-close-filled'
                        }
                      />
                    </Stack>
                  }
                />

                <Row desc="Surname" detail={data.SURNME} />
                <Row desc="First Name" detail={data.FIRST_NME} />
                <Row
                  desc="Gender"
                  detail={data.SEX == 'M' ? 'Male' : data.SEX == 'F' ? 'Female' : 'Other'}
                />
                <Row desc="Person Status" type={FieldType.chip} detail={data.PERSON_STATUS} />
                <Row desc="Occupation" detail={data.OCCUPATION_DESCR} />
                <Row desc="Expiry Date" detail={`${data.EXPIRY_DTE} | ${data.EXPIRY_DTE}`} />
                <Row desc="Marrital Status" detail={data.MARITAL_STATUS_DESCR} />
                <Row
                  desc="Date of Birth"
                  detail={`${data.BIRTH_DTE} | ${getAge(new Date(data.BIRTH_DTE))}`}
                />
                <Row desc="Place of Birth" detail={data.BIRTH_PLACE_NME} />
                <Row title="Residence" type={FieldType.devider} altDetColor={'blue'} />
                <Row desc="Address" detail={data.RESIDENTIAL_ADDR} />
                <Row desc="Postal Address" detail={data.POSTAL_ADDR} />
                <Row desc="District Name" detail={data.DISTRICT_NME} />
              </List>
            )}
          </>
        ) : (
          <Stack direction="column" justifyContent="center" alignItems="center" mt={4}>
            <Box sx={{ transform: 'scale(1.5)' }}>
              <Loader
                start={start}
                stop={stop}
                stopWithCheck={stopWithCheck}
                stopWithError={stopWithError}
              />
            </Box>
            <Fade in={hasFailed}>
              <Stack direction="row" justifyContent="center" alignItems="center" mt={4}>
                <Stack alignItems="center" mt={2} color="#808080">
                  <Typography
                    variant="subtitle"
                    sx={{ transform: 'translate(0px, 5px)' }}
                    fontSize={16}
                    my={0}
                  >
                    Validation Failed
                  </Typography>
                  <Typography variant="h6" my={0}>
                    Please try again later
                  </Typography>
                </Stack>
              </Stack>
            </Fade>
          </Stack>
        )}
      </Paper>
      <Divider />
      <Stack direction="row" height={35} justifyContent="start" alignItems="center" pb={1}>
        <img style={{ height: 35, marginTop: 20, objectFit: 'contain' }} src={omang} />
        <Stack mt={2} ml={2} color="#808080">
          <Typography
            variant="subtitle"
            sx={{ transform: 'translate(0px, 5px)' }}
            fontSize={12}
            my={0}
          >
            Validation source
          </Typography>
          <Typography variant="h6" my={0}>
            eID Service
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
