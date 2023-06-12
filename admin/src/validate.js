import {
  Box,
  Chip,
  Paper,
  Divider,
  IconButton,
  List,
  Modal,
  Stack,
  Typography
} from '@mui/material';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromServer } from './ApiService';
import { AuthContext } from './AuthContext';
import Iconify from './components/Iconify';

export const getRow = ({ title, size, desc, bold, pb = 1 }) => {
  return (
    <Stack direction={'row'} width="100%" alignItems="center" pb={pb} justifyContent="space-around">
      <Typography variant="caption" width="35%" color="#808080" fontSize={14}>
        {title}
      </Typography>
      <Typography
        variant="caption"
        fontWeight={bold ? 700 : 400}
        width="65%"
        fontSize={size == 'small' ? 14 : 18}
      >
        {desc}
      </Typography>
    </Stack>
  );
};

export const ValidateModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  const { userData } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.href.includes('validate?ref=')) {
      const id = window.location.href.split('?ref=');
      if (id) {
        setOpen(true);
        ref.current = id[1];
        getIT();
      } else {
        setOpen(false);
      }
      routeToHome();
    }
  }, [window.location.href]);

  const routeToHome = () => {
    if (userData) {
      navigate('/work');
    } else {
      navigate('/');
    }
  };

  const getIT = () => {
    getFromServer({
      path: `validate/details?ref=${ref.current}`,
      onComplete: (res) => {
        setData(res);
        console.log(res);
      },
      onError: (err) => {
        setError(err);
      }
    });
  };

  return (
    <Modal open={open}>
      <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
        <Stack
          width={500}
          maxWidth="100%"
          height={700}
          px={2}
          py={2}
          borderRadius={2}
          bgcolor="#fff"
        >
          <Stack
            direction={'row'}
            onClick={getIT}
            alignItems="center"
            pb={1}
            justifyContent="space-between"
          >
            <Typography variant="h6">{`Validate`}</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Iconify icon="ep:close" />
            </IconButton>
          </Stack>
          <Divider />
          <Typography mt={1} width="100%" textAlign="center">{`'${ref.current}'`}</Typography>
          {data && (
            <>
              <Paper sx={{ overflow: 'auto', height: 600 }}>
                <List>
                  <Stack direction="row" mt={1}>
                    <Box bgcolor="primary.main" height={320} borderRadius={1} width={4} mx={2} />
                    <Stack alignItems="center" width="100%">
                      {getRow({
                        title: 'Authority',
                        desc: data.authority || 'N/A',
                        bold: true
                      })}
                      {getRow({
                        title: 'Reference',
                        desc: <Chip label={data.ref} sx={{ bgcolor: '#00B800', color: '#fff' }} />
                      })}
                      {getRow({
                        title: 'Issued to',
                        desc: data.author
                      })}
                      {getRow({
                        title: 'Type',
                        desc: data.type || 'N/A'
                      })}
                      {getRow({
                        title: `${data.type} Type`,
                        desc: data.name || 'N/A'
                      })}
                      {getRow({
                        title: 'Status',
                        desc: (
                          <Chip
                            label={data.status}
                            sx={{ bgcolor: '#0088FF', textTransform: 'uppercase', color: '#fff' }}
                          />
                        )
                      })}
                      {getRow({
                        title: 'Date Approved',
                        desc: data.dateApproved
                      })}
                      {getRow({
                        title: 'Date Issued',
                        desc: data.dateIssued
                      })}
                      {getRow({
                        title: 'Valid Until',
                        desc: data.validUntil
                      })}
                    </Stack>
                  </Stack>
                  <Stack direction="row" mt={2} borderRadius={1}>
                    <Box bgcolor="#00B800" height="100%" borderRadius={1} width={4} mx={2} />
                    <Stack alignItems="center" width="100%">
                      {data.activity.map((item, index) => {
                        return (
                          <Stack key={index} width="100%" justifyContent="space-between">
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Iconify icon="mdi:check" />
                              <Typography ml={1.5} variant="subtitle" color="#808080" fontSize={16}>
                                {item.title}
                              </Typography>
                              <Box flex={1} />
                            </Stack>
                            <Typography ml={4} variant="subtitle" color="#808080" fontSize={12}>
                              {item.actor.name}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                </List>
              </Paper>
            </>
          )}
          {error && (
            <Stack
              flex={1}
              alignSelf="center"
              alignItems="center"
              justifyContent="center"
              justifySelf="center"
            >
              <Stack alignItems="center" justifyContent="center">
                <Chip
                  size="large"
                  sx={{ mb: 4, textTransform: 'uppercase', color: '#fff', bgcolor: 'red' }}
                  label={'Not Found'}
                />
                <Typography
                  px={4}
                  textAlign="center"
                >{`No Issued document found for reference`}</Typography>
                <Typography px={4} mb={8} textAlign="center">
                  {`No Permit, Lisence or Certificate found for '${ref.current}'`}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};
