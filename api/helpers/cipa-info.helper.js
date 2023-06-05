const fetch = require('node-fetch');

const fetchCompanyFromCipa = async (companyId) => {
  // fetch headers
  const headers = {
    'Content-Type': 'application/json',
    [process.env.APP_CIPA_API_KEY]: process.env.APP_CIPA_API_VALUE
  };

  const url = `${process.env.APP_CIPA_API_HOST_URL}/${companyId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  const data = await response.json();
  return data;
}

module.exports = fetchCompanyFromCipa;