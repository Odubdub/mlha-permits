import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import sidebarConfig from './SidebarConfig';

const DRAWER_WIDTH = 220;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12]
}));

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const theme = useTheme();

  const drawerWidthOpen = 240;
  const paddingIconButton = 10;
  const marginIconButton = 14;
  const iconFontSize = 20;
  const drawerWidthClose = (paddingIconButton + marginIconButton) * 2 + iconFontSize;

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            my: 2
          }}
        >
          <Logo />
        </Box>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Box sx={{ ml: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 'h5.fontSize', fontWeight: 600, color: 'text.primary' }}>
                Systems &amp;
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                MLHA Service
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} isExpanded={isOpenSidebar} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <Drawer
        variant="permanent"
        open={isOpenSidebar}
        sx={{
          width: isOpenSidebar
            ? { xs: '0px', sm: drawerWidthClose }
            : { xs: drawerWidthClose, sm: drawerWidthOpen },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isOpenSidebar
              ? theme.transitions.duration.leavingScreen
              : theme.transitions.duration.enteringScreen
          }),
          '& .MuiDrawer-paper': {
            justifyContent: 'space-between',
            overflowX: 'hidden',
            width: isOpenSidebar
              ? { xs: '0px', sm: drawerWidthClose }
              : { xs: drawerWidthClose, sm: drawerWidthOpen },
            borderRight: '0px',
            borderRadius: '0px 16px 16px 0px',
            boxShadow: theme.shadows[8],
            backgroundColor: isOpenSidebar ? '#11101D' : '#11101D',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: isOpenSidebar
                ? theme.transitions.duration.leavingScreen
                : theme.transitions.duration.enteringScreen
            })
          }
        }}
      >
        {renderContent}
      </Drawer>
    </RootStyle>
  );
}
