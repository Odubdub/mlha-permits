import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SessionTimer from './layouts/dashboard/SessionTimer';
import { Home } from './Pages/Home';
import { Applications } from './Pages/Applications';
import { Profile } from './Pages/Profile';
import { useState } from 'react';

export default function Router() {
  return (
    <>
      {useRoutes([
        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            {
              path: 'dashboard',
              element: <Home />
            },
            { path: 'applications', element: <Applications /> },
            { path: 'visa', element: <Applications /> },
            { path: 'recruitment', element: <Applications /> },
            { path: 'documents', element: <Applications /> },
            { path: 'residency', element: <Applications /> },
            { path: 'citizenship', element: <Applications /> },
            { path: 'profile', element: <Profile /> }
          ]
        },
        { path: '*', element: <Home /> }
      ])}
      <SessionTimer show={false} />
    </>
  );
}
