import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import { HelpButton } from './HelpButton'
import TextTransition, { presets } from 'react-text-transition';
import Login from './AuthPage'
import { AuthContext } from 'src/AuthContext'
import { Logo } from './Logo'
import { FieldTypes } from 'src/bundle/constants'

export const Welcome = () => {
    
    const [showAuthPage, setShowAuthPage] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const {userData, setUserData} = useContext(AuthContext)

    const [shownIndex, setShownIndex] = useState(0);
    const [titles, setTitles] = useState([
        "Issuance of work permits",
        "Emergency work permit",
        "Recruiters’ license & permit",
        "Work exemption",
        "Issuance of residence permits",
        "Permanent residence",
        "Residence exemption",
        "Citizenship",
        "Botswana blue card",
        "VISA"
    ]);

    useEffect(() => {
        setTimeout(() => {
          setShownIndex((shownIndex + 1) % titles.length);
        }, 2000);
      }, [shownIndex]);

      const start = () =>{
        window.startParticles()
        }
      const stop = () =>{

        window.stopParticles()
      }
    
    return (
        <Stack bgcolor={'#fff'} height='100vh' maxHeight='100vh' width='100vw' maxWidth='100vw' direction='row' position={'relative'}>
<div
    id="tsparticles" 
    style={{
      width: 700,
      height: 700,
      zIndex: 100,
      // backgroundColor:'red',
      right: 0,
      position: "absolute",
    }}
  />    
  <Box
  component="img"
  src='/static/welcome-bg.jpg'
    id="tsparticlesbg" 
    style={{
      width: "100vw",
      height: "100vh",
      zIndex: 10,
      opacity: 0.9,
      // backgroundColor:'red',
      right: 0,
      position: "absolute",
    }}
  />  

  <Box
  component="img"
  src='/static/bg.png'
    id="tsparticlesbg" 
    style={{
      width: "100vw",
      height: "100vh",
      zIndex: 11,
      opacity: 0.05,
      // backgroundColor:'red',
      right: 0,
      position: "absolute",
    }}/>       
        <Stack direction='row' position='absolute' zIndex={100} height='100vh' width='100vw'>
            <Stack flex={1}>
                <Logo/>
                <Typography fontWeight={900} ml={5} mt={5} fontSize={35} sx={{color: 'text.primary'}}>Welcome to Botswana</Typography>
                <Typography fontWeight={900} ml={5} fontSize={40} sx={{color: 'text.primary'}}>Government e-Services</Typography>
                <Stack sx={{bgcolor: 'primary.main', borderRadius: 2, mt: 2, ml: 3, width:430, alignItems: 'center'}}>
                    <Typography fontWeight={400} fontSize={35} sx={{color: '#fff', width:'wrap-content'}}>Customer Access Portal</Typography>
                </Stack>
                <Box flex={1}/>
                <Stack mt={1} fontWeight={600} ml={3}>
                <TextTransition
                    style={{ color: '#414141', fontSize: 40, marginTop: 5 }}
                    text={titles[shownIndex]}
                    springConfig={presets.molasses}
                    />
                    <Typography
                        style={{ fontWeight: 600,  fontSize: 20,marginTop: 5 }}
                        >
                            A Hackathon Solution By <span style={{backgroundColor: '#00e0ff', padding: '2px 10px', borderRadius: 10, color: '#fff'}}>Team DevSQL</span>
                        </Typography>
                        <Typography
                        style={{ fontWeight: 600,  fontSize: 20,marginTop: 5 }}
                        >
                            For the <span style={{fontWeight: 800}}>
                            Ministry of Immigration and Civil Registration
                            </span>
                        </Typography>
            </Stack>
                <Box flex={1}/>
                <Stack direction='row' bgcolor='#00000080' justifyContent='space-around' borderRadius={25} ml={5} mb={5} height={50} width={300}>
                    <HelpButton icon='material-symbols:call-sharp' title='Call'/>
                        <HelpButton icon='ic:round-email' title='Email'/>
                        <HelpButton icon='uiw:facebook' title='Facebook'/>
                        <HelpButton icon='akar-icons:whatsapp-fill' title='Whatsapp'/>
                        <HelpButton icon='bi:twitter' title='Twitter'/>
                        <HelpButton icon='ri:instagram-fill' title='Instagram'/>
                    </Stack>
            </Stack>
            <Stack 
                flex={1} justifyContent='space-between' alignItems='center' height='100%'>
                    <Box flex={1}/>
                    {
                        showAuthPage && 
                <Login isLogin={isLogin} onClose={()=>setShowAuthPage(false)}/>

                    }
                <Box flex={1}/>

                <Stack direction='row' mb={5} justifyContent='center' width='100%' justifySelf='end'>
                    <Button variant='contained' disabled={isLogin && showAuthPage} onClick={()=>{
                        setIsLogin(true)
                        setShowAuthPage(true)
                        }}
                         sx={{width: 230, mr: 5, bgcolor: 'primary.main', color: '#ffffff', '&:hover':{color: '#ffffff',bgcolor: 'primary.light'}, height: 55, borderRadius: 2,fontSize: 18}}>
                        Login
                    </Button>
                    <Button
                        disabled={!isLogin}
                     onClick={()=>{
                        setIsLogin(false)
                        setShowAuthPage(true)
                        }}
                    sx={{width: 230, mr: 5,bgcolor: '#222222', '&:hover':{bgcolor: '#22222280'}, height: 55, borderRadius: 2,fontSize: 18, color:'#ffffff'}}>
                        Register
                    </Button>
                    <Button onClick={stop}>
                        sdjkfnds
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    </Stack>
    )
    }
