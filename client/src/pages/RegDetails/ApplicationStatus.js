import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { storageHost, url } from 'src/ApiService';
import Iconify from 'src/components/Iconify';
import { getStatusDescription } from 'src/helper';
import { fToNow } from 'src/utils/formatTime';
import { hasIssuancePayment } from './ActionBarHelper';
import CopyField from './CopyField';
import { getFieldValue } from './DetailFields/DataSource';
import { DetailFieldsType } from './DetailFields/DetailFieldType';
import { FieldType } from './DetailFields/FieldType';
import Doc from './Doc';
import Field from './Field';
import Row from './Row';

function ApplicationStatus({ data, serviceConfig }) {
  const getIssuanceFees = () => {
    if (serviceConfig.issuanceFeeType == 'Flat') {
      return serviceConfig.issuanceFee;
    } else if (serviceConfig.issuanceFeeType == 'Dependant') {
      const value = getFieldValue({
        data: data,
        path: `applicationDetails.${serviceConfig.issuanceFeeDependancy.key}`
      });

      const fee = serviceConfig.issuanceFeeDependancy.depandancy.find((d) => d.value == value);

      return fee ? fee.fee : serviceConfig.issuanceFee;
    }

    return 0;
  };

  const getStatusColor = (value) => {
    const status = value.toLowerCase();
    if (
      status.toLowerCase().includes('revoked') ||
      status.toLowerCase().includes('failed') ||
      status.toLowerCase().includes('rejected') ||
      status.toLowerCase().includes('pending')
    ) {
      return 'error';
    } else if (['approved', 'issued', 'success', 'successful'].includes(status)) {
      return 'success';
    } else {
      return 'default';
    }
  };

  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <Card sx={{ pb: 2, mt: 2 }}>
      <CardHeader
        title={'Application Status'}
        sx={{ mb: 2 }}
        subheader={`Last Updated: ${fToNow(data.updatedAt)}`}
        action={
          <IconButton aria-label="settings">
            <Iconify icon="ion:refresh-circle" />
          </IconButton>
        }
      />
      {(data.issuanceDetails || {}).mode == 'direct' && (
        <Field
          info={{
            key: 'status',
            desc: `Issuance`,
            field: FieldType.attachment,
            formatter: 0,
            source: 0,
            bucket: data.department,
            path: 'issuanceDetails.issuanceAtt'
          }}
          data={data}
        />
      )}
      {['issued', 'revoked', 'pending-issuance', 'pending'].includes(data.status) && (
        <>
          {(data.certificate || {}).certificateFile && (
            <>
              <Row
                rightComponent={
                  <Stack direction="row">
                    <Tooltip title={`View document in new tab`}>
                      <IconButton sx={{ height: 34, width: 34, p: 1, color: '#808080' }}>
                        <Link
                          sx={{ textDecoration: 'none', color: '#808080', fontSize: 18 }}
                          href={`${storageHost}download/${data.certificate.certificateFile.bucket}/${data.certificate.certificateFile.key}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Iconify icon="fluent:document-16-filled" />
                        </Link>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Download`}>
                      <IconButton sx={{ height: 34, width: 34, p: 1, color: '#808080' }}>
                        <Link
                          sx={{ textDecoration: 'none', color: '#808080', fontSize: 18 }}
                          href={`${storageHost}download/${data.certificate.certificateFile.bucket}/${data.certificate.certificateFile.key}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Iconify icon="eva:cloud-download-outline" />
                        </Link>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`View document overlay`}>
                      <Button onClick={() => setShowCertificate(true)}>{`Preview`}</Button>
                    </Tooltip>
                    <Doc
                      onClose={() => setShowCertificate(false)}
                      url={`${storageHost}download/${data.certificate.certificateFile.bucket}/${data.certificate.certificateFile.key}`}
                      open={showCertificate}
                    />
                  </Stack>
                }
                desc="Issuance"
              />
              <Box mt={1} />
              <Row
                desc={`${((data.serviceConfig || {}).issuance || {}).type || ''} Reference`}
                altDetColor={['pending', 'revoked'].includes(data.status) ? 'red' : 'green'}
                rightComponent={
                  <CopyField
                    title={`${((data.serviceConfig || {}).issuance || {}).type || ''} Reference`}
                    text={data.certificate.uid}
                  />
                }
                type={DetailFieldsType.Chip}
              />
              <Box mt={2} />
            </>
          )}
        </>
      )}
      <Row
        desc={`${((data.issuanceDetails || {}).type || '') + ' '}Status`.trim()}
        altDetColor={['pending', 'revoked'].includes(data.status) ? 'red' : 'green'}
        rightComponent={
          <Chip
            ml={3}
            label={getStatusDescription(data.status).toUpperCase()}
            color={getStatusColor(data.status)}
          />
        }
        detail={data.status.toUpperCase()}
        type={DetailFieldsType.Chip}
      />
      <Box mt={2} />
      {data.paymentDetails && (
        <>
          <Divider mb={2} />
          <Typography color="text" sx={{ fontSize: 16, fontWeight: 800, mt: 1 }} ml={3}>
            Application Fee
          </Typography>
          <Box mt={1} />
          <Row
            desc="Status"
            altDetColor={['pending', 'revoked'].includes(data.status) ? 'red' : 'green'}
            rightComponent={
              <Stack direction="row" alignItems="center">
                <Chip
                  ml={3}
                  sx={{ textTransform: 'uppercase' }}
                  label={data.paymentDetails.status}
                  color={getStatusColor(data.paymentDetails.status.toLowerCase())}
                />
              </Stack>
            }
            detail={typeof data.paymentStatus.toUpperCase()}
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />
          <Row
            desc="Amount"
            altDetColor={['pending', 'revoked'].includes(data.status) ? 'red' : 'green'}
            rightComponent={
              <Typography variant="h5" fontWeight={400} color="text" mr={2}>
                {`P${Number(data.paymentDetails.amount).toFixed(2)}`}
              </Typography>
            }
            detail={data.paymentDetails.amount}
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />

          <Row
            desc="PPM Reference"
            altDetColor={['pending', 'revoked'].includes(data.status) ? 'red' : 'green'}
            rightComponent={
              <CopyField text={data.paymentDetails.ppmRef} title={'PPM Payment Reference'} />
            }
            detail={data.paymentStatus.toUpperCase()}
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />

          <Row
            desc="CRM Reference"
            altDetColor={['pending', 'revoked'].includes(data.status) ? 'red' : 'green'}
            rightComponent={
              <CopyField
                text={data.paymentDetails.applicationRef}
                title={'CRM Application Reference'}
              />
            }
            detail={data.paymentStatus.toUpperCase()}
            type={DetailFieldsType.Chip}
          />
        </>
      )}
      <Box mt={1} />
      {data.issuanceFeeDetails && (
        <>
          <Divider mb={2} />
          <Typography color="text" sx={{ fontSize: 16, fontWeight: 800, mt: 1 }} ml={3}>
            Issuance Fee
          </Typography>
          <Box mt={1} />
          <Row
            desc="Status"
            altDetColor={'green'}
            rightComponent={
              <Stack direction="row" alignItems="center">
                <Chip
                  ml={3}
                  sx={{ textTransform: 'uppercase' }}
                  label={data.issuanceFeeDetails.status}
                  color={getStatusColor(data.issuanceFeeDetails.status.toLowerCase())}
                />
              </Stack>
            }
            detail={typeof data.issuanceFeeStatus.toUpperCase()}
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />
          <Row
            desc="Amount"
            altDetColor={
              ['successful'].includes(((data.issuanceFeeDetails || {}).status || '').toLowerCase())
                ? 'green'
                : 'red'
            }
            rightComponent={
              <Typography variant="h5" fontWeight={400} color="text" mr={2}>
                {`P${Number(data.issuanceFeeDetails.amount).toFixed(2)}`}
              </Typography>
            }
            detail={data.issuanceFeeDetails.amount}
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />

          <Row
            desc="PPM Reference"
            altDetColor={
              ['successful'].includes(((data.issuanceFeeDetails || {}).status || {}).toLowerCase())
                ? 'green'
                : 'red'
            }
            rightComponent={
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  border: 'dashed 1px',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  borderColor: '#D2D2D2'
                }}
              >
                <Typography variant="h6" fontWeight={400} color="text" mr={2}>
                  {data.issuanceFeeDetails.ppmRef}
                </Typography>
                <Tooltip title="Copy 'PPM Payment Reference'">
                  <IconButton
                    size="small"
                    onClick={() =>
                      navigator.clipboard.writeText((data.issuanceFeeDetails || {}).ppmRef)
                    }
                  >
                    <Iconify icon="material-symbols:content-copy-rounded" />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
            detail={(data.issuanceFeeDetails || {}).status.toUpperCase()}
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />

          <Row
            desc="CRM Reference"
            altDetColor={['pending', 'revoked'].includes(data.status) ? 'red' : 'green'}
            rightComponent={
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  border: 'dashed 1px',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  borderColor: '#D2D2D2'
                }}
              >
                <Typography variant="h6" fontSize={12} fontWeight={400} color="text" mr={2}>
                  {data.issuanceFeeDetails.applicationRef}
                </Typography>
                <Tooltip title="Copy 'PPM Application Reference'">
                  <IconButton
                    size="small"
                    onClick={() =>
                      navigator.clipboard.writeText(data.issuanceFeeDetails.applicationRef)
                    }
                  >
                    <Iconify icon="material-symbols:content-copy-rounded" />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
            detail={data.issuanceFeeDetails.status.toUpperCase()}
            type={DetailFieldsType.Chip}
          />
        </>
      )}
      {hasIssuancePayment(data, serviceConfig) && !data.issuanceFeeDetails && (
        <>
          <Divider mb={2} />
          <Typography color="text" sx={{ fontSize: 16, fontWeight: 800, mt: 1 }} ml={3}>
            Issuance Fee
          </Typography>
          <Box mt={1} />
          <Row
            desc="Status"
            altDetColor={'green'}
            rightComponent={
              <Stack direction="row" alignItems="center">
                <Chip
                  ml={3}
                  sx={{
                    textTransform: 'uppercase',
                    bgcolor: 'payment-requested' ? 'red' : '#808080'
                  }}
                  label={data.status == 'payment-requested' ? 'REQUESTED' : 'NOT-REQUESTED'}
                  color="error"
                />
              </Stack>
            }
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />
          <Row
            desc="Amount"
            altDetColor={
              ['successful'].includes(((data.issuanceFeeDetails || {}).status || '').toLowerCase())
                ? 'green'
                : 'red'
            }
            rightComponent={
              <Typography variant="h5" color="#9D9D9D" fontWeight={200} mr={2}>
                {`P${Number(getIssuanceFees()).toFixed(2)}`}
              </Typography>
            }
            type={DetailFieldsType.Chip}
          />
          <Box mt={1} />
        </>
      )}
    </Card>
  );
}

export default ApplicationStatus;
