import { Link as RouterLink } from 'react-router-dom'
// material
import { styled } from '@mui/material/styles'
import { Card, Stack, Link, Container, Typography, Divider, CircularProgress, Box } from '@mui/material'
// layouts
// components
import Page from '../../components/Page'
import Logo from 'src/components/Logo'
import { useEffect } from 'react'
import FogortForm from './ForgotForm'

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}))

export default function Reset() {

  useEffect(()=>{

  },[])

  return (
    <RootStyle title="Login | Permit Management">
       <Container maxWidth="sm">
            <Card sx={{my:3, p:5, display:'flex', flexDirection: 'column', alignItems:'center'}}>
              <Stack sx={{ mb:2, width: 200, display:'flex', flexDirection: 'column', alignItems:'center' }}>
                <Logo/>
                <Typography
                  variant="p"
                  sx={{ xs: 'none', textAlign: 'center', fontSize: 16, fontWeight: 800, mt: 2 }}
                >
                  Republic of Botswana
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                      display: { xs: 'none', sm: 'block'},
                      my: 3
                    }}
                  >
                    Reset your password
                  </Typography>
                <Divider />
                <FogortForm />
                </Stack>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 3,
                  display: { sm: 'none' }
                }}
              >
                Don’t have an account?&nbsp;
                <Link variant="subtitle2" component={RouterLink} to="register" underline="hover">
                  Get started
                </Link>
              </Typography>
            </Card>
          </Container>
    </RootStyle>
  )
}
