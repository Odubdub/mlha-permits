import axios from 'axios';

export const url = 'http://3.19.47.78:3020/';
export const gatewayHost = 'https://gateway-cus-acc.gov.bw/';
export const customerGatewayHost = gatewayHost;

export const getRegistrations = async (path) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}${path}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const update = (path, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${url}${path}`, payload, { 'Content-Type': 'application/json' })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getService = async (path) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}${path}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const post = (path, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${url}${path}`, payload, { 'Content-Type': 'application/json' })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Helper function to replace all instances of a }{ with },{ from the response
export const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
};
