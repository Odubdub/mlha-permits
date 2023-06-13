import {
  Card,
  Stack,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  FormHelperText,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Iconify from 'src/bundle/Iconify';
import { isNotValue } from 'src/bundle/validator';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: 120
  },
  button: {
    marginTop: theme.spacing(2)
  }
}));

const NotificationDetails = ({ notification, onClose }) => {
  const classes = useStyles();

  return (
    <Stack height="100%" width="100%" alignItems="center" justifyContent="center">
      <Card sx={{ width: 500, border: '0.5px dashed #808080', height: 700 }}>
        <Stack height={'100%'} width="100%">
          <Stack direction="row" justifyContent="end">
            <IconButton onClick={onClose} sx={{ mt: 1, mr: 1 }}>
              <Iconify icon="ic:round-close" />
            </IconButton>
          </Stack>
          <Stack alignSelf="center" justifyContent="start" width={'100%'} flex={1}>
            <Box
              component="img"
              src="/static/cyber.png"
              mt={1}
              sx={{ width: 150, mb: 4 }}
              alignSelf="center"
            />
            <Stack
              bgcolor="#80808020"
              border="0.5px dashed #808080"
              mx={6}
              py={0.5}
              px={3}
              borderRadius={1}
              mb={2}
            >
              <Stack direction="row" alignItems="center">
                <Iconify icon="icon-park-solid:check-one" />
                <Typography ml={1}>Notification</Typography>
              </Stack>
            </Stack>
            <Stack px={4} mx={3}>
              {''}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            height={60}
            bgcolor="#80808020"
            width={'100%'}
            justifyContent="space-between"
            justifySelf="end"
            alignItems="center"
          >
            <Box component="img" src="/static/card.png" ml={2} sx={{ width: 110, mb: 4, mt: 4 }} />
            <Typography>
              Click to download file<span style={{ fontWeight: 'bold' }}>Document Storage</span>
              <Iconify
                icon="line-md:download-loop"
                sx={{ transform: 'scale(1.2)', mt: 0.5, ml: 1, mr: 3 }}
              />
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default NotificationDetails;
