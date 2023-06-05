const bodyParser = require('body-parser');
const express = require('express');
const Log = require('../../models/audit/log.model')

const logsRouter = express.Router();
logsRouter.use(bodyParser.json());

logsRouter.route('/')
  .get((req, res, next) => {
    Log.find({}).then(logs=>{
        if (logs){
            res.status(200).json(logs);
        }
    })
    .catch(err=>{
        res.status(500).json({error: err})
    })
  });

logsRouter.route('/application/:id')
  .get((req, res, next) => {
    Log.find({application: req.params.id}).then(logs=>{
        if (logs){
            res.status(200).json(logs);
        }
    })
    .catch(err=>{
        res.status(500).json({error: err})
    })
  })

  logsRouter.route('/session/:id')
  .get((req, res, next) => {
    Log.find({sessionId: req.params.id}).then(logs=>{
        if (logs){
            res.status(200).json(logs);
        }
    })
    .catch(err=>{
        res.status(500).json({error: err})
    })
  });

  logsRouter.route('/module/:name')
  .get((req, res, next) => {
    Log.find({application: req.params.name}).then(logs=>{
        if (logs){
            res.status(200).json(logs);
        }
    })
    .catch(err=>{
        res.status(500).json({error: err})
    })
  });


module.exports = logsRouter;