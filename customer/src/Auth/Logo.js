import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export const Logo = ({width, height, fontSize}) => {
  return (
    <Stack 
        sx={{
            mt: 10,
            bgcolor: '#fff', 
            width: width || 350, 
            height: height || 230,
            alignItems: 'center', 
            justifyContent: 'space-around',
            borderRadius: '0px 30px 30px 0px', 
            boxShadow:'rgba(0, 0, 0, 0.1) 0px 6px 12px'}}>
            <Box >
                <Box component="img" src="/static/coat.png" sx={{ width: (width/1.5) || 200 }} />
                <Typography fontWeight={500} fontSize={fontSize||16} sx={{color: '#000'}}>
                    REPUBLIC OF BOTSWANA
                </Typography>
            </Box>
    </Stack>
  )
}
