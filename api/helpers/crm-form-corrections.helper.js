const axios = require('axios');
const { CRMApplicationStatuses } = require('../constants');
const ServiceConfig = require('../models/authority/service-config.model');

const requestApplicationPayment = async ({applicationId, userId, serviceCode, applicationFixes, serviceVersion, onComplete, onError}) => {

    const serviceConfig = await ServiceConfig.findOne({ code: serviceCode, version: serviceVersion })
    const fieldsToCorrect = serviceConfig.form.filter(field=>applicationFixes.fieldsToFix.includes(field.fieldName || field.groupName))
    if (serviceConfig){

        const notificationPayload = JSON.stringify({
            "status_code": CRMApplicationStatuses.submissionCorrection.code,
            "status_alias": "approved",
            "title": "Submission Correction",
            "attachments": [],
            "user_id": userId,
            "message": applicationFixes.returnMessage,
            "dismissed": false,
            "application_id": applicationId,
            "response_type": "SubmissionCorrection",
            "rich_text_message": "#rich text",
            "form_payload": fieldsToCorrect,
            "push_service": "MLHA_004_05_003",
            "push_payment": "{}"
        })

        const config = {
        method: 'POST',
        url: `${process.env.CRM_STATUS_UPDATE_URL}`,
        headers: {
            'application_id': applicationId,
            'Content-Type': 'application/json'
        },
        data: { "data": notificationPayload }
        }

        axios(config)
        .then((res) => {
            onComplete(res)
        }).catch(err => {
            console.log(err)
            onError(err)
        })
    }
}

module.exports = requestApplicationPayment;