const jwt = require('jsonwebtoken');
const User = require('../../../models/access/User');
const adminUsersRouter = require('express').Router();

const {
  verifySuperAdmin,
  verifyOrdinaryUser,
  verifyRegistrationToken } = require('../../../middleware/authorisation');
  
const Department = require('../../../models/authority/department.model');
const { fetchUserFromIAM, newSystemLogin } = require('../../../helpers/crm-status.helper');
const { default: mongoose } = require('mongoose');

adminUsersRouter.route('/')
  .get(verifyOrdinaryUser, (req, res, next) => {
    console.log(req.decoded)
    if (req.decoded.type == 'developer'){

      User.find({},{ signature: 0, hashed_password: 0, salt: 0, registrationToken: 0 }).exec((err, users) => {
        if (err) return next(err);
        res.json(users);
      });
    } else {

      User.find({ department: mongoose.Types.ObjectId(req.decoded.department), type: 'admin' },{ signature: 0, hashed_password: 0, salt: 0, registrationToken: 0 }).exec((err, users) => {
        if (err) return next(err);
        res.json(users);
      });
    }
  })
  .post(async (req, res, next) => {
    const { email, idNumber, type, department, roles, designation, signature, hasSignature } = req.body;

    if (!email || !idNumber) {
      const err = new Error('Please enter required fields');
      err.status = 400;
      return next(err);
    }

    // #################################################################################
    const systemToken = await newSystemLogin();

    const userInCRM = await fetchUserFromIAM(idNumber, systemToken.access_token);

    console.log(userInCRM)
    if (!userInCRM) {
      const err = new Error('User not found in IAM');
      err.status = 400;
      return next(err);
    }
    // #################################################################################

    User.findOne({ idNumber }, (err, existingUser) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        return next(err);
      }

      const user = new User({
        type,
        roles,
        email,
        idNumber,
        signature,
        department,
        designation,
        idType: "omang",
        registrationToken: null,
        hasSignature: signature != undefined,
        status: 'Active',
        registrationToken: null,
        lastName: userInCRM.lastname,
        foreNames: userInCRM.firstname,
        phoneNumber: userInCRM.phone_number
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }

        // sendregistrationTokenEmail(email, 'Admin User', token);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Added user ${user.email}`);
      });
    });
  });

  adminUsersRouter.route('/get-by-identity/:idNumber')
  .get((req, res, next) => {
    User.findOne({ idNumber: req.params.idNumber }, { signature: 1}).exec((err, user) => {
      if (err) return next(err);
      res.json(user);
    });
  })

  adminUsersRouter.route('/set-signature/:idNumber')
  .post((req, res, next) => {
    User.findOneAndUpdate({ idNumber: req.params.idNumber }, { signature: req.body.signature, hasSignature: true}, { new: true }).exec((err, user) => {
      if (err) return next(err);
      res.json(user);
    });
  })

// get user by confirmation code
adminUsersRouter.route('/complete-registration')
  .get(verifyRegistrationToken, (req, res, next) => {
    const { idNumber } = req.userDetails;

    // console.log('Id Number', idNumber);

    User.findOne({ idNumber }, (err, user) => {
      if (err) return next(err);
      const userRes = {
        _id: user._id,
        type: user.type,
        roles: user.roles,
        email: user.email,
        idType: user.idType,
        status: user.status,
        idNumber: user.idNumber,
        department: user.department,
        designation: user.designation,
        
      }
      res.json(userRes);
    });
  })
  .post(verifyRegistrationToken, (req, res, next) => {
    const { idNumber } = req.userDetails;
    const { foreNames, lastName, password } = req.body;

    if (!foreNames || !lastName || !password) {
      const err = new Error('Please enter required fields');
      err.status = 400;
      return next(err);
    }

    if (password.length < 8) {
      const err = new Error('Password must be at least 8 characters long');
      err.status = 400;
      return next(err);
    }

    // find and update user
    User.findOneAndUpdate({ idNumber }, {
      $set: {
        foreNames,
        lastName
      }
    }, {
      new: true
    }, (err, user) => {
      if (err) return next(err);

      user.activate();
      user.setPassword(password);

      user.save((err) => {
        if (err) return next(err);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Updated user ${user.email}`);
      });
    });
  });

adminUsersRouter.route('/:id')
  .get((req, res, next) => {
    User.findById(req.params.id, {signature: 0, hashed_password: 0, salt: 0, registrationToken: 0})
      .populate({
        path: 'roles',
        select: ['name', 'service', 'department', 'permissions']
      })
      .populate({
        path: 'department',
        select: ['code', 'name'],
        populate: {
          path: 'ministry',
          select: ['code', 'name'],
        }
      })
      .exec((err, user) => {
        if (err) return next(err);
        res.json(user);
      });
  })
  .put((req, res, next) => {
    User.findById(req.params.id, (err, user) => {
      if (err) return next(err);

      const { roles, designation, signature } = req.body;

      if (!roles || !designation) {
        const err = new Error('Please enter required fields');
        err.status = 400;
        return next(err);
      }

      user.roles = roles;
      user.designation = designation;

      if (signature != undefined) {
        user.hasSignature = true;
        user.signature = signature;
      }

      user.save((err) => {
        if (err) return next(err);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Updated user ${user.email}`);
      });
    })
  });

adminUsersRouter.route('/dept-admin')
  .post(async (req, res, next) => {
    const {
      type,
      email,
      roles,
      idNumber,
      designation,
      departmentCode } = req.body;

    if (!email || !type || !idNumber || !departmentCode || !roles || !designation) {
      const err = new Error('Please enter required fields');
      err.status = 400;
      return next(err);
    }

    // #################################################################################
    const systemToken = await newSystemLogin();

    const userInCRM = await fetchUserFromIAM(idNumber, systemToken.access_token);

    if (!userInCRM) {
      const err = new Error('User not found in IAM');
      err.status = 400;
      return next(err);
    }
    // #################################################################################

    const department = await Department.findOne({ code: departmentCode });

    if (!department) {
      const err = new Error('Department does not exist');
      err.status = 400;
      return next(err);
    }    

    User.findOne({ idNumber }, (err, existingUser) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        return next(err);
      }

      // create confirmation token
      // const token = jwt.sign({
      //   idNumber
      // }, process.env.APP_SECRET, {
      //   expiresIn: '24h'
      // });

      const user = new User({
        type,
        roles,
        email,
        idNumber,
        designation,
        idType: "omang",
        signature: null,
        hasSignature: false,
        registrationToken: null,
        department: department._id
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }

        // sendregistrationTokenEmail(email, 'Admin User', token);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Added user ${user.email}`);
      });
    });
  });

adminUsersRouter.route('/bulk-upload')
  .post(verifyOrdinaryUser, verifySuperAdmin, async (req, res, next) => {
    const { users } = req.body;

    // obtain system token
    const systemToken = await newSystemLogin();

    const superAdminUser = await User.findById(req.decoded._id, {
      salt: 0,
      signature: 0,
      hashed_password: 0,
      registrationToken: 0
    }).exec();

    const addedUsers = [];
    const failedUsers = [];

    Promise.all(users.map(async (userObj) => {
      const { email, idNumber, designation } = userObj;

      const localUser = await User.findOne({ idNumber });
      if (localUser) {
        failedUsers.push({
          email,
          idNumber,
          designation,
          reason: 'User already has system access'
        });
        return;
      }

      // check if user exists in crm
      const userInCRM = await fetchUserFromIAM(idNumber, systemToken.access_token);

      if (!userInCRM) {
        failedUsers.push({
          email,
          idNumber,
          designation,
          reason: 'User does not exist in CRM'
        });
        return;
      }

      if (!email || !idNumber || !designation) {
        failedUsers.push({
          email,
          idNumber,
          designation,
          reason: 'Some user details are missing'
        });
        return;
      }

      const user = new User({
        email,
        idNumber,
        roles: [],
        designation,
        type: "admin",
        idType: "omang",
        signature: null,
        status: 'Active',
        hasSignature: false,
        registrationToken: null,
        lastName: userInCRM.lastname,
        foreNames: userInCRM.firstname,
        phoneNumber: userInCRM.phone_number,
        department: superAdminUser.department
      });

      try {
        await user.save();
        addedUsers.push(userObj);
      } catch (err) {
        failedUsers.push(userObj);
      }
    }))
      .then(() => {
        res.status(200).json({
          addedUsers,
          failedUsers,
          message: 'Bulk upload successful!'
        });
      })
      .catch((err) => {
        next(err);
      });
  });

  adminUsersRouter.route('/switch-department')
  .patch(async (req, res, next) => {

    const { idNumber, code } = req.body

    const department = await Department.findOne({code})

    if (!department) return next(Error('department does not exist in system'))

    const admin = await User.findOne({ idNumber })

    if (!admin) return next(Error('user does not exist in system'))

    admin.department = department._id

    try {
      await admin.save();
      res.status(200).send('Done')
    } catch (err) {
      res.status(500).send('An error occurred')
    }
  })

module.exports = adminUsersRouter;