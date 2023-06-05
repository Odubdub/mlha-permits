const saveApplicant = require("../factory/applicants");
const Applicant = require("../models/applicants/applicant.model");
const Application = require("../models/application/application.model");
const ServiceConfig = require("../models/authority/service-config.model");
const Service = require("../models/authority/service.model");
const { updateRegStats } = require("../util/statistics");
const { resolveOmangInfo, resolveCipa, sanitizeReferences } = require("./resolve-helper");
const { isObject, joinStrings, getFooter, isBlank } = require("./util");

const handleInitialSubmission = async(req, res, next) => {
    try {
        const rawApplicationData = req.body;
      
        let applicationAuthor;
        let applicationOwner;
  
        const applicationAuthorId = rawApplicationData.reference.submitted_by.id;
        const serviceCode = rawApplicationData.reference.service.service_id
  
        const extistingApplication = await Application.findOne({ application_id: rawApplicationData.reference.application_id })

        if (extistingApplication) {

          req.extistingApplication = extistingApplication
          return next()
        };
        // console.log('Submission')

        const profile = rawApplicationData.reference.profile || {};
  
        const applicantAuthorData = {
          idNo: applicationAuthorId || '',
          gender: profile.gender || '',
          lastName: cfl(profile.surname || ''),
          nationality: profile.nationality == 'Botswana' ? 'Motswana' : profile.nationality || '',
          citizenship: profile.citizenship || '',
          dateOfBirth: profile.date_of_birth || '',
          countryOfBirth: profile.country_of_birth || '',
          primaryPhoneNumber: profile.primary_phone || '',
          primaryEmailAddress: profile.primary_email || '',
          primaryPostalAddress: joinStrings((profile.primary_postal || {}).box_number || '', (profile.primary_postal || {}).city_town_village || '', ','),
          primaryPhysicalAddress: profile.primary_physical ?  Object.values(profile.primary_physical).join(',') : 'N/A',
          foreNames: joinStrings(cfl(profile.first_name || ''), cfl(profile.middle_name) || '', ' ')
        };
    
        applicationAuthor = await saveApplicant(applicantAuthorData);
        applicationOwner = await saveApplicant(applicantAuthorData);
  
        const baseApplicationData = {
          status: "new",
          certificate: null,
          serviceCode: rawApplicationData.reference.service.service_id,
          version: rawApplicationData.reference.service.version,
          application_id: rawApplicationData.reference.application_id,
          // type: applicationTypes[rawApplicationData.service.code],
          
          applicationOwner: applicationOwner._id,
          applicationAuthor: applicationAuthor._id,
          
          applicationOwnerIdNo: applicationAuthorId,
          applicationAuthorIdNo: applicationAuthorId,
  
          // paymentStatus: rawApplicationData.paymentStatus,
          // isPaymentRequired: rawApplicationData.isPaymentRequired,
          paymentStatus: "pending",
          isPaymentRequired: true,
          applicationDetails: {
            ...rawApplicationData.payload.form
          }
        };
  
        const paymentDetails = rawApplicationData.payload.payment;
        if (isObject(paymentDetails) && Object.keys(paymentDetails).length != 0){
          baseApplicationData.paymentDetails = {
            amount: paymentDetails.amount,
            status: paymentDetails.status,
            ppmRef: paymentDetails.payment_ref,
            paymentName: paymentDetails.payment_name,
            applicationRef: paymentDetails.application_ref
          }
        }
  
        //Sanitize application data
        sanitizeReferences(baseApplicationData);
  
        // find service by code
        const service = await Service.findOne({ code: serviceCode });
  
        if (service) {
          const appReviewProcess = {
            name: service.reviewProcess.name,
            issuanceFee: service.issuanceFee,
            steps: service.reviewProcess.steps,
            applicationFee: service.applicationFee,
            description: service.reviewProcess.description
          };
          
          baseApplicationData.service = service._id;
          baseApplicationData.department = service.department;
          baseApplicationData.reviewProcess = appReviewProcess;
        }
  
        const serviceConfig = await ServiceConfig.findOne({ code: serviceCode });
  
        // Logger application type
        req.loggerSubmissionType = `new ${serviceConfig.issuance.type.toLowerCase() || 'permit'} application`

        if (serviceConfig) {
          baseApplicationData.type = serviceConfig.type;
          baseApplicationData.name = serviceConfig.shortName;
          baseApplicationData.serviceConfig = serviceConfig._id;
        }
  
        // create application
        Application.create(baseApplicationData, (err, application) => {
          if (err) return next(err);
  
        req.loggerApplicationId = application._id.toString()

          const responsePayload = {
            reference: {
              status: "2",
              user_id: rawApplicationData.reference.submitted_by.id,
              application_id: rawApplicationData.reference.application_id,
              type: 'Notification',
              service_code: serviceCode,
            },
            payload: {
              title: "Submission Notification",
              attachments: [],
              message: `Your ${serviceConfig.renderer.name} application with reference number: ${rawApplicationData.reference.application_id} has been received.`,
              fields: [],
              description: `Good day **${applicationAuthor.foreNames} ${applicationAuthor.lastName}**, \n \n Your ${serviceConfig.renderer.name} application with reference number: ${rawApplicationData.reference.application_id} has been received. You will be notified when the application is processed. ${getFooter(serviceConfig.issuance)}`
            }
          }
  
          res.status(200).send(responsePayload);
  
          updateRegStats({serviceCode});

          //Resolve Other Application Info
          resolveOmangInfo(application);
          resolveCipa(application);
        });
      } catch (error) {

        console.log('Initial Payload Error: ')
        console.log(error);
        next(error);
    }
}

const handleCorrrectionsSubmission = async (req, res, next) => {

    try {
        const rawApplicationData = req.body;
        const serviceCode = rawApplicationData.reference.service.service_id
        const corrections = rawApplicationData.payload.form || {}
  
        // find application                         
        Application
        .findOne({ application_id: rawApplicationData.reference.application_id })
        .populate('applicationAuthor')
        .populate({
          path: 'serviceConfig',
          select: ['renderer', 'issuance']
        })
        .exec( async (err, application) => {
        if (err) return next(err);
  
        if (application) {

        const applicationDetails = {...application.applicationDetails}

        const fieldsToFix = (application.applicationFixes || {}).fieldsToFix || []
        
        //Update only fields requested to fix
        const allFixes = application.applicationFixes.allFixes
        fieldsToFix.forEach(key=>{

            //Set previous value
            const fix = allFixes.find(e=>e.key==key)
            fix.prev = application.applicationDetails[key]

            //Update to new value
            const value = corrections[key]
            if (value){
                applicationDetails[key] = value
            }
        })

        const applicationFixes = {
            ...application.applicationFixes,
            allFixes
        }

        const status = 'pending'

        //Sanitize application data
        sanitizeReferences(application);

        //Update Status
        application.status = 'pending';
        
        let updatedDoc = await Application.findByIdAndUpdate(application._id, {status, applicationFixes, applicationDetails}, { new: true })
        
        const responsePayload = {
            reference: {
                status: "2",
                user_id: rawApplicationData.reference.submitted_by.id,
                application_id: rawApplicationData.reference.application_id,
                type: 'Notification',
                service_code: serviceCode
            },
            payload: {
                title: "Correction Submission Notification",
                attachments: [],
                message: `Corrections to your ${application.serviceConfig.renderer.name} application have been received.`,
                fields: [],
                description: `Good day **${application.applicationAuthor.foreNames} ${application.applicationAuthor.lastName}**, \n \n Corrections for the ${application.serviceConfig.renderer.name} application with reference number: ${rawApplicationData.reference.application_id} has been received. Keep posted for any updates to this application. ${getFooter(application.serviceConfig.issuance)}`
            }
        }

        // Set Logs Params
        req.loggerSubmissionType = `corrections for ${application.serviceConfig.issuance.type.toLowerCase() || 'permit'} application`
        req.loggerApplicationId = application._id.toString()
        //Respond to CRM
        res.status(200).send(responsePayload);

        //Resolve Data
        resolveOmangInfo(updatedDoc);
        resolveCipa(updatedDoc);
        }
      });
  
      } catch (error) {
        console.log('Corrections Error: ')
        console.log(error);
        next(error);
    }
}

const handleCheckSubmissionCorrections = async (req, res, next) => {

  try {
      const rawApplicationData = req.body;
      const serviceCode = rawApplicationData.reference.service.service_id
      const corrections = rawApplicationData.payload.form || {}

      const applicant = await Applicant.findOne({idNo: rawApplicationData.reference.submitted_by.id})
      if (!applicant) return next()

      // find application
      Application
      .find({ applicationAuthor: applicant._id, status: 'returned', serviceCode, 'applicationFixes.fieldsToFix': {$exists: true}})
      .populate('applicationAuthor')
      .populate({
        path: 'serviceConfig',
        select: ['renderer', 'issuance']
      })
      .exec( async (err, applications) => {
      if (err) return next(err);

      if (applications.length) {

        const correctedFields = Object.keys(corrections) || []
        const application = applications.find(e=>e.applicationFixes.fieldsToFix.every(e=>correctedFields.includes(e)) && correctedFields.length == e.applicationFixes.fieldsToFix.length)

        if (!application) return next()

        const applicationDetails = { ...application.applicationDetails }
        const fieldsToFix = (application.applicationFixes || {}).fieldsToFix || []

        // check if correctedFields array is a subset of fieldsToFix
        // const isSubset = fieldsToFix.every(e => correctedFields.includes(e)) && correctedFields.length == fieldsToFix.length
        
        //Update only fields requested to fix
        const allFixes = application.applicationFixes.allFixes
        fieldsToFix.forEach(key=>{

          //Set previous value
          const fix = allFixes.find(e=>e.key==key)
          fix.prev = application.applicationDetails[key]

          //Update to new value
          const value = corrections[key]
          if (value){
              applicationDetails[key] = value
          }
        })

        const applicationFixes = {
            ...application.applicationFixes,
            allFixes
        }

        const status = 'pending'

        //Sanitize application data
        sanitizeReferences(application);

        //Update Status
        application.status = status;
        
        let updatedDoc = await Application.findByIdAndUpdate(application._id, {status, applicationFixes, applicationDetails}, { new: true })
          
        const responsePayload = {
            reference: {
                status: "2",
                user_id: rawApplicationData.reference.submitted_by.id,
                application_id: rawApplicationData.reference.application_id,
                type: 'Notification',
                service_code: serviceCode
            },
            payload: {
                title: "Correction Submission Notification",
                attachments: [],
                message: `Corrections to your ${application.serviceConfig.renderer.name} application have been received.`,
                fields: [],
                description: `Good day **${application.applicationAuthor.foreNames} ${application.applicationAuthor.lastName}**, \n \n Corrections for the ${application.serviceConfig.renderer.name} application with reference number ${rawApplicationData.reference.application_id} has been received. Keep posted for any updates to this application. ${getFooter(application.serviceConfig.issuance)}`
            }
        }

        
        // Set Logs Params
        req.loggerSubmissionType = `corrections for ${application.serviceConfig.issuance.type.toLowerCase() || 'permit'} application`
        req.loggerApplicationId = application._id.toString()
        
        //Respond to CRM
        res.status(200).send(responsePayload);

        //Resolve Data
        resolveOmangInfo(updatedDoc);
        resolveCipa(updatedDoc);
        
      } else {
        return next()
      }
    });

    } catch (error) {
      console.log('Check Correction Error')
      console.log(error);
      next(error);
  }
}

function cfl(word) {
  if (!word || isBlank(word) || word == '') return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = { handleCorrrectionsSubmission, handleInitialSubmission, handleCheckSubmissionCorrections }

// 44d98457-7913-41bf-aaf9-e2a418000669
// 44d98457-7913-41bf-aaf9-e2a418000669