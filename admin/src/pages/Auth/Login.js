// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography, Divider, Fade } from '@mui/material';
// layouts
// components
import Page from '../../components/Page';
import Logo from 'src/components/Logo';
import KeycloakLoginForm from './Keycloak-LoginForm';
import { useState, useEffect, useContext } from 'react';
import TextTransition, { presets } from 'react-text-transition';
import { AuthContext } from 'src/AuthContext';
import { getFromServer } from 'src/ApiService';

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

export default function Login() {
  const { userData } = useContext(AuthContext);
  const [didInitialiseAuth, setDidInitialiseAuth] = useState(false);
  const [titles, setTitles] = useState([
    {
      ministry: 'Ministry of Local Government & Rural Development',
      department: 'Gaborone City Council'
    },
    {
      ministry: 'Ministry of Trade and Industry',
      department: 'Botswana Trade Commission'
    }
  ]);

  const [shownIndex, setShownIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setShownIndex((shownIndex + 1) % titles.length);
    }, 7000);
  }, [shownIndex]);

  useEffect(() => {
    getFromServer({
      path: 'authority/departments',
      onComplete: (data) => {
        if (data.length > 0) {
          setShownIndex(0);

          const newTitles = data.map((dept) => ({
            ministry: dept.ministry.name,
            department: dept.name
          }));

          if (newTitles.length == 1) {
            newTitles.push({ ...newTitles[0] });
          }

          setTitles(newTitles);
        }
      },
      onError: (_) => {}
    });
  }, [userData]);

  return (
    <RootStyle title="CPMS | Login">
      <Container maxWidth="sm" sx={{}}>
        <Card sx={{ my: 3, p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Stack sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Logo sx={{ height: 100 }} />
            <Typography
              variant="p"
              sx={{ xs: 'none', textAlign: 'center', fontSize: 16, fontWeight: 800, mt: 0.5 }}
            >
              Republic of Botswana
            </Typography>
            <Stack alignItems="center" mt={1} fontWeight={600}>
              <TextTransition
                style={{ fontWeight: 600, marginTop: 5 }}
                text={titles[shownIndex].ministry}
                springConfig={presets.wobbly}
              />
              <TextTransition
                style={{ color: '#414141', fontSize: 14, marginTop: 5 }}
                text={titles[shownIndex].department}
                springConfig={presets.molasses}
              />
            </Stack>
            <Stack alignItems="center" mt={1} fontWeight={600}></Stack>
            <Typography
              variant="p"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 800,
                my: 2
              }}
            >
              Central Permit Management System
            </Typography>
            <Divider />
            {/* <LoginForm /> */}
            <KeycloakLoginForm onInitialized={() => setDidInitialiseAuth(true)} />
          </Stack>

          <Stack sx={{ mb: 5, mt: 2 }} alignItems="center">
            <Typography variant="h6">Don’t have access to the Admin Portal? &nbsp;</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Ask your system administrator to give you access.
            </Typography>
          </Stack>
        </Card>
      </Container>
    </RootStyle>
  );
}
