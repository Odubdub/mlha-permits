const axios = require('axios');
const { CRMApplicationStatuses } = require('../constants');
const { getFieldValue } = require('./parser')

const getPaymentService = ({data, config}) => {
  if (config.issuanceFeeType == 'Flat') {
    return {service: config.issuanceFeeService, fee: config.issuanceFee, glCode: config.issuanceGlCode};
  } else if (config.issuanceFeeType == 'Dependant') {
    const value = getFieldValue(data,`applicationDetails.${config.issuanceFeeDependancy.key}`, null);
    const conf = config.issuanceFeeDependancy.depandancy.find((d) => d.value == value);

    if (conf){
      
      return {fee: conf.fee, service : conf.service, glCode: conf.glCode};
    }

    // For 
    return {service: config.issuanceFeeService, fee: config.issuanceFee, glCode: config.issuanceGlCode};
  }

  return {service: config.issuanceFeeService, fee: config.issuanceFee, glCode: config.issuanceGlCode};
};

module.exports = getPaymentService;