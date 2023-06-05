const Application = require("../models/application/application.model")
const statistic = require('../models/application/application-stat.model');

const TimePeriods = {
    alltime: 0,
    daily: 1,
    weekly: 2,
    monthly: 3,
    yearly: 4
}

const getEndOfDay = (date) => {

    var endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)
    return endOfDay.getTime() / 1000
}

const getStartOfDay = (date) => {

    var endOfDay = new Date(date)
    endOfDay.setUTCHours(0, 0, 0, 0)
    return endOfDay.getTime() / 1000
}

const get7DaysBefore = (date) => {

    var d = new Date(date)
    d.setDate(d.getDate() - 7)

    return d
}

const get7WeeksBefore = (date) => {

    var d = new Date(date)
    d.setDate(d.getDate() - 49)
    return d
}

const get12MonthsBefore = (date) => {

    var d = new Date(date)
    d.setDate(d.getDate() - 365)
    return d
}

const get6YearsBefore = (date) => {

    var d = new Date(date)
    d.setDate(d.getDate() - 365 * 6)
    return d
}

const getDateBounds = (period, date) => {

    let result = {}

    if (period === TimePeriods.daily) {
        result.upper = getEndOfDay(date) + 1
        result.lowerDate = get7DaysBefore(date)
        result.lower = getStartOfDay(result.lowerDate) - 1
    } else if (period === TimePeriods.weekly) {
        result.upper = getStatsWeekOfDate(date) + 1
        result.lowerDate = get7WeeksBefore(date)
        result.lower = getStatsWeekOfDate(result.lowerDate) - 1
    } else if (period === TimePeriods.monthly) {
        result.upper = getStatsMonthOfDate(date) + 1
        result.lowerDate = get12MonthsBefore(date)
        result.lower = getStatsMonthOfDate(result.lowerDate) - 1
    } else {
        result.upper = date.getFullYear()
        result.lowerDate = get6YearsBefore(date)
        result.lower = result.lowerDate.getFullYear()
    }
    return result
}

const getBoundsSince = (date) => {
    
    let result = {}

    result.lower = getStartOfDay(Date(date))
    result.upper = getEndOfDay(new Date())
    return result
}



const getStatsWeekOfDate = (date) => {

    console.log('date od appliction is ',date)
    return Number(`${date.getFullYear()}${(date.getWeek()).toString().padStart(2, 0)}`)
}

const getStatsMonthOfDate = (date) => {

    return Number(`${date.getFullYear()}${(date.getMonth()).toString().padStart(2, 0)}`)
}

const updatePeriodicStats = ({ date, period, serviceCode, value = 1, status }) => {

    const newDate = new Date(date.getTime())
    newDate.setUTCHours(0, 0, 0, 0)

    let datePeriod

    if (period === TimePeriods.yearly) {

        //Get Year
        datePeriod = newDate.getFullYear()
    } else if (period === TimePeriods.monthly) {

        //Get sudo month
        datePeriod = getStatsMonthOfDate(newDate)
    } else if (period === TimePeriods.weekly) {

        //Get sudo week
        datePeriod = getStatsWeekOfDate(newDate)
    } else {
        //Set Start of Day
        datePeriod = newDate.getTime() / 1000
    }

    var query = { datePeriod: datePeriod, period: period, serviceCode: serviceCode, status: status }
    updateStatsCollection(query, value)
}

const updateAllTimeStats = ({ serviceCode, value, status }) => {

    var query = { period: TimePeriods.alltime, serviceCode: serviceCode, status: status }
    updateStatsCollection(query, value)
}

const updateStatsCollection = (query, value) => {

    var update = { $inc: { value: value, count: 1 } }
    var options = { upsert: true, new: true, setDefaultsOnInsert: true }

    statistic.findOneAndUpdate(query, update, options, function (error, _) {
        if (error) {
            console.log(error.message)
        }
    })
}

const updateRegStats = ({ value=33, serviceCode }) => {

    const date = new Date()

    updatePeriodicStats({ date: date, period: TimePeriods.daily, serviceCode: serviceCode, value: value, status: 'new' })
    updatePeriodicStats({ date: date, period: TimePeriods.weekly, serviceCode: serviceCode, value: value, status: 'new' })
    updatePeriodicStats({ date: date, period: TimePeriods.monthly, serviceCode: serviceCode, value: value, status: 'new' })
    updatePeriodicStats({ date: date, period: TimePeriods.yearly, serviceCode: serviceCode, value: value, status: 'new' })
    updateAllTimeStats({ serviceCode: serviceCode, value: value, status: 'new' })
}

const updateStatusStats = ({ value, serviceCode, status }) => {

    const date = new Date()

    updatePeriodicStats({ date: date, period: TimePeriods.daily, serviceCode: serviceCode, value: value, status: status })
    updatePeriodicStats({ date: date, period: TimePeriods.weekly, serviceCode: serviceCode, value: value, status: status })
    updatePeriodicStats({ date: date, period: TimePeriods.monthly, serviceCode: serviceCode, value: value, status: status })
    updatePeriodicStats({ date: date, period: TimePeriods.yearly, serviceCode: serviceCode, value: value, status: status })
    updateAllTimeStats({ serviceCode: serviceCode, value: value, status: status })
}

const test = () => {

    // findReportData(TimePeriods.daily, new Date('2022-04-28T07:18:09.789+00:00'))
    return

    //Property Instrument
    Application
        .find()
        .exec()
        .then(docs => {
            docs.forEach(doc => {
                updateRegStats({ date: doc.regDate, serviceCode: doc.serviceCode, value: Number(111) })
            })
        })
        .catch(err => {

            console.log('Weird error but update anyway!!!', err.message)
        })

}

const findStatusReportData = ({ period, date, serviceCodes, onComplete, onError }) => {
    
    let allTimeStatusResults = {}
    let allTimeStatusResultsComplete = false
    let periodicStatusResultsComplete = false
    let generalResultsComplete = false
    let backlogResultsComplete = false
    const allStatusFilters = {}

    //Alltime filters
    serviceCodes.forEach(serviceCode => {
        allStatusFilters[serviceCode] = []
        allStatusFilters[serviceCode].push({ name: 'new', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'new' }})
        allStatusFilters[serviceCode].push({ name: 'issued', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'issued' }})
        allStatusFilters[serviceCode].push({ name: 'rejected', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'rejected' }})
        allStatusFilters[serviceCode].push({ name: 'revoked', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'revoked' }})
    })

    //Get for all time filters
    serviceCodes.forEach(serviceCode => {
        allStatusFilters[serviceCode].forEach(filter => {
            getOne(filter.filters, 
                result => {
                    if (!allTimeStatusResults[serviceCode]){
                        allTimeStatusResults[serviceCode] = {}
                    }
                    allTimeStatusResults[serviceCode][filter.name] = result

                    //check if done
                    if (Object.keys(allTimeStatusResults).length === Object.keys(allStatusFilters).length) {
                        let hasPassed = true
                        Object.keys(allTimeStatusResults).forEach(serviceCode => {
                            if (Object.keys(allTimeStatusResults[serviceCode]).length !== 4) {
                                hasPassed = false
                            }
                        })

                        if (hasPassed) {
                            allTimeStatusResultsComplete = true
                            attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
                        }
                    }
                },
                error => {
                    console.log('error ', error)
                    onError(error)
                }
            )
        })
    })

    //Peridic Status Results
    const bounds = getDateBounds(period, date)

    const multiStats = [
        { name: 'new', sort: { datePeriod: period }, filters: { status: 'new', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } },
        { name: 'issued', sort: { datePeriod: period }, filters: { status: 'issued', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } },
        { name: 'revoked', sort: { datePeriod: period }, filters: { status: 'revoked', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } },
        { name: 'rejected', sort: { datePeriod: period }, filters: { status: 'rejected', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } }
    ]

    const periodicStatusResults = {}
    multiStats.forEach(query => {
        getAll(query.filters, query.sort, docs => {
            periodicStatusResults[query.name] = docs
            if ((Object.keys(multiStats).length) === Object.keys(periodicStatusResults).length) {
                periodicStatusResultsComplete = true
                attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
            }
        }, err => {
            onError(err)
        })
    })

    //General Periodic Results status: 'new'
    const generalStats = []
    serviceCodes.forEach(serviceCode => {
        generalStats.push({ name: serviceCode, sort: { datePeriod: period }, filters: { status: 'new', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: serviceCode }})
    })

    const generalResults = {}
    generalStats.forEach(query => {
        getAll(query.filters, query.sort, docs => {
            generalResults[query.name] = docs
            if ((generalStats.length) === Object.keys(generalResults).length) {
                generalResultsComplete = true
                attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
            }
        }, err => {
            onError(err)
        })
    })

    //Backlog results
    const backlogResults = {}
    serviceCodes.forEach(serviceCode => {
        Application.find({ serviceCode: serviceCode })
        .then(docs => {
            const issuedApplications = docs.filter(doc => doc.status === 'issued').length
            const pendingApplications = docs.filter(doc => doc.status === 'pending').length
            const rejectedApplications = docs.filter(doc => doc.status === 'rejected').length
            const pendingPaymentApplications = docs.filter(doc => doc.status === 'payment-requested').length
            const revokedApplications = docs.filter(doc => doc.status === 'revoked').length
            const returnedApplications = docs.filter(doc => doc.status === 'returned').length

            backlogResults[serviceCode] = {
                issued: issuedApplications,
                pending: pendingApplications,
                rejected: rejectedApplications,
                pendingPayment: pendingPaymentApplications,
                revoked: revokedApplications,
                returned: returnedApplications
            }
            if ((serviceCodes.length) === Object.keys(backlogResults).length) {
                backlogResultsComplete = true
                attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
            }
        })
    })
}

const findDepartmentReportData = ({ period, fromDate, serviceCodes, onComplete, onError }) => {
    
    let allTimeStatusResults = {}
    let allTimeStatusResultsComplete = false
    let periodicStatusResultsComplete = false
    let generalResultsComplete = false
    let backlogResultsComplete = false
    const allStatusFilters = {}

    //All time filters
    serviceCodes.forEach(serviceCode => {
        allStatusFilters[serviceCode] = []
        allStatusFilters[serviceCode].push({ name: 'new', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'new' }})
        allStatusFilters[serviceCode].push({ name: 'issued', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'issued' }})
        allStatusFilters[serviceCode].push({ name: 'rejected', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'rejected' }})
        allStatusFilters[serviceCode].push({ name: 'revoked', filters: { period: TimePeriods.alltime, serviceCode: serviceCode, status: 'revoked' }})
    })

    //Get for all time filters
    serviceCodes.forEach(serviceCode => {
        allStatusFilters[serviceCode].forEach(filter => {
            getOne(filter.filters, 
                result => {
                    if (!allTimeStatusResults[serviceCode]){
                        allTimeStatusResults[serviceCode] = {}
                    }
                    allTimeStatusResults[serviceCode][filter.name] = result

                    //check if done
                    if (Object.keys(allTimeStatusResults).length === Object.keys(allStatusFilters).length) {
                        let hasPassed = true
                        Object.keys(allTimeStatusResults).forEach(serviceCode => {
                            if (Object.keys(allTimeStatusResults[serviceCode]).length !== 4) {
                                hasPassed = false
                            }
                        })

                        if (hasPassed) {
                            allTimeStatusResultsComplete = true
                            attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
                        }
                    }
                },
                error => {
                    console.log('error ', error)
                    onError(error)
                }
            )
        })
    })

    //Peridic Status Results
    const bounds = getBoundsSince(fromDate)
    console.log('dept bounds',JSON.stringify(bounds, null, 2))

    const multiStats = [
        { name: 'new', sort: { datePeriod: period }, filters: { status: 'new', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } },
        { name: 'issued', sort: { datePeriod: period }, filters: { status: 'issued', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } },
        { name: 'revoked', sort: { datePeriod: period }, filters: { status: 'revoked', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } },
        { name: 'rejected', sort: { datePeriod: period }, filters: { status: 'rejected', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: { $in: serviceCodes } } }
    ]

    const periodicStatusResults = {}
    multiStats.forEach(query => {
        getAll(query.filters, query.sort, docs => {
            periodicStatusResults[query.name] = docs
            if ((Object.keys(multiStats).length) === Object.keys(periodicStatusResults).length) {
                periodicStatusResultsComplete = true
                attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
            }
        }, err => {
            onError(err)
        })
    })

    //General Periodic Results status: 'new'
    const generalStats = []
    serviceCodes.forEach(serviceCode => {
        generalStats.push({ name: serviceCode, sort: { datePeriod: period }, filters: { status: 'new', period: period, datePeriod: { $gt: bounds.lower, $lt: bounds.upper }, serviceCode: serviceCode }})
    })

    const generalResults = {}
    generalStats.forEach(query => {
        getAll(query.filters, query.sort, docs => {
            generalResults[query.name] = docs
            if ((generalStats.length) === Object.keys(generalResults).length) {
                generalResultsComplete = true
                attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
            }
        }, err => {
            onError(err)
        })
    })

    //Backlog results
    const backlogResults = {}
    serviceCodes.forEach(serviceCode => {
        Application.find({ serviceCode: serviceCode })
        .then(docs => {
            const issuedApplications = docs.filter(doc => doc.status === 'issued').length
            const pendingApplications = docs.filter(doc => doc.status === 'pending').length + docs.filter(doc => doc.status === 'new').length + docs.filter(doc => doc.status === 'pending-issuance').length
            const rejectedApplications = docs.filter(doc => doc.status === 'rejected').length
            const pendingPaymentApplications = docs.filter(doc => doc.status === 'payment-requested').length
            const revokedApplications = docs.filter(doc => doc.status === 'revoked').length
            const returnedApplications = docs.filter(doc => doc.status === 'returned').length

            backlogResults[serviceCode] = {
                issued: issuedApplications,
                pending: pendingApplications,
                rejected: rejectedApplications,
                pendingPayment: pendingPaymentApplications,
                revoked: revokedApplications,
                returned: returnedApplications,
                allApplications: docs.length
            }
            if ((serviceCodes.length) === Object.keys(backlogResults).length) {
                backlogResultsComplete = true
                attemptResponse({allTimeStatusResultsComplete, generalResultsComplete, periodicStatusResultsComplete, backlogResultsComplete, results: { allTimeStatusResults, periodicStatusResults, generalResults, backlogResults }, onComplete})
            }
        })
    })
}

const attemptResponse = ({periodicStatusResultsComplete, allTimeStatusResultsComplete, generalResultsComplete, backlogResultsComplete, onComplete, results}) => {
    console.log('attemptResponse ', periodicStatusResultsComplete, allTimeStatusResultsComplete, generalResultsComplete, backlogResultsComplete)
    if (periodicStatusResultsComplete && allTimeStatusResultsComplete && generalResultsComplete && backlogResultsComplete) {
        onComplete(results)
    } else {

    }
}

const getAll = (filters, sort = {}, onComplete, onError) => {

    statistic.find(filters).sort(sort)
    .exec()
    .then(docs => {
        onComplete(docs)
    })
    .catch(err => {
        console.log(`Error doing the things...`, err.message)
        onError(err)
    })
}

const getOne = (filters, onComplete, onError) => {
    statistic
    .findOne(filters)
    .then(doc => {

        if (doc === null) {
            onComplete({
                "period": 0,
                "serviceCode": filters.serviceCode,
                "status": filters.status,
                "__v": 0,
                "count": 0,
                "value": 0
              })
            } else {
                onComplete(doc)
            }
        })
    .catch(err => {
        onError(err)
    })
}

const getApplicantStatistics = (id, serviceCode, onComplete, onError) => {

    const projection = { _id: 1, status: 1, serviceCode: 1, createdAt: 1, updatedAt: 1 }

    Application.find({ 
        serviceCode: serviceCode,
        $or: [
            { applicationOwnerIdNo: id }, 
            { applicationAuthorIdNo: id }, 
            { 'applicationDetails.companyRegNo': id },
            { 'applicationDetails.businessRegNo': id }, 
            { 'applicationDetails.companyRegId': id },
            { 'applicationDetails.businessRegId': id }
        ]
        }, projection)
    .then(docs => {
        const issuedApplications = docs.filter(doc => doc.status === 'issued').length
        const pendingApplications = docs.filter(doc => doc.status === 'pending').length
        const rejectedApplications = docs.filter(doc => doc.status === 'rejected').length
        const pendingPaymentApplications = docs.filter(doc => doc.status === 'payment-requested').length
        const revokedApplications = docs.filter(doc => doc.status === 'revoked').length
        const returnedApplications = docs.filter(doc => doc.status === 'returned').length

        const results = {
            issued: issuedApplications,
            pending: pendingApplications,
            rejected: rejectedApplications,
            pendingPayment: pendingPaymentApplications,
            revoked: revokedApplications,
            returned: returnedApplications,
            total: docs.length,
            applications: docs
        }
        onComplete(results)
    })
    .catch(err => {
        onError(err)
    })
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1)
    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate())
    var dayOfYear = ((today - onejan + 86400000)/86400000)
    return Math.ceil(dayOfYear/7)
}

module.exports = { test, TimePeriods, findStatusReportData, findDepartmentReportData, getApplicantStatistics, updateRegStats, updateStatusStats }