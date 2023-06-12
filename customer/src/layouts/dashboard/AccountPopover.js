import { useContext, useRef, useState } from 'react';

// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, Typography, IconButton, Stack } from '@mui/material';
// components
import { AuthContext } from 'src/AuthContext';
import MenuPopover from './MenuPopover';
import Iconify from 'src/bundle/Iconify';
import { clearToken } from 'src/Auth/AuthService';
import { LoadingButton } from '@mui/lab';

export default function AccountPopover() {
  const { userData, setUserData } = useContext(AuthContext);
  const lang = userData != null ? userData.lang : 'en';
  const fontSize = userData != null ? userData.fontSize : 14;

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    clearToken();
    setUserData(null);
  };

  const getPartialInitials = function () {
    const parts = ((userData || {}).foreNames || '').split(' ');
    let initials = '';
    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i].length > 0 && parts[i] !== '') {
        initials += `${parts[i][0]}.`;
      }
    }

    return `${initials} ${parts[parts.length - 1]}`;
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Iconify icon="eva:person-fill" width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 300 }}
      >
        {userData != null && (
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle1" fontSize={fontSize} noWrap>
              {getPartialInitials()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} fontSize={fontSize} noWrap>
              {userData.position}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 12 }} variant="subtitle">
            Dependant Profiles
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton
            startIcon={<Iconify icon="mingcute:link-line" />}
            size="small"
            sx={{ ml: 2, fontSize: 12 }}
          >
            Link Profile
          </LoadingButton>
        </Stack>
        <Stack
          justifyContent="center"
          direction="row"
          sx={{ px: 2, py: 1, bgcolor: 'primary.lighter', mx: 1, borderRadius: 1 }}
        >
          <Typography sx={{ ml: 2 }} variant="subtitle" textAlign="center" color={''}>
            No Linked Profiles
          </Typography>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 12 }} variant="subtitle">
            Linked Companies
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton
            startIcon={<Iconify icon="mingcute:link-line" />}
            size="small"
            sx={{ ml: 2, fontSize: 12 }}
          >
            Link Company
          </LoadingButton>
        </Stack>
        <Stack
          justifyContent="center"
          direction="row"
          sx={{ px: 2, py: 1, bgcolor: 'primary.lighter', mx: 1, borderRadius: 1 }}
        >
          <Typography sx={{ ml: 2 }} variant="subtitle" textAlign="center" color={''}>
            No Linked Companies
          </Typography>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 12 }} variant="subtitle">
            Linked Societies
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton
            startIcon={<Iconify icon="mingcute:link-line" />}
            size="small"
            sx={{ ml: 2, fontSize: 12 }}
          >
            Link Society
          </LoadingButton>
        </Stack>
        <Stack
          justifyContent="center"
          direction="row"
          sx={{ px: 2, py: 1, bgcolor: 'primary.lighter', mx: 1, borderRadius: 1 }}
        >
          <Typography sx={{ ml: 2 }} variant="subtitle" textAlign="center" color={''}>
            No Linked Societies
          </Typography>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
