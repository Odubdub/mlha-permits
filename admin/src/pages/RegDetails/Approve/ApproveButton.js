import { useEffect, useRef, useState } from 'react';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/Iconify';
export default function ApproveButton({
  isCheck,
  isActionActor,
  isDisabled = false,
  action,
  hasPermissions,
  onClick,
  isUndo = false,
  isDone = false,
  isLoading
}) {
  const ref = useRef(null);
  const [doneState, setDoneState] = useState(isDone);
  const isAuthorised = hasPermissions && isActionActor;

  const getToolTip = () => {
    if (isDone || isDisabled) {
      return '';
    }

    if (!hasPermissions) {
      return 'You have insufficient permissions to perform this action';
    } else if (action.actor && !isActionActor) {
      return `${action.actor.name} is doing this action`;
    }

    if (isUndo) {
      return action.description;
    }

    return isCheck ? action.feedback.positive.caption : action.feedback.negative.caption;
  };

  const getToolTipTitle = () => {
    if (isUndo) {
      return 'Undo this action';
    }

    if (!hasPermissions) {
      return 'Action';
    }
    return 'Action';
  };

  useEffect(() => {
    setDoneState(isDone);
  }, [isDone]);

  const hasToolTip = () => {
    return !(isDone || isDisabled);
  };

  return (
    <Box ml={1}>
      <Tooltip
        title={
          !hasToolTip() ? (
            ''
          ) : (
            <Stack>
              {isUndo && (
                <>
                  <Typography variant="subtitle">{getToolTipTitle()}</Typography>
                  <Divider />
                </>
              )}
              <Typography variant="caption">{getToolTip()}</Typography>
            </Stack>
          )
        }
      >
        <Box>
          <LoadingButton
            onClick={isAuthorised ? onClick : null}
            disabled={isDisabled}
            loading={isLoading}
            size="medium"
            sx={{
              ...(!isAuthorised ? { pointerEvents: 'none' } : {}),
              minWidth: 34,
              opacity: isAuthorised ? 1 : 0.5,
              borderRadius: '50%',
              color: isUndo ? '#808080' : isCheck ? 'primary.main' : 'error.main',
              cursor: isAuthorised ? 'pointer' : 'not-allowed',
              width: 34,
              height: 34,
              minHeight: 34
            }}
            startIcon={
              !isDone ? (
                <Box
                  width={40}
                  height={40}
                  sx={{ display: 'flex', flexDirection: 'center', justifyContent: 'center' }}
                >
                  <Box width={30} height={30} sx={{ ml: '10px', mt: '6px' }}>
                    <Iconify
                      sx={{ fontSize: 18 }}
                      icon={
                        isUndo
                          ? 'icomoon-free:undo2'
                          : isCheck
                          ? 'akar-icons:check'
                          : 'eva:close-fill'
                      }
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ width: 40, height: 40 }}>
                  <Box width={30} height={30} sx={{ ml: '10px', mt: '6px' }}>
                    <Iconify icon={isCheck ? 'bi:check-circle-fill' : 'ep:circle-close-filled'} />
                  </Box>
                </Box>
              )
            }
            loadingPosition="start"
          />
        </Box>
      </Tooltip>
    </Box>
  );
}
