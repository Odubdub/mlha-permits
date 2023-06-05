import React, { useEffect, useRef, useState } from 'react'
import { InputLabel, FormControl, Box, TextField, Select, OutlinedInput, Chip, ListItemText, MenuItem, Checkbox, Stack } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { EditorMode } from '../EditorMode'
import { LoadingButton } from '@mui/lab'
import { isBlank } from 'src/helperFuntions'
import { postToServer, putInServer } from 'src/ApiService'


const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    }
  }
}

export const DefaultPermissions = {
  payment: {
    type: 'request-payment',
    name: 'Request Payment',
    actions: 'Requested Payment'
  },
  return: {
    type: 'return-form',
    name: 'Return Form',
    actions: 'Returned Form'
  },
  issue: {
    type: 'issue-certificate',
    name: 'Issue Certificate',
    actions: 'Issued Certificate'
  },
  reject: {
    type: 'reject-application',
    name: 'Rejected Application',
    actions: 'Rejected Application'
  },
  revoke: {
    type: 'revoke',
    name: 'Revoke',
    actions: 'Revoke'
  }
}

export default function RoleForm({editorMode = EditorMode.create, role, onClose, department, service, capitalize, cleanString, replaceUnderscores}) {

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({id: false, position: false, office: false, roles: false})
  const [error, _] = useState(null)
  const [data, setData] = useState({})
  const defaultPermissions = [
    ...((service.reviewProcess || {}).steps ||[]),
    ...Object.values(DefaultPermissions)
  ]

  const save = () => {

    if (hasNoErrors()){

        const payload = {
          name: data.name,
          department: department._id,
          service: service.code,
          permissions: data.permissions
        }

        postToServer({path: 'authority/roles', params: payload, onComplete: (response)=>{
            setIsLoading(false)
            setData({})
            onClose()
        }, onError: (error)=>{
            console.log('Error is : ', error).message
        }})
    }
  }

  const update = () => {

    if (hasNoErrors()){
      
        const payload = {
          name: data.name,
          permissions: data.permissions,
          id: role._id
        }

        putInServer({path: `authority/roles`, params: payload, onComplete: (response)=>{
            setIsLoading(false)
            setData({})
            onClose()
        }, onError: (error)=>{
            console.log('Error is : ', error).message
        }})
    }
  }

  const hasNoErrors = () => {

    const errs = {}

    if (isBlank(data.name)){
        errs.name = true
    }

    if (data.permissions == undefined || (data.permissions||[]).length < 1){
        errs.permissions = true
    }

    setErrors(errs)

    return Object.keys(errs).length === 0
  }

  useEffect(()=>{

    if (role != null){
      setData({name: role.name, permissions: role.permissions})
    } else {
      setData({})
    }
  },[role])

  return (
        <Box display='flex' alignItems='center' justifyContent='center' width='100%' height='100%' sx={{bgcolor: '#fff'}}>
            <Box sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Box sx={{bgcolor:'white', borderRadius: 2, width: '100%', mx:2, paddingBottom: 3, display: 'flex', alignItems: 'center', flexDirection: 'column'}} >
                <FormControl fullWidth>
                  <Box sx={{ mt: 1, mr: 1, width: '100%', px:1}}>
                      <FormControl fullWidth>
                          <InputLabel error={errors.permissions} id="demo-multiple-checkbox-label" width={5}>Permissions</InputLabel>
                          <Select
                              labelId="demo-multiple-checkbox-label"
                              id="demo-multiple-checkbox"
                              label='Permissions'
                              error={errors.permissions}
                              name='permissions'
                              multiple
                              disabled={isLoading}
                              value={data.permissions||[]}
                              onChange={e=>setData({...data, [e.target.name]: e.target.value})}
                              input={<OutlinedInput label="Permissions" />}
                              renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {
                                  selected.map((permission, index) => (
                                    <Chip key={index} sx={{textOverflow:'ellipsis'}} label={capitalize(replaceUnderscores(permission))} />
                                  ))
                                }
                              </Box>
                            )}
                          MenuProps={MenuProps}>
                          {defaultPermissions.map((permission) => (
                              <MenuItem key={permission.type} value={permission.type}>
                                  <Checkbox checked={(data.permissions || []).includes(permission.type)} />
                                  <ListItemText primary={permission.name} />
                              </MenuItem>
                          ))}
                          </Select>
                      </FormControl>
                  </Box>
                  <TextField id="outlined-basic" error={errors.name} disabled={isLoading} onChange={e=>setData({...data, [e.target.name]: e.target.value})} value={data.name} placeholder='Level 1 Officer' name='name' label="Role Name"  sx={{mt: 1, mx: 1}} variant="outlined" />
              </FormControl>
                { (editorMode === EditorMode.create || hasChanges()) && role == null &&
                  <Box display='flex' flexDirection='row' justifyContent='end' width='100%'>
                      <LoadingButton
                          variant="contained"
                          onClick={()=>save()}
                          loading={isLoading}
                          disabled={isLoading}
                          loadingPosition='end'
                          centerRipple
                          endIcon={<Iconify icon="akar-icons:arrow-right"/>}
                          sx={{marginTop: 2, marginRight: 1, alignSelf: 'end', justifySelf:'end'}}>
                          Create Role
                      </LoadingButton>
                  </Box>
                }
                { role != null && 
                  <Stack direction='row' justifyContent='end' alignSelf='end'>
                    <Box display='flex' flexDirection='row' justifyContent='end' width='100%'>
                        <LoadingButton
                        variant="contained"
                        onClick={()=>onClose()}
                        loading={isLoading}
                        loadingPosition='end'
                        centerRipple
                        endIcon={<Iconify icon="bi:x"/>}
                        sx={{marginTop: 2, marginRight: 1.5, alignSelf: 'end', bgcolor: 'red', '&:hover': { bgcolor: '#ff000080'}, justifySelf:'end'}}>
                        Cancel
                        </LoadingButton>
                    </Box>
                    <Box display='flex' flexDirection='row' justifyContent='end' width='100%'>
                        <LoadingButton
                        variant="contained"
                        onClick={()=>update()}
                        loading={isLoading}
                        loadingPosition='end'
                        centerRipple
                        endIcon={<Iconify icon="charm:arrow-right"/>}
                        sx={{marginTop: 2, marginRight: 1.5, alignSelf: 'end', justifySelf:'end'}}>
                        Update
                        </LoadingButton>
                    </Box>
                  </Stack>
                  }
                { error != null && <InputLabel id="demo-multiple-checkbox-label" error={errors.office} bgcolor='#fff' width={5}>Office</InputLabel>}
                </Box>
            </Box>
        </Box>
        )
}