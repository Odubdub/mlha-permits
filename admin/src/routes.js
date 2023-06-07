import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Config from './pages/Config/Config';
import Applications from './pages/Registrations/Registrations';
import NotFound from './pages/Page404';
import RegDetails from './pages/RegDetails/RegistrationDetails';
import DevTools from './pages/DevTools/DevTools';
import About from './pages/About/About';
import Reports from './pages/Report/Report';
import SessionTimer from './layouts/dashboard/SessionTimer';
import { Box } from '@mui/material';

export default function Router() {
 
  return (
    <>
      {useRoutes([
        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            { path: 'report', element: <Reports /> },
            { path: 'applications', element: <Applications /> },
            { path: 'applications/details', element: <RegDetails /> },
            {
              path: 'applications/more-details',
              element: (
                <Box>
                  <RegDetails />
                </Box>
              )
            },
            { path: 'config', element: <Config /> },
            { path: 'service-tools', element: <DevTools /> },
            { path: 'About', element: <About /> }
          ]
        },
        {
          path: '/',
          element: <LogoOnlyLayout />,
          children: [
            { path: '/', element: <Navigate to="/dashboard" /> },
            { path: '404', element: <NotFound /> },
            { path: '*', element: <Navigate to="/404" replace /> }
          ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
      ])}
      <SessionTimer show={false} />
    </>
  );
}
