import * as Yup from 'yup';
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
import { LoadingButton } from '@mui/lab'
import { Stack,TextField, Link } from '@mui/material'
import Label from 'src/components/Label'
import { isBlank } from 'src/helperFuntions';

export default function CreatePasswordForm() {

  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [errors, setErrors] = useState(false)
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
      navigate('/dashboard', { replace: true })
    }
  })

  const { touched, values, getFieldProps } = formik;

  const login = () => {
    if (!isBlank(values.password) && values.password == values.confirmPassword){
      setIsSubmitting(true)
      setErrors({})
    } else {
      if (isBlank(values.password)){
        setErrors({password: 'Password is Required'})
      } else if (isBlank(values.confirmPassword)){
        setErrors({confirmPassword: 'Password confirm is Required'})
      } else if (values.password != values.confirmPassword){
        setErrors({confirmPassword: 'Password mismatch'})
      }
    }
  }

  return (      
      <FormikProvider value={formik}>
        <Stack width={300} spacing={2}>
            { 
            loginError && 
            <Label>
              {loginError}
            </Label>
            }
            <TextField
              fullWidth
              type="password"
              mt={5}
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
              disabled={isSubmitting}
              name="confirmPassword"
              mt={5}
              label="Confirm Passwords"
              {...getFieldProps('confirmPassword')}
              error={errors.confirmPassword != undefined}
              helperText={errors.confirmPassword}
            />
          </Stack>
          <Stack direction="row"  width='100%' alignItems="end" justifyContent="end" sx={{ my: 2 }}>
            { !isSubmitting && <Link component={RouterLink} ml={2} variant="subtitle2" to="/login" underline="hover">
              Go to Login
            </Link>}
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={() => login()}>
            Reset Password
          </LoadingButton>
      </FormikProvider>
  )
}
