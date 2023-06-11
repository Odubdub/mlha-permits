import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, IconButton, Stack, Typography } from '@mui/material'
import { fontWeight } from '@mui/system'
import React, { useState } from 'react'
import Iconify from 'src/bundle/Iconify'

export const PaymentOptions = ({onPicked, onClose}) => {

    const options = [
        {
            img: "/static/bank.png",
            name: 'Debit/ Credit Card',
            caption: 'Available'
        },
        {
            img: "/static/orange.png",
            name: 'Orange Money',
            caption: 'An Orange Money account is required'
        },
        {
            img: "/static/myzaka.png",
            name: 'My Zaka',
            caption: 'A Mascom myzaka account is required'
        },
        {
            img: "/static/btc.png",
            name: 'BTC Smega',
            caption: 'A Smega account is required'
        },
        {
            img: "/static/ewallet.png",
            name: 'E-Wallet',
            caption: 'An FNB account is required'
        },
        {
            img: "/static/poso.png",
            name: 'Poso Money',
            caption: 'A Botswana Post account is required'
        }
    ]

    const [selected, setSelected] = useState(0)

  return (
    <Stack height='100%' width='100%' alignItems='center' justifyContent='center'>
        <Card sx={{width: 500, border: '0.5px dashed #808080', pb: 4, bgcolor: '#fefefe'}}>
        <Stack >
            <Stack>
            </Stack>
                <Stack direction='row'>
                    <Typography variant='h4' mx={3} mt={3} width={200}>
                        Payment Method
                    </Typography>
                    <Box flex='1'/>
                    <IconButton onClick={onClose} sx={{mt: 1, mr: 1}}>
                        <Iconify icon='ic:round-close'/>
                    </IconButton>
                </Stack>
                <Typography mx={3}>
                    Select your prefered mode of payment
                </Typography>
                {
                    options.map((option, index) => {
                        const isSelected = selected == index
                        return <Stack direction='row' sx={{transform: isSelected ? 1.2 : 1, transition: 'all ease 0.3s', cursor: 'pointer'}} mt={2} px={0.5} pr={2} py={0.5} borderRadius={2} alignItems='center' bgcolor={isSelected ? 'primary.main' : null} onClick={()=>setSelected(index)} justifyContent='start' mx={3}>
                        <Box component="img" bgcolor={'#ffffff'} borderRadius={2} border={isSelected ? null : '0.5px dashed #808080'} src={option.img} sx={{height: 60, width: 100, objectFit: 'contain'}} />
                        <Stack ml={2}>
                            <Typography color={isSelected ? '#ffffff' : '#000000'} fontWeight={isSelected ? 800 : null}>
                                {option.name}
                            </Typography>
                            <Typography variant='caption'>
                                {option.caption}
                            </Typography>
                        </Stack>
                        <Box flex={1}/>
                        {
                            isSelected &&
                            <Stack
                            sx={{justifySelf: 'end'}} 
                            >
                                <Iconify icon='icon-park-solid:check-one'/>
                            </Stack>
                        }
                    </Stack>
                    })
                }
                <LoadingButton
                    type="submit"
                    endIcon={<Iconify icon='octicon:arrow-right-16'/>}
                    sx={{alignSelf: 'end', mr: 4, }}
                    disabled={selected != 0}
                    variant="contained"
                    onClick={onPicked}
                >
                    Continue to payment
                </LoadingButton>
            </Stack>
        </Card>
    </Stack>
  )
}