import { Box, Divider, Grid, IconButton, InputAdornment, List, Paper, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"

export default function RejectApplication({ isDisabled=false, setRejectData, rejectData, issuanceConfig, errors}){

    useEffect(()=>{
        
        //Set default values
        setRejectData({
            message: '',
            reason: ''
        })
    }, [])

    return (
        <Stack sx={{width: '100%', maxHeight:500, display: 'flex', justifyContent: 'left'}}>
            <Typography id="m-title" variant="h4" ml={2} mt={1} component="h2">
                Reject Application
            </Typography>
            <Typography marginBottom='0.5em'  variant="h6" color='#808080' fontWeight='normal' fontSize={14} ml={2} component="h2">
                {`Decline application for ${issuanceConfig.type.toLowerCase()}`}
            </Typography>
            <Divider />
            <Paper style={{maxHeight: '80vh', overflow: 'auto'}}>
                <List> 
                    <Stack ml={2}>
                        <Typography fontWeight='bold' mb={1}>
                            Rejection Details
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            error={errors.reason}
                            onChange={e=>setRejectData({...rejectData, [e.target.name]: e.target.value})}
                            disabled={isDisabled}
                            name='reason'
                            type='text'
                            fullWidth
                            maxRows={6}
                            value={rejectData.reason}
                            label={'Reason'}
                            placeholder={'Why is the application rejected?'}
                            sx={{mt: 1}}/>
                        <TextField
                            id="outlined-basic"
                            error={errors.message}
                            onChange={e=>setRejectData({...rejectData, [e.target.name]: e.target.value})}
                            disabled={isDisabled}
                            name='message'
                            type='text'
                            fullWidth
                            maxRows={6}
                            value={rejectData.message}
                            label={'Notification Message'}
                            placeholder={'Your application was rejected because...'}
                            sx={{mt: 1}}/>
                    </Stack>
                </List>
            </Paper>
        </Stack> 
    )}
