// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Modal,
  Button,
  CircularProgress,
  Stack,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { drawerWidthClose, drawerWidthOpen } from 'src/layouts/dashboard/NewSidebar.js/Sidebar';
import { getFromServer } from 'src/ApiService';
import Page from '../../components/Page';
import Actions from './Actions';
import { CorrectionsContext } from './CorrectionsContext';
import InfoRenderer from './InfoRenderer';
import ApplicationStatus from './ApplicationStatus';
import ActionsBar from './ActionsBar';
import { IssuanceContext } from './IssuanceContext';
import Loader from 'src/components/Loader/loader';
import { AuthContext } from 'src/AuthContext';
import lodash from 'lodash';
import { PermitRegState } from 'src/helper';
import Iconify from 'src/components/Iconify';
import { useNavigate } from 'react-router-dom';
import { RegDetailsContext } from './RegDetailsContext';
import ActionInput from './ActionInput';
import { LoadingButton } from '@mui/lab';
import DetailsTopBar from './RegDetailsTopBar';
import Messages from './RightSideDetails/Messages';
import AppHistory from './RightSideDetails/History';
import { CopyContext } from './CopyContext';

const topBarButtonStyle = {
  width: '120px',
  ml: 2,
  mr: 1,
  pl: 1,
  justifySelf: 'end',
  px: 2,
  bgcolor: '#fff',
  boxShadow: 1,
  '&:hover': {
    color: '#fff',
    bgcolor: 'primary.main',
    borderColor: 'red'
  }
};

export default function RegDetails() {
  const stop = useRef();
  const start = useRef();
  const stopWithCheck = useRef();
  const stopWithError = useRef();
  const [showHistory, setShowHistory] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('An error occured');

  const Omang = 'Omang';
  const Cipa = 'Cipa';
  const Attachments = 'Attachments';

  const resolveHook = useRef(null);
  const [resolveOpen, setResolveOpen] = useState(false);

  const ref = useRef(null);
  const [data, setData] = useState(null);
  const [serviceConfig, setServiceConfig] = useState(null);
  const permitId = useRef();
  const [corrections, setCorrections] = useState({});
  const navigate = useNavigate();
  const [correctionMode, setCorrectionMode] = useState(false);
  const [applicationFixes, setApplicationFixes] = useState({
    allFixes: [],
    fieldsToFix: [],
    returnMessage: ''
  });

  const correctionsValue = {
    corrections,
    setCorrections,
    applicationFixes,
    setApplicationFixes,
    setCorrectionMode,
    correctionMode
  };

  const [showCertificate, setShowCertificate] = useState(false);
  const { userData, setUserData } = useContext(AuthContext);
  const [userServicePermissions, setUserServicePermissions] = useState([]);
  const applicationHalted = [
    PermitRegState.Rejected,
    PermitRegState.Returned,
    PermitRegState.Revoked
  ].includes((data || {}).status);
  const [action, setAction] = useState({ show: false });
  const [hasUnread, setHasUnread] = useState(false);

  const [copiedText, setCopiedText] = useState('');
  const copyValues = { copiedText, setCopiedText };

  const [issuance, setIssuance] = useState({
    message: '',
    issuance: true
  });

  const issuanceValues = { issuance, setIssuance };

  let resolveOptions = {};

  Object.keys((data || {}).applicationDetails || {})
    .filter((key) => ['companyRegNo', 'businessRegNo'].includes(key))
    .forEach((key) => {
      if (!(data.external || data.meta || {})[data.applicationDetails[key]]) {
        resolveOptions[Cipa] = 'resolve-cipa';
      }
    });

  Object.keys((data || {}).applicationDetails || {})
    .filter((key) => key.includes('IdNo'))
    .forEach((key) => {
      if (!(data.external || data.meta || {})[data.applicationDetails[key]]) {
        resolveOptions[Omang] = 'resolve-omang';
      }
    });

  Object.keys((data || {}).applicationDetails || {})
    .filter((key) => key.includes('Att'))
    .forEach((key) => {
      if (data.applicationDetails[key].length == 20) {
        resolveOptions[Attachments] = 'resolve-attachments';
      }
    });

  const executeAction = ({ action, actionData, onComplete, value }) => {
    const metadata = (serviceConfig.actions || []).find(
      (a) => a.type == action.type && value == a.onTick
    );
    setAction({ show: true, action, metadata, actionData, onComplete });
  };

  const resolveDetails = (endpoint, type) => {
    setIsResolving(true);
    setResolveOpen(false);
    getFromServer({
      path: `applications/${data._id}/${endpoint}`,
      onComplete: (data) => {
        console.log(data);
        fetch(() => {
          setIsResolving(false);
        });
      }
    });
  };

  useEffect(() => {
    permitId.current = location.href.split('id=')[1];
  }, []);

  useEffect(() => {
    if (permitId.current && start.current && data == null) {
      fetch();
      setTimeout(() => {
        start.current();
      }, 500);
    }
  }, [permitId.current, start.current]);

  //Prepare this for corrections
  useEffect(() => {
    if (serviceConfig != null) {
      const preCorrections = {};
      const info = [
        ...(serviceConfig.owner || []),
        ...(serviceConfig.details || []),
        ...(serviceConfig.details2 || []),
        ...(serviceConfig.applicant || []),
        ...(serviceConfig.attachments || [])
      ];
      info.forEach((i) => {
        if (i.correctable != false) {
          preCorrections[i.key] = {
            message: '',
            desc: i.desc,
            checked: false
          };
        }
      });
      setCorrections({ ...preCorrections });
    }
  }, [data, serviceConfig]);

  useEffect(() => {
    if (![undefined, null].includes(data) && ![undefined, null].includes(userData)) {
      const userRoles = userData.roles.filter((role) => role.service == data.service);
      const uSPs = lodash.uniq(
        lodash.flattenDepth(
          userRoles.map((role) => role.permissions),
          1
        )
      );

      setUserServicePermissions(uSPs);
    }
  }, [userData, data]);

  const fetch = (onFetched) => {
    setIsRefreshing(true);
    getFromServer({
      path: `applications/${permitId.current}`,
      onComplete: (d) => {
        //Delaynyana then present
        setTimeout(() => {
          stopWithCheck.current();
          setHasFailed(false);

          //Set data after 1.5 seconds to allow for the animation to settle
          setTimeout(() => {
            setData(d);
            setIsRefreshing(false);

            // const config = getRendererConfig(d.serviceCode, '1.0')
            //d.serviceConfig.renderer
            setServiceConfig(d.serviceConfig.renderer);

            if (d.applicationFixes && d.status == 'returned') {
              setApplicationFixes(d.applicationFixes);
            }

            if (onFetched) onFetched();
          }, 2500);
        }, 1000);
      },
      onError: (err) => {
        setTimeout(() => {
          stopWithError.current();
          setHasFailed(true);
          setErrorMessage('Could not retr application');
        }, 1000);
      }
    });
  };

  const setIssuanceDetails = (certificateDetails, issuanceDetails) => {
    setData({
      ...data,
      certificateDetails: certificateDetails,
      issuanceDetails: issuanceDetails,
      status: 'issued'
    });
  };

  const dismissAll = () => {
    if (showHistory) {
      setShowHistory(false);
    }

    if (showMessages) {
      setShowMessages(false);
    }
  };

  const regDetailsValue = { executeAction, serviceConfig, data };

  return (
    <Page title="Permit Details | MLHA Permits">
      <CopyContext.Provider value={copyValues}>
        <IssuanceContext.Provider value={issuanceValues}>
          <RegDetailsContext.Provider value={regDetailsValue}>
            <Container
              maxWidth="xl"
              sx={{ overflow: 'inherit', pb: 5, mt: 3 }}
              onClick={dismissAll}
            >
              <DetailsTopBar>
                <Fade in={!(serviceConfig == null || data == null)}>
                  <Stack direction="row" justifyContent="start" alignItems="center" sx={{ pb: 3 }}>
                    <IconButton onClick={() => navigate(-1)}>
                      <Iconify icon="eva:arrow-back-fill" />
                    </IconButton>
                    <Stack>
                      <Typography variant="h4">
                        {serviceConfig != null ? serviceConfig.name : ''}
                      </Typography>
                      <Stack direction="row">
                        <Typography variant="caption" mr={2}>
                          {serviceConfig != null ? serviceConfig.code : ''}
                        </Typography>
                        <Typography variant="caption">|</Typography>
                        <Typography ml={2} variant="caption">
                          {(data || {}).application_id}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack flex="1" justifyContent="end" justifySelf="end" />
                    <Tooltip title="Refresh">
                      <LoadingButton
                        sx={topBarButtonStyle}
                        loadingPosition="start"
                        loading={isRefreshing}
                        startIcon={<Iconify sx={{ width: 14, height: 14 }} icon="uiw:reload" />}
                        onClick={fetch}
                      >
                        Refresh
                      </LoadingButton>
                    </Tooltip>
                    {Object.keys(resolveOptions).length > 0 && (
                      <Tooltip title="Resolve Missing Information">
                        <LoadingButton
                          sx={topBarButtonStyle}
                          loadingPosition="start"
                          loading={isResolving}
                          ref={resolveHook}
                          startIcon={<Iconify icon="eva:refresh-outline" />}
                          endIcon={<Iconify icon="bi:caret-down-fill" />}
                          onClick={() => setResolveOpen(true)}
                        >
                          Resolve
                        </LoadingButton>
                      </Tooltip>
                    )}
                    <Menu
                      keepMounted
                      anchorEl={resolveHook.current}
                      open={resolveOpen}
                      onClose={() => setResolveOpen(false)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                      {Object.keys(resolveOptions).map((key, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => resolveDetails(resolveOptions[key])}
                          sx={{ typography: 'body2', minWidth: 120, textAlign: 'center' }}
                        >
                          {key}
                        </MenuItem>
                      ))}
                    </Menu>
                    <Tooltip title={`Show application history`}>
                      <LoadingButton
                        sx={{
                          px: 2,
                          boxShadow: 1,
                          '&:hover': { color: '#fff', bgcolor: 'primary.main', borderColor: 'red' }
                        }}
                        startIcon={<Iconify icon="octicon:log-24" />}
                        onClick={() => setShowHistory(true)}
                      >
                        History
                      </LoadingButton>
                    </Tooltip>
                    <Tooltip title={`Show applicant's queries`}>
                      {hasUnread ? (
                        <LoadingButton
                          onClick={() => setShowMessages(true)}
                          variant="outlined"
                          endIcon={
                            <Chip size="small" sx={{ bgcolor: 'red', color: '#fff' }} label={1} />
                          }
                          sx={{
                            mr: 1,
                            borderColor: 'red',
                            color: 'red',
                            '&:hover': { color: '#fff', bgcolor: 'red', borderColor: 'red' }
                          }}
                        >
                          <Typography
                            variant="span"
                            sx={{
                              display: { xs: 'none', sm: 'none', md: 'inline-flex', fontSize: 15 }
                            }}
                          >
                            Queries
                          </Typography>
                        </LoadingButton>
                      ) : (
                        <LoadingButton
                          sx={{
                            px: 2,
                            ml: 1,
                            boxShadow: 1,
                            '&:hover': {
                              color: '#fff',
                              bgcolor: 'primary.main',
                              borderColor: 'red'
                            }
                          }}
                          onClick={() => setShowMessages(true)}
                        >
                          <Iconify icon="material-symbols:contact-support" />
                          Queries
                        </LoadingButton>
                      )}
                    </Tooltip>
                  </Stack>
                </Fade>
              </DetailsTopBar>
              {action.show && (
                <Modal open={true}>
                  <ActionInput
                    metadata={action.metadata}
                    onCancel={action.onCancel}
                    application={data}
                    actionData={action.actionData}
                    onCompleteAction={action.onComplete}
                    onClose={() => setAction({ ...action, show: false })}
                  />
                </Modal>
              )}
              {action.show && (
                <Modal open={true}>
                  <ActionInput
                    metadata={action.metadata}
                    onCancel={action.onCancel}
                    application={data}
                    onCompleteAction={action.onComplete}
                    onClose={() => setAction({ ...action, show: false })}
                  />
                </Modal>
              )}
              <CorrectionsContext.Provider value={correctionsValue}>
                <Fade
                  timeout={{ enter: 400, exit: 100 }}
                  in={serviceConfig == null || data == null}
                  sx={{
                    position: 'fixed',
                    zIndex: 100,
                    height: '100%',
                    right: 0,
                    bottom: 5,
                    left: { xs: drawerWidthClose, md: drawerWidthOpen }
                  }}
                >
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
                      <Stack direction="row" justifyContent="center" alignItems="center" mt={2}>
                        <Stack alignItems="center" mt={2} color="#808080">
                          <Typography
                            variant="subtitle"
                            sx={{ transform: 'translate(0px, 5px)' }}
                            fontSize={16}
                            my={0}
                          >
                            An error occurred
                          </Typography>
                          <Typography variant="h6" my={0}>
                            {errorMessage}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Fade>
                  </Stack>
                </Fade>
                <Fade
                  timeout={{ enter: 350, exit: 100 }}
                  in={!(serviceConfig == null || data == null)}
                >
                  <Box>
                    {!(serviceConfig == null || data == null) && (
                      <Grid Grid ref={ref} container spacing={3} mt={3}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <InfoRenderer
                            title="Applicant"
                            subheader={
                              serviceConfig.applicantSubheader || `Details of the applicant`
                            }
                            primaryTitle="Author"
                            primary={serviceConfig.applicant}
                            secondaryTitle="Owner"
                            secondary={serviceConfig.owner}
                            data={data}
                          />
                          <Actions
                            data={data}
                            onReload={() => fetch()}
                            applicationHalted={applicationHalted}
                            permissions={userServicePermissions}
                            onShowCertificate={() => setShowCertificate(true)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <InfoRenderer
                            title={`Application Details`}
                            primaryTitle="Details"
                            secondaryTitle="Attachments"
                            secondary={serviceConfig.attachments}
                            tertiary={serviceConfig.details2 || []}
                            tertiaryTitle={'More Details'}
                            subheader={`Information submitted by applicant`}
                            primary={serviceConfig.details}
                            data={data}
                          />
                          <ApplicationStatus
                            data={data}
                            serviceConfig={serviceConfig}
                            userServicePermissions={userServicePermissions}
                          />
                        </Grid>
                        {userData.type != 'superadmin' && (
                          <ActionsBar
                            hide={showHistory || showMessages}
                            onReload={() => fetch()}
                            applicationHalted={applicationHalted}
                            setIssuanceDetails={setIssuanceDetails}
                            permissions={userServicePermissions}
                            setData={setData}
                            serviceConfig={serviceConfig}
                            data={data}
                          />
                        )}
                        {data && (
                          <Messages
                            show={showMessages}
                            onThreadUnread={(value) => setHasUnread(value)}
                            author={data.applicationAuthor}
                            onShow={() => showMessages(true)}
                            onHide={() => setShowMessages(false)}
                          />
                        )}
                        {data && (
                          <AppHistory
                            show={showHistory}
                            data={data}
                            author={data.applicationAuthor}
                            onShow={() => setShowHistory(true)}
                            onHide={() => setShowHistory(false)}
                          />
                        )}
                      </Grid>
                    )}
                  </Box>
                </Fade>
              </CorrectionsContext.Provider>
            </Container>
          </RegDetailsContext.Provider>
        </IssuanceContext.Provider>
      </CopyContext.Provider>
    </Page>
  );
}
