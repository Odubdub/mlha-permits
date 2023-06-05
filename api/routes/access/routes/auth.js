const express = require('express');
const passport = require('passport');
const authenticationRouter = express.Router();
const User = require('../../../models/access/User');
const { getToken, verifyOrdinaryUser } = require('../../../middleware/authorisation');
const { newSystemLogin, fetchUserFromIAM } = require('../../../helpers/crm-status.helper');
const { validateKeycloakToken } = require('../../../helpers/token.validation');
const { uniqueId } = require('lodash')
const { randomUUID } = require('crypto')

authenticationRouter.route('/register')
  .post((req, res, next) => {
    const { email, idNumber, idType, password, role, designation, registrationToken } = req.body;

    if (!email || !idNumber || !idType || !password) {
      const err = new Error('Please enter required fields');
      err.status = 400;
      return next(err);
    }

    if (password.length < 8) {
      const err = new Error('Password must be at least 8 characters long');
      err.status = 400;
      return next(err);
    }

    User.findOne({ idNumber }, (err, existingUser) => {
      if (err) {
        return next(err);
      }

      if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        return next(err);
      }

      const user = new User({
        role,
        email,
        idType,
        idNumber,
        designation,
        registrationToken,
        superAdmin: false
      });

      user.setPassword(password);

      user.save((err) => {
        if (err) {
          return next(err);
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Added user ${user.email}`);
      });
    });
  });

authenticationRouter.route('/login')
  .post(async (req, res, next) => {
    /*******/
    const systemToken = await newSystemLogin();
    const userInCRM = await fetchUserFromIAM("111191111", systemToken.access_token);
    
    console.log('userExistsInCRM: ', userInCRM);
    /*******/

    passport.authenticate('local', (err, user, info) => {
      
      if (err) return next(err);

      if (!user) return res.status(401).json(info);

      req.logIn(user, (err) => {
        // console.log(err);
        if (err) return res.status(500).json({
          err: "Could not log in user"
        });

        const token = getToken({
          _id: user._id,
          type: user.type,
          email: user.email,
          roles: user.roles,
          idType: user.idType,
          lastName: user.lastName,
          idNumber: user.idNumber,
          foreNames: user.foreNames,
          department: user.department
        });

        return res.status(200).json({
          token,
          _id: user._id,
          success: true,
          status: 'Login successful!',
          expires: new Date(Date.now() + 90*24*60*60*1000)
        });
        
      });
    })(req, res, next);
  });

authenticationRouter.route('/logout')
  .post((req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);

      req.session.destroy();

      return res.status(200).json({
        message: 'Logout successful!'
      });
    });
  });

authenticationRouter.route('/confirm')
  .post((req, res, next) => {
    const { idNumber, registrationToken } = req.body;
    User.findOne({ idNumber }, (err, user) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({
        err: "User not found"
      });
      if (user.registrationToken !== registrationToken) return res.status(401).json({
        err: "Invalid confirmation code"
      });
      user.registrationToken = null;
      user.save((err) => {
        if (err) return next(err);
        return res.status(200).json({
          message: "Confirmation successful"
        });
      });
    });
  });

authenticationRouter.route('/create-password')
  .post((req, res, next) => {
    const { idNumber, password } = req.body;
    User.findOne({ idNumber }, (err, user) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({
        err: "User not found"
      });
      user.setPassword(password);
      user.save((err) => {
        if (err) return next(err);
        return res.status(200).json({
          message: "Password created successfully"
        });
      });
    });
  });

authenticationRouter.route('/check-user')
.post((req, res, next) => {
  const idNumber = req.body.idNumber;
  
  User.findOne({ idNumber }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({
      message: "Authentication failed. Check your login credentials"
    });
    if (user){

      if (['developer'].includes(user.type) || ['602815618','734528219'].includes(user.idNumber)) {
        passport.authenticate('local', (err, user, info) => {
    
          if (err) return next(err);
    
          if (!user) return res.status(401).json(info);
    
          req.logIn(user, (err) => {
            // console.log(err);
            if (err) return res.status(500).json({
              err: "Could not log in user"
            });
    
            const token = getToken({
              _id: user._id,
              type: user.type,
              email: user.email,
              roles: user.roles,
              idType: user.idType,
              lastName: user.lastName,
              idNumber: user.idNumber,
              foreNames: user.foreNames,
              department: user.department,
              sessionId: randomUUID()
            });
    
            return res.status(200).json({
              token,
              _id: user._id,
              success: true,
              status: 'Login successful!',
              expires: new Date(Date.now() + 90*24*60*60*1000)
            });
          });
        })(req, res, next);
      } else {
        return res.status(200).send('Success');
      }
    }
  });
});

authenticationRouter.route('/login-with-token')
.post((req, res) => {

  validateKeycloakToken(req.body.token, async userData =>{

    const user = await User.findOne({idNumber: userData.username || userData.preferred_username})
    const token = getToken({
      _id: user._id,
      type: user.type,
      email: user.email,
      roles: user.roles,
      idType: user.idType,
      lastName: user.lastName,
      idNumber: user.idNumber,
      foreNames: user.foreNames,
      department: user.department,
      sessionId: randomUUID()
    });

    return res.status(200).json({
      token,
      _id: user._id,
      success: true,
      status: 'Login successful!',
      expires: new Date(Date.now() + 90*24*60*60*1000)
    });
  }, err=> {
    res.status(400).send(err)
  })
});

authenticationRouter.route('/me')
  .get(verifyOrdinaryUser, (req, res, next) => {
    if (!req.user) {
      const err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }

    return res.status(200).json({
      email: req.user.email,
      idNumber: req.user.idNumber,
      idType: req.user.idType,
      role: req.user.role
    });
  });

module.exports = authenticationRouter;
