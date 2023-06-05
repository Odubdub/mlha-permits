const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../../models/access/User');
const Service = require('../../../models/authority/service.model');
const Ministry = require('../../../models/authority/ministry.model');
const Department = require('../../../models/authority/department.model');
const ServiceConfig = require('../../../models/authority/service-config.model');
const sendregistrationTokenEmail = require('../../../config/nodemailer.config');
const { minioClient } = require('../../../helpers/crm-file-downloader.helper');
const { newSystemLogin, fetchUserFromIAM } = require('../../../helpers/crm-status.helper');

const servicesConfigRouter = express.Router();

const capitalise = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const createMinistry = (ministryPayload, callback) => {
  Ministry.findOne({ code: ministryPayload.code }, (err, ministryDoc) => {
    if (err) return callback(err);

    if (ministryDoc) {
      callback(null, ministryDoc);
    } else {
      Ministry.create(ministryPayload, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      });
    }
  });
};

const createDepartment = (departmentPayload, callback) => {
  Department.findOne({ code: departmentPayload.code }, (err, departmentDoc) => {
    if (err) return callback(err);

    if (departmentDoc) {
      callback(null, departmentDoc);
    } else {
      Department.create(departmentPayload, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      });
    }
  });
};

const createService = (servicePayload, callback) => {
  Service.findOne({ code: servicePayload.code }, (err, serviceDoc) => {
    if (err) return callback(err);

    if (serviceDoc) {
      callback(null, serviceDoc);
    } else {
      Service.create(servicePayload, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      });
    }
  });
};

const createAdminUser = (userPayload, callback) => {
  const {
    type,
    email,
    roles,
    idNumber,
    designation,
    departmentId,
    lastName,
    foreNames
  } = userPayload;

  User.findOne({ idNumber }, (err, user) => {
    if (err) return callback(err);

    if (user) {
      callback(null, user);
    } else {
      // create confirmation token
      const token = jwt.sign({
        idNumber
      }, process.env.APP_SECRET, {
        expiresIn: '24h'
      });

      const userDoc = new User({
        type,
        roles,
        email,
        idNumber,
        lastName,
        foreNames,
        designation,
        idType: "omang",
        signature: null,
        hasSignature: false,
        status: 'Active',
        registrationToken: token,
        department: departmentId
      });

      userDoc.save((err, result) => {
        if (err) return callback(err);

        // sendregistrationTokenEmail(email, 'Admin User', token);
        callback(null, result);
      });
    }
  });
};

servicesConfigRouter.route('/')
  .get((req, res, next) => {
    ServiceConfig.find({}, {_id: 1, code: 1, registry: 1, shortName: 1, version: 1})
    .exec((err, servicesConfig) => {
      if (err) return next(err);
      res.json(servicesConfig);
    });
  })
  .post(async (req, res, next) => {
    // console.log(req.body);

    let verifiedSuperUser 
    //Check if payload contains superadmin metadata
    if (req.body.superAdminIdNo && req.body.superAdminIdNo != null) {
      const systemToken = await newSystemLogin();
      const idNumber = req.body.superAdminIdNo
      const userInCRM = await fetchUserFromIAM(idNumber, systemToken.access_token);
      
      const user = await User.findOne({ idNumber });
      
      if (userInCRM && !user) {

        verifiedSuperUser = {
          email: req.body.superAdminEmail,
          idNumber: req.body.superAdminIdNo,
          roles: [],
          designation: 'Super Admin',
          type: "superadmin",
          idType: "omang",
          signature: null,
          hasSignature: false,
          registrationToken: null,
          lastName: userInCRM.lastname,
          foreNames: userInCRM.firstname,
          phoneNumber: userInCRM.phone_number
        }
      } else if (!userInCRM) {
        console.log('user not in CRM...')
        return res.status(402).send({ message:'User does not exist in IAM' });
      } else if (user){
        console.log('user exista in system...')
        return res.status(402).send({ message:'This user already has access to this system' });
      }
    }

    console.log(verifiedSuperUser)
    const ministry = {
      description: "",
      name: req.body.ministry,
      code: req.body.ministryCode
    }

    // create a ministry
    createMinistry(ministry, (err, ministry) => {
      if (err) return next(err);

      const department = {
        description: "",
        ministry: ministry._id,
        name: req.body.departmentName,
        code: req.body.departmentCode
      }

      // create a department
      createDepartment(department, (err, department) => {
        if (err) return next(err);
        // console.log(req.body);

        if (verifiedSuperUser) {
          
          const adminUser = {
            ...verifiedSuperUser,
            departmentId: department._id
          };

          //Create Super Admin
          createAdminUser(adminUser, (err, user) => {
            if (err) return next(err);
            console.log(user);
          });
        }

        //Create Bucket
        const bucketName = department._id.toString()
        minioClient.bucketExists(bucketName, (error, exists) => {
          if(error) {
              return console.log(error);
          }
      
          if (!exists){
            minioClient.makeBucket(bucketName, (err)=> {
              if (err) return next(err);
              console.log('created department bucket ', bucketName)
            })
          }
        });

        const service = {
          description: "",
          code: req.body.code,
          version: req.body.version,
          department: department._id,
          name: req.body.serviceName,
          displayName: req.body.shortName,
          registryRef: req.body.registryId,
          issuanceFee: req.body.issuanceFee,
          applicationFee: req.body.applicationFee,
    
          reviewProcess: {
            name: `${req.body.shortName.replace(/\s/g, '_').toUpperCase()}_REVIEW_PROCESS`,
            description: 'This review is conducted by the department outlining the process flow to review the application',
            steps: req.body.reviewProcessSteps.map((step, i) => {
              const stepObj = {
                stage: i + 1,
                required: true,
                type: step.type,
                actorType: step.actorType,
                name: capitalise(step.type.replace(/-/g, ' ').toLowerCase()),
                description: capitalise(step.type.replace(/-/g, ' ').toLowerCase()),
                feedback: {
                  positive: {
                    verb: step.feedback.positive,
                    caption: step.feedback.positive
                  },
                  negative: {
                    verb: step.feedback.negative,
                    caption: step.feedback.negative
                  }
                }
              };
    
              return stepObj;
            })
          }
        }

        // create a service
        createService(service, (err, service) => {
          if (err) return next(err);

          const serviceConfigPayload = req.body;

          // create a service config if it doesn't exist
          ServiceConfig.findOne({ code: serviceConfigPayload.code }, (err, serviceConfigDoc) => {
            if (err) return next(err);

            if (serviceConfigDoc) {
              res.json(serviceConfigDoc);
            } else {
              ServiceConfig.create(serviceConfigPayload, (err, result) => {
                if (err) return next(err);
                res.json(result);
              });
            }
          });
        });
      });
    });
  });

  servicesConfigRouter.route('/renderer/:id')
  .patch((req, res, next) => {

    const renderer = req.body;

    ServiceConfig.findByIdAndUpdate(req.params.id,
      { renderer, reviewProcessSteps: renderer.reviewProcessSteps }, { new: true }, (err, serviceConfig) => {
        if (err) return next(err);
        if (serviceConfig.code){
  
          //Update Service Steps
          const reviewProcess = {
            name: `${serviceConfig.shortName.replace(/\s/g, '_').toUpperCase()}_REVIEW_PROCESS`,
            description: 'This review is conducted by the department outlining the process flow to review the application',
            steps: serviceConfig.reviewProcessSteps.map((step, i) => {
              const stepObj = {
                stage: i + 1,
                required: true,
                type: step.type,
                actorType: step.actorType,
                name: capitalise(step.type.replace(/-/g, ' ').toLowerCase()),
                description: capitalise(step.type.replace(/-/g, ' ').toLowerCase()),
                feedback: {
                  positive: {
                    verb: step.feedback.positive,
                    caption: step.feedback.positive
                  },
                  negative: {
                    verb: step.feedback.negative,
                    caption: step.feedback.negative
                  }
                }
              };
    
              return stepObj;
            })
          }
  
          Service.findOneAndUpdate({
            code: serviceConfig.code
          }, { reviewProcess }, { new: true}, (err, service) => {
            if (err) return next(err);
            res.status(200).send(`Successfully updated service config for ${service.reviewProcess.steps.length}`);
          })
      }
    });
});

servicesConfigRouter.route('/issuance/:id')
  .patch((req, res, next) => {

    const issuance = req.body;

    ServiceConfig.findByIdAndUpdate(req.params.id,
      { issuance }, { new: true }, (err, serviceConfig) => {
        if (err) return next(err);
        res.status(200).send(`Successfully updated service config for ${serviceConfig.renderer.name}`);
    });
});

  servicesConfigRouter.route('/root-config/:id')
  .patch((req, res, next) => {

    const update = {
      ...req.body,
      "renderer.applicationFee": req.body.applicationFee,
      "renderer.issuanceFee": req.body.issuanceFee,
    }

    delete update.form
    delete update.profile
    delete update.registry
    delete update.renderer
    delete update.issuance
    delete update.reviewProcessSteps
    delete update.createdAt
    delete update.updatedAt
    delete update._id
    delete update.version
    delete update.code
    delete update._v

    ServiceConfig.findByIdAndUpdate(req.params.id,
      update, {
        new: true
      }, (err, serviceConfig) => {
        if (err) return next(err);
        res.status(200).send('Successfully updated service config');
    });
});

servicesConfigRouter.route('/:code/:version')
  .get((req, res, next) => {
    ServiceConfig.findOne({ code: req.params.code, version: req.params.version })
    .exec((err, serviceConfig) => {
      if (err) return next(err);
      res.json(serviceConfig);
    });
  });

servicesConfigRouter.route('/:code/:version')
.get((req, res, next) => {
  ServiceConfig.findOne({ code: req.params.code, version: req.params.version })
  .exec((err, serviceConfig) => {
    if (err) return next(err);
    res.json(serviceConfig);
  });
});

servicesConfigRouter.route('/form/:id')
.patch((req, res, next) => {
  const form = req.body;
  ServiceConfig.findByIdAndUpdate(req.params.id, {form})
  .then((result) => {
    res.status(200).send('Successful form update');
  })
  .catch((err) => {
    next(err)
  })
});

// servicesConfigRouter.route('/renderer/:id')
// .patch((req, res, next) => {
//   const renderer = req.body;
//   ServiceConfig.findByIdAndUpdate(req.params.id, {renderer})
//   .then((result) => {
//     res.status(200).send('Successful renderer update');
//   })
//   .catch((err) => {
//     next(err)
//   })
// });

module.exports = servicesConfigRouter;
