import { Box, Divider, Grid, IconButton, InputAdornment, List, Paper, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"

export default function ReturnApplication({ isDisabled=false, setReturnData, corrections=[], returnData, issuanceConfig, errors}){

    return (
        <Stack sx={{width: '100%', maxHeight:500, display: 'flex', justifyContent: 'left'}}>
            <Typography id="m-title" variant="h4" ml={2} mt={1} component="h2">
                Return Form
            </Typography>
            <Typography marginBottom='0.5em'  variant="h6" color='#808080' fontWeight='normal' fontSize={14} ml={2} component="h2">
                {`Application to be returned for corrections`}
            </Typography>
            <Divider />
            <Paper style={{maxHeight: '80vh', overflow: 'auto'}}>
                <List> 
                    <Stack ml={2}>
                        <Typography fontWeight='bold' mb={1}>
                            Correction Details
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            error={errors.returnMessage}
                            onChange={e=>setReturnData({...returnData, [e.target.name]: e.target.value})}
                            disabled={isDisabled}
                            name='returnMessage'
                            type='text'
                            fullWidth
                            maxRows={6}
                            multiline
                            value={returnData.returnMessage}
                            label={'Notification Message'}
                            placeholder={'Your application was returned for corrections on the following fields'}
                            sx={{mt: 1}}/>
                    </Stack>
                </List>
            </Paper>
        </Stack> 
    )}
