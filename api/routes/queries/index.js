const bodyParser = require('body-parser');
const express = require('express');
const Thread = require('../../models/queries/thread.model');
const Message = require('../../models/queries/queries.model');
const axios = require('axios');
const { verifyOrdinaryUser } = require('../../middleware/authorisation');

let threadChanges = []

const queriesRouter = express.Router();
queriesRouter.use(bodyParser.json());

queriesRouter.route('/')
  .post(async (req, res, next) => {

    const profile = req.body.reference.profile
    const payload = req.body.payload

    const timestamp = Date.now();
    const date = new Date(timestamp * 1000)
    console.log(date.toLocaleString() + ' --CRM-- Customer Query -- Payload -- ${}')
    
    console.log('body')
    console.log(req.body)

    let thread = await Thread.findOneAndUpdate({ userId: (profile||{}).username || '000010000' }, { senderId: payload.senderId, name: (profile||{}).name ||'Unknown User', read: false, lastMessage: payload.message }, { new: true, upsert: true })

    // This thread has been updated, send it to the front end
    if (threadChanges.includes(thread._id.toString())) {
      threadChanges.push(thread)
    }

    Message.create({...payload, threadId: thread._id.toString()}, (err, message) => {
        if (err) return next(err);
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        console.log(2)
        res.end(`Message Received ${message._id}`);
    });
  })
  .get((req, res, next) => {
    Thread.find({}).then(threads=>{
        if (threads){
            res.status(200).json(threads);
        }
    })
    .catch(err=>{

    })
  });

queriesRouter.route('/threads/:threadId')
  .get((req, res, next) => {

    Message
    .find({threadId: req.params.threadId})
    .exec((err, messages) => {
      if (err) return next(err);

      if (!messages) {
        const err = new Error('Messages not found');
        err.status = 404;
        return next(err);
      }

      Thread.findByIdAndUpdate(req.params.threadId, { read: true })
      res.json(messages);
    });
  })
  .post(verifyOrdinaryUser,(req, res, next) => {

    const payload = req.body
    Thread.findByIdAndUpdate(req.params.threadId, { lastMessage: payload.message, read: true }, { new: true }, (err, thread) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Updated department ${thread.name}`)

      if (threadChanges.includes(req.params.threadId)) {
        threadChanges.push(thread)
      }

      Message.create({
        threadId: req.params.threadId,
        messageId: payload.messageId,
        subject: payload.subject || 'No Subject',
        message: payload.message,
        status: 0,
        label: payload.label,
        category: payload.category,
        sender: {
            idNumber: req.decoded.idNumber,
            name: `${req.decoded.foreNames} ${req.decoded.lastName}`
        }
      })

      var data = JSON.stringify({
            "messageId": payload.messageId,
            "subject": `Permit Query`,
            "message": payload.message,
            "status": 0,
            "label": payload.label,
            "category": "Query",
            "profileId": thread.userId
        });

        console.log(data)

        // return;
        var config = {
            method: 'post',
            url: 'http://crm-acc.gov.bw:4000/scm/create',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            },
            data : data
        };

        axios(config)
        .then((response) => {
            console.log('sent to them', response)
        })
        .catch((error) => {
            console.log(error);
        });
    });
  });

  queriesRouter.route('/thread-by-user/:userId')
  .get((req, res, next) => {
    Thread.findOne({userId: req.params.userId})
    .then(thread=>{
        if (thread){
            Message
            .find({threadId: thread._id.toString()})
            .exec((err, messages) => {
            if (err) return next(err);

            if (!messages) {
                const err = new Error('Messages not found');
                err.status = 404;
                return next(err);
            } else {
                res.json({thread, messages});
            }
            });
        }
    })
    .catch(err=>{

    })
  });

  queriesRouter.route('/threads/:threadId/close')
  .patch((req, res, next) => {

    Thread.findByIdAndUpdate(req.params.threadId, { open: false }, { new: true }, (err, thread) => {
        if (err) return next(err);

        if (threadChanges.includes(req.params.threadId)) {
          threadChanges.push(req.params.threadId)
        }
        
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end(`Updated department ${thread.name}`)
    })
  });

module.exports = {queriesRouter, threadChanges};