export const hasReviewedAll = (data) => {

    const currentStatus = data.reviewStatus
    const requiredSteps = data.reviewProcess.steps.filter(s=>s.required)

    //Check if the current status is equal to the last required step
    const lastRequiredStep = requiredSteps[requiredSteps.length - 1]
    
    if (lastRequiredStep.stage <= currentStatus.stage){
        return true
    }
    return false
}

    const getStepMessage = (data) => {
}

export const getReviewMessage = (data) => {

    const currentStatus = data.reviewStatus
    const stageForCurrentStep = data.reviewProcess.steps.find(s=>s.stage == currentStatus.stage)
    if (stageForCurrentStep != null){

        return stageForCurrentStep.feedback.negative.message
    }

    return 'Permit cannot be issued until all required actions are performed'
}

export const hasClearedPayment = (data) => {

    return !data.isPaymentRequired
}