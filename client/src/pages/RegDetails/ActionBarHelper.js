export let issueMessage = '';

export const hasPassedReviewStages = (data) => {
  issueMessage = '';
  const currentStatus = data.reviewStatus;
  const requiredSteps = data.reviewProcess.steps.filter((s) => s.required);

  //Check if the current status is equal to the last required step
  const lastRequiredStep = requiredSteps[requiredSteps.length - 1];

  if (lastRequiredStep.stage <= currentStatus.stage) {
    return true;
  } else {
    issueMessage = 'Permit cannot be issued until all required actions are performed.';
  }

  return false;
};

export const hasIssuancePayment = (data, serviceConfig) => {
  if (serviceConfig.issuanceFeeType == 'Flat') {
    return serviceConfig.issuanceFee != 0;
  } else if (serviceConfig.issuanceFeeType == 'Dependant') {
    return serviceConfig.issuanceFeeDependancy.depandancy.length != 0;
  }

  return false;
};

export const hasBeenApprovedIssuancePayment = (data, serviceConfig) => {
  let hasIssuanceFee = hasIssuancePayment(data, serviceConfig);

  if (hasIssuanceFee) {
    return 'SUCCESSFUL' == (data.issuanceFeeDetails || {}).status || '';
  }

  return true;
};

export const getIssuanceMessage = (data) => {
  const currentStatus = data.reviewStatus;
  const requiredSteps = data.reviewProcess.steps.filter((s) => s.required);

  //Check if the current status is equal to the last required step
  const lastRequiredStep = requiredSteps[requiredSteps.length - 1];

  if (lastRequiredStep.stage > currentStatus.stage) {
  } else if (data.isPaymentRequired && data.paymentStatus != 'approved') {
    return 'Payment is required.';
  }

  return '#Permit cannot be issued until all required actions are performed.';
};

export const hasClearedPayment = (data) => {
  return !data.isPaymentRequired;
};
