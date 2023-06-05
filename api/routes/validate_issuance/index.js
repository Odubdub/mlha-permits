const bodyParser = require('body-parser');
const { application } = require('express')
const express = require('express');
const { getFooter, joinStrings } = require('../../helpers/util')
const Application = require('../../models/application/application.model')
const Certificate = require('../../models/certificate/certificate.model')

const validateIssuanceRouter = express.Router();
validateIssuanceRouter.use(bodyParser.json());


validateIssuanceRouter.route('/')
  .post(async (req, res, next) => {
    const rawApplicationData = req.body;
    const id = rawApplicationData.payload.form.referenceId;
    const reference = rawApplicationData.reference
    const serviceCode = rawApplicationData.reference.service.service_id
    const profile = rawApplicationData.reference.profile || {};

    Certificate.findOne({$or: [{applicationId: id},{uid: id.toUpperCase()}]})
    .exec((err, doc) => {
        if (err || !doc){
          const responsePayload = {
            reference: {
              status: "2",
              user_id: reference.submitted_by.id,
              application_id: reference.application_id,
              type: 'Notification',
              service_code: serviceCode,
            },
            payload: {
              title: `Issuance Not Found`,
              attachments: [],
              message: `Permit/Certificate/License with reference number: ${id} is not valid and was not found in the system. Go to the 1Gov portal for more details`,
              fields: [],
              description: `Good day **${joinStrings(profile.first_name || '', profile.middle_name || '', ' ')} ${profile.surname || ''}**, \n \n Permit/Certificate/License with reference number: ${id} is not valid and was not found in the system. ${getFooter()}`
            }
          }
  
          res.status(200).send(responsePayload);
        } else if (doc){

            Application.findById(doc.applicationId)
            .populate('applicationOwner')
            .populate('applicationAuthor')
            .populate({
              path: 'serviceConfig',
              select: ['renderer', 'issuance']
            })
            .exec(async (err, application) => {
                if (err) return next(err);

                const serviceConfig = application.serviceConfig;

                const approveAction = application.activity.find(a=>a.type=='approve-application')

                const responsePayload = {
                    reference: {
                      status: "2",
                      user_id: reference.submitted_by.id,
                      application_id: reference.application_id,
                      type: 'Notification',
                      service_code: serviceCode,
                    },
                    payload: {
                      title: `${serviceConfig.issuance.type} Approved`,
                      attachments: [],
                      message: `${serviceConfig.issuance.type} with reference number: ${id} is valid and was issued to ${reductFullNames(`${application.applicationAuthor.foreNames} ${application.applicationAuthor.lastName}`)}. Go to the 1Gov portal for more details`,
                      fields: [],
                      description: `Good day **${joinStrings(profile.first_name || '', profile.middle_name || '', ' ')} ${profile.surname || ''}**, \n \n The ${serviceConfig.issuance.name} application with reference number: ${id} was approved on ${formatShotDate(approveAction.date)} and issued to ${reductFullNames(`${application.applicationAuthor.foreNames} ${application.applicationAuthor.lastName}`)}. This ${application.serviceConfig.issuance.type} is valid until ${formatShotDate(application.issuanceDetails.input.validUntil)}.  ${getFooter(serviceConfig.issuance)}`
                    }
                  }
          
                  res.status(200).send(responsePayload);
              });
        }
    })
})

validateIssuanceRouter.route('/details')
  .get(async (req, res, next) => {
    const id = req.query.ref

    Certificate.findOne({$or: [{applicationId: id},{uid: id.toUpperCase()}]})
    .exec((err, doc) => {
        if (err || !doc){

          res.status(400).send(err);
        } else if (doc){

            Application.findById(doc.applicationId)
            .populate('applicationOwner')
            .populate('applicationAuthor')
            .populate('certificate')
            .populate({
              path: 'serviceConfig',
              select: ['renderer', 'issuance']
            })
            .exec(async (err, application) => {
                if (err) return next(err);

                const approveAction = application.activity.find(a=>a.type=='approve-application') || {}

                console.log(application.applicationAuthor)
                res.json({
                  owner: reductFullNames(`${application.applicationOwner.foreNames} ${application.applicationOwner.lastName}`),
                  author: reductFullNames(`${application.applicationAuthor.foreNames} ${application.applicationAuthor.lastName}`),
                  status: application.status,
                  ref: application.certificate.uid,
                  type: application.serviceConfig.issuance.type,
                  name: application.serviceConfig.issuance.name,
                  issuanceName: application.serviceConfig.issuance.name,
                  dateIssued: formatShotDate(application.issuanceDetails.input.validFrom),
                  validUntil: formatShotDate(application.issuanceDetails.input.validUntil),
                  dateApproved: formatShotDate(approveAction.date || '1970-01-01'),
                  reference: application.certificate.uid,
                  activity: [...application.activity, {date: application.issuanceDetails.input.validFrom, title: `${application.issuanceDetails.type} Issuance`, actor: {name: application.issuanceDetails.issuedBy}}],
                  authority: ((application || {}).issuanceDetails || {}).department || 'N/A'
                });
            });
        }
    })
})


const formatShotDate = (str) => {
    const date = new Date(str)
    const strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const d = date.getDate()
    const m = strArray[date.getMonth()]
    const y = date.getFullYear()
    return `${d} ${m} ${y}`
}

const concatNames = (profile) => {

    return reductFullNames(`${joinStrings(profile.first_name || '', profile.middle_name || '', ' ')} ${profile.surname || ''}`);
}

const reductFullNames = (fullName) => {

  const names = (fullName.toUpperCase()).split(' ');
    const reducedFirstName = names[0][0] + '*'.repeat(names[0].length - 2) + names[0][names[0].length - 1];
    const reducedMiddleNames = names.slice(1, -1).map(name => name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]);
    const reducedSurname = names[names.length - 1][0] + '*'.repeat(names[names.length - 1].length - 2) + names[names.length - 1][names[names.length - 1].length - 1];
    return `${reducedFirstName} ${reducedMiddleNames.join(' ')} ${reducedSurname}`;
}
  
module.exports = validateIssuanceRouter;