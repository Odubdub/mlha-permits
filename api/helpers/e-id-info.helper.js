const fetch = require('node-fetch');

const fethOmangFromEID = async (omangId) => {
  
  const headers = {
    'Content-Type': 'application/json',
    [process.env.APP_OMANG_API_KEY]: process.env.APP_OMANG_API_VALUE
  };

  const url = `${process.env.APP_OMANG_API_HOST_URL}/${omangId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  const data = await response.json();
  return data;
}

module.exports = fethOmangFromEID;