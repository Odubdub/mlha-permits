const bodyParser = require('body-parser');
const express = require('express');
const Department = require('../../../models/authority/department.model');
const router = express.Router();

const departmentsRouter = express.Router();
departmentsRouter.use(bodyParser.json());

departmentsRouter.route('/')
  .get((req, res, next) => {
    Department
    .find({})
    .populate({
      path: 'ministry',
      select: ['name']
    })
    .exec((err, departments) => {
      if (err) return next(err);
      res.json(departments);
    });
  })
  .post((req, res, next) => {
    Department.create(req.body, (err, department) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Added a department ${department.name}`)
    });
  });

departmentsRouter.route('/:departmentId')
  .get((req, res, next) => {
    Department
    .findById(req.params.departmentId)
    .populate({
      path: 'ministry',
      select: ['name', 'id', 'code']
    })
    .exec((err, department) => {
      if (err) return next(err);

      if (!department) {
        const err = new Error('Department not found');
        err.status = 404;
        return next(err);
      }

      res.json(department);
    });
  })
  .put((req, res, next) => {
    Department.findByIdAndUpdate(req.params.departmentId, req.body, { new: true }, (err, department) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Updated department ${department.name}`)
    });
  })
  .delete((req, res, next) => {
    Department.findByIdAndRemove(req.params.departmentId, (err, department) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Deleted department ${department.name}`)
    });
  });

module.exports = departmentsRouter;