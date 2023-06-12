import { useContext, useRef, useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  Button,
  InputAdornment,
  Chip
} from '@mui/material';
import axios from 'axios';
import Iconify from 'src/components/Iconify';
import { gatewayHost, getFromServer, postDataLogin, postToServer } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import AuthCode from 'react-auth-code-input';
import './input.css';
import jwtDecode from 'jwt-decode';
import { getAuthParams, updateToken } from './AuthService';
import lodash from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const roles = ['admin', 'user', 'guest'];

export default function KeycloakLoginForm({ onInitialized }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { _, setUserData } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const AuthInputRef = useRef();

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

      var payload = JSON.stringify({
        username: data.username,
        otp: str
      });

      var config = {
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
          postToServer({
            path: 'access-control/auth/login-with-token',
            params: {
              token: token
            },
            onComplete: (data) => {
              setLoginError(null);
              updateToken(data.token, data.expires, data._id);
              getUser();
            },
            onError: (error) => {
              setIsSubmitting(false);
              setLoginError(((error.response || {}).data || {}).message || 'Authentication Error');
            }
          });
        })
        .catch((error) => {
          console.log(error);
          setLoginError(((error.response || {}).data || {}).message || 'Authentication Error');
        });
    }
  };

  const getUser = () => {
    const params = getAuthParams();
    getFromServer({
      path: `authority/admin-users/${params.id}`,
      onComplete: (data) => {
        const decoded = jwtDecode(getAuthParams().token);
        const uData = { ...decoded, ...data };
        const userServiceIDs = lodash.uniq(uData.roles.map((role) => role.service));
        getFromServer({
          path: 'authority/services',
          onComplete: (srvcs) => {
            const userServices = srvcs.filter((srvc) => userServiceIDs.includes(srvc._id));
            onInitialized();

            // setServices(userServices)
            // setSubmitting(false)
            setUserData({ ...uData, services: userServices });
            navigate('/work', { replace: true });
          },
          onError: (err) => {
            onInitialized();
            console.log(err);
          }
        });
      },
      onError: (error) => {
        setLoginError(null);
        onInitialized();
        console.log(error);
      }
    });
  };

  const checkUser = () => {
    setLoginError(null);
    if (validate()) {
      setIsSubmitting(true);
      postToServer({
        path: `access-control/auth/check-user`,
        params: {
          password: data.password,
          idNumber: data.username
        },
        onComplete: (data) => {
          if (data == 'Success') {
            login(data.username);
          } else if (Object.prototype.toString.call(data) === '[object Object]') {
            updateToken(data.token, data.expires, data._id);
            getUser();
          }
        },
        onError: (error) => {
          setLoginError(((error.response || {}).data || {}).message);
          setIsSubmitting(false);
        }
      });
    }
  };

  const validate = () => {
    const errs = {};

    if ((data.password || '').trim().length == 0) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length == 0;
  };

  const login = async () => {
    setLoginError(null);
    const { username, password } = data;

    var config = {
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
      .catch((error) => {
        setLoginError('Invalid username or password');
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Stack spacing={3} alignItems="center" minWidth={280}>
      {loginError && <Chip label={loginError} sx={{ bgcolor: 'red', color: '#fff' }} />}
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
            A message with an OTP has been sent to you mobile. Enter the code to login
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
            disabled={isSubmitting}
            label="OneGov ID"
            name="username"
            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
            value={data.username || ''}
            error={errors.username != undefined}
            helperText={errors.username || 'Enter a valid 1Gov ID Number'}
          />

          <TextField
            fullWidth
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
            onClick={checkUser}
          >
            Sign in with 1Gov
          </LoadingButton>
        </>
      )}
    </Stack>
  );
}
