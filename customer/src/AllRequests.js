import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  List,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRegistrations, post } from './ApiService';
import Iconify from './bundle/Iconify';
import { RequestContext } from './RequestContext';
import { fDateTime, limitTextLength, storageHost } from './FieldForm';
import { matchSorter } from 'match-sorter';
import { pluralize } from './FieldForm';
import { AuthContext } from './AuthContext';

export const AllRequests = ({ maxHeight }) => {
  const [allRequests, setAllRequests] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AuthContext);
  const { currentRequest, setCurrentRequest, readOnlyForm, setReadOnlyForm } =
    useContext(RequestContext);
  const [hovered, setHovered] = useState(null);
  const handleClick = (id) => {
    navigate(`/requests/${id}`);
  };

  //Function that initiates multiple downloads from an array of urls
  const downloadAll = async (e, files, id) => {
    e.stopPropagation();

    const urls = files.map((file) => `${storageHost}download/${file.bucket}/${file.key}`);
    for (const url of urls) {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }

    post(`requests/download-increase/${id}`, {});
  };

  useEffect(() => {
    //Get service data by serviceCode from api
    if (userData) {
      const arr = window.location.pathname.split('requests/');
      if (arr.length == 2) {
        const id = arr[1];
        getRegistrations(`requests/by-id/${id}`)
          .then((res) => {
            console.log(userData.preferred_username);
            if (res.registeredBy == userData.preferred_username) {
              setCurrentRequest(res);
              setReadOnlyForm(true);
            }
          })
          .catch((error) => console.error('Error:', error));
      }
    }
  }, [window.location.pathname]);

  const search = (event) => {
    //delay for search
    const v = event.target.value;
    setTimeout(() => {
      if (v == event.target.value) {
        const output = matchSorter(allRequests, v, {
          keys: ['description', 'uploadType', 'version', 'keywords']
        });
        setDisplayed(output);
      }
    }, 500);
  };

  useEffect(() => {
    getRegistrations(`requests/all`)
      .then((res) => {
        setAllRequests(res);
        setDisplayed(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Stack>
      <Stack>
        <TextField
          size="small"
          placeholder="Search "
          fullWidth
          onChange={search}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {displayed.length > 0 && displayed.length != allRequests.length && (
                  <Chip label={`${displayed.length} res`} />
                )}
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="end">
                <Iconify
                  fontSize={16}
                  sx={{ transform: 'translate(-10px,0px)' }}
                  icon="fe:search"
                />
              </InputAdornment>
            )
          }}
        />
      </Stack>
      <Paper
        style={{
          maxHeight: maxHeight,
          backgroundColor: 'transparent',
          overflow: 'auto'
        }}
      >
        <List sx={{ overflow: 'auto', my: 2 }}>
          <Stack direction="column" width="100%">
            {displayed.map(
              (
                {
                  code,
                  uploadType,
                  date,
                  views = 0,
                  downloads = 0,
                  serviceCode,
                  files = [],
                  keywords,
                  description,
                  version,
                  _id
                },
                index
              ) => {
                const isSelected = currentRequest?._id === _id || hovered === _id;
                return (
                  <Box
                    key={index}
                    onMouseEnter={() => setHovered(_id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleClick(_id)}
                    sx={{
                      mb: 2,
                      my: 1,
                      cursor: 'pointer',
                      px: 2,
                      py: 1,
                      overflow: 'hidden',
                      transition: 'ease 0.1fs',
                      bgcolor: isSelected ? 'primary.main' : '#00000010',
                      color: isSelected ? '#fff' : '#000',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'primary.main', color: '#fff' }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: 14, mb: 0.5, fontWeight: 600 }}>
                        {uploadType}
                      </Typography>
                      <Typography sx={{ fontSize: 14, ml: 1, mb: 0.5, foncotWeight: 600 }}>
                        {'Version ' + version}
                      </Typography>

                      <Stack flex={1} />
                      <LoadingButton
                        disabled
                        sx={{ fontWeight: 300, fontStyle: 'italic' }}
                        startIcon={<Iconify icon="ic:baseline-remove-red-eye" />}
                        children={pluralize('View', views)}
                      />

                      <LoadingButton
                        disabled
                        startIcon={<Iconify icon="mingcute:download-2-line" />}
                        sx={{ fontWeight: 300, fontStyle: 'italic' }}
                        children={pluralize('Download', downloads)}
                      />
                    </Stack>
                    <Divider />
                    <Stack direction="row" alignItems="center" mt={1}>
                      <Typography component="p" sx={{ fontSize: 12, mt: 0.5 }}>
                        {`Date: ${fDateTime(date)}`}
                      </Typography>
                      <Box flex={1} />
                      <Chip
                        sx={{ color: isSelected ? '#fff' : '#000' }}
                        label={<Iconify icon="ph:files-fill" />}
                      />
                      <Typography sx={{ fontSize: 12, ml: 0.5 }}>
                        {files.length + (files.length == 1 ? ' File' : ' Files')}
                      </Typography>

                      <LoadingButton
                        onClick={(e) => downloadAll(e, files, _id)}
                        sx={{
                          ml: 1,
                          borderRadius: 1,
                          border:
                            files.length == 0
                              ? null
                              : `1.5px solid ${isSelected ? '#fff' : '#000'}`,
                          color: isSelected ? '#fff' : '#000',
                          '&:hover': { color: '#ffffff80' }
                        }}
                        disabled={files.length == 0}
                        startIcon={<Iconify icon="ri:download-cloud-2-line" />}
                        children={`Download all`}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" sx={{ mt: 0.5 }}>
                      <Typography component="p" sx={{ fontSize: 12, mt: 0.5 }}>
                        {limitTextLength(description, 300)}
                      </Typography>
                      <Tooltip
                        title={
                          serviceCode
                            ? ''
                            : "Update to 'Owner Details' section is required for this service to update to a Standardized Service Code"
                        }
                      >
                        <Typography
                          component="p"
                          sx={{
                            fontSize: 12,
                            textDecoration: serviceCode ? 'none' : 'line-through',
                            textDecorationColor: 'error.main',
                            ml: 0.5,
                            mt: 0.5
                          }}
                        >
                          {serviceCode || code}
                        </Typography>
                      </Tooltip>
                    </Stack>
                    <Stack direction="row" mt={1}>
                      {keywords.split(',').map((word, i) => (
                        <Chip
                          key={i}
                          sx={{ bgcolor: '#fff', mr: 1, textTransform: 'uppercase' }}
                          label={word}
                        />
                      ))}
                    </Stack>
                  </Box>
                );
              }
            )}
          </Stack>
        </List>
      </Paper>
    </Stack>
  );
};
