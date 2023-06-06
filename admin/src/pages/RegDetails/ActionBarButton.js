import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Tooltip, Typography, Zoom } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/Iconify';

const red = '#f44336';
const green = '#4caf50';
const blue = '#32c5ff';

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

function ActionBarButton({ toolTip = '', toolTipTitle = '', icon, disabled, title = '', onClick }) {
  return (
    <Tooltip
      TransitionComponent={Zoom}
      sx={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      title={
        toolTip == '' ? (
          ''
        ) : (
          <Stack mb={0.5}>
            <Typography variant="subtitle">{toolTipTitle}</Typography>
            <Divider />
            {toolTip.includes('\n') ? (
              <>
                {toolTip.split('\n').map((t, i) =>
                  t.length > 0 ? (
                    <Box bgcolor="#FF0000" borderRadius={1} px={1} py={0.5} mt={1}>
                      <Typography key={i} variant="caption">
                        {t}
                      </Typography>
                    </Box>
                  ) : (
                    <></>
                  )
                )}
              </>
            ) : (
              <Box bgcolor="#FF0000" borderRadius={1} px={1} py={0.5} mt={1}>
                <Typography variant="caption">{toolTip}</Typography>
              </Box>
            )}
          </Stack>
        )
      }
    >
      <Box>
        <LoadingButton
          sx={getButtonStyle(blue)}
          disabled={disabled}
          startIcon={<Iconify icon={icon} color="#fff" />}
          onClick={disabled ? null : () => onClick()}
        >
          <Typography color="#fff">{title}</Typography>
        </LoadingButton>
      </Box>
    </Tooltip>
  );
}

export default ActionBarButton;
