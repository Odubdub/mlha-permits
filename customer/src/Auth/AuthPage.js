import { Card, Stack, Container, Typography, Divider, Box, Button } from '@mui/material';
import LoginForm from './LoginForm';
import TextTransition, { presets } from 'react-text-transition';
import { useEffect, useRef, useState } from 'react';
import ministries from './ministries.json';
import Loader from 'src/bundle/Loader/loader'
import RegisterForm from './RegisterForm'

export default function Login({onClose, isLogin, setIsLogin}) {

  const stop = useRef();
  const start = useRef();
  const stopWithCheck = useRef();
  const stopWithError = useRef();

  const [shownIndex, setShownIndex] = useState(0);
  const [titles, setTitles] = useState([
    {
      ministry: 'Ministry of Communication, Knowledge and Technology',
      department: 'Government Online'
    },
    {
      ministry: 'Ministry of Trade and Industry',
      department: 'Botswana Trade Commission'
    }
  ]);

  useEffect(() => {
    setTimeout(() => {
      setShownIndex((shownIndex + 1) % titles.length);
    }, 4000);
  }, [shownIndex]);

  useEffect(() => {
    const allDepartments = [];
    ministries.forEach((ministry) => {
      ministry.departments.forEach((department) => {
        allDepartments.push({ ministry: ministry.name, department: department.name });
      });
    });

    // Shuffle the array
    for (let i = allDepartments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allDepartments[i], allDepartments[j]] = [allDepartments[j], allDepartments[i]];
    }

    setTitles(allDepartments);
  }, []);
  
  return (
    <Stack sx={{ backdropFilter:'blur(5px)', width: 500, minHeight: 597,boxShadow: 'rgba(0, 0, 0, 0.15) 1px 1.5px 5px;', bgcolor:'#ffffffaa', borderRadius: 3, my: 3, px: 5, py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Stack sx={{ mb: 2, position:'relative', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
          <Stack direction='row' alignItems='center'>
            <Stack sx={{transform: 'scale(1.5)'}}>

            <Loader
              start={start}
              stop={stop}
              stopWithCheck={stopWithCheck}
              stopWithError={stopWithError}
            />
            </Stack>
            <Stack>
              <Typography
                  variant="p"
                  sx={{ xs: 'none', mt: 2, ml: 3, textAlign: 'left', fontSize: 30, fontWeight: 800}}
                >
                {isLogin ? 'Login' : 'Register'}
              </Typography>
              <Typography
                variant="p"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  ml: 3,
                  mb: 2
                }}
              >
                To access the services, you need to login to the Portal with your credentials.
              </Typography>
            </Stack>
          </Stack>
          

          {
            isLogin ?
            <LoginForm onStopLoad={stop.current} setIsLogin={setIsLogin} onStartLoad={start.current}/>
            :
            <RegisterForm onStopLoad={stop.current} setIsLogin={setIsLogin} onStartLoad={start.current}/>
          }          
          {
            isLogin &&
            <Stack sx={{ mb: 5, mt: 2 }} alignItems="center">
              <Typography variant="h6">Don’t have an account? &nbsp;</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                <Button onClick={()=>setIsLogin(false)}>Register</Button>for an account with 1Gov.
              </Typography>
            </Stack>
          }
        </Stack>
        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            display: { sm: 'none' }
          }}
        ></Typography>
      </Stack>
  );
}
