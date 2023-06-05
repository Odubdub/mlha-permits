
const express = require('express');
const Role = require("../../../models/access/Role");
const Service = require("../../../models/authority/service.model");

const rolesRouter = express.Router();

rolesRouter.route('/')
  .get((req, res, next) => {
    Role.find({})
    .populate({
      path: 'service',
      select: ['_id', 'code']
    })
    .populate({
      path: 'department',
      select: ['_id', 'code']
    })
    .exec((err, roles) => {
      if (err) return next(err);
      
      //Drop Collection and save the new structure
      //I'm only getting the old structure a.t.m

      res.json(roles);
    });
  })
  .post((req, res, next) => {
    console.log(req.body);
    // get a service by its code
    Service.findOne({ code: req.body.service }, (err, service) => {
      if (err) return next(err);

      if (service) {
        // check if role already exists
        const roleObj = {
          name: req.body.name,
          service: service._id,
          department: req.body.department,
          permissions: req.body.permissions
        };
        
        console.log("Role Obj: ", roleObj);

        Role.create(roleObj, (err, role) => {
          if (err) return next(err);
          res.send(role._id);
        });
      } else {
        res.writeHead(400, {'Content-Type' : 'text/plain'});
        res.end(`Service with code ${req.body.serviceCode} does not exist`);
      }
    });
  })
  .put((req, res, next) => {
    console.log(req.body);
    // get a service by its code
    Role.findById(req.body.id, (err, role) => {
      if (err) return next(err);

      role.name = req.body.name;
      role.permissions = req.body.permissions;

      role.save((err, role) => {
        if (err) return next(err);
        res.send(role._id);
      });
    })
  });

rolesRouter.route('/:id')
  .get((req, res, next) => {
    Role.findById(req.params.id)
    .populate({
      path: 'service',
      select: ['_id', 'code']
    })
    .populate({
      path: 'department',
      select: ['_id', 'code']
    })
    .exec((err, role) => {
      if (err) return next(err);
      res.json(role);
    });
  })
  .delete((req, res, next) => {
    Role.findByIdAndRemove(req.params.id, (err, role) => {
      if (err) return next(err);
      res.send(role._id);
    });
  });


rolesRouter.route('/add-role')
  .post((req, res, next) => {
    // get a service by its code
    Service.findOne({ code: req.body.service }, (err, service) => {
      if (err) return next(err);

      if (service) {
        // check if role already exists
        const roleObj = {
          name: req.body.name,
          service: service._id,
          department: service.department,
          permissions: req.body.permissions
        };
        
        console.log("Role Obj: ", roleObj);

        Role.create(roleObj, (err, role) => {
          if (err) return next(err);
          res.send(role._id);
        });
      } else {
        res.writeHead(400, {'Content-Type' : 'text/plain'});
        res.end(`Service with code ${req.body.serviceCode} does not exist`);
      }
    });
  });


module.exports = rolesRouter;

