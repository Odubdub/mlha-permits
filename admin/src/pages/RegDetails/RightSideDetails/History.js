import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { getFromServer, patch, postToServer } from 'src/ApiService';
import Iconify from 'src/components/Iconify';
import { fDateTime, fDate, fTime, fToNow, getDifferenceBetweenDates } from 'src/utils/formatTime';

const style = {
  top: 1,
  right: 0,
  bottom: 1,
  width: 550,
  borderRadius: 2,
  zIndex: 200,
  position: 'fixed',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(256,256,256)',
  boxShadow: 24,
  margin: 1,
  padding: 1,
  transition: 'all ease 0.3s'
};

function History({ show, data, onShow, onHide }) {
  const [logs, setLogs] = useState([]);
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [resolveOpen, setLogTypeOpen] = useState(false);
  const logTypeRef = useRef(null);
  const [logType, setLogType] = useState('All');
  const logTypes = ['All', 'Technical', 'Review', 'System'];
  const [refresh, setRefresh] = useState(0);
  const handleClick = (e) => {
    onShow();
    e.stopPropagation();
  };

  const handleHide = (e) => {
    onHide();
    e.stopPropagation();
  };

  const getApplicationLogs = () => {
    getFromServer({
      path: `logs/application/${data._id}`,
      onComplete: (logs) => {
        setLogs(logs);
      },
      onError: (err) => {}
    });
  };

  const LogActions = {
    opened: 'opened',
    closed: 'closed',
    reviewed: 'reviewed',
    approved: 'approved',
    fetched: 'fetched',
    submitted: 'submitted',
    generated: 'generated',
    login: 'login',
    logout: 'logout',
    edited: 'edited',
    validate: 'validated',
    rejected: 'rejected',
    revoked: 'revoked',
    issued: 'issued',
    returned: 'returned',
    received: 'received',
    filtered: 'filtered'
  };

  const LogTargets = {
    application: 'application',
    applications: 'applications',
    certificate: 'certificate',
    permit: 'permit',
    document: 'document',
    applicant: 'applicant',
    system: 'system',
    officer: 'officer',
    cipa: 'cipa',
    omang: 'omang',
    corrections: 'corrections'
  };

  const LogModules = {
    portal: 'portal',
    reports: 'reports',
    applications: 'applications',
    config: 'config',
    authentication: 'authentication',
    serviceTools: 'service tools',
    applicationDetails: 'application details'
  };

  const LogActorTypes = {
    system: 'system',
    user: 'user',
    customer: 'customer',
    crm: 'crm',
    gateway: 'gateway',
    comms: 'comms',
    ppm: 'ppm',
    omang: 'omang',
    cipa: 'cipa',
    iam: 'iam'
  };

  useEffect(() => {
    if (show) {
      getApplicationLogs();
    }
  }, [show]);

  const getHttpStatusIcon = (status) => {
    if (status >= 200 && status < 300) {
      return 'fluent:checkmark-circle-24-filled';
    } else if (status >= 300 && status < 400) {
      return 'ion:arrow-forward-circle';
    } else if (status >= 400 && status < 500) {
      return 'fluent:warning-24-filled';
    } else if (status >= 500 && status < 600) {
      return 'ion:alert-circle';
    }
  };

  const getHttpStatusDescription = (status) => {
    if (status >= 200 && status < 300) {
      return 'Success';
    } else if (status >= 300 && status < 400) {
      return 'Redirect';
    } else if (status >= 400 && status < 500) {
      return 'Client Error';
    } else if (status >= 500 && status < 600) {
      return 'Server Error';
    }
  };

  useEffect(() => {
    if (logType == 'All') {
      setDisplayedLogs(logs);
    } else if (logType == 'Review') {
      const acceptable = [
        LogActions.rejected,
        LogActions.revoked,
        LogActions.approved,
        LogActions.reviewed,
        LogActions.returned,
        LogActions.issued
      ];
      setDisplayedLogs(logs.filter((log) => acceptable.includes(log.action)));
    }
  }, [logType, logs]);

  return (
    <Stack
      sx={{ ...style, height: show ? 'calc(100vh - 20px)' : '55px', right: show ? 10 : -600 }}
      flex={1}
      onClick={handleClick}
    >
      <Stack
        direction={'row'}
        onClick={() => setRefresh(refresh + 1)}
        alignItems="center"
        justifyContent="start"
      >
        {!show ? (
          <Tooltip title="Show application history">
            <IconButton onClick={handleClick}>
              <Iconify icon="fluent:history-24-filled" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Close Support">
            <IconButton onClick={handleHide}>
              <Iconify icon="ic:round-close" />
            </IconButton>
          </Tooltip>
        )}
        <Typography alignSelf="start" fontWeight={900} mt={0.5} fontSize={20}>
          Application History
        </Typography>
        <Box flex="1" />
        <Tooltip title="Filter">
          <LoadingButton
            ref={logTypeRef}
            onClick={() => setLogTypeOpen(true)}
            children={`View ${logType.toLowerCase()}`}
            endIcon={<Iconify icon="bi:caret-down-fill" />}
          />
        </Tooltip>
        <Menu
          keepMounted
          anchorEl={logTypeRef.current}
          open={resolveOpen}
          onClose={() => setLogTypeOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {logTypes.map((value, index) => (
            <MenuItem
              key={index}
              onClick={() => setLogType(value)}
              sx={{
                typography: 'body2',
                minWidth: 120,
                textAlign: 'center',
                color: value == logType ? 'primary.main' : '#000'
              }}
            >
              {value}
              {value == logType && <Iconify sx={{ ml: 4 }} icon="bi:check" />}
            </MenuItem>
          ))}
        </Menu>
        <Tooltip title="Reload">
          <IconButton size="small" onClick={getApplicationLogs}>
            <Iconify icon="bytesize:reload" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider />
      <Stack flex="1">
        <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
          <List mb={4}>
            <Stack mb={8}>
              {displayedLogs.map((log, i) => {
                let icon = 'tabler:activity-heartbeat';
                if (log.initiatorChain.length) {
                  const initiator = log.initiatorChain[0];
                  icon =
                    initiator == LogActorTypes.customer
                      ? 'mdi:user'
                      : initiator == LogActorTypes.system
                      ? 'eos-icons:system-ok-outlined'
                      : initiator == LogActorTypes.user
                      ? 'eos-icons:admin'
                      : 'tabler:activity-heartbeat';
                }
                const isSelectedLog = log._id == selectedLog;
                const nextDate = displayedLogs[i + 1]?.createdAt;

                return (
                  <Stack key={i}>
                    <Stack
                      onClick={() => setSelectedLog(log._id)}
                      onMouseEnter={(_) => setSelectedLog(log._id)}
                      direction="row"
                      alignItems="center"
                    >
                      <Stack alignSelf={'stretch'} alignItems="center">
                        {i != 0 && (
                          <Box bgcolor="#80808020" width={4} justifySelf="stretch" flex={1} />
                        )}
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            py: 0.6,
                            px: 0.6,
                            width: 34,
                            height: 34,
                            borderRadius: 4,
                            bgcolor: '#80808020'
                          }}
                        >
                          <Iconify icon={icon} />
                        </Stack>
                        {i != logs.length - 1 && (
                          <Box bgcolor="#80808020" width={4} justifySelf="stretch" flex={1} />
                        )}
                      </Stack>
                      <Stack
                        flex={1}
                        sx={{
                          '&:hover': {
                            color: '#fff',
                            transform: 'scale(1.02)',
                            bgcolor: 'primary.main'
                          },
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          bgcolor: '#00DDFF2C',
                          borderRadius: 1,
                          mx: 1,
                          my: logType == 'Review' ? 4 : 0.5,
                          px: 2,
                          py: 1
                        }}
                      >
                        <Stack direction="row" flex={1}>
                          <Stack>
                            <Typography variant="caption" fontWeight="600">
                              {fDateTime(log.updatedAt)}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: 14 }}>
                              {log.description}
                            </Typography>
                          </Stack>
                          <Box flex={1} />
                          <Stack>
                            <Tooltip title={getHttpStatusDescription(log.status)}>
                              <Box borderRadius={3} height={30} width={30}>
                                <Iconify fontSize={22} icon={getHttpStatusIcon(log.status)} />
                              </Box>
                            </Tooltip>
                          </Stack>
                        </Stack>
                        <Collapse in={selectedLog == log._id}>
                          <Stack mt={2}>
                            <Divider />
                            <Stack direction="row" alignItems="center" my={2}>
                              {log.initiatorChain.map((ic, i) => (
                                <Stack key={i} direction="row" alignItems="center">
                                  <Chip
                                    sx={{
                                      textTransform: 'uppercase',
                                      bgcolor: isSelectedLog ? '#fff' : '#80808020'
                                    }}
                                    size="small"
                                    label={ic}
                                  />
                                  {i != log.initiatorChain.length - 1 && (
                                    <Iconify icon="material-symbols:line-end-arrow-notch-rounded" />
                                  )}
                                </Stack>
                              ))}
                            </Stack>
                            <Stack direction="row" width="100%">
                              <Stack width="100%">
                                {log.user && (
                                  <>
                                    <Stack
                                      width="100%"
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Typography variant="subtitle" fontSize={14} fontWeight={700}>
                                        {`${log.user.foreNames} ${log.user.lastName}`}
                                      </Typography>
                                      <Box flex={1} />
                                      {isSelectedLog && (
                                        <LoadingButton
                                          size="small"
                                          sx={{
                                            color: !isSelectedLog ? '#fff' : '#000',
                                            borderColor: !isSelectedLog ? '#fff' : '#000',
                                            '&:hover': {
                                              color: 'primary.main',
                                              borderColor: 'primary.main',
                                              bgcolor: '#fff'
                                            }
                                          }}
                                          variant={'outlined'}
                                          endIcon={
                                            <Iconify icon="ic:round-keyboard-double-arrow-right" />
                                          }
                                        >
                                          View session logs
                                        </LoadingButton>
                                      )}
                                    </Stack>
                                  </>
                                )}
                              </Stack>
                            </Stack>
                          </Stack>
                        </Collapse>
                      </Stack>
                    </Stack>
                    {logType == 'Review' && (
                      <Stack alignSelf="start" direction="row" alignItems="center">
                        <Box
                          bgcolor="#80808020"
                          width={4}
                          alignSelf="stretch"
                          height={!nextDate ? 19 : 34}
                          ml={1.9}
                        />
                        <Box
                          bgcolor="#80808020"
                          width={20}
                          height={4}
                          alignSelf="center"
                          flex={1}
                        />
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            py: 0.6,
                            px: 2,
                            height: 34,
                            borderRadius: 4,
                            bgcolor: '#80808020'
                          }}
                        >
                          <Typography variant="caption">
                            {getDifferenceBetweenDates(log.createdAt, nextDate)}
                          </Typography>
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </List>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default History;
