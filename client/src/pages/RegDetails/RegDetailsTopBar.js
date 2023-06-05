import { Box } from '@mui/material';
import React from 'react';
import { drawerWidthClose, drawerWidthOpen } from 'src/layouts/dashboard/NewSidebar.js/Sidebar';

const style = {
  margin: 0,
  top: 'auto',
  right: 5,
  borderRadius: '0px 0px 30px 30px',
  height: 80,
  position: 'fixed',
  zIndex: 100,
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(256,256,256,0.6)',
  transition: 'all ease 0.5s',
  boxShadow: 1,
  mx: 2,
  padding: 2
};

const DetailsTopBar = ({ onShowHistory, children }) => {
  return (
    <Box sx={{ ...style, top: 0, left: { xs: drawerWidthClose, md: drawerWidthOpen } }}>
      {children}
    </Box>
  );
};

export default DetailsTopBar;
