const express = require('express');
const { isObject, getFooter } = require('../../helpers/util')
const paymentsRouter = express.Router();
const Application = require('../../models/application/application.model');

paymentsRouter.route('/issuance')
.post((req, res, next) => {
  // console.log(req.body);
  const rawApplicationData = req.body;
  
  // find application
  Application
  .findOne({application_id: rawApplicationData.reference.application_id})
  .populate('applicationOwner')
  .populate('applicationAuthor')
  .populate({
    path: 'serviceConfig',
    select: ['issuance']
  })
  .exec((err, application) => {

    if (err || !application) return next(err);

    application.issuanceFeeStatus = 'approved'
    application.status = 'pending'

    //Logs
    req.loggerDocumentType = application.serviceConfig.issuance.type || 'permit'
    req.loggerApplicationId = application._id

    const paymentDetails = rawApplicationData.payload.payment;
    if (isObject(paymentDetails) && Object.keys(paymentDetails).length != 0){
      application.issuanceFeeDetails = {
        amount: paymentDetails.amount,
        status: paymentDetails.status,
        ppmRef: paymentDetails.payment_ref,
        paymentName: paymentDetails.payment_name,
        applicationRef: paymentDetails.application_ref
      }
    }

    application.save((err, _) => {
        if (err) return next(err);
        const responsePayload = {
          reference: {
            status: "2",
            user_id: rawApplicationData.reference.submitted_by.id,
            application_id: rawApplicationData.reference.application_id,
            type: 'Notification',
            service_code: req.params.serviceCode
          },
          payload: {
            title: "Payment Success Notification",
            attachments: [],
            fields:[],
            message: `Your payment for application with reference: ${rawApplicationData.reference.application_id} has been recieved.`,
            description: `Good day **${application.applicationAuthor.foreNames} ${application.applicationAuthor.lastName}**, \n \n Issuance payment for application with reference: ${rawApplicationData.reference.application_id} has been recieved. Your ${application.serviceConfig.issuance.name} will be approved for issuance. ${getFooter(application.serviceConfig.issuance)}`,
          }
        }

        res.status(200).send(responsePayload);
      });
  });
});

paymentsRouter.route('/:serviceCode/payment-amount')
.post((req, res, next) => {
  // console.log(req.body);
  const rawApplicationData = req.body.data;
  
  // find application
  Application.findOne({application_id: rawApplicationData.response_id}).exec((err, application) => {
    if (err) return next(err);

    if (application) {

      res.status(200).send(application.paymentDetails.paymentAmount);
    }
  });
});

module.exports = paymentsRouter;