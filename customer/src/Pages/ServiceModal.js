import { LoadingButton } from '@mui/lab';
import { Divider, Grid, Grow, Modal, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { nanoid } from 'nanoid';
import React, { useContext, useRef } from 'react';
import { useState } from 'react';
import { post, url } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import { FieldViewer } from 'src/bundle/FieldViewer';
import Iconify from 'src/bundle/Iconify';
import Row from 'src/bundle/renderer/Row';
import CardDetails from './Card/CardDetails';
import { PaymentOptions } from './PaymentOptions';

export const ServiceModal = ({ service = {}, open, onClose }) => {
  const [sectionErrors, setSectionErrors] = useState({});
  const [data, setData] = useState({});
  const [openSection, setOpenSection] = useState(0);
  const [errors, setErrors] = useState({});
  const registerRef = useRef(null);
  const { userData } = useContext(AuthContext);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const capitalize = (word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    return capitalized;
  };

  const handleSubmit = () => {
    setOpenSection(-1);
    handleClosePaymentOptions();
    const crmRef = nanoid(16);

    const output = {
      reference: {
        application_id: crmRef,
        response_id: '',
        submitted_by: {
          id: userData.idNo,
          type: '0'
        },
        status: 0,
        service: {
          service_id: service.serviceCode,
          service_name: service.shortName,
          version: '1.0'
        },
        profile: {
          first_name: userData.foreNames,
          middle_name: '',
          citizenship: userData.countryOfBirth == 'BOTSWANA' ? 'Citizen' : 'Non Citizen',
          surname: userData.lastName,
          date_of_birth: userData.dateOfBirth,
          gender: capitalize(userData.gender),
          country_of_birth: capitalize(userData.countryOfBirth),
          nationality: capitalize(userData.nationality),
          primary_phone: userData.primaryPhoneNumber,
          primary_postal: {
            is_primary: false,
            box_number: '',
            city_town_village: userData.primaryPostalAddress
          },
          primary_email: userData.primaryEmailAddress
        }
      },
      payload: {
        form: data,
        payment: getPayment((service || {}).serviceFee, crmRef)
      }
    };

    post(`applications/${service.serviceCode}`, output)
      .then((res) => {
        console.log(res);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        onClose();
      });
  };

  const handleClosePaymentOptions = () => {
    setShowPaymentOptions(false);
    setShowPayment(false);
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
    setShowPaymentOptions(false);
  };

  const handleClosePayment = () => {
    setShowPaymentOptions(true);
    setShowPayment(false);
  };

  let BWP = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BWP'
  });

  const getServiceFee = (val) => {
    if (isNaN(val) || val == 0) {
      return 'FREE';
    } else {
      return BWP.format(val);
    }
  };

  const getPayment = (val, crmRef) => {
    if (isNaN(val) || val == 0) {
      return {};
    } else {
      return {
        payment_name: 'Publication of Banns Fee',
        amount: `${val}`,
        status: 'SUCCESSFUL',
        payment_ref: `PPM-${nanoid(12)}`,
        application_ref: crmRef,
        service_code: service.serviceCode
      };
    }
  };

  return (
    <Modal
      BackdropProps={{
        style: {
          backgroundColor: 'transparent',
          background: '#ffffffaa',
          backdropFilter: 'blur(5px)'
        }
      }}
      open={open}
    >
      <Stack sx={{ width: '100vw', height: '100%' }} justifyContent="center" alignItems="center">
        <Grow in={open}>
          <Stack
            bgcolor="#fff"
            sx={{
              bgcolor: '#FFFFFFAA',
              boxShadow: 'rgba(0, 0, 0, 0.2) 2px 3px 10px;'
            }}
            maxHeight="calc(100vh - 80px)"
            maxWidth={1400}
            borderRadius={2}
            overflow="hidden"
            width={'calc(100% - 50px)'}
          >
            <Grid container direction="row" height="100%">
              <Grid item xs={12} sm={12} md={6} lg={6} height="100%" justifyContent="start">
                <Stack alignItems="center" px={3}>
                  <Box component="img" src="/static/coat.png" mt={5} sx={{ width: 100 }} />
                  <Typography fontWeight={400} mb={1} fontSize={12}>
                    Republic of Botswana
                  </Typography>
                  {((service || {}).description || {}).act && (
                    <Typography fontWeight={700} fontSize={14}>
                      {((service || {}).description || {}).act || ''}
                    </Typography>
                  )}
                  <Typography fontWeight={700} fontSize={14}>
                    {(service || {}).ministry || ''}
                  </Typography>
                  <Typography fontWeight={500} mb={1} fontSize={14}>
                    {(service || {}).department || ''}
                  </Typography>
                  <Typography mb={1} fontWeight={800} fontSize={24}>
                    {(service || {}).shortName || ''}
                  </Typography>
                  {((service || {}).description || {}).long && (
                    <Typography fontWeight={400} width="100%" textAlign="justify" fontSize={14}>
                      {service.description.long}
                    </Typography>
                  )}
                  <Divider sx={{ width: '100%', my: 2 }} />
                  <Stack
                    alignSelf="start"
                    mt={1}
                    mb={2}
                    width="100%"
                    pb={2}
                    sx={{ bgcolor: '#ceeffc60', px: 1, py: 1, borderRadius: 1.5 }}
                  >
                    <Typography ml={1} alignSelf="start" fontWeight={700} fontSize={18}>
                      Contacts
                    </Typography>
                    <Row mx={1} desc="Email" detail={'labour@gov.bw'} />
                    <Row mx={1} desc="Phone" detail={'+267 373 2700'} />
                    <Row mx={1} desc="Website" detail={'www.gov.bw'} />
                    <Row
                      mx={1}
                      desc="Physical Address"
                      detail={'Block 8, Government Enclave, Khama Crescent'}
                    />
                    <Row mx={1} desc="Toll Free" detail={'0800 600 777'} />
                    <Row mx={1} desc="Tel" detail={'3611100, 3611180\n3611132'} />
                    <Row mx={1} desc="Address" detail={'Government Enclave'} />
                  </Stack>
                  <Stack
                    alignSelf="start"
                    mt={1}
                    mb={2}
                    width="100%"
                    pb={2}
                    sx={{ bgcolor: '#ceeffc60', px: 1, py: 1, borderRadius: 1.5 }}
                  >
                    <Typography ml={1} alignSelf="start" fontWeight={700}>
                      Service Fees
                    </Typography>
                    <Row
                      mx={1}
                      desc="Application Fee"
                      center={true}
                      detail={getServiceFee((service || {}).serviceFee)}
                      alignItems="center"
                      detailFontWeight={800}
                      detailFontSize={20}
                    />
                  </Stack>
                </Stack>
              </Grid>
              {/* <Box alignSelf='stretch' border='0.5px dashed #C2C2C279' ml={2} /> */}
              <Grid item xs={12} sm={12} md={6} lg={6} height="100%" bgcolor="#80808010">
                <Stack alignItems="center" height="100%" width="100%">
                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    borderBottom="0.5px dashed #80808080"
                    height={50}
                    width="100%"
                  >
                    <LoadingButton
                      startIcon={<Iconify icon="ri:draft-fill" />}
                      sx={{
                        alignSelf: 'end',
                        mx: 1,
                        my: 0.9,
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'primary.lighter' }
                      }}
                      onClick={onClose}
                    >
                      Save as Draft
                    </LoadingButton>
                    <LoadingButton
                      endIcon={<Iconify icon="mdi:close" />}
                      sx={{
                        alignSelf: 'end',
                        mx: 1,
                        my: 0.9,
                        color: 'red',
                        '&:hover': { bgcolor: '#ff000020' }
                      }}
                      onClick={onClose}
                    >
                      Close Application
                    </LoadingButton>
                  </Stack>
                  {service && service.form && service.form.length > 0 ? (
                    <FieldViewer
                      ref={registerRef}
                      data={data}
                      host={url}
                      defaultSize={true}
                      setData={setData}
                      maxHeight={'calc(100vh - 250px)'}
                      minHeight={'calc(100vh - 250px)'}
                      height={'calc(100vh - 250px)'}
                      width={'100%'}
                      errors={errors}
                      setErrors={setErrors}
                      openSection={openSection}
                      setOpenSection={setOpenSection}
                      setSectionErrors={setSectionErrors}
                      sectionErrors={sectionErrors}
                      sections={service.form}
                    />
                  ) : (
                    <Stack flex={1} alignItems="center" justifyContent="center">
                      <Typography fontWeight={700} fontSize={14}>
                        No form available
                      </Typography>
                    </Stack>
                  )}
                  <Divider sx={{ ml: 3 }} />
                  <Stack
                    justifySelf="end"
                    sx={{
                      borderRadius: '0px 0px 10px 0px',
                      p: 1,
                      borderTop: '0.5px dashed #80808080'
                    }}
                    justifyContent="end"
                    direction="row"
                    width="100%"
                    height={60}
                    right={30}
                    alignItems="center"
                  >
                    <Typography ml={1} fontWeight={700} fontSize={14}>
                      Application Fee
                    </Typography>
                    <Box flex={1} />
                    {getServiceFee((service || {}).serviceFee) == 'FREE' ? (
                      <LoadingButton
                        variant="contained"
                        disabled={Object.values(errors).includes(true)}
                        sx={{ justifySelf: 'end', mr: 1 }}
                        onClick={() => handleSubmit()}
                        startIcon={<Iconify icon="icon-park-solid:doc-detail" />}
                        endIcon={<Iconify icon="fa6-solid:arrow-right" />}
                      >
                        Submit Application
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        variant="contained"
                        sx={{ justifySelf: 'end', mr: 1 }}
                        disabled={Object.values(errors).includes(true)}
                        onClick={() => setShowPaymentOptions(true)}
                        startIcon={<Iconify icon="ph:hand-coins-fill" />}
                        endIcon={<Iconify icon="fa6-solid:arrow-right" />}
                      >
                        Pay for service
                      </LoadingButton>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Modal
              BackdropProps={{
                style: {
                  backgroundColor: 'transparent',
                  background: '#ffffffaa',
                  backdropFilter: 'blur(5px)'
                }
              }}
              open={showPayment}
            >
              <CardDetails
                amount={getServiceFee()}
                amountStr={getServiceFee((service || {}).serviceFee)}
                onClose={handleClosePayment}
                onCompletePayment={handleSubmit}
                feeName={(service || {}).feeName}
              />
            </Modal>

            <Modal
              BackdropProps={{
                style: {
                  backgroundColor: 'transparent',
                  background: '#ffffffaa',
                  backdropFilter: 'blur(5px)'
                }
              }}
              open={showPaymentOptions}
            >
              <PaymentOptions
                onPicked={handleProceedToPayment}
                onClose={handleClosePaymentOptions}
              />
            </Modal>
          </Stack>
        </Grow>
      </Stack>
    </Modal>
  );
};
