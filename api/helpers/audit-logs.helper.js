const { getOrdinaryUser } = require("../middleware/authorisation")
const Log = require("../models/audit/log.model")

const audit = (req, res) => {

    console.log('---------- BODY START -----------')
    console.log(req.body)
    console.log('---------- BODY END -----------')

    // getUser(req, async (user) => {

    //     try {
    //         const log = createRequestLog(req, res)

    //         if (log){
    //             // Check if the last log was the same
    //             const filters = {}
                
    //             if (log.user){
    //                 filters['user.idNumber'] = log.user.idNumber
    //                 filters.sessionId = log.user.sessionId
    //                 if (log.application){
    //                     filters.application = log.application
    //                 }
    //             }

    //             filters.target = log.target
    //             filters.action = log.action
    //             filters.description = log.description
    //             filters.module = log.module
    //             filters.status = log.status

    //             // Get the last log for this user
    //             const lastLog = await Log.findOne(filters).sort({createdAt: -1})

    //             // If the last log was not the same, create a new log
    //             if (!lastLog){
    //                 Log.create({
    //                     ...log
    //                 })

    //             } else {
    //             }
    //         } else {
    //             return false
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     } 
    // })

    return req.baseUrl == '/queries' && req.statusCode == 304
}

const getUser = (req, onComplete) => {

    let user = req.decoded

    if (!user){
        
        user = getOrdinaryUser(req)
    }

    onComplete(user)
}

const createRequestLog = (req, res) => {

    // if (res.statusCode == 304) return null

    console.log('- - - - - - - - - - - - - - - - - - - - - - - -')
    // console.log(req.body)

    const logger = {}
    const path = cleanPath(req.originalUrl)

    const routesToSkip = ['certificate?id=', 'authority/services', 'authority/notifications','authority/departments', 'certificate/conditions','authority/admin-users','queries', 'permit_base.png', 'license_base.png', 'registration_base', 'certificate_base.png', 'logs/application']

    for (let i = 0; i < routesToSkip.length; i++) {
        if (path.includes(routesToSkip[i])){
            return null
        }
    }


    if (req.method == 'GET' && 'authority/services/user-services' == path){
        logger.target = LogTargets.system
        logger.module = LogTargets.system
        logger.description = `${req.decoded.foreNames} ${req.decoded.lastName} received authorised services`
        logger.action = LogActions.received
    } else if (req.method == 'GET' && path == 'queries'){
        logger.action = LogActions.login
        logger.module = LogTargets.system
        logger.target = LogTargets.query
        logger.user = {
            idNumber: req.body.idNumber
        }
        logger.description = 'Fetched updates on customer messages'
    } else if (req.method == 'GET' && path.startsWith('applications?query')){
        logger.module = LogModules.applications
        logger.target = LogTargets.application
        logger.action = LogActions.fetched
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system]
        logger.description = "Fetched customer applications for user"
    } else if (req.method == 'GET' && path == 'applications/statistics/all'){
        logger.module = LogModules.reports
        logger.target = LogTargets.applications
        logger.action = LogActions.fetched
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system]
        logger.description = "Fetched customer applications' reports"
    } else if (req.method == 'GET' && path.startsWith('applications/')){
        logger.description = "Opened Application"
        logger.application = getApplicationId(req, 'applications/:id')
        logger.action = LogActions.fetched
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system]
        logger.target = LogTargets.application
        logger.module = LogModules.applications
    } else if (req.method == 'POST' && path.startsWith('applications/') && req.loggerSubmissionType){
        logger.description = `Submitted ${req.loggerSubmissionType}`
        logger.module = LogModules.applications
        logger.action = LogActions.submitted
        logger.target = LogTargets.application
        logger.initiatorChain = [LogActorTypes.crm, LogActorTypes.crm, LogActorTypes.gateway, LogActorTypes.system]
        logger.application = req.loggerApplicationId
    } else if (req.method == 'POST' && matchPath('applications/:id/review-status', path)){                                           
        logger.module = LogModules.applications
        logger.action = LogActions.reviewed
        logger.target = LogTargets.application
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system]
        logger.application = getApplicationId(req, 'applications/:id/review-status')
        logger.description = req.loggerDescription
    } else if (req.method == 'POST' && matchPath('applications/:id/undo-review-status', path)){
        logger.module = LogModules.applications
        logger.action = LogActions.reviewed
        logger.target = LogTargets.application
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system]
        logger.application = getApplicationId(req, 'applications/:id/undo-review-status')
        logger.description = "Reversed review status"
    } else if (req.method == 'POST' && matchPath('applications/:id/return-form', path)){
        logger.module = LogModules.applications
        logger.action = LogActions.returned
        logger.target = LogTargets.form
        logger.application = getApplicationId(req, 'applications/:id/return-form')
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.crm, LogActorTypes.customer]
        logger.description = "Returned application to customer"
    } else if (req.method == 'POST' && matchPath('applications/:id/reject', path)){
        logger.module = LogModules.applications
        logger.action = LogActions.rejected
        logger.target = LogTargets.application
        logger.application = getApplicationId(req, 'applications/:id/reject')
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.crm, LogActorTypes.customer]
        logger.description = "Rejected Customer Application"
    } else if (req.method == 'POST' && matchPath('applications/:id/resolve-cipa', path)){
        logger.module = LogModules.applications
        logger.target = LogTargets.cipa
        logger.action = LogActions.validate
        logger.application = getApplicationId(req, 'applications/:id/resolve-cipa')
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.crm, LogActorTypes.customer]
        logger.description = "Resolved company/business in application"
    } else if (req.method == 'POST' && matchPath('applications/:id/generate-certificate', path)){
        logger.module = LogModules.applications
        logger.action = LogActions.generated
        logger.target = req.loggerDocumentType
        logger.application = getApplicationId(req, 'applications/:id/generate-certificate')
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.crm, LogActorTypes.customer]
        logger.description = `Generated ${req.loggerDocumentType}`
    } else if (req.method == 'POST' && matchPath('applications/:id/revoke', path)){
        logger.module = LogModules.applications
        logger.action = LogActions.revoked
        logger.target = req.loggerDocumentType
        logger.application = getApplicationId(req, 'applications/:id/revoke')
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.crm, LogActorTypes.customer]
        logger.description = `Revoked the issued ${req.issuanceType}`
    } else if (req.method == 'POST' && matchPath('applications/:id/issue', path)){
        logger.module = LogModules.applications
        logger.action = LogActions.issued
        logger.target = req.loggerDocumentType
        logger.application = getApplicationId(req, 'applications/:id/issue')
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.crm, LogActorTypes.customer]
        logger.description = `Issued ${req.issuanceType}`
    } else if (req.method == 'POST' && matchPath('applications/:id/payments', path)){
        logger.module = LogModules.applications
        logger.action = LogActions.issued
        logger.target = req.loggerDocumentType
        logger.application = req.loggerApplicationId
        logger.initiatorChain = [LogActorTypes.customer, LogActorTypes.crm, LogActorTypes.gateway, LogActorTypes.system]
        logger.description = `Received Issuance Payment for ${req.loggerDocumentType}`
    } else if ( req.method == 'GET' && path.startsWith('validations/omang/')){
        logger.module = LogModules.applications
        logger.action = LogActions.validate
        logger.target = LogTargets.omang
        logger.application = req.query.application_id
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.omang]
        logger.description = 'Initiated omang validation'
    } else if ( req.method == 'GET' && path.startsWith('validations/cipa/')){
        logger.description = 'Initiated company/business validation'
        logger.module = LogModules.applications
        logger.action = LogActions.validate
        logger.target = LogTargets.cipa
        logger.application = req.query.application_id
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.cipa]
    } else if ( req.method == 'POST' && path.startsWith('access-control/auth')){
        logger.description = 'Internal user verification'
        logger.module = LogModules.authentication
        logger.action = LogActions.login
        logger.target = LogTargets.system

        logger.user = {
            idNumber: req.body.idNumber
        }
        logger.initiatorChain = [LogActorTypes.user, LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.iam]
    } else if (req.method == 'POST' && path.startsWith('access-control/auth/login-with-token')){
        logger.description = 'Initiated token validation with IAM'
        logger.module = LogModules.authentication
        logger.initiatorChain = [LogActorTypes.system, LogActorTypes.gateway, LogActorTypes.iam]
        logger.action = LogActions.login
        logger.target = LogTargets.system
    } else {
        // By default this route is not monitored
        return null
    }
    
    // console.log('logger', logger)
    
    logger.initiatorChain = logger.initiatorChain || []
    
    if (logger.initiatorChain.length){
        if (logger.initiatorChain[0] == LogActorTypes.user && req.decoded){
            logger.user = req.decoded
            logger.sessionId = req.decoded.sessionId || null
        }
    }

    //Status
    logger.status = res.statusCode

    logger.date = new Date()

    logger.path = path

    console.log(logger)

    return logger
}

const getApplicationId = (req, template) => {
    const index = template.split('/').indexOf(':id')
    return cleanPath(req.originalUrl).split('/')[index]
}

function cleanPath(str) {
    return str.replace(/^\/|\/$/g, '');
  }

  function matchPath(pattern, test) {
    
    const patternRegex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
    const testPath = cleanPath(test);
    return patternRegex.test(testPath);
  }
  

const LogActions = {
    opened: 'opened',
    closed: 'closed',
    reviewed: 'reviewed',
    approved: 'approved',
    fetched: 'fetched',
    submitted: 'submitted',
    generated: 'generated',
    login: 'login',
    logout: 'logout',
    edited: 'edited',
    validate: 'validated',
    rejected: 'rejected',
    revoked: 'revoked',
    issued: 'issued',
    returned: 'returned',
    received: 'received',
    filtered: 'filtered'
}

const LogTargets = {
    application: 'application',
    applications: 'applications',
    form: 'form',
    certificate: 'certificate',
    permit: 'permit',
    document: 'document',
    applicant: 'applicant',
    query: 'query',
    system: 'system',
    services: 'services',
    officer: 'officer',
    cipa: 'cipa',
    omang: 'omang',
    corrections: 'corrections'
}

const LogModules = {
    portal: 'portal',
    reports: 'reports',
    applications: 'applications',
    config: 'config',
    authentication: 'authentication',
    serviceTools: 'service tools',
    applicationDetails: 'application details'
}

const LogActorTypes = {
    system: 'system',
    user: 'user',
    customer: 'customer',
    crm: 'crm',
    gateway: 'gateway',
    comms: 'comms',
    ppm: 'ppm',
    omang: 'omang',
    cipa: 'cipa',
    iam: 'iam'
}

module.exports = { audit, LogActions, LogModules, LogTargets, LogActorTypes }
