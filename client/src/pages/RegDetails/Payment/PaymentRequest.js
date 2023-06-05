import { Box, Divider, Grid, IconButton, InputAdornment, List, Paper, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Iconify from "src/components/Iconify"

export default function PaymentRequest({ isDisabled=false, setPaymentData, paymentData, config, issuanceConfig, errors}){

    const [editAmount, setEditAmount] = useState(false)

    const onlyNumberKey = (evt) => {
              
        // Only ASCII character in that range allowed
        var ASCIICode = (evt.which) ? evt.which : evt.keyCode
        if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
            return false;
        return true;
    }

    const setAmount = (value) => {
        if (!isNaN(value)){
            setPaymentData({...paymentData, paymentAmount: value})
        }
    }

    useEffect(()=>{
        
        //Set default values
        setPaymentData({
            paymentAmount: config.amount || 0,
            paymentName: config.name
        })
    }, [])

    return (
        <Stack sx={{width: '100%', maxHeight:500, display: 'flex', justifyContent: 'left'}}>
            <Typography id="m-title" variant="h4" ml={2} mt={1} component="h2">
                Payment Request
            </Typography>
            <Typography marginBottom='0.5em'  variant="h6" color='#808080' fontWeight='normal' fontSize={14} ml={2} component="h2">
                {config.title}
            </Typography>
            <Divider />
            <Paper style={{maxHeight: '80vh', overflow: 'auto'}}>
                <List> 
                    <Stack ml={2}>
                        <Typography fontWeight='bold' mb={1}>
                            {`Payment Details`}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={4}>
                                <TextField
                                    id="outlined-basic"
                                    error={errors.paymentAmount}
                                    onChange={e=>setAmount(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            BWP
                                        </InputAdornment>
                                        ),
                                        endAdornment: config.dynamic && (
                                            <IconButton onClick={()=>setEditAmount(true)}>
                                                <Iconify icon='akar-icons:edit'/>
                                            </IconButton>
                                        )
                                    }}
                                    disabled={isDisabled || !config.dynamic}
                                    name='paymentAmount'
                                    type='text'
                                    fullWidth
                                    maxRows={6}
                                    value={paymentData.paymentAmount}
                                    label={'Amount'}
                                    placeholder={'100.00'}
                                    sx={{mt: 1}}/>
                            </Grid>
                            <Grid item xs={12} sm={8} md={8}>
                                <TextField
                                    id="outlined-basic"
                                    error={errors.paymentName}
                                    onChange={e=>setPaymentData({...paymentData, [e.target.name]: e.target.value})}
                                    disabled={isDisabled}
                                    name='paymentName'
                                    type='text' 
                                    fullWidth
                                    maxRows={6}
                                    value={paymentData.paymentName}
                                    label={'Payment Name'} 
                                    placeholder={config.placeholder}
                                    sx={{mt: 1}} 
                                    variant="outlined" />
                            </Grid>
                        </Grid>
                    </Stack>
                </List>
            </Paper>
        </Stack> 
    )}
