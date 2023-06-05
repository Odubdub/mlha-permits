import { LoadingButton } from '@mui/lab';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import { postToServer } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import Iconify from 'src/components/Iconify';
import { isDeveloper } from 'src/helper';
import { fDateTime, fToNow } from 'src/utils/formatTime';
import Field from '../Field';
import { RegDetailsContext } from '../RegDetailsContext';
import ReturnActionModal from '../ReturnActionModal';
import { ApprovalStatus } from './ActionMode';
import ApproveButton from './ApproveButton';

export default function ActionCell({
  id,
  permissions = [],
  applicationHalted,
  onReload,
  name,
  canReturn,
  isReturnedStep,
  isActiveStep,
  action,
  peformedActions = [],
  isPositive,
  index,
  isLast = false
}) {
  const [state, setState] = useState(ApprovalStatus.NotDone);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const { executeAction, serviceConfig, data } = useContext(RegDetailsContext);

  const actionConfig = (serviceConfig.actions || []).find((a) => a.type === action.type);

  const [showReturnModal, setShowReturnModal] = useState(false);

  const { userData } = useContext(AuthContext);

  const hasPermissions = permissions.includes(action.type) || isDeveloper(userData);

  // The person registered for this action
  const isActionActor = userData.idNumber == (action.actor || {}).idNumber;
  const [isHovered, setIsHovered] = useState(false);

  const [isActionActorAdding, setIsActionActorLoading] = useState(false);
  const [isRemoveClaimAdding, setIsRemoveStepActorLoading] = useState(false);

  const approve = () => {
    if (hasPermissions) {
      if (isApproveLoading) {
        setRejectState(ApprovalStatus.Passed);
      }
      tick(true);
    }
  };

  const thisAction = peformedActions.filter((pA) => pA.permission == action._id)[0];

  const reject = () => {
    if (hasPermissions) {
      tick(false);
    }
  };

  const tick = (value) => {
    const path = isReturnedStep
      ? `applications/${id}/update-review`
      : `applications/${id}/review-status`;

    executeAction({
      action,
      value,
      actionData: action.details || {},
      onComplete: (details, onComplete) => {
        const params = { stage: action.stage, checked: value };
        params.details = details;

        if (value) {
          setIsApproveLoading(true);
        } else {
          setIsRejectLoading(true);
        }

        postToServer({
          path,
          params,
          onComplete: () => {
            onReload();
            if (onComplete) onComplete();
          },
          onError: (err) => {
            console.log(err);
          }
        });
      }
    });
  };

  const done = () => {
    if (isRejectLoading) {
      setState(ApprovalStatus.Failed);
      setIsRejectLoading(false);
    } else if (isApproveLoading) {
      setState(ApprovalStatus.Passed);
      setIsApproveLoading(false);
    }
  };

  const disableReject = () => {
    return (
      !isActiveStep ||
      isApproveLoading ||
      isRejectLoading ||
      state != ApprovalStatus.NotDone ||
      applicationHalted
    );
  };

  const disableApprove = () => {
    return (
      !isActiveStep ||
      isApproveLoading ||
      isRejectLoading ||
      state != ApprovalStatus.NotDone ||
      applicationHalted
    );
  };

  const isPendingAndClaimedAction = () => {
    return isPositive == null && action.actor;
  };

  const isPendingAction = () => {
    return isPositive == null && action.actorType != 'system';
  };

  const isClaimedAction = () => {
    return action.actor;
  };

  const claimStep = () => {
    setIsActionActorLoading(true);

    postToServer({
      path: `applications/${id}/claim-review-step`,
      params: { stepType: action.type },
      onComplete: () => {
        onReload();
      },
      onError: (err) => {
        onReload();
      }
    });
  };

  const removeStepActor = () => {
    setIsRemoveStepActorLoading(true);
    postToServer({
      path: `applications/${id}/remove-step-actor`,
      params: { stepType: action.type },
      onComplete: () => {
        onReload();
      },
      onError: (err) => {
        onReload();
      }
    });
  };

  useEffect(() => {
    setIsRemoveStepActorLoading(false);
    setIsActionActorLoading(false);
  }, [action.actor]);

  return (
    <Stack onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {showReturnModal && (
        <ReturnActionModal
          onClose={() => setShowReturnModal(false)}
          id={data._id}
          onReload={onReload}
          action={action}
        />
      )}
      <Box
        display="flex"
        onClick={() => done()}
        alignItems="center"
        ml={2}
        mr={1}
        mt={1}
        flexDirection="row"
      >
        <Box
          sx={{
            borderRadius: 4,
            width: isHovered ? 30 : 24,
            height: isHovered ? 30 : 24,
            display: 'flex',
            alignItems: 'center',
            transition: 'all ease 0.2s',
            justifyContent: 'center',
            backgroundColor: isHovered ? 'primary.lighter' : '#80808020'
          }}
        >
          {(isHovered && canReturn) || isReturnedStep ? (
            <Tooltip title={`Return application to ${action.actor.name}`}>
              <IconButton disabled={isReturnedStep} onClick={() => setShowReturnModal(true)}>
                <Iconify sx={{ fontSize: 12, color: 'primary.main' }} icon="icomoon-free:undo2" />
              </IconButton>
            </Tooltip>
          ) : (
            index
          )}
        </Box>
        <Box flex="1">
          <Typography ml={1} color={isPositive != null ? '#000' : '#808080'} fontWeight="medium">
            {name}
          </Typography>
          {thisAction && (
            <Typography component="h6" fontSize={12} ml={1}>
              {`${thisAction.name}・${fDateTime(thisAction.date)}`}
            </Typography>
          )}
          {isPendingAndClaimedAction() ? (
            <Stack direction="row">
              <Typography component="h6" fontStyle="italic" color="#808080" ml={1}>
                {`${action.actor.name}`}
              </Typography>
              {['developer', 'superadmin'].includes(userData.type) && isClaimedAction && (
                <Fade orientation="horizontal" in={isHovered}>
                  <Tooltip title="Remove From Process">
                    <IconButton
                      size="small"
                      disabled={isRemoveClaimAdding}
                      loadingPosition="start"
                      sx={{ ml: 2 }}
                      onClick={removeStepActor}
                    >
                      <Iconify icon="ic:round-close" />{' '}
                    </IconButton>
                  </Tooltip>
                </Fade>
              )}
            </Stack>
          ) : isPendingAction() && hasPermissions ? (
            <LoadingButton
              size="small"
              loading={isActionActorAdding}
              loadingPosition="end"
              endIcon={<Iconify icon="material-symbols:arrow-right-alt-rounded" />}
              sx={{ ml: 1 }}
              onClick={claimStep}
            >
              Peform Action
            </LoadingButton>
          ) : (
            <></>
          )}
        </Box>

        {action.details && (
          <Tooltip title={showMoreDetails ? 'Hide action details' : 'Show more details'}>
            <IconButton
              size="medium"
              sx={{ height: 34, width: 34 }}
              onClick={() => setShowMoreDetails(!showMoreDetails)}
            >
              <Iconify icon={showMoreDetails ? 'eva:collapse-fill' : 'eva:expand-fill'} />
            </IconButton>
          </Tooltip>
        )}
        {[true, false].includes(isPositive) && !isReturnedStep ? (
          <>
            {/* Action commited buttons | Action cannot be changed */}
            {!isPositive ? (
              <ApproveButton
                isCheck={false}
                onDone={done}
                isDisabled={true}
                isDone={isPositive == false}
                isLoading={false}
                onClick={() => {}}
              />
            ) : (
              <ApproveButton
                isCheck={true}
                onDone={done}
                isDisabled={true}
                isDone={isPositive == true}
                isLoading={false}
                onClick={() => {}}
              />
            )}
          </>
        ) : (
          <Stack direction="row">
            <ApproveButton
              isCheck={false}
              onDone={done}
              isDisabled={disableReject()}
              isDone={state == ApprovalStatus.Failed}
              hasPermissions={hasPermissions}
              isActionActor={isActionActor}
              action={action}
              isLoading={isRejectLoading && state != ApprovalStatus.Failed}
              onClick={() => reject()}
            />
            <ApproveButton
              isCheck={true}
              onDone={done}
              isDisabled={disableApprove()}
              isDone={state == ApprovalStatus.Passed}
              hasPermissions={hasPermissions}
              isActionActor={isActionActor}
              action={action}
              isLoading={isApproveLoading && state != ApprovalStatus.Passed}
              onClick={() => approve()}
            />
          </Stack>
        )}
      </Box>
      {isPositive != null && (
        <Box>
          <Stack direction="row">
            <Box
              sx={{
                borderRadius: 1,
                width: '4px',
                transition: 'all ease 0.3s',
                ml: showMoreDetails ? 2 : 6.6,
                mb: 2,
                bgcolor: isPositive ? 'primary.main' : 'red'
              }}
            />
            <Stack>
              <Typography ml={1} color="#000" fontSize={14} fontWeight="medium">
                {`by ${((action || {}).actor || {}).name || action.actor}`}
              </Typography>
              {action.details && actionConfig && (
                <Collapse in={showMoreDetails}>
                  <Stack
                    bgcolor="#80808010"
                    sx={{ border: 'dashed 1px', my: 1, ml: 1, pb: 1.5, borderRadius: 1, mr: 2 }}
                  >
                    {actionConfig.fields
                      .filter((f) => action.details[f.fieldName] != undefined)
                      .map((field, index) => {
                        const info = {
                          key: field.fieldName,
                          desc: field.fieldLabel,
                          field: field.field,
                          formatter: 0,
                          source: 0,
                          bucket: data.department,
                          mx: 2,
                          path: field.fieldName
                        };

                        return <Field key={index} info={info} data={action.details} />;
                      })}
                  </Stack>
                </Collapse>
              )}
              <Typography ml={1} color="#808080" fontSize={14}>
                {`${fDateTime(action.date)}  |  ${fToNow(action.date)}`}
              </Typography>
              <Box mt={2} />
              {!isLast && <Divider mt={2} />}
            </Stack>
          </Stack>
        </Box>
      )}
      {isReturnedStep && (
        <Stack direction="row" mt={1} mr={1}>
          <Box
            sx={{
              border: 'dashed 1.5px red',
              borderRadius: 1,
              bgcolor: '#ff000010',
              borderRadius: 1,
              transition: 'all ease 0.3s',
              ml: 6.6,
              mb: 2
            }}
          >
            <Typography mx={1} mt={0.5} fontSize={14}>
              {action.return.returnMessage}
            </Typography>
            <Divider mt={1} />
            <Typography mx={1} color="#808080" fontSize={14}>
              {`${fDateTime(action.return.returnDate)}  |  ${fToNow(action.return.returnDate)}`}
            </Typography>
            <Typography mx={1} mb={0.5} color="#ff0000" fontSize={14} fontWeight="medium">
              {`Returned by ${action.return.returnedBy}`}
            </Typography>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
