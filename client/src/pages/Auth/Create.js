import { Link as RouterLink } from 'react-router-dom'
// material
import { styled } from '@mui/material/styles'
import { Card, Stack, Link, Container, Typography, Divider } from '@mui/material'
import Page from '../../components/Page'
import Logo from 'src/components/Logo'
import CreatePasswordForm from './CreateForm'

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}))

export default function Create() {


  return (
    <RootStyle title="Forgot Password | Permit Management">
        <Container maxWidth="sm">
            <Card sx={{my:3, p:5, display:'flex', flexDirection: 'column', alignItems:'center'}}>
                <Stack sx={{ mb:2, display:'flex', flexDirection: 'column', alignItems:'center' }}>
                <Logo/>
                <Typography
                    variant="p"
                    sx={{ xs: 'none', textAlign: 'center', fontSize: 16, fontWeight: 800, mt: 1 }}
                >
                    Republic of Botswana
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        display: { xs: 'none', sm: 'block'},
                        mt:1
                    }}
                    >
                    Activate account
                    </Typography>
                    <Typography
                    variant="h6"
                    sx={{ mb: 2, display: { xs: 'none', sm: 'block'}}}
                >
                </Typography>
                <CreatePasswordForm/>
                <Divider />
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