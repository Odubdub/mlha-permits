import * as React from 'react';
import { useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

import { Box, Drawer, List, Typography, Divider, Stack } from '@mui/material';

// import MenuIcon from '@mui/icons-material/Menu'
// import ExitToAppIcon from '@mui/icons-material/ExitToApp'

// import Logo from './Logo.js'
import StyledAvatar from './StyledAvatar';
import Logo from 'src/components/Logo.js';
import { AuthorityTitle } from './AuthorityTitle';
import SideItem from './SideItem';
import User from './User';
import {
  Authorities,
  AuthorityContext
} from 'src/layouts/dashboard/NewSidebar.js/AuthorityContext';
import { useContext } from 'react';
import { AuthContext } from 'src/AuthContext';

export const drawerWidthOpen = 240;
const paddingIconButton = 10;
const marginIconButton = 14;
const iconFontSize = 20;
export const drawerWidthClose = (paddingIconButton + marginIconButton) * 2 + iconFontSize;
export default function Sidebar() {
  const theme = useTheme();
  const { authority, setAuthority } = React.useContext(AuthorityContext);
  const depts = Authorities.map((s) => s.shortTitle);
  const { userData, setUserData } = useContext(AuthContext);

  const sidebar = [
    {
      icon: 'basil:document-solid',
      desc: 'Documents',
      path: '/documents',
      secondDesc: '',
      badge: 0,
      subList: []
    },
    {
      icon: 'icon-park-solid:passport-one',
      desc: 'Visa',
      path: '/visa',
      secondDesc: '',
      badge: 0,
      subList: []
    },
    {
      icon: 'solar:passport-bold',
      desc: 'Work',
      path: '/work',
      secondDesc: '',
      badge: 0,
      subList: []
    },
    {
      icon: 'solar:user-id-bold',
      desc: 'Citizenship',
      path: '/citizenship',
      secondDesc: '',
      badge: 0,
      subList: []
    },
    {
      icon: 'maki:residential-community',
      desc: 'Residency',
      path: '/residency',
      secondDesc: '',
      badge: 0,
      subList: []
    },
    {
      icon: 'bi:briefcase-fill',
      desc: 'Recruitment',
      path: '/recruitment',
      secondDesc: '',
      badge: 0,
      subList: []
    },
    {
      icon: 'bx:stats',
      desc: 'Report',
      path: '/report',
      secondDesc: '',
      badge: 0,
      subList: []
    }
  ];

  if (userData.type != 'admin') {
    //insert the config item at second position
    sidebar.push({
      icon: 'icon-park-outline:setting-config',
      desc: 'Config',
      path: '/config',
      secondDesc: '',
      badge: 0,
      subList: []
    });
  }

  if (userData.type == 'developer') {
    //insert the config item at second position
    sidebar.push({
      icon: 'entypo:tools',
      desc: 'Service Tools',
      path: '/service-tools',
      secondDesc: '',
      badge: 0,
      subList: []
    });
  }

  sidebar.push({
    icon: 'akar-icons:question-fill',
    desc: 'About',
    path: '/about',
    secondDesc: '',
    badge: 0,
    subList: []
  });

  const onSetAuthority = () => {
    setAuthority(Authorities.filter((e) => e.shortTitle === t)[0]);
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'auto',
          marginTop: '14px',
          alignItems: 'center'
        }}
      >
        <Logo />
        <AuthorityTitle
          authority={authority}
          authorities={Authorities}
          depts={depts}
          setAuthority={(t) => onSetAuthority(t)}
        />
      </Box>
      <Box>
        <Stack>
          {sidebar.map((item, index) => (
            <SideItem item={item} key={item.desc} />
          ))}
        </Stack>
        <Box />
      </Box>
      <User />
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        id="sidebar"
        variant="permanent"
        sx={{
          width: { xs: drawerWidthClose, md: drawerWidthOpen },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          '& .MuiDrawer-paper': {
            overflowX: 'hidden',
            width: { xs: drawerWidthClose, md: drawerWidthOpen },
            borderRight: '0px',
            boxShadow: theme.shadows[8],
            backgroundColor: 'primary.lighter',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            })
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
