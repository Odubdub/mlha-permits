import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Divider, Stack } from '@mui/material';
import StyledAvatar from './StyledAvatar';
import { AuthContext } from 'src/AuthContext';
import Iconify from 'src/components/Iconify';
import { clearToken } from 'src/pages/Auth/AuthService';
import SessionTimer from '../SessionTimer';

export default function User() {
  const { userData, setUserData } = useContext(AuthContext);

  const handleLogout = () => {
    clearToken();
    setUserData(null);
  };

  return (
    <Stack sx={{ bottom: 0, width: '100%', justifyContent: 'flex-end', flex: 1 }}>
      <Box flex={1} />
      {userData.department != null && (
        <Stack sx={{ m: 1 }}>
          <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 600 }}>
            {(userData.department || {}).name || ''}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              display: { sm: 'none', xs: 'none', md: 'block' },
              fontSize: 12,
              fontWeight: 300
            }}
          >
            {((userData.department || {}).ministry || {}).name || ''}
          </Typography>
        </Stack>
      )}
      <Divider />
      <Stack
        direction="row"
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignContents: 'center',
          margin: '14px 14px',
          marginTop: 'auto',
          padding: '12px 4px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            marginRight: '18px',
            paddingLeft: '0px',
            alignItems: 'center',
            alignContent: 'center'
          }}
        >
          <StyledAvatar name={`${userData.foreNames} ${userData.lastName}`} />
        </Box>
        <Tooltip title={`${userData.foreNames} ${userData.lastName}`}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontFamily: 'inherit',
                display: 'block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: 'inherit',
                maxWidth: 130,
                fontWeight: 'bold',
                color: 'textColor'
              }}
            >
              {`${userData.foreNames} ${userData.lastName}`}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{
                display: 'block',
                whiteSpace: 'nowrap',
                lineHeight: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100px',
                color: 'textColor'
              }}
            >
              {userData.designation}
            </Typography>
          </Box>
        </Tooltip>
        <Tooltip title={<SessionTimer />} placement="right">
          <IconButton
            aria-label="settings"
            sx={{ transform: 'scale(-1)' }}
            onClick={() => handleLogout()}
          >
            <Iconify icon="majesticons:logout-half-circle-line" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
