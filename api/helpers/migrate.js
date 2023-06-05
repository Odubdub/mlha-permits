const { default: axios } = require("axios")
const Application = require("../models/application/application.model")
const Role = require('../models/access/Role');
const User = require('../models/access/User');
const Department = require('../models/authority/department.model');
const Ministry = require('../models/authority/ministry.model');
const Service = require('../models/authority/service.model');
const Statistic = require('../models/application/application-stat.model');
const CertificateConditions = require('../models/certificate/conditions.model');
const CertificateCounter = require('../models/certificate/certificate-counter.model');
const Certificate = require('../models/certificate/certificate.model');
const Applicant = require('../models/applicants/applicant.model');

const migrate = () => {

    const source = {

        // applications: Applicati
        users: User,
        departments: Department,
        ministries: Ministry,
        services: Service,
        statistics: Statistic,
        certificateconditions: CertificateConditions,
        certificatecounters: CertificateCounter,
        certificates: Certificate,
        applicants: Applicant,
        roles: Role
    }

    Object.keys(source).forEach(key => {

        const model = source[key]

        model.find({})
        .then(docs => {
            if (docs.length == 0) {
                console.log(`Fetching ${key} ${`${process.env.MIGRATION_SOURCE_HOST_URL}/${key}`}`)
                axios.get(`${process.env.MIGRATION_SOURCE_HOST_URL}/${key}`)
                .then(response => {
                    console.log(`Found ${response.data.length} ${key} from previous system`)
                    response.data.forEach(document => {
                        model.create(document)
                        .then(() => {
                            console.log('Application created')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    })
                })
            } else {
                console.log('Using existing ' + docs.length + ' ' + key)
            }
            // console.log(key, docs.length)
        })
        .catch(err => {
            console.log(err)
        })
    })
}

module.exports = migrate