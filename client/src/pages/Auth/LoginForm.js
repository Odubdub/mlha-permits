import * as Yup from 'yup'
import { useContext, useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
import lodash from 'lodash'

// material
import {
  Link,
  Stack,
  Box,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from 'src/components/Iconify'
import { getFromServer, postToServer } from 'src/ApiService'
import { AuthContext } from 'src/AuthContext'
import { getAuthParams, updateToken } from './AuthService'
import Label from 'src/components/Label'
import jwtDecode from 'jwt-decode'
import { DepartmentContext } from 'src/DepartmentContext'

export default function LoginForm() {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { userData, setUserData } = useContext(AuthContext)
  const { setServices, setDepartment } = useContext(DepartmentContext)
  const [error, setError] = useState(null)

  const LoginSchema = Yup.object().shape({
    omang: Yup.string().required('Omang is required'),
    password: Yup.string().required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      omang: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      postToServer({path:'access-control/auth/login', params: {
        password: values.password,
        idNumber: values.omang
      }, onComplete: data => {
        setError(null)
        updateToken(data.token, data.expires, data._id)
        getUser()
      }, onError: error => {
        setSubmitting(false)
        setError('Login Error')
      }})
    }
  })

  const getUser = () => {
    const params = getAuthParams()
    getFromServer({
      path:`authority/admin-users/${params.id}`, 
      onComplete: data => {

        const decoded = jwtDecode(getAuthParams().token)
        const uData = {...decoded, ...data }

        console.log(uData)

        const userServiceIDs = lodash.uniq(uData.roles.map(role=>role.service))
          getFromServer({
            path: 'authority/services',
            onComplete: srvcs=>{

              const userServices = srvcs.filter(srvc=>userServiceIDs.includes(srvc._id))
              setServices(userServices)
              setSubmitting(false)
              setUserData({...uData, services: userServices})
              navigate('/applications', { replace: true })
            }, onError: err=>{}})
      },
      onError: error => {
        setError(null)
      }})
  }

  useEffect(()=>{
    getUser()
  }, [])

  const { errors, touched, values, isSubmitting, setSubmitting, handleSubmit, getFieldProps } = formik

  const handleShowPassword = () => {

    setShowPassword((show) => !show)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box width='100%' display='flex' flexDirection='row' justifyContent='center'>
        {error && <Label color='error' sx={{mb:2}}>{error}</Label>}
        </Box>
        <Stack spacing={3}>
          <TextField
            fullWidth
            disabled={isSubmitting}
            autoComplete="omang"
            type="text"
            label="Omang/Passport"
            {...getFieldProps('omang')}
            error={Boolean(touched.omang && errors.omang)}
            helperText={touched.omang && errors.omang}
          />
          <TextField
            fullWidth
            disabled={isSubmitting}
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword}  edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Link component={RouterLink} sx={{cursor: isSubmitting ? 'none':'pointer'}} variant="subtitle2" to="/forgot" underline="hover">
              Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
