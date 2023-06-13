const express = require('express');
const { generateCertificate } = require('../../helpers/cert-gen.helper');
const paginatedResults = require('../../middleware/paginatedResults');
const applicationRouter = express.Router();

const Application = require('../../models/application/application.model');
const Certificate = require('../../models/certificate/certificate.model');
const { verifyOrdinaryUser } = require('../../middleware/authorisation');
const { updateStatusStats } = require('../../util/statistics');
const { resolveCRMFiles } = require('../../helpers/crm-file-downloader.helper');
const { resolveOmangInfo, resolveCipa } = require('../../helpers/resolve-helper');
const { uploadToCentralBucket } = require('../../helpers/crm-file-upload.helper');
const { updateApplicationStatus } = require('../../helpers/crm-status.helper');
const { CRMApplicationStatuses } = require('../../constants');
const ServiceConfig = require('../../models/authority/service-config.model');
const {
  handleInitialSubmission,
  handleCorrrectionsSubmission,
  handleCheckSubmissionCorrections
} = require('../../helpers/crm-submission-helper');
const paginatedApplicantResults = require('../../middleware/paginatedApplicantResults');
const { getFooter, isObject } = require('../../helpers/util');
const searchApplications = require('../../middleware/searchResults');
const getPaymentServiceCode = require('../../helpers/crm-payment.helper');
const {
  rawApplicationStats,
  generateReport,
  getReportData,
  getFinancialReportData
} = require('../../helpers/statistics.helper');
const { last } = require('lodash');
const { post } = require('../access');
const notificationsModel = require('../../models/application/notifications.model');

/**
 * Get applications filtered by service
 * @returns {Application[]} - Paginated
 */
applicationRouter.route('/').get(verifyOrdinaryUser, paginatedResults(Application), (req, res) => {
  res.json(res.paginatedResults);
});

applicationRouter
  .route('/:userId/byApplicant')
  .get(verifyOrdinaryUser, paginatedApplicantResults(Application), (req, res) => {
    res.json(res.paginatedResults);
  });

applicationRouter.route('/search').get(verifyOrdinaryUser, searchApplications, (req, res) => {
  res.json(res.paginatedResults);
});

/**/
applicationRouter
  .route('/:serviceCode')
  .post(handleInitialSubmission, handleCorrrectionsSubmission);

/**/
applicationRouter.route('/:applicationId/resolve-cipa').get((req, res, next) => {
  Application.findById(req.params.applicationId).exec((err, application) => {
    if (err) return next(err);
    resolveCipa(application, () => {
      res.status(200).send('done');
    });
  });
});

/**/
applicationRouter.route('/:applicationId/resolve-omang').get((req, res, next) => {
  Application.findById(req.params.applicationId).exec((err, application) => {
    if (err) return next(err);
    resolveOmangInfo(application, () => {
      res.status(200).send('done');
    });
  });
});

applicationRouter.route('/:applicationId/resolve-attachments').get((req, res, next) => {
  Application.findById(req.params.applicationId).exec((err, application) => {
    if (err) return next(err);
    resolveCRMFiles(application, (resolvedApplication) => {
      res.status(200).send(resolvedApplication);
    });
  });
});

applicationRouter.route('/all').get((req, res, next) => {
  Application.find({}).exec((err, applications) => {
    if (err) return next(err);
    res.json(applications);
  });
});

/**
 * Get a single application by id
 */
applicationRouter.route('/:applicationId').get((req, res, next) => {
  Application.findById(req.params.applicationId)
    .populate('certificate')
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate({
      path: 'serviceConfig',
      select: ['renderer', 'issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);
      res.json(application);
    });
});

/**
 * Get application activity (history)
 */
applicationRouter.route('/:applicationId/activity').get((req, res, next) => {
  Application.findById(req.params.applicationId)
    .populate('activity')
    .exec((err, application) => {
      if (err) return next(err);
      res.json(application.activity);
    });
});

/**
 * Activity => History (Add a history/activity object to the application)
 */
applicationRouter.route('/:applicationId/activity').post((req, res, next) => {
  const activity = {
    type: req.body.type,
    title: req.body.title,
    actor: 'User from context',
    description: req.body.description
  };

  // find application by id
  Application.findById(req.params.applicationId, (err, application) => {
    if (err) return next(err);

    // if application exists
    if (application) {
      // do not add activity if activity type 'application_created' exists in the activity array
      if (
        !(
          activity.type === 'application-opened' &&
          application.activity.filter((activity) => activity.type === 'application-opened').length >
            0
        )
      ) {
        application.activity.push(activity);
      }

      application.save((err, application) => {
        if (err) return next(err);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Added a new activity to application ${application._id}`);
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Application ${req.params.applicationId} not found`);
    }
  });
});

applicationRouter
  .route('/:applicationId/review-status')
  .post(verifyOrdinaryUser, async (req, res, next) => {
    // console.log(req.body);
    const application = await Application.findById(req.params.applicationId)
      .populate('applicationOwner')
      .populate({
        path: 'serviceConfig',
        select: ['renderer', 'issuance']
      })
      .populate('applicationAuthor');

    if (!application) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Application ${req.params.applicationId} not found`);
    }

    const { stage, checked } = req.body;
    const reviewProcessSteps = application.reviewProcess.steps;
    const currentReviewStep = reviewProcessSteps.find((step) => step.stage === req.body.stage);
    const nextReviewStep =
      reviewProcessSteps.length >= stage
        ? reviewProcessSteps.find((step) => step.stage === req.body.stage + 1)
        : null;

    // Logger
    req.loggerDescription = checked
      ? currentReviewStep.feedback.positive.verb
      : currentReviewStep.feedback.negative.verb;

    // activity object
    const activity = {
      type: currentReviewStep.type,
      details: req.body.details || null,
      actor: {
        userObjId: req.decoded._id,
        idNumber: req.decoded.idNumber,
        name: `${req.decoded.foreNames} ${req.decoded.lastName}`
      },
      title: checked
        ? currentReviewStep.feedback.positive.verb
        : currentReviewStep.feedback.negative.verb,
      description: checked
        ? currentReviewStep.feedback.positive.caption
        : currentReviewStep.feedback.negative.caption
    };

    // if activity is not logged again
    if (stage !== application.reviewStatus.stage) {
      // add activity to application
      application.activity.push(activity);
    }

    // If next action is by the system
    if (checked && nextReviewStep && nextReviewStep.actorType == 'system') {
      const reqPaymentActivity = {
        type: nextReviewStep.type,
        details: req.body.details || null,
        actor: {
          userObjId: req.decoded._id,
          idNumber: req.decoded.idNumber,
          name: `System`
        },
        title: nextReviewStep.feedback.positive.verb,
        description: nextReviewStep.feedback.positive.caption
      };

      // add activity to application
      application.activity.push(reqPaymentActivity);
      application.reviewStatus = { stage: nextReviewStep.stage, checked: true };

      //Push payment service
      const config = await ServiceConfig.findOne({ code: application.serviceCode });

      const issuanceService = getPaymentServiceCode({ data: application, config: config.renderer });
      console.log(issuanceService);

      updateApplicationStatus({
        alias: 'Initiated',
        applicationId: application.application_id,
        serviceCode: application.serviceCode,
        pushService: issuanceService.service,
        userId: application.applicationAuthor.idNo,
        responseType: 'PushPayment',
        statusCode: CRMApplicationStatuses.awaitingPayment.code,
        richMessage: `Good day **${application.applicationAuthor.foreNames} ${
          application.applicationAuthor.lastName
        }**, \n \n Please pay **P${issuanceService.fee}** for the issuance of your ${
          config.issuance.name
        }.  ${getFooter(application.serviceConfig.issuance)}`,
        message: `Please pay P${issuanceService.fee} for the issuance of your ${config.issuance.name}.`,
        title: `Request for Issuance Payment`,
        onComplete: () => {
          application.status = 'payment-requested';
          application.save((err, application) => {
            if (err) return next(err);

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Application Issuance Payment requested ${application._id}`);
          });
        },
        onError: (err) => {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Issuance Payment Request failed for Application ${application._id}`);
        }
      });

      // application.requestIssuancePayment(reqPayObj);
      application.status = 'payment-requested';
    } else {
      // application.reviewStatus.stage = stage;
      // application.reviewStatus.checked = checked;
      application.status = 'pending';
      application.reviewStatus = req.body;
      application.save((err, application) => {
        if (err) return next(err);
        // console.log(application);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Added a new activity to application ${application._id}`);
      });
    }
  });

applicationRouter
  .route('/:applicationId/undo-review-status')
  .post(verifyOrdinaryUser, (req, res, next) => {
    // find application by id
    // console.log('Review Status: ', req.body);
    Application.findById(req.params.applicationId, (err, application) => {
      if (err) return next(err);

      // if application exists
      if (application) {
        const stepIndex = application.reviewProcess.steps.findIndex(
          (step) => step.type === req.body.actionType
        );

        const reviewStatus = {
          stage: stepIndex,
          checked: true
        };

        const activity = [...application.activity];
        const actionIndex = activity.findIndex((act) => act.type === req.body.actionType);

        console.log(activity[actionIndex].date);
        activity[actionIndex].return = {
          active: true,
          returnedBy: `${req.decoded.foreNames} ${req.decoded.lastName}`,
          idNumber: req.decoded.idNumber,
          returnMessage: req.body.returnMessage,
          returnDate: new Date()
        };

        console.log(activity[actionIndex].date);

        Application.findOneAndUpdate(
          { _id: application._id },
          { $set: { activity, reviewStatus } },
          { new: true },
          (err, updatedApplication) => {
            if (err) return next(err);
            if (!updatedApplication) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end(`Application ${req.params.applicationId} not found`);
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Application returned to officer for corrections`);
          }
        );
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Application ${req.params.applicationId} not found`);
      }
    });
  });

applicationRouter
  .route('/:applicationId/update-review')
  .post(verifyOrdinaryUser, async (req, res, next) => {
    Application.findById(req.params.applicationId, (err, application) => {
      if (err) return next(err);

      // if application exists
      if (application) {
        console.log(req.body);
        const activity = [...application.activity];

        const lastActionType = activity[activity.length - 1].type;

        const nextActionIndex = application.reviewProcess.steps.findIndex(
          (step) => step.type == lastActionType
        );

        const nextStep = application.reviewProcess.steps[nextActionIndex];

        const reviewStatus = {
          stage: nextStep.stage,
          checked: true
        };

        const currentReviewStep = application.reviewProcess.steps[req.body.stage - 1];
        // console.log(currentReviewStep)

        // return
        const activityIndex = req.body.stage - 1;

        const action = activity[activityIndex];
        (action.title = req.body.checked
          ? currentReviewStep.feedback.positive.verb
          : currentReviewStep.feedback.negative.verb),
          (action.description = req.body.checked
            ? currentReviewStep.feedback.positive.caption
            : currentReviewStep.feedback.negative.caption);
        action.details = req.body.details || null;
        action.date = new Date();

        Application.findOneAndUpdate(
          { _id: application._id },
          { $set: { reviewStatus, activity } },
          { new: true },
          (err, updatedApplication) => {
            if (err) return next(err);
            if (!updatedApplication) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end(`Application ${req.params.applicationId} not found`);
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Application returned to officer for corrections`);
          }
        );
      } else {
        console.log('app = ', application);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Application ${req.params.applicationId} not found`);
      }
    });
  });

applicationRouter
  .route('/:applicationId/return-review-step')
  .post(verifyOrdinaryUser, async (req, res, next) => {
    // console.log(req.body);
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Application ${req.params.applicationId} not found`);
    }

    const step = application.reviewProcess.steps.find((step) => step.type == req.body.stepType);

    if (step.actor) {
      res.status(403).send(`${step.actor.name} is doing this action`);
    } else {
      const actor = {
        userObjId: req.decoded._id,
        idNumber: req.decoded.idNumber,
        name: `${req.decoded.foreNames} ${req.decoded.lastName}`
      };

      const reviewProcess = { ...application.reviewProcess };

      const index = reviewProcess.steps.findIndex((step) => step.type == req.body.stepType);
      reviewProcess.steps[index].actor = actor;

      // console.log('review process')
      // console.log(JSON.stringify(process, null, 2))

      Application.findOneAndUpdate(
        { _id: application._id },
        { $set: { reviewProcess } },
        { new: true },
        (err, updatedApplication) => {
          if (err) return next(err);
          if (!updatedApplication) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Application ${req.params.applicationId} not found`);
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`${actor.name} granted ${req.body.stepType} for ${application._id}`);
        }
      );
    }
  });

applicationRouter
  .route('/:applicationId/claim-review-step')
  .post(verifyOrdinaryUser, async (req, res, next) => {
    // console.log(req.body);
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Application ${req.params.applicationId} not found`);
    }

    const step = application.reviewProcess.steps.find((step) => step.type == req.body.stepType);

    if (step.actor) {
      res.status(403).send(`${step.actor.name} is doing this action`);
    } else {
      const actor = {
        userObjId: req.decoded._id,
        idNumber: req.decoded.idNumber,
        name: `${req.decoded.foreNames} ${req.decoded.lastName}`
      };

      const reviewProcess = { ...application.reviewProcess };

      const index = reviewProcess.steps.findIndex((step) => step.type == req.body.stepType);
      reviewProcess.steps[index].actor = actor;

      // console.log('review process')
      // console.log(JSON.stringify(process, null, 2))

      Application.findOneAndUpdate(
        { _id: application._id },
        { $set: { reviewProcess } },
        { new: true },
        (err, updatedApplication) => {
          if (err) return next(err);
          if (!updatedApplication) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Application ${req.params.applicationId} not found`);
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`${actor.name} granted ${req.body.stepType} for ${application._id}`);
        }
      );
    }
  });

applicationRouter
  .route('/:applicationId/remove-step-actor')
  .post(verifyOrdinaryUser, async (req, res, next) => {
    // console.log(req.body);
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Application ${req.params.applicationId} not found`);
    }

    const step = application.reviewProcess.steps.find((step) => step.type == req.body.stepType);

    if (step.actor) {
      const reviewProcess = { ...application.reviewProcess };

      const index = reviewProcess.steps.findIndex((step) => step.type == req.body.stepType);
      reviewProcess.steps[index].actor = null;

      // console.log('review process')
      // console.log(JSON.stringify(process, null, 2))

      Application.findOneAndUpdate(
        { _id: application._id },
        { $set: { reviewProcess } },
        { new: true },
        (err, updatedApplication) => {
          if (err) return next(err);
          if (!updatedApplication) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Application ${req.params.applicationId} not found`);
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`Officer removed from ${req.body.stepType} for ${application._id}`);
        }
      );
    } else {
      res.status(403).send(`No one is doing this action`);
    }
  });

applicationRouter.route('/:applicationId/return-form').post((req, res, next) => {
  Application.findById(req.params.applicationId)
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate({
      path: 'serviceConfig',
      select: ['form', 'renderer', 'issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);
      if (application) {
        application.applicationFixes = req.body;
        application.status = 'returned';

        application.save((err, application) => {
          if (err) return next(err);
        });

        updateApplicationStatus({
          alias: 'application returned',
          applicationId: application.application_id,
          serviceCode: application.serviceCode,
          userId: application.applicationAuthor.idNo,
          statusCode: CRMApplicationStatuses.returned.code,
          responseType: 'ApplicationCorrection',
          richMessage: `Good day **${application.applicationAuthor.foreNames} ${
            application.applicationAuthor.lastName
          }**, \n \n Your application for a ${
            application.serviceConfig.renderer.name
          } has been returned for corrections. Please make the necessary corrections and resubmit you application.  \n \n **Before Resubmission:** \n \n ${
            req.body.returnMessage
          }  ${getFooter(application.serviceConfig.issuance)}`,
          pushService: application.serviceCode,
          message: `Good day, your application for a ${application.serviceConfig.renderer.name} has been returned for corrections. Please make the necessary corrections and resubmit your application.`,
          title: `Application Returned for Corrections`,
          correctionFields: req.body.fieldsToFix,
          onComplete: () => {
            application.applicationFixes = req.body;
            application.status = 'returned';

            application.save((err, application) => {
              if (err) return next(err);

              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end(`Updated Application Status ${application._id}`);
            });
          },
          onError: (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Rejection failed for Application ${application._id}`);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Application ${req.params.applicationId} not found`);
      }
    });
});

/**
 * Alive check for the service registry ping
 */
applicationRouter.route('/alive').get((req, res, next) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Application API is alive');
});

applicationRouter.route('/:applicationId/revoke').post((req, res, next) => {
  Application.findById(req.params.applicationId)
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate('certificate')
    .populate({
      path: 'serviceConfig',
      select: ['issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);
      if (application) {
        updateApplicationStatus({
          alias: 'application revoked',
          applicationId: application.application_id,
          serviceCode: application.serviceCode,
          userId: application.applicationAuthor.idNo,
          statusCode: CRMApplicationStatuses.revoked.code,
          richMessage: `Good day **${application.applicationAuthor.foreNames} ${
            application.applicationAuthor.lastName
          }**, \n \n The issued ${application.issuanceDetails.type.toLowerCase()} with reference number: ${
            application.certificate.uid
          } for a ${
            application.serviceConfig.issuance.name
          } has been revoked. The ${application.issuanceDetails.type.toLowerCase()} is no longer valid.  ${getFooter(
            application.serviceConfig.issuance
          )}`,
          message: `The issued ${application.issuanceDetails.type.toLowerCase()} with reference number: ${
            application.certificate.uid
          } has been revoked.`,
          title: `${application.issuanceDetails.type} Revoked`,
          onComplete: () => {
            application.status = 'revoked';
            // application.rejectionDetails = req.body;
            application.save((err, application) => {
              if (err) return next(err);

              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end(`Revoke failed for Application ${application._id}`);
            });
          },
          onError: (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Revoke failed for Application ${application._id}`);
          }
        });

        //Update Reports
        updateStatusStats({ serviceCode: application.serviceCode, status: 'revoked', value: 1 });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Application ${req.params.applicationId} not found`);
      }
    });
  // find application by id
  // Application.findById(req.params.applicationId, (err, application) => {
  //   if (err) return next(err);

  //   // if application exists
  //   if (application) {
  //     updateApplicationStatus({
  //       alias: 'application revoked',
  //       applicationId: application.application_id,
  //       serviceCode: application.serviceCode,
  //       userId: application.applicationAuthor.idNo,
  //       statusCode: CRMApplicationStatuses.revoked.code,
  //       message: `The issued ${application.issuanceDetails.type.toLowerCase()} has been revoked.`,
  //       title: `${application.issuanceDetails.type} Revoked`,
  //       onComplete: ()=>{
  //         application.status = 'revoked';
  //         application.save( async (err, application) => {
  //           if (err) return next(err);
  //           updateStatusStats({serviceCode: application.serviceCode, status: 'revoked', value: 1})
  //           res.writeHead(200, { 'Content-Type': 'text/plain' });
  //           res.end(`Revoked Application ${application._id}`);
  //         });
  //       },
  //       onError: (err)=>{
  //         res.writeHead(500, { 'Content-Type': 'text/plain' });
  //         res.end(`Revoke failed for Application ${application._id}`);
  //       }
  //     })
  //   } else {
  //     res.writeHead(404, { 'Content-Type': 'text/plain' });
  //     res.end(`Application ${req.params.applicationId} not found`);
  //   }
  // });
});

applicationRouter.route('/:userId/user-notifications').get((req, res, next) => {
  notificationsModel
    .find({ user_id: req.params.userId })
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.log('Err');
    });
});

applicationRouter.route('/:applicationId/reject').post((req, res, next) => {
  // find application by id
  Application.findById(req.params.applicationId)
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate({
      path: 'serviceConfig',
      select: ['issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);
      if (application) {
        updateApplicationStatus({
          alias: 'application rejected',
          applicationId: application.application_id,
          serviceCode: application.serviceCode,
          userId: application.applicationAuthor.idNo,
          statusCode: CRMApplicationStatuses.rejected.code,
          richMessage: `Good day **${application.applicationAuthor.foreNames} ${
            application.applicationAuthor.lastName
          }**, \n \n Your application for a ${
            application.serviceConfig.issuance.name
          } has been rejected for the following reason: \n\n ${req.body.reason}.  ${getFooter(
            application.serviceConfig.issuance
          )}`,
          message: req.body.message,
          responseType: 'Notification',
          title: `Application Rejected`,
          onComplete: () => {
            application.status = 'rejected';
            application.rejectionDetails = req.body;
            application.save((err, application) => {
              if (err) return next(err);

              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end(`Rejected Application ${application._id}`);
            });
          },
          onError: (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Rejection failed for Application ${application._id}`);
          }
        });

        //Update Reports
        updateStatusStats({ serviceCode: application.serviceCode, status: 'rejected', value: 1 });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Application ${req.params.applicationId} not found`);
      }
    });
});

applicationRouter.route('/:applicationId/generate-certificate').post((req, res, next) => {
  // find application by id
  Application.findById(req.params.applicationId)
    .populate('certificate')
    .populate('department')
    .populate({
      path: 'serviceConfig',
      select: ['issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);

      // if application exists
      if (application) {
        application.issuanceDetails = req.body;

        application.save(async (err, application) => {
          if (err) return next(err);

          // Set Logger Doctype
          req.loggerDocumentType = application.serviceConfig.issuance.type;

          const generateCertData = {
            id: application._id,
            type: application.issuanceDetails.type,
            suffix: application.issuanceDetails.suffix,
            serviceCode: application.issuanceDetails.code,
            service: application.service,
            conditions: req.body.conditions,
            department: application.department.code,
            uid: (application.certificate || {}).uid
          };

          generateCertificate(generateCertData, async (err, certificate) => {
            if (err) return next(err);

            // const bucket = 'permits';
            // const folder = 'certificates';
            const { fileBuffer, fileName, certID } = certificate;

            // const objectName = `${folder}/${fileName}`;

            // const certificateResponse = await uploadFile(bucket, objectName, fileBuffer);

            //Upload to moffat
            const centralBucketResponse = await uploadToCentralBucket({
              buffer: fileBuffer,
              fileName,
              serviceCode: generateCertData.serviceCode,
              type: generateCertData.type
            });

            if (centralBucketResponse) {
              // console.log('Certificate uploaded successfully: ', centralBucketResponse);
              // add a new certificate
              const certificate = new Certificate({
                uid: certID,
                applicationId: application._id,
                crmApplicationId: application.application_id,
                certificateFile: {
                  bucket: centralBucketResponse.bucket,
                  name: centralBucketResponse['original-name'],
                  extension: centralBucketResponse.extension,
                  key: centralBucketResponse.key
                }
              });

              certificate.save((err, certificate) => {
                if (err) return next(err);

                application.status = 'pending-issuance';
                application.certificate = certificate;

                application.save((err, application) => {
                  if (err) return next(err);
                  // res.writeHead(200, { 'Content-Type': 'text/plain' });
                  res.status(200).json(certificate);
                });
              });
            } else {
              console.log('Certificate upload failed');
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end(`Certificate upload failed`);
            }
          });
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Application ${req.params.applicationId} not found`);
      }
    });
});

applicationRouter.route('/:applicationId/upload-certificate').post((req, res, next) => {
  // find application by id
  Application.findById(req.params.applicationId, async (err, application) => {
    if (err) return next(err);

    // if application exists
    if (application) {
      application.issuanceDetails = req.body;
      application.status = 'pending-issuance';

      application.save(async (err, application) => {
        if (err) return next(err);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Issued Application ${application._id}`);
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Application ${req.params.applicationId} not found`);
    }
  });
});

applicationRouter.route('/:applicationId/issue').post((req, res, next) => {
  // find application
  Application.findById(req.params.applicationId)
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate('certificate')
    .populate({
      path: 'serviceConfig',
      select: ['issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);
      // if no certificate send error
      if (application && !application.certificate) {
        console.log('no certificate');
        res.status(404).send('No certificate document found');
      } else {
        const certFile = application.certificate.certificateFile;
        const att = {
          bucket: certFile.bucket,
          'original-name': certFile.name,
          extension: certFile.extension,
          key: certFile.key
        };

        req.loggerDocumentType = application.issuanceDetails.type;

        updateApplicationStatus({
          alias: 'certificate issued',
          applicationId: application.application_id,
          serviceCode: application.serviceCode,
          pushService: application.serviceCode,
          userId: application.applicationAuthor.idNo,
          statusCode: CRMApplicationStatuses.approved.code,
          richMessage: `Good day **${application.applicationAuthor.foreNames} ${
            application.applicationAuthor.lastName
          }**, \n \n We are pleased to inform you that your ${
            application.serviceConfig.issuance.name
          } has been approved and issued a certificate with reference: ${
            application.certificate.uid
          }.  ${getFooter(application.serviceConfig.issuance)}`,
          attachments: [att],
          message: `Your ${application.issuanceDetails.name.toLowerCase()} has been approved and issued a certificate with reference: ${
            application.certificate.uid
          }.`,
          title: `${application.issuanceDetails.type} Issued`,
          onComplete: () => {
            console.log('Issued Permit');

            application.status = 'issued';

            application.save((err, application) => {
              if (err) return next(err);
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end(`Issuance successful for Application ${application._id}`);
            });
          },
          onError: (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Issuance failed for Application ${JSON.stringify(err)}`);
          }
        });

        updateStatusStats({ serviceCode: application.serviceCode, status: 'issued', value: 1 });
      }
    });
});

applicationRouter.route('/:applicationId/request-payment').post((req, res, next) => {
  // console.log(req.body);
  // find application
  Application.findById(req.params.applicationId)
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate('certificate')
    .populate({
      path: 'serviceConfig',
      select: ['issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);
      if (application) {
        application.status = 'payment-requested';

        application.save(async (err, application) => {
          if (err) return next(err);
          updateApplicationStatus({
            alias: 'Initiated',
            applicationId: application.application_id,
            serviceCode: application.serviceCode,
            pushService: 'MTI_007_12_021',
            userId: application.applicationAuthor.idNo,
            responseType: 'PushPayment',
            statusCode: CRMApplicationStatuses.awaitingPayment.code,
            richMessage: `Good day **${application.applicationAuthor.foreNames} ${
              application.applicationAuthor.lastName
            }**, \n \n Please pay P${req.body.paymentAmount} for the issuance of your ${
              application.serviceConfig.issuance.name
            }. \n\n ${req.body.reason}. ${getFooter(application.serviceConfig.issuance)}`,
            message: `Please pay P${req.body.paymentAmount} for the issuance of your ${application.serviceConfig.issuance.name}.`,
            title: `Request for Issuance Payment`,
            onComplete: () => {
              application.status = 'payment-requested';
              application.issuanceFeeStatus = 'payment-requested';

              application.save((err, application) => {
                if (err) return next(err);

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Application Issuance Payment requested ${application._id}`);
              });
            },
            onError: (err) => {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end(`Rejection failed for Application ${application._id}`);
            }
          });
        });

        console.log('Stuff');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Application ${req.params.applicationId} not found`);
      }
    });
});

applicationRouter.route('/:serviceCode/payment-amount').post((req, res, next) => {
  // console.log(req.body);
  const rawApplicationData = req.body.data;

  // find application
  Application.findOne({ application_id: rawApplicationData.response_id }).exec(
    (err, application) => {
      if (err) return next(err);

      if (application) {
        res.status(200).send(application.paymentDetails.paymentAmount);
      }
    }
  );
});

applicationRouter.route('/:serviceCode/payments').post((req, res, next) => {
  // console.log(req.body);
  const rawApplicationData = req.body;

  // find application
  Application.findOne({ application_id: rawApplicationData.reference.application_id })
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate({
      path: 'serviceConfig',
      select: ['issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);

      application.issuanceFeeStatus = 'approved';
      application.status = 'pending';

      //Logs
      req.loggerDocumentType = application.serviceConfig.issuance.type || 'permit';
      req.loggerApplicationId = application._id;

      const paymentDetails = rawApplicationData.payload.payment;
      if (isObject(paymentDetails) && Object.keys(paymentDetails).length != 0) {
        application.issuanceFeeDetails = {
          amount: paymentDetails.amount,
          status: paymentDetails.status,
          ppmRef: paymentDetails.payment_ref,
          paymentName: paymentDetails.payment_name,
          applicationRef: paymentDetails.application_ref
        };
      }

      if (application) {
        application.save((err, _) => {
          if (err) return next(err);
          const responsePayload = {
            reference: {
              status: '2',
              user_id: rawApplicationData.reference.submitted_by.id,
              application_id: rawApplicationData.reference.application_id,
              type: 'Notification',
              service_code: req.params.serviceCode
            },
            payload: {
              title: 'Payment Success Notification',
              attachments: [],
              fields: [],
              message: `Your payment for application with reference: ${rawApplicationData.reference.application_id} has been recieved.`,
              description: `Good day **${application.applicationAuthor.foreNames} ${
                application.applicationAuthor.lastName
              }**, \n \n Issuance payment for application with reference: ${
                rawApplicationData.reference.application_id
              } has been recieved. Your ${
                application.serviceConfig.issuance.name
              } will be approved for issuance. ${getFooter(application.serviceConfig.issuance)}`
            }
          };

          res.status(200).send(responsePayload);
        });
      }
    });
});

applicationRouter.route('/payments').post((req, res, next) => {
  // console.log(req.body);
  const rawApplicationData = req.body;

  // find application
  Application.findOne({ application_id: rawApplicationData.reference.application_id })
    .populate('applicationOwner')
    .populate('applicationAuthor')
    .populate({
      path: 'serviceConfig',
      select: ['issuance']
    })
    .exec((err, application) => {
      if (err) return next(err);

      application.issuanceFeeStatus = 'approved';
      application.status = 'pending';

      //Logs
      req.loggerDocumentType = application.serviceConfig.issuance.type || 'permit';
      req.loggerApplicationId = application._id;

      const paymentDetails = rawApplicationData.payload.payment;
      if (isObject(paymentDetails) && Object.keys(paymentDetails).length != 0) {
        application.issuanceFeeDetails = {
          amount: paymentDetails.amount,
          status: paymentDetails.status,
          ppmRef: paymentDetails.payment_ref,
          paymentName: paymentDetails.payment_name,
          applicationRef: paymentDetails.application_ref
        };
      }

      if (application) {
        application.save((err, _) => {
          if (err) return next(err);
          const responsePayload = {
            reference: {
              status: '2',
              user_id: rawApplicationData.reference.submitted_by.id,
              application_id: rawApplicationData.reference.application_id,
              type: 'Notification',
              service_code: req.params.serviceCode
            },
            payload: {
              title: 'Payment Success Notification',
              attachments: [],
              fields: [],
              message: `Your payment for application with reference: ${rawApplicationData.reference.application_id} has been recieved.`,
              description: `Good day **${application.applicationAuthor.foreNames} ${
                application.applicationAuthor.lastName
              }**, \n \n Issuance payment for application with reference: ${
                rawApplicationData.reference.application_id
              } has been recieved. Your ${
                application.serviceConfig.issuance.name
              } will be approved for issuance. ${getFooter(application.serviceConfig.issuance)}`
            }
          };

          res.status(200).send(responsePayload);
        });
      }
    });
});

applicationRouter
  .route('/statistics/all')
  .get(verifyOrdinaryUser, rawApplicationStats, (req, res, next) => {
    res.json(req.applicationStats);
  });

applicationRouter.route('/statistics/data-for-user').get((req, res, next) => {
  if (req.query.financial == 'true') {
    getFinancialReportData(
      req,
      (results) => {
        res.json(results);
      },
      (error) => {
        res.status(500).send(error);
      }
    );
  } else {
    getReportData(
      req,
      (results) => {
        res.json(results);
      },
      (error) => {
        res.status(500).send(error);
      }
    );
  }
});

applicationRouter
  .route('/statistics/generate')
  .get(verifyOrdinaryUser, generateReport, (req, res, next) => {});

module.exports = applicationRouter;
