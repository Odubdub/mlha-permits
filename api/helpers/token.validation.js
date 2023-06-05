const axios = require('axios');

// get bearer token from headers
const authorizeWithIAM = (req, res, next) => {

    console.log('authorize')
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      
      var config = {
        method: 'post',
        url: `https://gateway-cus-acc.gov.bw/auth/validate-token?token=${bearerToken}`,
        headers: { }
      };
      
      axios(config)
      .then(function (response) {
        console.log('Valid Token - Submission Accepted')
        console.log(response.data)
        next()
      })
      .catch(function (error) {
        console.log('error validating token');
        console.log('Invalid Token - Submission Rejected')
        res.status(401).json({ message: 'Unauthorized' })
        console.log(error);
      });
    } else {
      console.log('No Token Provided - Submission Rejected')
      res.status(401).json({ message: 'Unauthorized' })
    }
  }

  // get bearer token from headers
const validateKeycloakToken = (token, onComplete, onError) => {
  var config = {
    method: 'post',
    url: `https://gateway-cus-acc.gov.bw/auth/validate-token?token=${token}`,
    headers: {}
  }

  axios(config)
    .then((response) => {
      console.log('Valid Token - Open doors for this man! ...or woman')
      onComplete(response.data)
    })
    .catch((error) => {
      console.log(error)
      onError(error)
    })
}


  module.exports = { authorizeWithIAM, validateKeycloakToken }