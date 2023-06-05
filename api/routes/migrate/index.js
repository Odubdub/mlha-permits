const express = require('express');
const router = express.Router()
const { default: mongoose } = require("mongoose");
const Role = require('../../models/access/Role');
const User = require('../../models/access/User');
const Application = require('../../models/application/application.model');
const Department = require('../../models/authority/department.model');
const Ministry = require('../../models/authority/ministry.model');
const Service = require('../../models/authority/service.model');
const Statistic = require('../../models/application/application-stat.model');
const CertificateConditions = require('../../models/certificate/conditions.model');
const CertificateCounter = require('../../models/certificate/certificate-counter.model');
const Certificate = require('../../models/certificate/certificate.model');
const Applicant = require('../../models/applicants/applicant.model');

router.get('/applications', (req, res) => {

    Application.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/users', (req, res) => {

    User.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/departments', (req, res) => {

    Department.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/ministries', (req, res) => {

    Ministry.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/services', (req, res) => {

    Service.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/roles', (req, res) => {

    Role.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})


router.get('/statistics', (req, res) => {

    Statistic.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/certificateconditions', (req, res) => {

    CertificateConditions.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/certificatecounters', (req, res) => {

    CertificateCounter.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/certificates', (req, res) => {

    Certificate.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/applicants', (req, res) => {

    Applicant.find({})
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.send(err)
    })
})

module.exports = router;