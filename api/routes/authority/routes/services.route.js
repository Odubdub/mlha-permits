const express = require('express');
const rolesHelp = require('../../../factory/roles');
const Service = require('../../../models/authority/service.model');
const { verifyOrdinaryUser } = require('../../../middleware/authorisation');
const User = require('../../../models/access/User')
const ServiceConfig = require('../../../models/authority/service-config.model')
const lodash = require('lodash');
const servicesRouter = express.Router();

servicesRouter.route('/')
  .get((req, res, next) => {
    Service.find({}).exec((err, services) => {
      if (err) return next(err);
      res.json(services);
    });
  })
  .post((req, res, next) => {
    Service.findOne({ code: req.body.code }, (err, service) => {
      if (err) return next(err);
      
      if (service) {
        res.writeHead(400, {'Content-Type' : 'text/plain'});
        res.end(`Service with code ${req.body.code} already exists`);
      } else {
        Service.create(req.body, (err, service) => {
          if (err) return next(err);
          res.writeHead(200, {'Content-Type' : 'text/plain'});
          res.end(`Added service ${service.name}`)
        });
      }
    });
  });

  servicesRouter.route('/for-user')
  .get(verifyOrdinaryUser, async (req, res, next) => {
    const user = await User.findById(req.decoded._id)
    .populate({
      path: 'roles',
      model: 'Role',
      select: ['name', 'service'],
      populate: {
        path: 'service',
        model: 'Service',
        select: ['name', 'code']
      }
    })
    .exec();

    if (user &&  user.type == 'admin' && user.roles.length > 0) {
      const serviceCodes = lodash.uniq(user.roles.map(role => role.service.code));
      res.json(serviceCodes);
    } else if (user && user.type == 'superadmin' && user.department) {
      const departmentServices = await Service.find({department: user.department},{code:1}).exec();
      const serviceCodes = departmentServices.map(service => service.code);
      res.json(serviceCodes);
    } else if (user && user.type == 'developer') {
      const services = await Service.find({},{code:1}).exec();
      const serviceCodes = services.map(service => service.code);
      res.json(serviceCodes);
    } else {
      return res.status(401).json({
          message: 'You are not authorized to access this resource'
      });
    }
  })

  servicesRouter.route('/user-services')
  .get(verifyOrdinaryUser, async (req, res, next) => {
    
    const user = await User.findById(req.decoded._id)
    .populate({
      path: 'roles',
      model: 'Role',
      select: ['name', 'service'],
      populate: {
        path: 'service',
        model: 'Service',
        select: ['name', 'code']
      }
    })
    .exec();

    //Filter by admin context
    if (user &&  user.type == 'admin' && user.roles.length > 0) {
      const serviceCodes = lodash.uniq(user.roles.map(role => role.service.code));
      const serviceConfigs = await ServiceConfig.find({code: {$in: serviceCodes}},{shortName:1,code:1}).exec();
      res.json(serviceConfigs);
    } else if (user && user.type == 'superadmin' && user.department) {
      const departmentServices = await Service.find({department: user.department},{code:1}).exec();
      const serviceCodes = departmentServices.map(service => service.code);
      const serviceConfigs = await ServiceConfig.find({code: {$in: serviceCodes}},{shortName:1,code:1}).exec();
      res.json(serviceConfigs);
    } else if (user && user.type == 'developer') {
      const serviceConfigs = await ServiceConfig.find({},{shortName:1,code:1}).exec();
      res.json(serviceConfigs);
    } else {
      return res.status(401).json({
          message: 'You are not authorized to access this resource'
      });
    }
  });


servicesRouter.route('/:serviceId')
  .get((req, res, next) => {
    Service
    .findById(req.params.serviceId)
    .populate({
      path: 'department',
      select: ['code', 'name'],
      populate: {
        path: 'ministry',
        select: ['code', 'name'],
      }
    })
    .exec(async (err, service) => {
      if (err) return next(err);

      // print roles
      await rolesHelp.generateRolesForService(service);

      res.json(service);
    });
  });

servicesRouter.route('/:serviceId/review-process')
  .post((req, res, next) => {
    // if the review process does not exist, create it
    Service.findById(req.params.serviceId, (err, service) => {
      if (err) return next(err);

      // check if review process already exists
      let reviewProcess = service.reviewProcess;

      if (reviewProcess) {
        res.writeHead(400, {'Content-Type' : 'text/plain'});
        res.end(`Review process already exists`);
      } else {
        // add a review process to service
        Service.findByIdAndUpdate(req.params.serviceId, {
          $set: { reviewProcess: req.body }
        }, { new: true }, (err, service) => {
          if (err) return next(err);
          res.writeHead(200, {'Content-Type' : 'text/plain'});
          res.end(`Added review process ${req.body.name} to service ${service.name}`)
        });
      }
    });
  });

// route to add review stages to the service review process
servicesRouter.route('/:serviceId/review-process/:reviewProcessId/steps')
  .post((req, res, next) => {
    Service.findById(req.params.serviceId, (err, service) => {
      if (err) return next(err);

      // check if step already exists using stage
      let step = service.reviewProcess.steps.find(step => step.stage === req.body.stage);
      if (step) {
        res.writeHead(400, {'Content-Type' : 'text/plain'});
        res.end(`Step with stage ${req.body.stage} already exists`);
      } else {
        service.reviewProcess.steps.push(req.body);
        service.save((err, service) => {
          if (err) return next(err);
          res.writeHead(200, {'Content-Type' : 'text/plain'});
          res.end(`Added step ${req.body.stage} to service ${service.code} ${service.name}`)
        });
      }
    });
  });

module.exports = servicesRouter;