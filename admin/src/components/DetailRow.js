import { Box, Checkbox, Typography } from '@mui/material'
import React from 'react'

export default function DetailRow({desc, detail, mx, isCorrectable=true, fieldKey, rightComponent, onToggleCorrectionField, isChecked=false, correctionMode}){

  return (
    (<Box sx={{ mx: mx || 3, mt:0.5, mb:0.5, display: 'flex', flexDirection: 'row' }} dir="ltr">
            { correctionMode && <Checkbox disabled={!isCorrectable} checked={isChecked} onChange={()=>onToggleCorrectionField(fieldKey)} sx={{width:30, height:30, marginRight: 1}}/>}
        <Box width={140} mt={0.5}>
            <Typography variant="body1" sx={{fontSize: 14}} noWrap>
                {desc}
            </Typography>
        </Box>
        {
        rightComponent 
        || 
        <Box mt={0.5}>
          <Typography variant="subtitle1" sx={{textDecoration:isChecked?'line-through':'none', textDecorationThickness:1.5, textDecorationColor:'#00BCD4'}}>
              {detail}
          </Typography>
        </Box>
        }
    </Box>)
  )
}
