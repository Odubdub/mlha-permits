import { IconButton, Toolbar, Tooltip } from '@mui/material'
import React from 'react'
import Iconify from 'src/bundle/Iconify'

export const HelpButton = ({ title, link, icon}) => {
  return (
    <Tooltip title={title}>
        <IconButton sx={{color: '#ffffff'}}>
            <Iconify icon={icon}/>
        </IconButton>
    </Tooltip>
  )
}
