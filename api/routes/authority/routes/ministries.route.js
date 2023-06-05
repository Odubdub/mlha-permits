const bodyParser = require('body-parser');
const express = require('express');
const Ministry = require('../../../models/authority/ministry.model');
const router = express.Router();

const ministriesRouter = express.Router();
ministriesRouter.use(bodyParser.json());

ministriesRouter.route('/')
  .get((req, res, next) => {
    Ministry.find({}).exec((err, ministries) => {
      if (err) return next(err);
      res.json(ministries);
    });
  })
  .post((req, res, next) => {
    Ministry.create(req.body, (err, ministry) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Added Ministry ${ministry.name}`)
    });
  });

ministriesRouter.route('/:ministryId')
  .get((req, res, next) => {
    Ministry.findById(req.params.ministryId, (err, ministry) => {
      if (err) return next(err);
      res.json(ministry);
    });
  })
  .put((req, res, next) => {
    Ministry.findByIdAndUpdate(req.params.ministryId, req.body, { new: true }, (err, ministry) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Updated Ministry ${ministry.name}`)
    });
  })
  .delete((req, res, next) => {
    Ministry.findByIdAndRemove(req.params.ministryId, (err, ministry) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Deleted Ministry ${ministry.name}`)
    });
  });


module.exports = ministriesRouter;