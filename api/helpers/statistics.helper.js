const lodash = require('lodash');
const puppeteer = require('puppeteer');
const User = require("../models/access/User");
const Application = require('../models/application/application.model')
const Department = require('../models/authority/department.model')
const ServiceConfig = require('../models/authority/service-config.model')
const Service = require('../models/authority/service.model')
const getPaymentService = require('./crm-payment.helper')

const rawApplicationStats = async(req, res, next) => {
    // filter
    try {
        
        const fromDate = new Date(req.query.fromDate);
        const untilDate = new Date(req.query.untilDate);

        fromDate.setHours(0,0,0,0);
        untilDate.setHours(23,59,59,999);
        // Set the end of the day to untilDate

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
        
        // Get serviceConfigs
        let serviceCodes 
        if (user &&  user.type == 'admin' && user.roles.length > 0) {
            serviceCodes = lodash.uniq(user.roles.map(role => role.service.code));
        } else if (user && user.type == 'superadmin' && user.department) {
            const services = await Service.find({department: user.department}).exec();
            serviceCodes = services.map(service => service.code);
        } else if (user && user.type == 'developer') {
            const services = await Service.find({}).exec();
            serviceCodes = services.map(service => service.code);
        } else {
            return res.status(401).json({
                message: 'You are not authorized to access this resource'
            });
        }

        const configs = await ServiceConfig.find({code: {$in: serviceCodes}}, {shortName: 1,code:1, glCode: 1}).exec();
        
        const allResults = []

        // Loop through each day of the period
        const daysBetweenDates = getDaysBetweenDates(fromDate, untilDate);

        for (let i = 0; i < configs.length; i++) {
            const config = configs[i];
            const shortName = config.shortName;
            const glCode = config.glCode || 'N/A';

            const stats = {
                shortName,
                glCode,
                serviceCode: config.code,
                rejected: [],
                issued: [],
                revoked: [],
                returned: [],
                pendingPayment: [],
                pending: [],
                count: [],
                totalIssuanceFees: [],
                totalApplicationFees: [],
                totalFees: [],
                new: []
            }

            for (let i = 0; i < daysBetweenDates; i++) {

                const day = addDayToDate(new Date(req.query.fromDate), i);
                const dayStart = new Date(day);
                const dayEnd = new Date(day);
                dayStart.setHours(0,0,0,0);
                dayEnd.setHours(23,59,59,999);
                
                // console.log('From Date ', dayStart)
                // console.log('Until Date', dayEnd)

                // 
                const docs = await Application.find({ createdAt: { $gte: dayStart, $lte: dayEnd }, serviceCode: config.code}).exec();

                // Calculate Totals by status
                const rejected = docs.filter(doc => doc.status == 'rejected').length;
                
                const issued = docs.filter(doc => doc.status == 'issued').length;

                const revoked = docs.filter(doc => doc.status == 'revoked').length;

                const returned = docs.filter(doc => doc.status == 'returned').length;

                const newApps = docs.filter(doc => doc.status == 'new').length;

                const pendingPayment = docs.filter(doc => doc.status == 'pending-payment').length;
                
                const pending = docs.filter(doc => doc.status == 'pending').length;

                // Financials
                const totalApplicationFees = docs.reduce((acc, doc) => acc + Number((doc.paymentDetails||{}).amount||0), 0);
                const totalIssuanceFees = docs.reduce((acc, doc) => acc + Number((doc.issuanceFeeDetails||{}).amount||0), 0);
                const totalFees = totalApplicationFees + totalIssuanceFees;

                if (docs.length){

                    console.log(config.shortName, ' -> ', dayStart, ' -> ', docs.length)
                }

                stats.count.push({
                    day: dayStart,
                    count: docs.length,
                })

                stats.issued.push({
                    day: dayStart,
                    count: issued,
                })

                stats.pending.push({
                    day: dayStart,
                    count: pending,
                })

                stats.pendingPayment.push({
                    day: dayStart,
                    count: pendingPayment,
                })

                stats.rejected.push({
                    day: dayStart,
                    count: rejected,
                })

                stats.revoked.push({
                    day: dayStart,
                    count: revoked,
                })

                stats.returned.push({
                    day: dayStart,
                    count: returned,
                })

                stats.new.push({
                    day: dayStart,
                    count: newApps
                })

                stats.totalApplicationFees.push({
                    day: dayStart,
                    count: totalApplicationFees,
                })

                stats.totalIssuanceFees.push({
                    day: dayStart,
                    count: totalIssuanceFees,
                })

                stats.totalFees.push({
                    day: dayStart,
                    count: totalFees,
                })
            }

            allResults.push(stats);
        }

        req.applicationStats = allResults;
        next();

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

const generateReport = async(req, res) => {
        
    // filter
    const url = `http://localhost:3000/statistics?userId=${req.decoded._id}&fromDate=${req.query.fromDate}&untilDate=${req.query.untilDate}&financial=${req.query.financial=='true'}`

    console.log(url)
    try {

      const browser = await puppeteer.launch({ headless: true });

      //Page 1
      const page1 = await browser.newPage();
      await page1.goto(url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

      const reportPageBuffer = await page1.pdf({
        format: 'A4',
        printBackground: true
      });

      res.status(200).send(reportPageBuffer.toString('base64'));

    } catch (err) {

      console.log(err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`An error occured`);
    }
}

const getReportData = async (req, onComplete, onError) => {

    try {
        
        const fromDate = new Date(req.query.fromDate);
        const untilDate = new Date(req.query.untilDate);

        fromDate.setHours(0,0,0,0);
        untilDate.setHours(23,59,59,999);

        // Set the end of the day to untilDateconst fromDate = new Date(req.query.fromDate);
        const user = await User.findById(req.query.userId)
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

    
        const dept = await Department.findById(user.department).exec();
        
        // Get serviceConfigs
        let serviceCodes 
        if (user &&  user.type == 'admin' && user.roles.length > 0) {
            serviceCodes = lodash.uniq(user.roles.map(role => role.service.code));
        } else if (user && user.type == 'superadmin' && user.department) {
            const services = await Service.find({department: user.department}).exec();
            serviceCodes = services.map(service => service.code);
        } else if (user && user.type == 'developer') {
            const services = await Service.find({}).exec();
            serviceCodes = services.map(service => service.code);
        } else {
            return onError({
                message: 'You are not authorized to access this resource'
            });
        }

        const configs = await ServiceConfig.find({code: {$in: serviceCodes}}, {shortName: 1,code:1, glCode: 1}).exec();
        
        const results = []

        // Loop through each day of the period
        const daysBetweenDates = getDaysBetweenDates(fromDate, untilDate);

        for (let i = 0; i < configs.length; i++) {
            const config = configs[i];
            const shortName = config.shortName;
            const glCode = config.glCode || 'N/A';
 
            // console.log('From Date ', dayStart)
            // console.log('Until Date', dayEnd)

            // 
            const docs = await Application.find({ createdAt: { $gte: fromDate, $lte: untilDate }, serviceCode: config.code}).exec();

            // Calculate Totals by status
            const rejected = docs.filter(doc => doc.status == 'rejected').length;
            
            const issued = docs.filter(doc => doc.status == 'issued').length;

            const revoked = docs.filter(doc => doc.status == 'revoked').length;

            const returned = docs.filter(doc => doc.status == 'returned').length;

            const pendingPayment = docs.filter(doc => doc.status == 'pending-payment').length;
            
            const inReview = docs.filter(doc => ['pending','pending-payment','new', 'returned'].includes(doc.status)).length;
            
            const pending = docs.filter(doc => ['pending', 'new'].includes(doc.status)).length;

            // Financials
            const totalApplicationFees = docs.reduce((acc, doc) => acc + Number((doc.paymentDetails||{}).amount||0), 0);
            const totalIssuanceFees = docs.reduce((acc, doc) => acc + Number((doc.issuanceFeeDetails||{}).amount||0), 0);
            const totalFees = totalApplicationFees + totalIssuanceFees;
            const applicationFee = config.applicationFee || 0;

            let issuanceFee = 0;
            if (config.issuanceFeeType == 'Flat'){
                issuanceFee = config.issuanceFee || 0;
            } else if (config.issuanceFeeType == 'Dependant') {
                issuanceFee = config.issuanceFeeDependancy.depandancy.map(dep => (dep.fee)).join('/ ');
            }

            const stats = {
                shortName,
                glCode,
                serviceCode: config.code,
                rejected,
                issued,
                inReview,
                revoked,
                returned,
                pendingPayment,
                pending,
                count: docs.length,
                totalIssuanceFees,
                totalApplicationFees,
                applicationFee,
                issuanceFee,
                totalFees
            }

            results.push(stats);
        }

        onComplete({ dept: dept || {name: 'Departmental'}, results});

    } catch (error) {
        
        onError.log(error);
        on({
            message: 'Something went wrong'
        })
    }
}


const getFinancialReportData = async (req, onComplete, onError) => {
    try {
        
        const fromDate = new Date(req.query.fromDate);
        const untilDate = new Date(req.query.untilDate);

        fromDate.setHours(0,0,0,0);
        untilDate.setHours(23,59,59,999);

        // Set the end of the day to untilDateconst fromDate = new Date(req.query.fromDate);
        const user = await User.findById(req.query.userId)
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

    
        const dept = await Department.findById(user.department).exec();
        
        // Get serviceConfigs
        let serviceCodes 
        if (user &&  user.type == 'admin' && user.roles.length > 0) {
            serviceCodes = lodash.uniq(user.roles.map(role => role.service.code));
        } else if (user && user.type == 'superadmin' && user.department) {
            const services = await Service.find({department: user.department}).exec();
            serviceCodes = services.map(service => service.code);
        } else if (user && user.type == 'developer') {
            const services = await Service.find({}).exec();
            serviceCodes = services.map(service => service.code);
        } else {
            return onError({
                message: 'You are not authorized to access this resource'
            });
        }
        
        const results = []

        const docs = await Application.find({ createdAt: { $gte: fromDate, $lte: untilDate }, serviceCode:{$in: serviceCodes} }).populate({path: 'serviceConfig',select: ['renderer']}).exec();

        console.log(docs.length, " docs")
          docs.forEach(doc=>{

            let glCode
            let issuanceGlCode
            let applicationFee = 0
            let issuanceFee = 0
            let applicationCount = 1
            let issuanceCount = 0

            let serviceApplicationFee = 0
            let serviceIssuanceFee = 0

            if (doc.serviceConfig.applicationFee != 0){    
                glCode = doc.serviceConfig.renderer.glCode
                serviceApplicationFee = doc.serviceConfig.renderer.applicationFee

                if (doc.paymentDetails){
                    applicationFee = (doc.paymentDetails||{}).amount || 0
                    applicationCount = 1
                }
            }
    
            let issuanceService
            if (doc.serviceConfig.issuanceFee != 0){
                issuanceService = getPaymentService({data: doc, config: doc.serviceConfig.renderer})
                console.log(issuanceService)
                if (issuanceService){                
                    issuanceGlCode = issuanceService.glCode
                    serviceIssuanceFee = issuanceService.fee
    
                    if (doc.issuanceFeeDetails){
                        
                        issuanceFee = (doc.issuanceFeeDetails||{}).amount || 0
                        issuanceCount = 1
                    }
                } else {
                    
                    issuanceGlCode = doc.serviceCode
                }
            }

            const res = {glCode: glCode || issuanceGlCode, applicationFee: Number(applicationFee), issuanceFee: Number(issuanceFee), serviceApplicationFee, applicationCount, issuanceCount, serviceIssuanceFee}
            
            if (res.glCode){

                const item = results.find(item=>item.glCode == res.glCode)
                if (item){
                    item.applicationCount += Number(applicationCount)
                    item.issuanceCount += Number(issuanceCount)
                    item.issuanceFee += Number(issuanceFee)
                    item.applicationFee += Number(applicationFee)
                } else {
                    results.push(res)
                }
            } else {
                console.log('--------------------------NO GL CODE--------------------------')
                console.log(doc.type)
                console.log('glCode', glCode)
                console.log('issuanceGlCode', issuanceGlCode)
                console.log('Final GL Code')
                console.log('_______________________________________________________________')
            }
          })

        onComplete({ dept: dept || {name: 'Departmental'}, results});
    } catch (error) {
        
        console.log(error);
        onError({
            message: 'Something went wrong'
        })
    }
}


const getDaysBetweenDates = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date2 - date1) / oneDay));
    return diffDays;
}

const addDayToDate = (date, i) => {
    const d = new Date(date);
    d.setDate(date.getDate() + i);
    return d;
}

module.exports = {rawApplicationStats, generateReport, getReportData, getFinancialReportData};