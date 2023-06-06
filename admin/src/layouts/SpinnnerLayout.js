import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';

const HeaderStyle = styled('header')(({ theme }) => ({

  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  height: '100vh',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}))

export default function SpinnerLayout() {
  return (
    <>
      <HeaderStyle>
        <Box sx={{ display: 'flex', width:'100%', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
      </HeaderStyle>
      <Outlet />
    </>
  );
}
