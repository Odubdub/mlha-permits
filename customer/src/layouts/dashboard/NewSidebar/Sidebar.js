import * as React from 'react'
import { useTheme } from '@mui/material/styles'

import {Box, Drawer, Stack } from '@mui/material'

// import MenuIcon from '@mui/icons-material/Menu'
// import ExitToAppIcon from '@mui/icons-material/ExitToApp'

// import Logo from './Logo.js'
import SideItem from './SideItem';
import User from './User'
import { useContext } from 'react'
import { AuthContext } from 'src/AuthContext'
import { Logo } from 'src/Auth/Logo'

export const drawerWidthOpen = 240;
const paddingIconButton = 10;
const marginIconButton = 14;
const iconFontSize = 20;
export const drawerWidthClose = (paddingIconButton + marginIconButton) * 2 + iconFontSize;
export default function Sidebar() {

  const theme = useTheme()
  const {userData} = useContext(AuthContext)

  const sidebar = [
    {
      icon: 'icon-park-outline:setting-config',
      desc: 'Dashboard',
      path: '/dashboard',
      secondDesc: '',
      badge: 0,
      subList: [],
    },
    {
      icon: 'carbon:document-attachment',
      desc: 'My Applications',
      path: '/applications',
      secondDesc: '',
      badge: 0,
      subList: [],
    },
    {
      icon: 'bx:stats',
      desc: 'My Profile',
      path: '/profile',
      secondDesc: '',
      badge: 0,
      subList: [],
    }
  ]

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'auto',
          marginTop: '14px',
          alignItems: 'center',
        }}
      >
      {/* <Logo /> */}
      </Box>
      <Box>
        <Stack>
        {sidebar.map((item, index) => (
            <SideItem item={item} key={item.desc} />
            ))}
        </Stack>
        <Box/>

      </Box>
      <User />
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        id='sidebar'
        variant="permanent"
        sx={{
          width: { xs: drawerWidthClose, md: drawerWidthOpen },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            overflowX: 'hidden',
            width: { xs: drawerWidthClose, md: drawerWidthOpen },
            borderRight: '1px dashed #808080',
            // boxShadow: theme.shadows[8],
            backgroundColor: '#fff',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Logo height={140} fontSize={10} width={200}/>
        {drawerContent}
      </Drawer>
    </Box>
  );
}
