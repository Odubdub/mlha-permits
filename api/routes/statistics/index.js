const express = require('express');
const lodash = require('lodash');
const puppeteer = require('puppeteer');
const { verifyOrdinaryUser } = require('../../middleware/authorisation');
const User = require('../../models/access/User');
const Service = require('../../models/authority/service.model');
const { TimePeriods, getApplicantStatistics, findDepartmentReportData, findStatusReportData } = require('../../util/statistics');
const router = express.Router()

const setUserServices = async (req, res, next) => {
    
  const user = await User.findById(req.decoded._id)
    .populate({
      path: 'roles',
      model: 'Role',
      select: ['name', 'service'],
      populate: {
        path: 'service',
        model: 'Service',
        select: ['name', 'code']
      }
    })
    .exec();

    if (user &&  user.type == 'admin' && user.roles.length > 0) {
      req.serviceCodes = lodash.uniq(user.roles.map(role => role.service.code));
      next();
    } else if (user && user.type == 'superadmin' && user.department) {
      //TODO: Set ServiceCodes by department
      const servs = await Service.find({department: user.department})
      req.serviceCodes = servs.map(s=>s.code)
      next();
    } else if (user.type == 'developer') {
      //TODO: Set all ServiceCodes
      const servs = await Service.find({})
      req.serviceCodes = servs.map(s=>s.code)
      next();
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`An error occured`);
    }
}

router.route('/').get((_, res) => {
  res.render('report')
});

router.route('/all')
  .get(verifyOrdinaryUser, setUserServices, (req, res, next) => {
    findStatusReportData({
        period: TimePeriods.daily,
        date: new Date(),
        serviceCodes: req.serviceCodes,
        onComplete: results => {
            res.json(results);
        },
        onError: err => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`An error occured`);
        }
    })
});

router.route('/services')
  .get((req, res, next) => {
    
    findDepartmentReportData({
      period: TimePeriods.daily,
      fromDate: req.query.date,
      serviceCodes: req.query.serviceCodes.split(','),
      onComplete: results => {
          res.json(results);
      },
      onError: err => {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`An error occured`);
      }
  })
});

router.route('/department')
  .get(verifyOrdinaryUser, setUserServices, async (req, res, next) => {
    
    const url = `http://localhost:3000/statistics?serviceCodes=${req.serviceCodes.join(',')}&date=${req.query.date}&department=${req.query.department}`

    try {

      const browser = await puppeteer.launch({ headless: true });

      //Page 1
      const page1 = await browser.newPage();
      await page1.goto(url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

      const reportPageBuffer = await page1.pdf({
        format: 'A4',
        printBackground: true
      });

      const filename = `report-${req.query.date}.pdf`;
      res.status(200).send(reportPageBuffer.toString('base64'));

    } catch (err) {

      console.log(err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`An error occured`);
    }
});

router.route('/applicant/:serviceCode/:id')
  .post(verifyOrdinaryUser, setUserServices, (req, res, next) => {
    console.log('req.body.serviceCodes = ', req.body.serviceCodes)
    if (!req.params.id && !req.params.serviceCode) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`An error occured`);
    } else {
      
        if (req.serviceCodes.includes(req.params.serviceCode)) {
            getApplicantStatistics(req.params.id, req.params.serviceCode, 
            results => {
                res.json(results);
            },
            err => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`An error occured ${err}`);
            })
        } else {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end(`Forbidden`);
        }
    }
});

module.exports = router;