import * as Yup from 'yup';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Button,
  Radio,
  FormLabel,
  CircularProgress
} from '@mui/material';
import { AuthContext } from 'src/AuthContext';
import './input.css';
import jwt_decode from 'jwt-decode';
import { getAuthParams, updateToken } from './AuthService';
import {
  loginEmail,
  loginSms,
  persistToken,
  validateOtp
} from './Interactivity';
import AuthCode from 'react-auth-code-input';
import Iconify from 'src/bundle/Iconify'

const email = 'email';
const sms = 'sms';

export default function LoginForm({onStartLoad, onStopLoad}) {
  const [showPassword, setShowPassword] = useState(false);
  const { userData, setUserData } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [isPreloading, setIsPreloading] = useState(true);

  const [otp, setOtp] = useState('');
  const [showCode, setShowCode] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username/Passport is required'),
    password: Yup.string().required('Password is required')
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      login(values);
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const [selectedMethod, setSelectedMethod] = useState(sms);

  const AuthInputRef = useRef();

  const updateCode = (str) => {
    const { username } = values;
    setOtp(str);
    if (str.length == 6) {
      setIsSubmitting(true);
      onStartLoad();

      validateOtp({
        username,
        otp: str
      })
        .then((response) => {

          setTimeout(() => {
            const token = response.data.access_token;
            updateToken(token);

            persistToken(response.data);

            const decoded = jwt_decode(token);
            setUser(decoded);
          },[1500])
          
        })
        .catch((error) => {
          setIsSubmitting(false);
          onStopLoad();
        });
    }
  };

  const setUser = (decoded) => {
    setUserData(decoded);
  };

  const login = async () => {
    setIsSubmitting(true);
    onStartLoad();
    setLoginError(null);
    const { username, password } = values;

    (selectedMethod == sms ? loginSms(values) : loginEmail(values))
      .then((response) => {
        setShowCode(true);
        setIsSubmitting(false);
        onStopLoad();
      })
      .catch(function (error) {
        setLoginError('Invalid username or password');
        setIsSubmitting(false);
        onStopLoad();
      });
  };

  const clearLogin = () => {
    AuthInputRef.current.clear();
    setOtp('');
    setShowCode(false);
    setIsSubmitting(false);
    onStopLoad();
  };

  useEffect(() => {
    const params = getAuthParams();
    if (params) {
      const decoded = jwt_decode(params);
      setUser(decoded);
    }
    setIsPreloading(false);
  }, []);

  return (
    <Stack mx={2}>
      {!isPreloading ? (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} mt={3}>
              {loginError && <Typography color="red">{loginError}</Typography>}
              {showCode ? (
                <>
                  <Typography width="100%" textAlign="center" fontWeight={800} mt={3}>
                    Enter OTP to login
                  </Typography>
                  <Stack alignItems="center">

                  <AuthCode
                    ref={AuthInputRef}
                    allowedCharacters="numeric"
                    length={6}
                    disabled={isSubmitting}
                    placeholder="・"
                    inputClassName="input"
                    onChange={updateCode}
                  />
                  </Stack>

                  <Typography width="100%" px={4} fontWeight={500} color="grey" textAlign="center">
                    {isSubmitting
                      ? 'Verifying OTP...'
                      : `The OTP was sent you via ${selectedMethod}`}
                  </Typography>
                  <Typography width="100%" px={4} color="grey" textAlign="center">
                    <Button onClick={clearLogin}>Click here</Button>to go back to login.
                  </Typography>
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    autoComplete="username"
                    type="text"
                    label="Username"
                    {...getFieldProps('username')}
                    error={Boolean(touched.username && errors.username)}
                    helperText={'Enter a valid 1Gov Username'}
                  />

                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    {...getFieldProps('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.password && errors.password)}
                    helperText={'Enter a valid password'}
                  />
                  <Stack direction="row" alignItems="center" sx={{ display: 'flex', gap: 2 }}>
                    <FormLabel>Send OTP Via: </FormLabel>
                    <Stack direction="row" alignItems="center">
                      <Radio
                        size="small"
                        checked={selectedMethod === sms}
                        onChange={() => setSelectedMethod(sms)}
                        value={'a'}
                      />
                      SMS
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <Radio
                        size="small"
                        checked={selectedMethod === email}
                        onChange={() => setSelectedMethod(email)}
                        value="b"
                      />
                      Email
                    </Stack>
                  </Stack>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loadingPosition="end"
                    endIcon={<Iconify icon="material-symbols:arrow-right-alt-rounded" />}
                    loading={isSubmitting}
                    onClick={() => login()}
                  >
                    Sign in with 1Gov
                  </LoadingButton>
                </>
              )}
            </Stack>
          </Form>
        </FormikProvider>
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
}
