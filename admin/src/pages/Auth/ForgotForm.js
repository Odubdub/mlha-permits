import * as Yup from 'yup'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
import { LoadingButton } from '@mui/lab'
import { Stack,TextField, Link  } from '@mui/material'
// import { postData } from 'src/ApiService'
import Label from 'src/components/Label'
import { validateEmail } from './helper'

export default function FogortForm() {

  const navigate = useNavigate()
  const [emailError, setEmailError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      // navigate('/dashboard', { replace: true })
    }
  })

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const forgot = () => {

    if (validateEmail(values.email)) {
      // navigate('/login', { replace: true })
      setIsSubmitting(true)
    } else {
      setEmailError('Invalid Email')
    }
  }

  return (      
      <FormikProvider value={formik}>
        <Form autoComplete="off" sx={{width: 200}} noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{width: 200}}>
            { 
            emailError && 
            <Label>
              {emailError}
            </Label>
            }
            <TextField
              fullWidth
              autoComplete="email"
              type="text"
              disabled={isSubmitting}
              label="Email"
              // value={email}
              // onChange={e=>setEmail(e.target.value)}
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>
          <Stack direction="row"  width='100%' alignItems="end" justifyContent="end" sx={{ my: 2 }}>
            <Link component={RouterLink}  variant="subtitle2" sx={{opacity:isSubmitting ? 0.5 : 1}} to={isSubmitting ? '#' : "/login"} underline="hover">
              Remember password?
            </Link>
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={e=>forgot()}>
            Send Reset Link
          </LoadingButton>
        </Form>
      </FormikProvider>
  )
}
