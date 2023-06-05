import axios from 'axios';
import { customerGatewayHost } from 'src/ApiService';

let tokenRefreshInterval;
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh';
const TOKEN_REFRESH_INTERVAL = 5000;
const TOKEN_REFRESH_THRESHOLD = 120000; // 2 minutes in milliseconds

// function to check if the token is valid
const isTokenValid = (token) => {
  // parse the token and check if it's expired
  const { exp } = JSON.parse(atob(token.split('.')[1]));
  return Date.now() < exp * 1000;
};

// function to refresh the token
const refreshToken = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (token && isTokenValid(token)) {
    // check if the token has less than 2 minutes left before expiry
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    if (exp * 1000 - Date.now() < TOKEN_REFRESH_THRESHOLD) {
      // make an API call to refresh the token

      try {
        var config = {
          method: 'post',
          url: `${customerGatewayHost}auth/refresh-token?token=` + refreshToken,
          headers: {}
        };

        const response = await axios(config);

        // if the token is successfully refreshed, update the expiry time
        localStorage.setItem(TOKEN_KEY, response.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
      } catch (error) {
        removeTokensFromLocalStorage();
      }
    }
  } else {
    // clear the token from local storage
    removeTokensFromLocalStorage();
    // redirect to the login page
  }
};

// function to reset the token refresh interval
const resetTokenRefreshInterval = () => {
  clearInterval(tokenRefreshInterval);
  tokenRefreshInterval = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
};

// function to handle user interaction
const handleUserInteraction = () => {
  resetTokenRefreshInterval();
};

export const initializeAuthInteractionListeners = ({ onLogout }) => {
  // add event listeners to detect user interaction
  document.addEventListener('click', handleUserInteraction);
  document.addEventListener('mousemove', handleUserInteraction);
  document.addEventListener('keydown', handleUserInteraction);

  // check if the token is valid on page load
  window.addEventListener('load', () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && isTokenValid(token)) {
      resetTokenRefreshInterval();
    } else {
      removeTokensFromLocalStorage();
      // redirect to the login page
    }
  });
};

// persist the token in local storage after login
export const persistToken = (response) => {
  localStorage.setItem(TOKEN_KEY, response.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
};

export const logout = async () => {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  try {
    var data = JSON.stringify({
      accessToken,
      refreshToken
    });

    var config = {
      method: 'post',
      url: `${customerGatewayHost}auth/logout`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    await axios(config);
    removeTokensFromLocalStorage();
  } catch (error) {
    console.log(error);
  }
};

export const loginSms = ({ username, password }) => {
  return axios({
    method: 'post',
    url: `${customerGatewayHost}auth/login/sms`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      username: username,
      password: password
    }
  });
};

export const loginEmail = ({ username, password }) => {
  return axios({
    method: 'post',
    url: `${customerGatewayHost}auth/login`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      username: username,
      password: password
    }
  });
};

export const validateOtp = ({ username, otp }) => {
  return axios({
    method: 'post',
    url: `${customerGatewayHost}auth/validate/otp`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      username,
      otp
    })
  });
};

const removeTokensFromLocalStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
