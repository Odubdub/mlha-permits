import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
import { LoadingButton } from '@mui/lab'
import { Stack,TextField, Link } from '@mui/material'
import Label from 'src/components/Label'
import { isBlank } from 'src/helperFuntions';
import { getFromServer, postToServer } from 'src/ApiService';
import { clearToken } from './AuthService';

export default function CreatePasswordForm() {

  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState({})
  const token = useRef(null)
  const LoginSchema = Yup.object().shape({
    confirmPassword: Yup.string().required('Confirmition is required'),
    password: Yup.string().required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      confirmPassword: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      navigate('/login', { replace: true })
    }
  })

  const { touched, values, getFieldProps } = formik;

  const completeReg = () => {

    const errs = {}
    if (!isBlank(values.password) && values.password == values.confirmPassword){
      setIsSubmitting(true)
    } else {
      if (isBlank(values.foreNames)){
        errs.foreNames = true
      } else if (isBlank(values.lastName)){
        errs.lastName = true
      } else if (isBlank(values.password)){
        errs.password = true
      } else if (isBlank(values.confirmPassword)){
        errs.confirmPassword = true
      } else if (values.password != values.confirmPassword){
        errs.confirmPassword = true
      }
    }

    setErrors(errs)
    if (Object.keys(errs).length == 0){

      clearToken()
      postToServer({
        path:`authority/admin-users/complete-registration?registrationToken=${token.current}`,
        params: values, 
        onComplete: res=>{
          navigate('/registrations', {replace: true})
          setIsSubmitting(false)
        },
        onError: error=>{
          console.log('Error posting: ', error.message)
          setIsSubmitting(false)
        }})
    }
  }

  useEffect(() => {
      //get token from href
      token.current = location.href.split('token=')[1]

      if (token != null){
          getFromServer({
            path:`authority/admin-users/complete-registration?registrationToken=${token.current}`,
            params: {},
            onComplete: res=>{
              setUserData(res)
          },
          onError: error=>{
            console.log('Error getting: ', error.message)
          }})
      }
  },[])

  return (      
      <FormikProvider value={formik}>
        <Stack width={300} spacing={2} sx={{mb: 2}}>
            { 
            loginError && 
            <Label>
              {loginError}
            </Label>
            }
            <TextField
              fullWidth
              type="text"
              mt={5}
              size="small"
              disabled={true}
              label="Email"
              name="email"
              value={userData.email||''}
              helperText={errors.foreNames}/>

            <TextField
              fullWidth
              type="text"
              mt={5}
              size="small"
              disabled={true}
              label="Identity Number"
              name="idNumber"
              value={userData.idNumber||''}
              error={errors.lastName != undefined}
              helperText={errors.lastName}/>

            <TextField
              fullWidth
              type="text"
              mt={5}
              size="small"
              disabled={isSubmitting}
              label="Forenames"
              name="foreNames"
              {...getFieldProps('foreNames')}
              error={errors.foreNames != undefined}
              helperText={errors.foreNames}
            />
            <TextField
              fullWidth
              type="text"
              mt={5}
              size="small"
              disabled={isSubmitting}
              label="Last Name"
              name="lastName"
              {...getFieldProps('lastName')}
              error={errors.lastName != undefined}
              helperText={errors.lastName}
            />
            <TextField
              fullWidth
              type="password"
              mt={5}
              size="small"
              disabled={isSubmitting}
              label="Password"
              name="password"
              {...getFieldProps('password')}
              error={errors.password != undefined}
              helperText={errors.password}
            />
            <TextField
              fullWidth
              type="password"
              size="small"
              disabled={isSubmitting}
              name="confirmPassword"
              my={5}
              label="Confirm Passwords"
              {...getFieldProps('confirmPassword')}
              error={errors.confirmPassword != undefined}
              helperText={errors.confirmPassword}
            />
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={() => completeReg()}>
            Complete Registration
          </LoadingButton>
      </FormikProvider>
  )
}
