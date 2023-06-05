import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Divider,
  Fade,
  IconButton,
  List,
  Modal,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import cipa from './cipa.png';
import Loader from '../Loader/loader';
import Iconify from '../Iconify';
import { fToNow, fDate } from './DateTime';
import { WidgetType } from '../constants';
import Row from './Row';
import { getFromServer } from 'src/ApiService';

export const CompanyInfo = ({ title, subtitle, onClose, regNo }) => {
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
          path: `validations/cipa/${regNo}`,
          onComplete: (d) => {
            setTimeout(() => {
              stopWithCheck.current();
              setHasFailed(false);
              setTimeout(() => {
                setData(d);
              }, 1500);
            }, 1000);
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
          {title || 'Company Information'}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="clarity:close-line" />
        </IconButton>
      </Stack>
      <Divider />
      <Paper style={{ maxHeight: '70vh', minHeight: 500, minWidth: 500, overflow: 'auto' }}>
        {data != null ? (
          <List>
            <Row desc="Name" detail={data.name} />
            <Row
              desc="Incoporation Number"
              rightComponent={
                <Stack direction="row" alignItems="center" mt="2px">
                  <Typography variant="subtitle1" sx={{ fontSize: 16, ml: 2 }}>
                    {data.IncorporationNumber}
                  </Typography>
                  <Iconify
                    fontSize={20}
                    sx={{ color: data != null ? 'green' : 'red', ml: 2 }}
                    icon={data != null ? 'akar-icons:circle-check-fill' : 'ep:circle-close-filled'}
                  />
                </Stack>
              }
            />
            <Row
              desc="Incoporation Date"
              detail={`${fDate(new Date(data.IncorporationDate.split('+')[0]))} | ${fToNow(
                new Date(data.IncorporationDate.split('+')[0])
              )}`}
            />
            <Row
              desc="Status"
              mx={3}
              detail={data.status.toUpperCase()}
              type={WidgetType.chip}
              altDetColor={'blue'}
            />
            <Row
              title="Principal Business Address"
              type={WidgetType.devider}
              altDetColor={'blue'}
            />
            <Row desc="Line 1" detail={data.principalPlaceOfBusiness.addressLine1} />
            <Row desc="Line 2" detail={data.principalPlaceOfBusiness.addressLine2} />
            <Row desc="Locality" detail={data.principalPlaceOfBusiness.locality} />
            <Row desc="Country" detail={data.principalPlaceOfBusiness.country} />
            <Row title="Directors" type={WidgetType.devider} altDetColor={'blue'} />
            {data.companyDirectors.map((director, index) => {
              return (
                <Stack key={index} sx={{ bgcolor: '#80808010', mt: 1, borderRadius: 1 }}>
                  <Row desc="Name" detail={`${director.firstName} ${director.lastName}`} />
                  <Row
                    desc="Appointment Date"
                    detail={`${fDate(new Date(director.appointmentDate.split('+')[0]))} | ${fToNow(
                      new Date(director.appointmentDate.split('+')[0])
                    )}`}
                  />
                  <Row title="Residential Address" type={WidgetType.devider} altDetColor={'blue'} />
                  <Row desc="Line 1" detail={director.residentialAddress.addressLine1} />
                  <Row desc="Line 2" detail={director.residentialAddress.addressLine2} />
                  <Row desc="Locality" detail={director.residentialAddress.locality} />
                  <Row desc="Country" detail={director.residentialAddress.country} />
                  <Row title="Postal Address" type={WidgetType.devider} altDetColor={'blue'} />
                  <Row desc="Line 1" detail={director.postalAddress.addressLine1} />
                  <Row desc="Locality" detail={director.postalAddress.locality} />
                  <Row
                    desc="Country"
                    detail={
                      director.postalAddress.country == 'BW'
                        ? 'Botswana'
                        : director.postalAddress.country
                    }
                  />
                </Stack>
              );
            })}
            <Row title="Shareholders" type={WidgetType.devider} altDetColor={'blue'} />
            {data.ownership.map((shareholder, index) => {
              return (
                <Stack
                  key={index}
                  sx={{
                    bgcolor: '#80808010',
                    mt: 1,
                    height: '100%',
                    width: '100%',
                    borderRadius: 1
                  }}
                >
                  <Row desc="Name" detail={`${shareholder.shareholderName}`} />
                  <Row desc="Number of Shares" detail={`${shareholder.NumberOfShares}`} />
                  <Row desc="Ownership Type" detail={`${shareholder.ownershipType}`} />
                </Stack>
              );
            })}
          </List>
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
      <Stack direction="row" height={30} justifyContent="space-between" alignItems="center" pb={1}>
        <img style={{ height: 30, marginTop: 20, objectFit: 'contain' }} alt="" src={cipa} />
      </Stack>
    </Box>
  );
};
