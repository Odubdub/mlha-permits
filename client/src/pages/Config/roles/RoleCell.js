import { Stack, IconButton, Collapse, Typography, Divider, Box, Tooltip, Chip } from '@mui/material'
import React from 'react'
import Iconify from 'src/components/Iconify'
import { capitalize, replaceHyphens } from '../format'

export const RoleCell = ({role, index, onOpen=null, setSelectedRole, selectedRole, mr=3, ml=2, allowHover=false}) => {

  const fontSize = 14

  const handleClick = (e) => {
    e.stopPropagation()
    if (selectedRole == role._id){
        setSelectedRole('')
    } else {
        setSelectedRole(role._id)
    }
  }

  return (<Box onClick={handleClick} 
                onMouseEnter={allowHover ? ()=>setSelectedRole(role._id) : ()=>{}} 
                onMouseLeave={()=>setSelectedRole('')} 
                key={index} 
                sx={{display:'flex', bgcolor: '#80808010', mr:mr, ml:ml, borderRadius: 1, pl: 2, mt: 1, flexDirection:'column', transition: "all 1s, color 0.2s", '&:hover': { bgcolor: "primary.main", color: '#fff'}}}>        
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant="subtitle1" fontSize={fontSize} my={1}>
                        {`${(role || {}).name||'Undeined role'}`}
                    </Typography>
                    <Stack direction='row'>
                        {
                            onOpen != null && selectedRole == (role || '')._id &&
                            <Box display='flex' justifySelf='end' py={0.5} color='#fff' borderRadius={1} flexDirection='row' alignItems='center'>
                                <IconButton size='small' onClick={()=>onOpen(role)}>
                                    <Iconify icon='mdi:edit'/>
                                </IconButton>
                            </Box>
                        }
                        <Box display='flex' justifySelf='end' px={1} py={0.5} color='#fff' borderRadius={1} flexDirection='row' alignItems='center'>
                            <Tooltip title={`This role has ${((role || {}).permissions || {}).length || 0} permission${((role || {}).permissions || {}).length || 0 > 1 ? "s" : ""}`}>
                                <Chip size='small' ml={1} mt={1} label={`${((role || {}).permissions ||{}).length || 0}`}/>
                            </Tooltip>
                        </Box>
                    </Stack>
                </Box>
                {
                    <Collapse in={selectedRole == (role || '')._id}>
                        <Stack mb={1}>
                            <Divider/>
                            {
                                ((role || {}).permissions || []).map((p,i)=>(
                                    <Stack direction='row' alignItems='center' mt={1}>
                                        <Stack sx={{width: 30, height: 30, bgcolor: '#fff', borderRadius: 15}} alignItems='center' justifyContent='center'>
                                            <Typography color='primary'>
                                                {i+1}
                                            </Typography>
                                        </Stack>
                                        <Typography variant='subtitle' fontSize={14} sx={{mx: 2}}>
                                            {capitalize(replaceHyphens(p))}
                                        </Typography>
                                    </Stack>
                                ))
                            }
                        </Stack>
                    </Collapse>
                }
            </Box>)
}
