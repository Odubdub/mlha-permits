import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import DashboardNavbar from './DashboardNavbar';
import Sidebar from './NewSidebar/Sidebar';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'inherit',
  minHeight: '100%',
  paddingTop: 24,
  paddingBottom: 0,
  [theme.breakpoints.up('lg')]: {
    paddingTop: 24,
    paddingRight: theme.spacing(2)
  }
}));

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState('Dashboard');

  return (
    <RootStyle>
      <DashboardNavbar selectedModule={selectedModule} sx={{ bgcolor: 'red' }} onOpenSidebar={() => setOpen(true)} />
      <Sidebar setSelectedModule={setSelectedModule}/>
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
