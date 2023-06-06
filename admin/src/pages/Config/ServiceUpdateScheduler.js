import { LoadingButton, MobileTimePicker } from '@mui/lab'
import { Modal, Stack, Typography, IconButton, Box, Divider, Paper, List, TextField, InputAdornment, Chip, Input } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Iconify from 'src/components/Iconify'
import { isBlank, pluralize } from 'src/helperFuntions';
import { getFromServer, postToServer } from 'src/ApiService';
import { replaceAllUnderscores } from './format';

// '& .MuiInput-root': {
//   '&:before, :after, :hover:not(.Mui-disabled):before': {
//     borderBottom: 0,
//   },
// },

export const ServiceUpdateScheduler = ({open, onClose}) => {

  const [schedule, setSchedule] = useState([])
  const [services, setServices] = useState([])
  const totalUpdates = services.map(s=>s.notifications.length).reduce((a,b)=>a+b,0)
  const totalServices = services.filter(s=>s.notifications.length > 0).length

  const updateScheduleConfig = () => {
    console.log('schedule => ', schedule)
  }

  const getShortApplicationName = (name) => {

    //Check if string has suffix "application"
    let shortName = name
    const suffixes = ['permit', 'certificate', 'license', 'report', 'job card', 'registration', 'register']
    suffixes.forEach(suffix=>{
        if (shortName.includes(suffix)){
            shortName = shortName.replace(suffix, '')                
        }
    })

    if (shortName.toLowerCase().includes('rebate')){
        //replace third " " with "."
        const words = shortName.split(' ')
        shortName = words[0]+' '+words[1]+' '+words[2]+'.'+words[3]
    }

    return shortName.trim()
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const setData = (e) => {

  const srvs = [...services]

  const service = srvs.find(service=>service.code == e.target.name)
  const index = srvs.indexOf(service)

  if (isTimeString(e.target.value+':00')){
    service.notifyAt = e.target.value
  } else {
    service.notifyAt = 'instant'
  }

  srvs[index] = service
  setServices(srvs)
}

const resetData = (code) => {

  const srvs = [...services]

  const service = srvs.find(service=>service.code == code)
  const index = srvs.indexOf(service)

  service.notifyAt = 'instant'

  srvs[index] = service
  setServices(srvs)
}

function isTimeString(str){
 const regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
  if (regexp.test(str)) {
      return true
  }
  return false
}

const post = () => {

  const payload = services.map(service=>({
    serviceCode: service.code,
    notifyAt: service.notifyAt
  }))

  postToServer({
    path: 'authority/notifications', 
    params: payload, 
    onComplete: d=>{
      onClose()
    }, onError: err=>{

    }})
}

const pushAll = () => {
  onClose()
}

  useEffect(()=>{
    if (open){
      getFromServer({path: 'authority/notifications', onComplete: d=>{
        setServices(d)
        console.log('services => ', d)
      }, onError: err=>{
        console.log('err => ', err)
      }})
    }
  }, [open])

  const getScheduleWidget = ({service, i}) => {
    return (
      <Stack key={i}>
        <Stack direction='row' pl={3} pr={4} my={1} alignItems='center' sx={{'&:hover':'grey'}} justifyContent='space-between' width='100%'>
          <Typography  variant='subtitle'>{capitalizeFirstLetter(getShortApplicationName(replaceAllUnderscores(service.name)))}</Typography>
            <Typography flex='1'>
            {schedule[service.code]}
            </Typography>
            <Typography>
            { pluralize(service.notifications.length || 0, ' update')}
            </Typography>
            <Chip 
              label={service.notifyAt == 'instant' ? 'Instant' : 'Scheduled'} 
              onClick={()=>resetData(service.code)} 
              sx={{width: 90, mx: 3, bgcolor:service.notifyAt == 'instant' ? 'primary.main':'gray.main'}}/>
            <Input
              id="time"
              disableUnderline={true}
              variant='standard'
              size='small'
              name={service.code}
              onChange={e=>setData(e)} 
              label=""
              type="time"
              value={service.notifyAt == 'instant' ? '':service.notifyAt}
              
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}/>
        </Stack>
        <Divider sx={{mx: 3}}/>
      </Stack>
    )
  }

  return (
    <Modal open={open}>
          <Stack sx={{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', px: 2, py: 2}}>
            <Stack justifyContent='space-between'  width='700px' alignItems='center' sx={{ borderRadius: 2, bgcolor:'#fff', overflow: 'hidden'}}>
              <Stack direction='row' alignItems='center' bgcolor='#F2F2F2' pl={3} pr={2} pb={1} width='100%' justifyContent='start' pt={1.5}>
                  <Typography variant='h6'>
                    Schedule CRM Updates
                  </Typography>
                  <Box sx={{flex: 1}}/>
                  <IconButton onClick={onClose}>
                      <Iconify icon='ep:close'/>
                  </IconButton>
              </Stack>
              <Stack flex='1' width='100%'>
                <Paper style={{maxHeight: '70vh', overflow: 'auto'}}>
                  <List sx={{overflow: 'auto'}}>
                    <Stack>
                      {services.map((service, i)=>(getScheduleWidget({service: service, i})))}
                    </Stack>
                  </List>
                </Paper>
              </Stack>
                <Stack direction='row' alignItems='center' bgcolor='#F2F2F2' pb={1.5} width='100%'>
                  <Stack ml={2}>
                    <Typography variant='h6' color='#808080'>
                      {pluralize(totalUpdates || 0, ' update')}
                    </Typography>
                    <Typography variant='caption'>
                      {`Across ${pluralize(totalServices,'Service')}`}
                    </Typography>
                  </Stack>
                  <Stack flex='1'/>
                <LoadingButton 
                    loading={false} 
                    loadingPosition='end'
                    variant='contained'
                    onClick={pushAll}
                    endIcon={<Iconify icon='charm:arrow-right'/>}>
                    Push All Now
                </LoadingButton>
                <LoadingButton
                    loading={false} 
                    loadingPosition='end'
                    variant='contained'
                    sx={{ml: 1, mr: 2}}
                    onClick={post}
                    endIcon={<Iconify icon='fluent:send-clock-20-regular'/>}>
                    Update Settings
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
    </Modal>
  )
}
