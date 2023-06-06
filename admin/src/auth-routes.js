import { useRoutes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Reset from './pages/Auth/Forgot'
import Create from './pages/Auth/Create'
import SpinnerLayout from './layouts/SpinnnerLayout'

export default function AuthRouter() {

  return useRoutes([
    {
      path: '/',
      element: <SpinnerLayout />,
      children: [
        { path: '/', element: <Login to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'forgot', element: <Reset /> },
        { path: 'auth/set-password', element: <Create /> },
        { path: '*', element: <Login to="/login" replace /> }
      ]
    },
    { path: '*', element: <Login replace /> }
  ])
}