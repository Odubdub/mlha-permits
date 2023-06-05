const jwt = require('jsonwebtoken');
const config = require('../config/config');

const getToken = (user) => {
  return jwt.sign(user, config.secret, {
    expiresIn: 90*24*60*60
  });
}

const verifyOrdinaryUser = (req, res, next) => {
  let token;

  // get bearer token
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    var bearerToken = bearer[1];
    token = bearerToken;
  }

  // decode token
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    const err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
}

const getOrdinaryUser = (req) => {
  let token;

  let status = 402;
  // get bearer token
  if (req.headers){

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
      var bearer = bearerHeader.split(' ');
      var bearerToken = bearer[1];
      token = bearerToken;
    }
  
    // decode token
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          status = 401;
          return 'unauthorized';
        } else {
          return decoded;
        }
      });
    } else {
      status = 403;
    }
  }
  return { message: 'unauthorized', status };
}

const verifyRegistrationToken = (req, res, next) => {
  const token = req.query.registrationToken;

  // decode token
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        const err = new Error('Invalid registration code');
        err.status = 401;
        return next(err);
      } else {
        const userDetails = {
          idNumber: decoded.idNumber
        };

        req.userDetails = userDetails;
        // req.decoded = decoded;
        next();
      }
    });
  } else {
    const err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
}

const verifySuperAdmin = (req, res, next) => {
  console.log(req.decoded);
  if (req.decoded.type == 'superadmin') {
    next();
  } else {
    const err = new Error('You are not authorised to perform this operation!');
    err.status = 403;
    return next(err);
  }
}

const verifyDeveloperAdmin = (req, res, next) => {
  if (req.decoded.type == 'developer') {
    next();
  } else {
    const err = new Error('You are not authorised to perform this operation!');
    err.status = 403;
    return next(err);
  }
}

const isLogin = (req) => {

  return '/access-control/auth' == req.baseUrl && req.method == 'POST'
}

module.exports = {
  getToken,
  getOrdinaryUser,
  verifySuperAdmin,
  verifyOrdinaryUser,
  verifyDeveloperAdmin,
  verifyRegistrationToken
}