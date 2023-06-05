import React, { useEffect, useState } from 'react'
import { FormControl, Box, TextField, Stack } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { LoadingButton } from '@mui/lab'
import { getFromServer, postToServer, putInServer } from 'src/ApiService'

export default function CertificateConditionsForm({service}) {
  
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({title: '', caption: '', show: true, service: service._id})
  const [serviceConditions, setServiceConditions] = useState(null)

  const setConditions = () => {
    postToServer({
      path: `certificate/conditions/${service._id}`,
      params: {...data, show: true, caption: data.caption.trim(), title: data.title.trim()},
      onComplete: conditions => {
        if (conditions){

          setServiceConditions({
            show: conditions.show,
            caption: conditions.caption,
            title: conditions.title,
            service: conditions.service
          })
        } else {
          setData({title: '', caption: '', show: true, service: service._id})
        }
      },
      onError: err => {
        console.log(err)
      }
    })
  }

  const hasUpdate = () => {

    if (serviceConditions != null){

      return (serviceConditions.title != data.title || serviceConditions.caption != data.caption)
    }

    return false
  }

  const updateConditions = () => {
    putInServer({
      path: `certificate/conditions/${service._id}`,
      params: {...data, show: true, caption: data.caption.trim(), title: data.title.trim()},
      onComplete: conditions => {
        setServiceConditions(data)
      },
      onError: err => {
        console.log(err)
      }
    })
  }

  const disableConditions = () => {
    putInServer({
      path: `certificate/conditions/${service._id}`,
      params: {...serviceConditions, show: false},
      onComplete: _ => {
        setData({ ...data, show: false })
        setServiceConditions({ ...serviceConditions, show: false })
      },
      onError: err => {
        console.log(err)
      }
    })
  }

  useEffect(()=>{

    setServiceConditions(null)
    setData({title: '', caption: '', show: true, service: service._id})

    getFromServer({
      path: `certificate/conditions/${service._id}`,
      onComplete: conditions => {
        if (conditions){

          console.log(service._id)
          console.log(conditions)
          setData(conditions)
          setServiceConditions(conditions)
        } else {
          setData({title: '', caption: '', show: true, service: service._id})
        }
      },
      onError: err=> {
        console.log(err)
        setData({title: '', caption: '', show: true, service: service._id})
      }
    })
  },[service])

  return (
    <Box display='flex' alignItems='center' justifyContent='center' height='100%'>
    <Box sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Box sx={{ borderRadius: 2, width: '100%', ml:0, mr: 1, paddingBottom: 3, display: 'flex', alignItems: 'center', flexDirection: 'column'}} >
          <FormControl fullWidth>
              <TextField id="outlined-basic" disabled={isLoading} onChange={e=>setData({...data, [e.target.name]: e.target.value})} value={data.title || ''} name='title' label="Title"  sx={{mt: 1, mx: 3, fontWeight:'medium'}} variant="outlined" />
              <Stack sx={{borderRadius: 2, ml:3, mr:3, my:1}}>
                <TextField fullWidth minRows={20} rows={20} value={data.caption} name='caption' onChange={e=>setData({...data, [e.target.name]: e.target.value})} multiline/>
              </Stack>
              {
                <Box display='flex' flexDirection='row' justifyContent='end' width='100%' pr={2}>
                  {
                    serviceConditions != null && serviceConditions.show &&
                    <LoadingButton
                      variant="contained"
                      onClick={()=>disableConditions()}
                      loading={isLoading}
                      loadingPosition='start'
                      centerRipple
                      endIcon={
                        <Iconify icon="bxs:hide"/>}
                          sx={{marginTop: 2, marginRight: 1, alignSelf: 'end', bgcolor:'#FF0000', justifySelf:'end'}}>
                        Remove Conditions
                    </LoadingButton>
                  }
                  {
                    data.title.length > 0 && data.caption.length > 0 && hasUpdate() &&
                    <LoadingButton
                      variant="contained"
                      onClick={()=>updateConditions()}
                      loading={isLoading}
                      loadingPosition='start'
                      centerRipple
                      endIcon={
                        <Iconify icon="charm:arrow-right"/>}
                          sx={{marginTop: 2, marginRight: 1, alignSelf: 'end', justifySelf:'end'}}>
                        Update Conditions
                    </LoadingButton>
                  }
                  {
                    data.title.length > 0 && data.caption.length > 0 && serviceConditions == null &&
                    <LoadingButton
                      variant="contained"
                      onClick={()=>setConditions()}
                      loading={isLoading}
                      loadingPosition='start'
                      centerRipple
                      endIcon={
                        <Iconify icon="charm:arrow-right"/>}
                          sx={{marginTop: 2, marginRight: 1, alignSelf: 'end', justifySelf:'end'}}>
                        Save Conditions
                    </LoadingButton>
                  }
              </Box>
              }
          </FormControl>
        </Box>
    </Box>
</Box>
  )
}