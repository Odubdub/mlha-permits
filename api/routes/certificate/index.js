const express = require('express');
const { downloadFileFromCRM } = require('../../helpers/crm-file-downloader.helper');
const Application = require('../../models/application/application.model');
const CertificateConditions = require('../../models/certificate/conditions.model');
const { getFile } = require('../../util/minio.util')
const router = express.Router()

/*
 * Get the permit webpage
 */
 router.route('/').get((req, res) => {
    if (req.query.page == '1'){
      if (req.query.department == "MTI_007_12"){
        res.render('certificate_front_botc', { type: req.query.type, certID: req.query.certID })
      } else {
        res.render('certificate_front', { type: req.query.type, certID: req.query.certID })
      }
    } else {
      if (req.query.department == "MTI_007_12"){
        res.render('certificate_back_botc', { type: req.query.type, certID: req.query.certID })
      } else {
        res.render('certificate_back', { type: req.query.type, certID: req.query.certID })
      }
    }
});

router.route('/doc')
  .get(async (req, res, next) => {
    const applicationId = req.query.application_id;

    // find application
    Application.findById(applicationId)
    .populate('certificate')
    .exec(async (err, application) => {
      if (err) return next(err);

      // if no certificate send error
      if (application && !application.certificate) {
        console.log('no certificate');
        res.status(404).send('No certificate document found');
      } else {
        const { name, etag, bucket, versionId } = application.certificate.certificateFile;

        const fileStream = await getFile(bucket, name).createStream();

        // res.set('Content-disposition', 'attachment; filename=' + name);
        
        res.setHeader('Content-Type', 'application/pdf');

        // res.sendFile(fileStream.);

        fileStream.pipe(res);

        // fileStream.pi
      }
    });
  });

  router.route('/download')
  .get(async (req, res, next) => {
    const applicationId = req.query.application_id;

    // find application
    Application.findById(applicationId)
    .populate('certificate')
    .exec(async (err, application) => {
      if (err) return next(err);

      // if no certificate send error
      if (application && !application.certificate) {
        console.log('no certificate');
        res.status(404).send('No certificate document found');
      } else {
        const { name, etag, bucket, versionId } = application.certificate.certificateFile;

        const fileStream = await getFile(bucket, name).createStream();
        res.set('Content-disposition', 'attachment; filename=' + name);
        res.setHeader('Content-Type', 'application/pdf');
        fileStream.pipe(res);
      }
    });
  });

  router.route('/conditions/:serviceId')
  .get(async (req, res, next) => {
    //find one by serviceId from CertificateConditions
    CertificateConditions
    .findOne({service: req.params.serviceId})
    .exec((err, conditions) => {
      if (err) {
        return next(err);
      };
      res.json(conditions);
    });
  })
  .post(async (req, res, next) => {
    CertificateConditions
    .create(req.body, (err, condition) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Added condition - ${condition._id} for service ${req.params.serviceId}`)
    });
  })
  .put(async (req, res, next) => {
    CertificateConditions.findOneAndUpdate({service: req.params.serviceId}, req.body, (err, condition) => {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end(`Updated condition ${condition._id}`)
    });
  });

  router.route('/crmfile')
  .get(async (req, res, next) => {
    try {
      const crmResponse = await downloadFileFromCRM(req.query.fileId);
      // res.set('Content-disposition', 'attachment; filename=' + crmResponse.fileName);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.send(crmResponse.file);
      res.send(crmResponse);
    } catch (error) {
      return next(error);
    }
  }
  );

module.exports = router;