import {
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  Button,
  FormControl,
  InputAdornment,
  Chip
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { gatewayHost, postToServer } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import { getAuthParams, updateToken } from './AuthService';
import axios from 'axios';
import AuthCode from 'react-auth-code-input';
import './input.css';
import Iconify from 'src/bundle/Iconify';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const roles = ['admin', 'user', 'guest'];

export default function KeycloakLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const AuthInputRef = useRef();

  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const clearLogin = () => {
    AuthInputRef.current.clear();
    setCode('');
    setShowCode(false);
    setIsSubmitting(false);
  };

  const updateCode = (str) => {
    setCode(str);
    if (str.length == 6) {
      setIsSubmitting(true);

      let payload = JSON.stringify({
        username: data.username,
        otp: str
      });

      let config = {
        method: 'post',
        url: `${gatewayHost}auth/validate/otp`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      };

      axios(config)
        .then((response) => {
          const token = response.data.access_token;
          //KC-login
          setIsSubmitting(false);
          updateToken(token);

          const decoded = jwt_decode(token);
          setUserData(decoded);
        })
        .catch((error) => {
          console.log(error);
          setIsSubmitting(false);
        });
    }
  };

  const validate = () => {
    const errs = {};

    if (![9, 11].includes(data.username.length)) {
      errs.username = 'Invalid Username';
    }

    if ((data.password || '').trim().length == 0) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length == 0;
  };

  const login = async () => {
    setLoginError(null);
    if (validate()) {
      const { username, password } = data;

      let config = {
        method: 'post',
        url: `${gatewayHost}auth/login/sms`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: username,
          password: password
        }
      };

      axios(config)
        .then((_) => {
          setShowCode(true);
          setIsSubmitting(false);
        })
        .catch((_error) => {
          setLoginError('Invalid username or password');
          setIsSubmitting(false);
        });
    }
  };

  useEffect(() => {
    const params = getAuthParams();
    if (params) {
      const decoded = jwt_decode(params);
      setUserData(decoded);
      navigate('/dashboard');
    }
  }, []);

  return (
    <Stack spacing={3} alignItems="center">
      {loginError && <Chip label={loginError} sx={{ bgcolor: 'error.main', color: '#fff' }} />}
      {showCode ? (
        <>
          <Box sx={{ pb: 4 }} className="container">
            <AuthCode
              ref={AuthInputRef}
              allowedCharacters="numeric"
              length={6}
              disabled={isSubmitting}
              placeholder="・"
              inputClassName="input"
              onChange={updateCode}
            />
          </Box>
          <Typography width="100%" px={4} color="grey" textAlign="center">
            A message with an OTP has been sent to your mobile. Enter the code to login.
          </Typography>
          <Typography width="100%" px={4} color="grey" textAlign="center">
            <Button onClick={clearLogin}>Click here</Button>to go back to login.
          </Typography>
        </>
      ) : (
        <FormControl>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            disabled={isSubmitting}
            label="OneGov ID"
            name="username"
            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
            value={data.username || ''}
            error={errors.username != undefined}
            helperText={errors.username || 'Enter a valid 1Gov Username'}
          />

          <TextField
            fullWidth
            sx={{ mt: 1 }}
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
            name="password"
            disabled={isSubmitting}
            label="Password"
            value={data.password || ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={errors.password != undefined}
            helperText={errors.password || 'Enter a valid password'}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loadingPosition="end"
            loading={isSubmitting}
            endIcon={<Iconify icon="akar-icons:arrow-right" />}
            onClick={login}
          >
            Sign in with 1Gov
          </LoadingButton>
        </FormControl>
      )}
    </Stack>
  );
}
