import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardHeader,
  Stack,
  Divider,
  Paper,
  IconButton,
  List,
  Tooltip,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import { getRegistrations } from './ApiService';
import { AuthContext } from './AuthContext';
import { RequestContext } from './RequestContext';
import Iconify from './bundle/Iconify';
import { clearToken } from './Auth/AuthService';
import { matchSorter } from 'match-sorter';
import SessionTimer from './SessionTimer';
import { fDateTime, limitFileName, limitTextLength } from './FieldForm';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

export const UserDetails = ({ isAdmin = false, addNewRequest }) => {
  const { userData, setUserData } = useContext(AuthContext);
  const {
    currentRequest,
    setCurrentRequest,
    refreshRegistrations,
    setRefreshRegistrations
  } = useContext(RequestContext);
  const [allRequests, setRequests] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [showSession, setShowSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      getRegistrations(`requests/by-publisher/${userData.preferred_username}`)
        .then((res) => {
          setRequests(res);
          setDisplayed(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userData, refreshRegistrations]);

  const handleClick = (id) => {
    navigate(`/requests/${id}`);
  };

  const logout = () => {
    clearToken();
    setUserData(null);
    setCurrentRequest(null);
  };

  const search = (event) => {
    //delay for search
    const v = event.target.value;
    setTimeout(() => {
      if (v == event.target.value) {
        const output = matchSorter(allRequests, v, {
          keys: [
            'changeType',
            'date',
            'company',
            'description',
            'projectName',
            'changeClassification',
            '_id'
          ]
        });
        setDisplayed(output);
      }
    }, 500);
  };

  const addNew = () => {
    setCurrentRequest(null);
  };

  const getStatusColor = (status) => {
    const type = status.toLowerCase();
    if ('major' == type) {
      return '#FF6262';
    } else if ('minor' == type) {
      return '#E78700';
    } else if ('normal' == type) {
      return '#00E000';
    } else if ('standard' == type) {
      return '#0091CA';
    } else if ('emergency' == type) {
      return '#ff0000';
    }

    return 'grey';
  };

  useEffect(() => {
    if (userData == null) {
      setCurrentRequest(null);
    }
  }, [userData]);

  return (
    <Card
      sx={{
        mx: 1,
        mt: 3,
        maxHeight: 'calc(100vh - 40px)',
        height: 'calc(100vh - 40px)',
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start'
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center">
            <Box component="img" src="/static/logo.png" sx={{ height: 50, mr: 1 }} />
            <Stack flex={1}>
              <Typography
                sx={{ fontSize: 20, fontWeight: 800, mt: 0, width: '100%', textAlign: 'right' }}
              >
                M&D Tools
              </Typography>

              <Stack direction="row" justifyContent="end" alignItems="center">
                <Tooltip title={showSession ? <SessionTimer /> : ''} placement="right">
                  <Typography
                    onClick={() => setShowSession(!showSession)}
                    sx={{
                      fontSize: 16,
                      fontStyle: 'italic',
                      mt: 0,
                      width: '100%',
                      textAlign: 'right'
                    }}
                  >
                    {`@${userData.given_name || userData.preferred_username}`}
                  </Typography>
                </Tooltip>
                <Tooltip title="logout">
                  <IconButton
                    aria-label="settings"
                    size="small"
                    sx={{ transform: 'scale(-1,1)' }}
                    onClick={() => logout()}
                    width={40}
                    height={40}
                  >
                    <Iconify icon="akar-icons:sign-out" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" justifyContent="end" alignItems="center">
                <Typography
                  sx={{ fontSize: 16, fontWeight: 600, mt: 0, width: '100%', textAlign: 'right' }}
                >
                  {`${allRequests.length} Request${allRequests.length != 1 ? 's' : ''}`}
                </Typography>
                {!isAdmin && (
                  <Tooltip title="Request a file">
                    <IconButton
                      aria-label="settings"
                      size="small"
                      onClick={() => addNew()}
                      width={40}
                      height={40}
                    >
                      <Iconify icon="carbon:upload" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
              <Typography
                sx={{ fontSize: 16, fontWeight: 400, mt: 0.6, width: '100%', textAlign: 'right' }}
              ></Typography>
            </Stack>
          </Stack>
        }
        sx={{ mb: 0.1 }}
      />
      <Stack direction="column" sx={{ mx: 3 }}>
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

        <Stack flex={1} maxHeight="calc(100vh - 150px)" height="calc(100vh - 150px)">
          {allRequests.length ? (
            <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
              <List mb={4}>
                <Stack mb={8}>
                  {displayed.map((upload, index) => {
                    const {
                      code,
                      changeType,
                      date,
                      serviceCode,
                      company,
                      description,
                      projectName,
                      changeClassification,
                      _id
                    } = upload;
                    const isSelected = currentRequest == null ? false : currentRequest._id == _id;
                    return (
                      <Box
                        key={index}
                        onClick={() => handleClick(_id)}
                        sx={{
                          mb: 2,
                          my: 1,
                          cursor: 'pointer',
                          px: 2,
                          py: 1,
                          overflow: 'hidden',
                          transition: 'ease 0.5s',
                          bgcolor: isSelected ? 'primary.main' : '#00000010',
                          color: isSelected ? '#fff' : '#000',
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'primary.main', color: '#fff' }
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: 14, mb: 0.5, fontWeight: 600 }}>
                            {`${changeType}`}
                          </Typography>
                          <Typography sx={{ fontSize: 14, mb: 0.5, fontWeight: 600 }}>
                            {fDateTime(date)}
                          </Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" alignItems="center" mt={1}>
                          <Typography component="p" sx={{ fontSize: 12, mt: 0.5 }}>
                            {`${company}・${projectName}`}
                          </Typography>
                          <Box flex={1} />
                          <Chip
                            label={changeClassification}
                            size="small"
                            sx={{
                              ml: 1,
                              textTransform: 'uppercase',
                              color: isSelected ? getStatusColor(changeClassification) : '#fff',
                              bgcolor: isSelected ? '#fff' : getStatusColor(changeClassification)
                            }}
                          />
                        </Stack>
                        <Stack direction="row" alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography component="p" sx={{ fontSize: 12, mt: 0.5 }}>
                            {limitTextLength(description, 100)}
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
                      </Box>
                    );
                  })}
                </Stack>
              </List>
            </Paper>
          ) : (
            <Stack height="calc(100vh - 150px)" alignItems="center">
              <Box flex={1} />
              <Typography
                sx={{ alignSelf: 'center', justifySelf: 'center' }}
                children={'You have no M&D Tools'}
              />
              <Box flex={1} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
