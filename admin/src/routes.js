import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Config from './pages/Config/Config';
import Applications from './pages/Registrations/Registrations';
import NotFound from './pages/Page404';
import RegDetails from './pages/RegDetails/RegistrationDetails';
import DevTools from './pages/DevTools/DevTools';
import { useState, useRef, useEffect } from 'react';
import { Authorities, AuthorityContext } from './layouts/dashboard/NewSidebar.js/AuthorityContext';
import About from './pages/About/About';
import Reports from './pages/Report/Report';
import SessionTimer from './layouts/dashboard/SessionTimer';
import { Box } from '@mui/material';

export default function Router() {
  const [authority, setAuthority] = useState(Authorities[0]);
  const authorityValue = { authority: authority, setAuthority: setAuthority };
  const filters = useRef({
    Work: [],
    Visa: [
      'MLHA_004_05_001',
      'MLHA_004_05_002',
      'MLHA_004_05_003',
      'MLHA_004_05_004',
      'MLHA_004_05_005',
      'MLHA_004_05_006',
      'MLHA_004_05_007',
      'MLHA_004_05_008'
    ],
    Citizenship: [
      'MLHA_004_05_009',
      'MLHA_004_05_010',
      'MLHA_004_05_011',
      'MLHA_004_05_012',
      'MLHA_004_05_013',
      'MLHA_004_05_014',
      'MLHA_004_05_015',
      'MLHA_004_05_016',
      'MLHA_004_05_017',
      'MLHA_004_05_018',
      'MLHA_004_05_019',
      'MLHA_004_05_020',
      'MLHA_004_05_021',
      'MLHA_004_05_022',
      'MLHA_004_05_023',
      'MLHA_004_05_027',
      'MLHA_004_05_028',
      'MLHA_004_05_029',
      'MLHA_004_05_030',
      'MLHA_004_05_031',
      'MLHA_004_05_032'
    ],
    Residency: ['MLHA_004_05_024', 'MLHA_004_05_025', 'MLHA_004_05_026'],
    Recruitment: [
      'MLHA_004_05_033',
      'MLHA_004_05_034',
      'MLHA_004_05_035',
      'MLHA_004_05_036',
      'MLHA_004_05_037'
    ]
  });

  useEffect(() => {}, [window.location.pathname]);

  return (
    <AuthorityContext.Provider value={authorityValue}>
      {useRoutes([
        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            { path: 'report', element: <Reports /> },
            {
              path: 'work',
              element: (
                <Applications
                  title={'Work Permit Applications'}
                  applicationFilters={filters.current.Citizenship}
                />
              )
            },
            {
              path: 'citizenship',
              element: (
                <Applications
                  title="Citizenship Applications"
                  applicationFilters={filters.current.Citizenship}
                />
              )
            },
            {
              path: 'residency',
              element: (
                <Applications
                  title="Residency Applications"
                  applicationFilters={filters.current.Residency}
                />
              )
            },
            {
              path: 'recruitment',
              element: (
                <Applications
                  title="Recruitment Applications"
                  applicationFilters={filters.current.Recruitment}
                />
              )
            },
            {
              path: 'visa',
              element: (
                <Applications title="Visa Applications" applicationFilters={filters.current.Visa} />
              )
            },
            {
              path: 'documents',
              element: <Applications title="Documents" applicationFilters={[]} />
            },
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
    </AuthorityContext.Provider>
  );
}
