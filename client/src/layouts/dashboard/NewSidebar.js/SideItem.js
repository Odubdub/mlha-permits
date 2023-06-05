import React from 'react'
import {ListItemButton, ListItemIcon, ListItemText, Badge, Tooltip, Chip } from '@mui/material'
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import Iconify from 'src/components/Iconify'

export default function SideItem({item, showMini}) {

  const { pathname } = useLocation()
  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false)
  const isActive = match(item.path)

  return (
    <Tooltip
            component={RouterLink}
            to={item.path}
            key={item.desc}
            title={showMini ? item.desc : ''}
            placement={'right'}
            sx={{fontWeight: isActive ? 'bold' : 'normal'}}
          >
          <ListItemButton
            sx={{
              margin: '6px 14px',
              maxHeight: '40px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: isActive ? 'primary.main' : 'transparent',
              '&:hover': {
                backgroundColor: isActive ? 'primary.main' : '#FFFFFF92',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <Badge
                badgeContent={item.badge}
                color="error"
                variant="dot"
              >
                  { 
                    item.svg != null ?
                    <item.svg  width={25} height={25} sx={{color:  isActive ? 'white' : 'gray'}}/> : 
                    <Iconify width={25} height={25} icon={item.icon} sx={{color:  isActive ? 'white' : 'gray'}} />
                  }
              </Badge>
            </ListItemIcon>

            <ListItemText
              primary={item.desc}
              primaryTypographyProps={{
                variant: 'body2',
              }}
              sx={{
                display: 'inline',
                margin: '0px',
                overflowX: 'hidden',
                color: isActive ? 'white' : 'gray',
                fontWeight: isActive ? 'bold' : 'normal',
                whiteSpace: 'nowrap',
                minWidth: '100px',
              }}
            />
            {item.badge !== 0 &&
            <Chip
                label={item.badge}
                color={'error'}
                size="small"
                sx={{ height:'auto'}} />
              }
          </ListItemButton>
        </Tooltip>
  )
}
