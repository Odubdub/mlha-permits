const PermitTypes = {
    Export: 'ExportPermit',
    Import: 'ImportPermit',
    Rebate: 'RebateCertificate',
    Skip: 'SkipHire',
    Advertising: 'AdvertisingPermit',
    Stadium: 'StadiumHirePermit',
    Dog: 'DogLicense',
    SpecialEvents: 'SpecialEventsPermit',
    TempLiqour: 'TemporaryLiquorLicense',
    TreeCutting: 'TreeCuttingPermit',
    BurialPermits:'BurialPermit',
    Noise: 'NoiseNuisancePermit',
    Park: 'ParkSpaceHirePermit',
    FireReport: 'FireReportPermit',
    FireWorks: 'FireWorksPermit',
    Classroom: 'ClassroomDiningPermit'
}

const CRMApplicationStatuses = {
   
     submissionFailed: {
        "code":"1",
        "status":"submission failed",
        "description":"failed to submit application to gateway."
     },
     submitted: {
        "code":"2",
        "status":"Submitted",
        "description":"Application submitted successfully"
     },
     new: {
        "code":"3",
        "status":"new",
        "description":null
     },
     returned: {
        "code":"4",
        "status":"returned",
        "description":null
     },
     rejected: {
        "code":"5",
        "status":"rejected",
        "description":null
     },
     approved: {
        "code":"6",
        "status":"approved",
        "description":null
     },
     reuploaded: {
        "code":"7",
        "status":"reuploaded",
        "description":null
     },
     processing: {
        "code":"8",
        "status":"processing",
        "description":null
     },
     awaitingPayment:{
        "code":"9",
        "status":"awaiting payment",
        "description":"Application needs payment to continue processing."
     },
     submittingPayment: {
        "code":"10",
        "status":"submitting payment",
        "description":"Submitting payment details."
     },
     closed: {
        "code":"11",
        "status":"closed",
        "description":"Application completed and closed. no further changes allowed."
     },
     complete: {
        "code":"12",
        "status":"complete",
        "description":"Application complete but modifications allowed."
     },
     revoked:{
        "code":"13",
        "status":"revoked",
        "description":"Application has been revoked. The issued certificate is no longer valid."
    },
    submissionCorrection:{
        "code":"6",
        "status":"SubmissionCorrection",
        "description":"Application complete but modifications allowed."
    }
}

const Instant = 'instant'

module.exports = { PermitTypes, CRMApplicationStatuses, Instant }