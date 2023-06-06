export const getBlameErrorMessage = (blame) => {
    if (blame == 'CRM') return 'Not provided by CRM'
    if (blame == 'CIPA') return 'The registration number was not resolved by CIPA, it is possible the provided Registration number is incorrect or the CIPA Service is down.'
    if (blame == 'eID')  return 'The registration number was not resolved by eID/Omang, it is possible the provided Identity number is incorrect or the Omang Service is down.'
    return 'Not provided by Customer';
}