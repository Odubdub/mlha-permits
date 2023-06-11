import { Card, Stack, Box,TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Divider,
    FormHelperText,
    Typography, } from '@mui/material'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Iconify from 'src/bundle/Iconify'
import { isNotValue } from 'src/bundle/validator'

const useStyles = makeStyles((theme) => ({
    formControl: {
      marginBottom: theme.spacing(2),
      minWidth: 120,
    },
    button: {
      marginTop: theme.spacing(2),
    },
  }));


const CardDetails = ({onCompletePayment, amount, onClose, feeName = 'Application Fee'}) => {

  const classes = useStyles();
  const [cardNumber, setCardNumber] = useState('4000 0000 0000 0002');
  const [expiryMonth, setExpiryMonth] = useState(null);
  const [expiryYear, setExpiryYear] = useState(null);
  const [cvv, setCvv] = useState(null);
  const [email, setEmail] = useState('');

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleExpiryMonthChange = (event) => {
    setExpiryMonth(event.target.value);
  };

  const handleExpiryYearChange = (event) => {
    setExpiryYear(event.target.value);
  };

  const handleCvvChange = (event) => {
    setCvv(event.target.value);
  };
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCompletePayment = (event) => {
    onCompletePayment({
        email,
        cvv,
        cardNumber,
        expiryMonth,
        expiryYear
    })
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isValid = () => {

    if (validateEmail(email) && !isNotValue(cvv) && !isNotValue(expiryYear) && !isNotValue(cardNumber) && !isNotValue(expiryMonth)){
        return true
    }

    return false
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform form validation here
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !email) {
      alert('Please fill in all the required fields.');
      return;
    }

    // Perform further processing or submit the form
    // ...
  };

  return (
    <Stack height='100%' width='100%' alignItems='center' justifyContent='center'>
        <Card sx={{width: 500, border: '0.5px dashed #808080', height: 700}}>
            <Stack height={'100%'} width='100%'>
            <Stack direction='row' justifyContent='end'>

                <Typography ml={16} alignSelf='center' sx={{opacity: 0.7, textAlign: 'center', mt: 2, bgcolor: 'red', color: 'white', borderRadius: 0.2, width: 210, pt: 0.2, fontWeight: 700}}>
                    This is a test payment
                </Typography>
                <Box flex='1'/>
                <IconButton onClick={onClose} sx={{mt: 1, mr: 1}}>
                    <Iconify icon='ic:round-close'/>
                </IconButton>
            </Stack>
            <Stack  alignSelf='center' justifyContent='start' width={'100%'} flex={1}>
                <Box component="img" src="/static/cyber.png" mt={1} sx={{width: 150, mb: 4 }} alignSelf='center' />
                <Stack  bgcolor='#80808020' border='0.5px dashed #808080' mx={6} py={0.5} px={3} borderRadius={1} mb={2}>
                    <Stack direction='row' alignItems='center'>
                    <Iconify icon='icon-park-solid:check-one' />
                    <Typography ml={1}>
                        ACCOUNTANT GENERAL
                    </Typography>
                    </Stack>
                    <Stack direction='row' justifyContent='space-between' >

                    <Typography fontWeight='800' fontSize={24}>
                        P500.00
                    </Typography>
                    <Typography>
                        {feeName}
                    </Typography>
                    </Stack>
                </Stack>
                <Stack  px={4}  mx={3}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Card Number"
                        value={cardNumber}
                        InputLabelProps={{ shrink: true }}
                        variant='standard'
                        sx={{boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                        onChange={handleCardNumberChange}
                        placeholder='XXXX XXXX XXXX XXXX'
                        fullWidth
                        required
                    />
                    <FormHelperText>
                        Enter a valid card number
                    </FormHelperText>
                    <FormControl sx={{mt:1.5}} className={classes.formControl}>
                        <InputLabel>Expiry Month</InputLabel>
                        <Select
                            variant='standard'
                            InputLabelProps={{ shrink: true }}
                            sx={{width: 150}}
                            value={expiryMonth||''}
                            onChange={handleExpiryMonthChange}
                            required
                            >
                        <MenuItem value="01">01</MenuItem>
                        <MenuItem value="02">02</MenuItem>
                        <MenuItem value="02">03</MenuItem>
                        <MenuItem value="02">04</MenuItem>
                        <MenuItem value="02">05</MenuItem>
                        <MenuItem value="02">06</MenuItem>
                        <MenuItem value="02">07</MenuItem>
                        <MenuItem value="02">08</MenuItem>
                        <MenuItem value="02">09</MenuItem>
                        <MenuItem value="02">10</MenuItem>
                        <MenuItem value="02">11</MenuItem>
                        <MenuItem value="02">12</MenuItem>
                        {/* Add more months */}
                        </Select>

                        <FormHelperText>
                            Select
                        </FormHelperText>
                    </FormControl>
                    <FormControl sx={{ml: 1, mt:1.5, width: 130}} className={classes.formControl}>
                        <InputLabel>Expiry Year</InputLabel>
                        <Select
                            variant='standard'
                            InputLabelProps={{ shrink: true }}

                        value={expiryYear||''}
                        onChange={handleExpiryYearChange}
                        required
                        >
                        <MenuItem value="2023">2023</MenuItem>
                        <MenuItem value="2023">2024</MenuItem>
                        <MenuItem value="2023">2025</MenuItem>
                        <MenuItem value="2023">2026</MenuItem>
                        <MenuItem value="2023">2027</MenuItem>
                        <MenuItem value="2023">2028</MenuItem>
                        <MenuItem value="2023">2029</MenuItem>
                        {/* Add more years */}
                        </Select>
                        <FormHelperText>
                            Select
                        </FormHelperText>
                    </FormControl>
                    <Stack direction='row'>
                        <Box width={16} borderTop='0.5px solid #80808080' mt={5.95}/>
                        <Stack>
                            <TextField
                                label="CVV"
                                value={cvv||''}
                                InputLabelProps={{ shrink: true}}
                                sx={{width: 130 }}
                                variant='standard'
                                placeholder='123'
                                onChange={handleCvvChange}
                                fullWidth
                                required
                            />
                            <FormHelperText>
                                Card Verification Code
                            </FormHelperText>
                        </Stack>
                    </Stack>
                    <br />
                <TextField
                    label="Email"
                    value={email||''}
                    InputLabelProps={{ shrink: true }}
                    variant='standard'
                    placeholder='john@example.com'
                    onChange={handleEmailChange}
                    fullWidth
                    required
                />
                    <FormHelperText>
                        Payment receipt will be sent to this email
                    </FormHelperText>
                <Stack>
                    
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!isValid()}
                    onClick={handleCompletePayment}
                    sx={{
                        bgcolor:'#1876FF',
                        '&:hover':{ bgcolor: '#0054D2' },
                        boxShadow: '#0054D2 1px 1.5px 4px;'
                    }}
                    className={classes.button}
                >
                    Complete Payment
                </Button>
                </Stack>
        </form>
                </Stack>
            </Stack>
            
            <Stack direction='row' height={60} bgcolor='#80808020' width={'100%'} justifyContent='space-between' justifySelf='end' alignItems='center'>
                    <Box component="img" src="/static/card.png" ml={2} sx={{width: 110, mb: 4, mt: 4 }}/>
                    <Typography>
                    Secured by <span style={{fontWeight: 'bold'}}>CyberSource</span>
                    <Iconify icon='uim:lock' sx={{transform: 'scale(1.2)', mt: 0.5, ml: 1, mr: 3}}/>
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    </Stack>
  )
}

export default CardDetails