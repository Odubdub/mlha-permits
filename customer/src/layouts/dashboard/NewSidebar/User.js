import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Divider, Stack, Chip } from '@mui/material';
import StyledAvatar from './StyledAvatar';
import { AuthContext } from 'src/AuthContext';
import SessionTimer from '../SessionTimer';
import Iconify from 'src/bundle/Iconify'
import { clearToken } from 'src/Auth/AuthService'

export default function User() {
  const { userData, setUserData } = useContext(AuthContext);

  const handleLogout = () => {
    clearToken()
    setUserData(null);
  };
console.log(userData)
  return (
    <Stack sx={{ bottom: 0, width: '100%', justifyContent: 'flex-end', flex: 1 }}>
      <Box flex={1} />
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
            alignSelf: 'flex-start',
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
                textTransform: 'capitalize',
                maxWidth: 130,
                fontWeight: 'bold',
                color: 'textColor'
              }}
            >
              {`${userData.foreNames} ${userData.lastName}`}
            </Typography>
            <Stack direction="row" alignItems='center' spacing={1}>
            <Iconify icon="fa6-solid:location-dot"/>

            <Typography>
              {userData.primaryPhysicalAddress}
            </Typography>
            </Stack>
            <Chip
              sx={{
                mt: 1,
                alignSelf:'flex-start',
                color: 'primary.main',
                textTransform: 'uppercase',
                border: '1px dashed',
                bgcolor: 'transparent',
                fontWeight: 'bold',
                borderColor: 'primary.main',
              }}
              size='small'
              label={userData.idNo}
            />
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
