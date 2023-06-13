import axios from 'axios';
import { getAuthParams } from './pages/Auth/AuthService';

export const gatewayHost = 'https://gateway-cus-acc.gov.bw/';
export let storageHost = 'http://localhost:4444/';
// export let storageHost = 'https://reg-ui-acc.gov.bw:4080/';
// export const gatewayHost = 'https://serviceregistry.gov.bw/'
// export const gatewayHost = 'http://localhost:3005/'
// export const gatewayHost = 'http://192.168.1.145:3005/'

export const serviceRegistryHost = 'https://onegov-serviceregistry.gov.bw/';
export let url = process.env.REACT_APP_API_BASE_URL;

if (window.location.href.includes('http://localhost:')) {
  url = 'http://localhost:3000/';
  // console.log('inject development host')
  // url = 'http://168.167.72.223/';
  // url = 'https://uat.devsql.co.bw/api/';
  // } else {
  console.log('inject production host');
} else if (window.location.href.includes('https://')) {
  url = process.env.REACT_APP_API_BASE_URL;
}

const getHeaders = () => ({ headers: { authorization: `Bearer ${getAuthParams().token}` } });

// Export
// export const socket = io(url);
// // socket.on('connection', (m) => {
// //   console.log('connected to socket', m);
// // });

export const put = ({ path, params, onComplete, onError }) => {
  axios
    .put(url + path, params, getHeaders())
    .then((response) => {
      onComplete(response.data);
    })
    .catch((err) => {
      console.log('Error putting: ', err.message);
      onError(err);
    });
};

export const postToServer = ({ path, params, onComplete, onError }) => {
  axios
    .post(url + path, params, getHeaders())
    .then((response) => {
      onComplete(response.data);
      console.log(response);
    })
    .catch((err) => {
      onError(err);
    });
};

export const putInServer = ({ path, params, onComplete, onError }) => {
  axios
    .put(url + path, params, getHeaders())
    .then((response) => {
      onComplete(response.data);
    })
    .catch((err) => {
      onError(err);
    });
};

export const getFromServer = ({ path, params, onComplete, onError }) => {
  axios
    .get(url + path, getHeaders())
    .then((response) => {
      onComplete(response.data, response);
    })
    .catch((err) => {
      console.log('Error getting: ', err.message);
      onError(err);
    });
};

export const patch = ({ path, params, onComplete, onError }) => {
  axios
    .patch(url + path, params, getHeaders())
    .then((response) => {
      onComplete(response.data);
    })
    .catch((err) => {
      console.log('Error patching: ', err.message);
      onError(err);
    });
};

export const uploadFile = ({ path, data, onComplete, onError }) => {
  const config = { headers: { 'content-type': 'multipart/form-data', ...getHeaders().headers } };
  axios
    .post(url + path, data, config)
    .then((response) => {
      onComplete(response.data);
    })
    .catch((err) => {
      console.log('Error uploading: ', err.message);
      onError(err);
    });
};

// export const systemLogin = (onLoggedIn) => {

//   var data = JSON.stringify({
//       "username": "permits-admin",
//       "password": "W3g0!ng2D!3"
//     });

//     var config = {
//       method: 'post',
//       url: 'https://gateway-cus-acc.gov.bw/auth/login',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data : data
//     };

//     axios(config)
//     .then(response => {
//       onLoggedIn(response.data.access_token)
//     })
//     .catch(function (error) {
//       console.log('error getting token');
//       console.log(error);
//     });
// }
