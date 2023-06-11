import { IconButton, Toolbar, Tooltip } from '@mui/material'
import React from 'react'
import Iconify from 'src/bundle/Iconify'

export const HelpButton = ({ title, link, icon, color = null}) => {
  return (
    <Tooltip title={title}>
        <IconButton sx={{color: color || '#ffffff'}}>
            <Iconify icon={icon}/>
        </IconButton>
    </Tooltip>
  )
}
