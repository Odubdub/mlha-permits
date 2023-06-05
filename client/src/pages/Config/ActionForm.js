import React, { useContext, useEffect, useRef, useState } from 'react'
import { InputLabel, MenuItem, FormControl, Box, Checkbox, TextField, FormControlLabel } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { EditorMode } from './EditorMode'
import { LoadingButton } from '@mui/lab'
import { isBlank } from 'src/helperFuntions'

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

export default function ApprovalForm({editorMode = EditorMode.create, permitType, approval={}, onClose, user = {}}) {

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({id: false, position: false, office: false, roles: false})
  const [error, setError] = useState(null)
  const isSave = useRef(false)

  const [data, setData] = useState({
      required: true
  })

  useEffect(()=>{

    if (isSave.current && !Object.values(errors).includes(true)){

      setIsLoading(true)
      if (editorMode === EditorMode.create){
        createApproval()
      } else {
        updateApproval()
      }
    }
  }, [errors, isSave.current])

  const save = () => {

    if (hasNoErrors()){
        isSave.current = true
    }
  }

  const hasChanges = () => {

    let hasChanges = false

    if (data.descr != approval.descr){

      hasChanges = true
    }

    if (data.required != approval.required){

      hasChanges = true
    }

    return hasChanges
  }

  const setEditData = (name, value) => {

    const d = {...data}
    d[name] = value
    setData(d)
  }

  const createApproval = () => {

    console.log(JSON.stringify(data, null, 2))
  }

  const updateApproval = () => {
    
    console.log(JSON.stringify(data, null, 2))
  }

  const hasNoErrors = () => {

    const errs = {}

    if (isBlank(data.name)){
        errs.name = true
    }

    if (isBlank(data.descr)){
        errs.descr = true
    }

    setErrors(errs)

    return Object.keys(errs).length === 0
  }

  return (
    <Box display='flex' alignItems='center' justifyContent='center' height='100%'>
        <Box sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Box sx={{bgcolor:'white', borderRadius: 2, width: '100%', mx:2, paddingBottom: 3, display: 'flex', alignItems: 'center', flexDirection: 'column'}} >
            <FormControl fullWidth>
                <TextField id="outlined-basic" error={errors.name} disabled={isLoading} onChange={e=>setEditData(e.target.name, e.target.value)} value={data.name} placeholder='Initial Review' name='name' label="Action Name"  sx={{mt: 1, mx: 1}} variant="outlined" />
                <TextField id="outlined-basic" error={errors.descr} onChange={e=>setEditData(e.target.name, e.target.value)} disabled={isLoading} value={data.descr} label="Action Description" placeholder="Check if form was filled with valid information" name='descr' sx={{mt: 1, mx: 1}}  variant="outlined" />
                <FormControlLabel control={<Checkbox name='required' sx={{ml:1}} onChange={e=>setEditData(e.target.name, e.target.checked)} checked={data.required} />} value={data.required} label={`Required for permit to be issued`} />
            </FormControl>
            { (editorMode === EditorMode.create || hasChanges()) && <Box display='flex' flexDirection='row' justifyContent='end' width='100%'>
                <LoadingButton
                  variant="contained"
                  onClick={()=>save()}
                  loading={isLoading}
                  loadingPosition='start'
                  centerRipple
                  startIcon={<Iconify icon="fluent:add-circle-16-filled"/>}
                  sx={{marginTop: 2, marginRight: 1, alignSelf: 'end', justifySelf:'end'}}>
                  {editorMode === EditorMode.create ? 'Add Action' : 'Update Action'}
                </LoadingButton>
            </Box>}
            { error != null && <InputLabel id="demo-multiple-checkbox-label" error={errors.office} bgcolor='#fff' width={5}>Office</InputLabel>}
            </Box>
        </Box>
    </Box>
  )
}