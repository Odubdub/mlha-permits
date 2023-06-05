import React, { useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack, Collapse } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { drawerWidthClose, drawerWidthOpen } from 'src/layouts/dashboard/NewSidebar.js/Sidebar';
import { CorrectionsContext } from './CorrectionsContext';
import Iconify from 'src/components/Iconify';
import { isBlank } from 'src/helperFuntions';
import { ActionMode } from './ActionMode';
import Issuance, { toDateInput } from './Issuance.js/Issuance';
import { hasBeenApprovedIssuancePayment, hasPassedReviewStages } from './ActionBarHelper';
import Loader from 'src/components/Loader/loader';
import { postToServer, uploadFile } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import { isDeveloper, PermitRegState } from 'src/helper';
import ActionBarButton from './ActionBarButton';
import PaymentRequest from './Payment/PaymentRequest';
import RejectApplication from './Reject/reject';
import ReturnApplication from './Return/return';
import ActionBarStatus from './ActionBarStatus';
import { fCurrency } from 'src/utils/formatNumber';
import { DefaultPermissions } from '../Config/roles/RoleForm';
import DirectIssuance from './Issuance.js/DirectIssuance';
import Generate from './Issuance.js/Generate';

const style = {
  margin: 0,
  top: 'auto',
  right: 5,
  borderRadius: 2,
  position: 'fixed',
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(256,256,256,0.6)',
  transition: 'all ease 0.5s',
  boxShadow: 24,
  margin: 2,
  padding: 2
};

const red = '#f44336';
const green = '#4caf50';
const blue = '#32c5ff';

export default function ActionsBar({
  setIssuanceDetails,
  hide,
  applicationHalted,
  permissions,
  serviceConfig,
  data,
  setData
}) {
  const { setCorrectionMode, setApplicationFixes, corrections, setCorrections } =
    useContext(CorrectionsContext);
  const [barMode, setBarMode] = useState(ActionMode.None);
  const issuanceConfig = data.serviceConfig.issuance;
  const [issueLoading, setIssueLoading] = useState(false);
  const [fixCount, setFixCount] = useState(0);
  const [issuanceErrors, setIssuanceErrors] = useState({});
  const [certificateGenData, setCertificateGenData] = useState({ validFrom: toDateInput() });
  const [issuanceData, setIssuanceData] = useState({});

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentData, setPaymentData] = useState({});

  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectErrors, setRejectErrors] = useState({});
  const [rejectData, setRejectData] = useState({});

  const [returnLoading, setReturnLoading] = useState(false);
  const [returnErrors, setReturnErrors] = useState({});
  const [returnData, setReturnData] = useState({ returnMessage: '' });

  const { userData } = useContext(AuthContext);

  const stop = useRef();
  const start = useRef();
  const stopWithCheck = useRef();
  const stopWithError = useRef();

  const onConfirmReject = () => {
    const errs = {};

    if (isBlank(rejectData.reason)) {
      errs.reason = true;
    }

    if (isBlank(rejectData.message)) {
      errs.message = true;
    }

    setRejectErrors(errs);

    if (Object.values(errs).length == 0) {
      setRejectLoading(true);

      start.current();
      postToServer({
        path: `applications/${data._id}/reject`,
        params: rejectData,
        onComplete: () => {
          stopWithCheck.current();
          setBarMode(ActionMode.None);
          setRejectLoading(false);
          setData({ ...data, rejectionDetails: rejectData, status: 'rejected' });
        },
        onError: (err) => {
          stopWithError.current();
          console.log(err);
        }
      });
    }
  };

  const onConfirmReturn = () => {
    const errs = {};
    if (isBlank(returnData.returnMessage)) {
      errs.message = true;
    }
    setReturnErrors(errs);

    if (Object.values(errs).length == 0) {
      start.current();
      postToServer({
        path: `applications/${data._id}/return-form`,
        params: returnData,
        onComplete: () => {
          stopWithCheck.current();
          setBarMode(ActionMode.None);
          setApplicationFixes(returnData);
          setData({ ...data, applicationFixes: returnData, status: 'returned' });
          setCorrectionMode(false);
        },
        onError: (err) => {
          stopWithError.current();
          console.log(err);
        }
      });
    } else {
      console.log('There are errs');
    }
  };

  const getButtonStyle = (color) => {
    return {
      color: '#fff',
      mr: 1,
      bgcolor: color,
      transition: 'background 0.4s, color 0.4s',
      '&:hover': {
        color: color,
        bgcolor: `${color}60`
      },
      '&:disabled': {
        opacity: 0.5
      }
    };
  };

  const setReturnMetadata = () => {
    let msg = 'Please fix the following issues:';
    Object.keys(corrections).forEach((key) => {
      if (corrections[key].checked) {
        msg += `\n${corrections[key].desc}: ${corrections[key].message}, `;
      }
    });

    //replace last comma with a period
    const fieldsToFix = Object.keys(corrections).filter((key) => corrections[key].checked);
    let returnMsg = msg.replace(/,\s*$/, '.');

    // Replace ocurrances of "'" with "`" in returnMesssage

    setReturnData({
      returnMessage: returnMsg.replace(/'/g, '`'),
      fieldsToFix: fieldsToFix,
      allFixes: fieldsToFix.map((key) => ({ key: key, fixDescription: corrections[key].message }))
    });
  };

  const validateFixes = () => {
    let hasErrors = false;
    const clone = { ...corrections };
    Object.keys(corrections).forEach((key) => {
      clone[key].messageError = false;
      if (corrections[key].checked && isBlank(corrections[key].message)) {
        hasErrors = true;
        clone[key].messageError = true;
      }
    });

    if (hasErrors) {
      setCorrections(clone);
    } else {
      setReturnMetadata();
      setBarMode(ActionMode.ConfirmReturn);
    }
  };

  const approveDirectIssuance = () => {
    const errs = {};
    issuanceConfig.fields.forEach((field) => {
      if (field.mandatory && isBlank(certificateGenData[field.fieldName])) {
        errs[field.fieldName] = true;
      }
    });

    setIssuanceErrors(errs);

    if (Object.keys(errs).length == 0) {
      start.current();

      uploadAttachments((attMetaData) => {
        const issuanceDetails = { ...certificateGenData, ...attMetaData, mode: 'direct' };
        postToServer({
          path: `applications/${data._id}/upload-certificate`,
          params: issuanceDetails,
          onComplete: (res) => {
            console.log('dooon', attMetaData);
            setBarMode(ActionMode.None);
            stopWithCheck.current();
            setIssuanceDetails(res, issuanceDetails);
          },
          onError: (err) => {
            stopWithError.current();
          }
        });
      });
    }
  };

  const uploadAttachments = (onComplete) => {
    const attPayload = {};
    // find a list of keys with suffix 'Att' in data
    const attachmentKeys = Object.keys(certificateGenData).filter((key) => key.endsWith('Att'));

    // Create an object of formData
    const formData = new FormData();

    // Loop through the attachment keys and add the file to the formData
    attPayload.fields = attachmentKeys;
    attachmentKeys.forEach((key) => {
      // Update the formData object
      formData.append(key, getFileForKey(key));
    }, []);

    // Append the keys to be received
    formData.append('fields', attachmentKeys);

    // Append the keys to be received
    formData.append('destination', data.department);

    uploadFile({
      path: 'files/upload',
      data: formData,
      onComplete: (attMetaData) => {
        onComplete(attMetaData);
      },
      onError: () => {
        console.log('Error Here');
      }
    });
  };

  const getFileForKey = (key) => {
    var element = document.getElementById(key).getElementsByTagName('input')[0];

    return element.files[0];
  };

  //Direct Issuance End
  const generateCertificate = () => {
    const errs = {};
    if (issuanceConfig.fields) {
      issuanceConfig.fields.forEach((field) => {
        if (field.mandatory || false) {
          if (isBlank(certificateGenData[field.fieldName])) {
            errs[field.fieldName] = true;
          }
        }
      });
      setIssuanceErrors(errs);
    }

    if (Object.keys(errs).length == 0) {
      start.current();
      const payload = {
        input: certificateGenData,
        ...issuanceConfig,
        issuedBy: `${userData.foreNames} ${userData.lastName}`
      };

      console.log(payload);

      postToServer({
        path: `applications/${data._id}/generate-certificate`,
        params: payload,
        onComplete: (certificate) => {
          setBarMode(ActionMode.None);
          stopWithCheck.current();
          // setIssuanceDetails(res, payload)

          console.log('res', certificate);
          setData({ ...data, issuanceDetails: payload, certificate, status: 'pending-issuance' });
        },
        onError: (err) => {
          stopWithError.current();
        }
      });
    }
  };

  const revokeApplication = () => {
    //revoke
    start.current();
    postToServer({
      path: `applications/${data._id}/revoke`,
      params: {},
      onComplete: (res) => {
        setBarMode(ActionMode.None);
        stopWithCheck.current();
        setData({ ...data, status: 'revoked' });
      },
      onError: (err) => {
        stopWithError.current();
      }
    });
  };

  const issueCertificate = () => {
    //issuance
    start.current();
    postToServer({
      path: `applications/${data._id}/issue`,
      params: issuanceData,
      onComplete: (res) => {
        setBarMode(ActionMode.None);
        stopWithCheck.current();
        setData({ ...data, status: 'issued' });
      },
      onError: (err) => {
        stopWithError.current();
      }
    });
  };

  const fixForm = () => {
    setCorrectionMode(true);
    setBarMode(ActionMode.FixForm);
  };

  const cancel = () => {
    setCorrectionMode(false);
    setBarMode(ActionMode.None);
  };

  const issuancePaymentClear = hasBeenApprovedIssuancePayment(data, serviceConfig);
  const passedReviewStages = hasPassedReviewStages(data);
  const issuable = passedReviewStages && issuancePaymentClear;

  useEffect(() => {
    let count = 0;
    Object.values(corrections).forEach((value) => {
      if (value.checked) {
        count += 1;
      }
    });

    setFixCount(count);
  }, [corrections]);

  const canRequestPayment = () => {
    return (
      permissions.includes(DefaultPermissions.payment.type) ||
      (isDeveloper(userData) && serviceConfig.issuanceFeeType == 'Dynamic')
    );
  };

  const canRejectApplication = () => {
    return permissions.includes(DefaultPermissions.reject.type) || isDeveloper(userData);
  };

  const canReturnForm = () => {
    return permissions.includes(DefaultPermissions.return.type) || isDeveloper(userData);
  };

  const canGenarateCertificate = () => {
    return permissions.includes(DefaultPermissions.issue.type) || isDeveloper(userData);
  };

  const canRevokeIssuance = () => {
    return permissions.includes(DefaultPermissions.revoke.type) || isDeveloper(userData);
  };

  const getRequestPaymentToolTipInfo = () => {
    if (!canRequestPayment()) {
      return `You have insufficient permissions to peform this action`;
    }
    return '';
  };

  const getIssuanceToolTipInfo = () => {
    let message = '';

    if (!canGenarateCertificate()) {
      message += `You have insufficient permissions to peform this action.\n`;
    }

    if (!hasPassedReviewStages) {
      message += 'This application has not passed all review steps.\n';
    }

    if (!issuancePaymentClear) {
      message += `Action not available pending 'Issuance Fee' (${data.serviceConfig.issuance.type} fee) payment by Customer.\n`;
    }

    return message;
  };

  const getRevokeToolTipInfo = () => {
    if (!canRevokeIssuance()) {
      return `You have insufficient permissions to peform this action`;
    }

    return '';
  };

  const getRejectionTooltipInfo = () => {
    if (!canRejectApplication()) {
      return `You have insufficient permissions to peform this action`;
    }

    return '';
  };

  const getReturnTooltipInfo = () => {
    if (!canReturnForm()) {
      return `You have insufficient permissions to peform this action`;
    }
    return '';
  };

  const getDisableActionBarTitle = () => {
    if (data.status == 'returned') {
      return 'Application returned to customer';
    } else if (data.status == 'payment-requested') {
      return 'Payment requested from customer';
    } else if (data.status == 'rejected') {
      return 'Customer application rejected';
    } else if (data.status == 'issued') {
      return `${issuanceConfig.type} issued to customer`;
    } else if (data.status == 'revoked') {
      return `${issuanceConfig.type} revoked`;
    }

    return '#Unimplemented Status';
  };

  const getDisableActionBarSubtitle = () => {
    if (data.status == 'returned') {
      const attachments = data.applicationFixes.fieldsToFix.filter((f) => f.includes('Att')).length;
      const details = data.applicationFixes.fieldsToFix.filter((f) => !f.includes('Att')).length;

      const msgPieces = [];

      if (attachments != 0) {
        msgPieces.push(`${attachments} attachment${attachments > 1 ? 's' : ''}`);
      }
      if (details != 0) {
        msgPieces.push(`${data.applicationFixes.allFixes.length} detail${details > 1 ? 's' : ''}`);
      }

      return `${msgPieces.join(' & ')} in form to be corrected.`;
    } else if (data.status == 'payment-requested') {
      console.log((data.paymentDetails || {}).paymentAmount || '0', 'is ss');
      return `${fCurrency(`${(data.paymentDetails || {}).paymentAmount}`)} pending payment`;
    } else if (data.status == `rejected`) {
      return `Reason: ${data.rejectionDetails.reason}`;
    } else if (data.status == `issued`) {
      return `${issuanceConfig.type} issued`;
    } else if (data.status == 'revoked') {
      return `This ${issuanceConfig.type} was invalidated`;
    }
    return '#Unimplemented subtitle';
  };

  const getDisableActionBarCaption = () => {
    if (data.status == PermitRegState.Returned) {
      return 'Customer to correct details';
    } else if (data.status == PermitRegState.PaymentRequested) {
      return 'Customer to pay requested fee';
    } else if (data.status == PermitRegState.Rejected) {
      return `End of application cycle`;
    } else if (data.status == PermitRegState.Approved) {
      return `End of application cycle`;
    } else if (data.status == PermitRegState.Revoked) {
      return `Customer to reapply for service if necessary`;
    }

    return '#Unimplemented Status';
  };

  return (
    <Box
      sx={{
        ...style,
        bottom: hide ? -100 : 5,
        opacity: hide ? 0 : 1,
        left: { xs: drawerWidthClose, md: drawerWidthOpen }
      }}
    >
      {
        <Stack direction="row" justifyContent="space-between">
          {!applicationHalted ? (
            <Stack flex={1}>
              <Collapse in={[ActionMode.Issue, ActionMode.DirectIssuance].includes(barMode)}>
                <Stack>
                  {issuanceConfig.mode == 'default' ? (
                    <Issuance
                      errors={issuanceErrors}
                      data={data}
                      issuanceData={issuanceData}
                      setIssuanceData={setIssuanceData}
                      isDisabled={issueLoading}
                      config={issuanceConfig}
                    />
                  ) : (
                    <DirectIssuance
                      errors={issuanceErrors}
                      data={data}
                      issuanceData={issuanceData}
                      setIssuanceData={setIssuanceData}
                      isDisabled={issueLoading}
                      config={issuanceConfig}
                    />
                  )}
                </Stack>
              </Collapse>
              <Collapse in={[ActionMode.Generate, ActionMode.DirectIssuance].includes(barMode)}>
                <Generate
                  errors={issuanceErrors}
                  data={data}
                  certificateGenData={certificateGenData}
                  setCertificateGenData={setCertificateGenData}
                  isDisabled={issueLoading}
                  config={issuanceConfig}
                />
              </Collapse>
              <Collapse in={[ActionMode.ConfirmReturn].includes(barMode)}>
                <ReturnApplication
                  errors={returnErrors}
                  data={data}
                  returnData={returnData}
                  setReturnData={setReturnData}
                  isDisabled={returnLoading}
                  config={issuanceConfig}
                />
              </Collapse>
              <Collapse in={[ActionMode.RequestPayment].includes(barMode)}>
                <PaymentRequest
                  errors={paymentErrors}
                  data={data}
                  paymentData={paymentData}
                  setPaymentData={setPaymentData}
                  isDisabled={paymentLoading}
                  config={
                    serviceConfig.payment || {
                      name: 'Issuance fee',
                      title: 'Issuance fee',
                      dynamic: true,
                      amount: '300',
                      placeholder: `${issuanceConfig.type} fee`
                    }
                  }
                />
              </Collapse>
              <Collapse in={[ActionMode.Reject].includes(barMode)}>
                <RejectApplication
                  errors={rejectErrors}
                  data={data}
                  rejectData={rejectData}
                  setRejectData={setRejectData}
                  isDisabled={rejectLoading}
                  issuanceConfig={issuanceConfig}
                />
              </Collapse>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'start',
                  px: 2,
                  mt: 2
                }}
              >
                {data.status == 'issued' ? (
                  <ActionBarButton
                    onClick={() => revokeApplication()}
                    toolTip={getRevokeToolTipInfo()}
                    toolTipTitle={`Revoke ${issuanceConfig.type}`}
                    disabled={!canRevokeIssuance()}
                    icon="line-md:cancel"
                    title={`Revoke ${issuanceConfig.type}`}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'start'
                    }}
                  >
                    {[ActionMode.FixForm].includes(barMode) && (
                      <ActionBarButton
                        onClick={() => validateFixes()}
                        disabled={fixCount == 0}
                        icon="ion:arrow-undo"
                        title="Return Form to Customer"
                      />
                    )}
                    {[ActionMode.ConfirmReturn].includes(barMode) && (
                      <LoadingButton
                        loadingPosition="start"
                        disabled={fixCount < 0 && !canReturnForm()}
                        onClick={() => onConfirmReturn()}
                        sx={getButtonStyle(blue)}
                        startIcon={<Iconify fontSize={12} icon="ion:arrow-undo" color="#fff" />}
                      >
                        Confirm Return
                      </LoadingButton>
                    )}
                    {[ActionMode.None].includes(barMode) && (
                      <ActionBarButton
                        onClick={() => fixForm()}
                        toolTip={getReturnTooltipInfo()}
                        disabled={!canReturnForm()}
                        toolTipTitle="Mark Corrections on Application"
                        icon="ic:baseline-auto-fix-high"
                        title="Fix Form"
                      />
                    )}
                    {[ActionMode.None].includes(barMode) && (
                      <ActionBarButton
                        onClick={() => setBarMode(ActionMode.Reject)}
                        toolTip={getRejectionTooltipInfo()}
                        toolTipTitle="Reject Customer Application"
                        disabled={rejectLoading || !canRejectApplication()}
                        icon="eva:close-fill"
                        title="Reject Application"
                      />
                    )}
                    {[ActionMode.Reject].includes(barMode) && (
                      <ActionBarButton
                        onClick={() => onConfirmReject()}
                        toolTip=""
                        disabled={!canRejectApplication()}
                        icon="eva:close-fill"
                        title="Confirm Reject"
                      />
                    )}
                    {/* {canRequestPayment() && (
                      <ActionBarButton
                        onClick={() => setBarMode(ActionMode.RequestPayment)}
                        toolTip={getRequestPaymentToolTipInfo()}
                        toolTipTitle="Payment Request"
                        disabled={!canRequestPayment()}
                        icon="fluent:payment-16-filled"
                        title="Request Payment"
                      />
                    )} */}
                    {/* {canRequestPayment() && (
                      <LoadingButton
                        loadingPosition="start"
                        disabled={fixCount < 0 && !canReturnForm()}
                        onClick={() => requestPayment()}
                        sx={getButtonStyle(blue)}
                        startIcon={
                          <Iconify fontSize={12} icon="fluent:payment-16-filled" color="#fff" />
                        }
                      >
                        Send Payment Request
                      </LoadingButton>
                    )} */}
                    {[ActionMode.None].includes(barMode) && issuanceConfig.mode == 'default' && (
                      <ActionBarButton
                        onClick={() => setBarMode(ActionMode.Generate)}
                        toolTip={getIssuanceToolTipInfo()}
                        toolTipTitle={`${issuanceConfig.type} Generation`}
                        disabled={!issuable || !canGenarateCertificate()}
                        icon="fa6-solid:gear"
                        title={`${data.certificate ? 'Regenerate' : 'Generate'} ${
                          issuanceConfig.type
                        }`}
                      />
                    )}
                    {[ActionMode.None].includes(barMode) && issuanceConfig.mode == 'direct' && (
                      <ActionBarButton
                        onClick={() => setBarMode(ActionMode.DirectIssuance)}
                        toolTip={getIssuanceToolTipInfo()}
                        toolTipTitle={`${issuanceConfig.type} Upload`}
                        disabled={!issuable || !canGenarateCertificate()}
                        icon="charm:tick"
                        title={`Upload ${issuanceConfig.type}`}
                      />
                    )}
                    {[ActionMode.Generate].includes(barMode) && (
                      <Box>
                        <LoadingButton
                          loadingPosition="start"
                          disabled={!(issuable || isDeveloper(userData))}
                          onClick={() => generateCertificate()}
                          sx={getButtonStyle(blue)}
                          startIcon={<Iconify color="#fff" icon="eos-icons:rotating-gear" />}
                        >
                          <Typography color="#fff">
                            {`Confirm ${data.certificate ? 'Regenerate' : 'Generate'}`}
                          </Typography>
                        </LoadingButton>
                      </Box>
                    )}
                    {[ActionMode.Issue].includes(barMode) && (
                      <Box>
                        <LoadingButton
                          loadingPosition="start"
                          disabled={!issuable || !canGenarateCertificate()}
                          onClick={() => issueCertificate()}
                          sx={getButtonStyle(blue)}
                          startIcon={<Iconify color="#fff" icon="bi:send-check-fill" />}
                        >
                          <Typography color="#fff">{`Confirm ${issuanceConfig.type} Issuance`}</Typography>
                        </LoadingButton>
                      </Box>
                    )}
                    {[ActionMode.DirectIssuance].includes(barMode) && (
                      <Box>
                        <LoadingButton
                          loadingPosition="start"
                          disabled={!issuable}
                          onClick={() => approveDirectIssuance()}
                          sx={getButtonStyle(blue)}
                          startIcon={<Iconify color="#fff" icon="charm:tick" />}
                        >
                          <Typography color="#fff">Upload Document</Typography>
                        </LoadingButton>
                      </Box>
                    )}
                    {[ActionMode.None].includes(barMode) && data.status == 'pending-issuance' && (
                      <ActionBarButton
                        onClick={() => setBarMode(ActionMode.Issue)}
                        toolTip={getIssuanceToolTipInfo()}
                        toolTipTitle={`${issuanceConfig.type} Issuance`}
                        disabled={!issuable || !canGenarateCertificate()}
                        icon="bi:send-check-fill"
                        title={`Issue ${issuanceConfig.type}`}
                      />
                    )}
                    {![ActionMode.None].includes(barMode) && (
                      <LoadingButton
                        sx={getButtonStyle(red)}
                        startIcon={<Iconify icon="eva:close-fill" />}
                        onClick={() => cancel()}
                      >
                        Cancel
                      </LoadingButton>
                    )}
                  </Box>
                )}
              </Box>
            </Stack>
          ) : (
            <ActionBarStatus
              title={getDisableActionBarTitle()}
              subtitle={getDisableActionBarSubtitle()}
              next={getDisableActionBarCaption()}
            />
          )}
          <Loader
            key={data.status}
            start={start}
            stop={stop}
            stopWithCheck={stopWithCheck}
            stopWithError={stopWithError}
          />
        </Stack>
      }
    </Box>
  );
}
