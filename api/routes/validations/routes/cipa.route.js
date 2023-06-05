const express = require('express');
const fetchCompanyFromCipa = require('../../../helpers/cipa-info.helper');
const { getFieldValue } = require('../../../helpers/parser');
const cipaRouter = express.Router();

cipaRouter.route('/:companyId')
  .get(async (req, res, next) => {
    try {
      const cipaResponse = await fetchCompanyFromCipa(req.params.companyId);
      if (cipaResponse.code == 404) {
        res.status(404).json({
          message: 'Company not found'
        });
      } else {
        const formatted = formatCompanyData(cipaResponse);

        if (!formatted){
          return res.status(500).json({
            message: 'Error: No company data found'
          });
        }
        res.status(200).send(formatted);
      }
    } catch (error) {
      console.log('Error',error)
      next(error);
    }
  });

function formatCompanyData(responseObject) {

  let rawCompanyData = null

  if (!rawCompanyData) {
    rawCompanyData = getFieldValue(responseObject, 'data.Envelope.Body.Response.BursCompanyView', null);
  }

  if (!rawCompanyData) {
    rawCompanyData = getFieldValue(responseObject, 'data.Body.Response.BursCompanyView', null);
  }

  if (!rawCompanyData) {
    console.log('Error: No company data found')
    console.log(JSON.stringify(responseObject, null, 2))
    return null
  }
  return {
    name: getFieldValue(rawCompanyData, 'CompanyName.Value', 'N/A・API Error'),
    type: getFieldValue(rawCompanyData, 'CompanyType.Value', 'N/A・API Error'),
    status: getFieldValue(rawCompanyData, 'CompanyStatus.Value', 'N/A・API Error'),
    IncorporationNumber: getFieldValue(rawCompanyData, 'UIN.Value', 'N/A・API Error'),
    OwnConstitution: getFieldValue(rawCompanyData, 'OwnConstitutionYn.Value', 'N/A・API Error'),
    IncorporationDate: getFieldValue(rawCompanyData, 'IncorporationDate.Value', 'N/A・API Error'),
    annualReturnFilingMonth: getFieldValue(rawCompanyData, 'AnnualReturnFilingMonth.Value', 'N/A・API Error'),

    businessPostalAddress: {
      addressLine1: getFieldValue(rawCompanyData, 'PostalAddressDetail.PostalAddress.Line1.Value', 'N/A・API Error'),
      addressLine2: getFieldValue(rawCompanyData, 'PostalAddressDetail.PostalAddress.Line2.Value', 'N/A・API Error'),
      country: getFieldValue(rawCompanyData, 'PostalAddressDetail.PostalAddress.Country.Value', 'N/A・API Error'),
    },

    principalPlaceOfBusiness: {
      addressLine1: getFieldValue(rawCompanyData, 'PrincipalPlaceOfBusinessDetail.PrincipalPlaceOfBusiness.Line1.Value', 'N/A・API Error'),
      addressLine2: getFieldValue(rawCompanyData, 'PrincipalPlaceOfBusinessDetail.PrincipalPlaceOfBusiness.Line2.Value', 'N/A・API Error'),
      locality: getFieldValue(rawCompanyData, 'PrincipalPlaceOfBusinessDetail.PrincipalPlaceOfBusiness.RegionCode.Value', 'N/A・API Error'),
      country: getFieldValue(rawCompanyData, 'PrincipalPlaceOfBusinessDetail.PrincipalPlaceOfBusiness.Country.Value', 'N/A・API Error'),
    },

    companyDirectors: (Array.isArray(getFieldValue(rawCompanyData, 'DirectorDetails.IndividualDirector'))) ?
      getFieldValue(rawCompanyData, 'DirectorDetails.IndividualDirector').map(director => directorsObject(director)) :
      new Array(directorsObject(getFieldValue(rawCompanyData, 'DirectorDetails.IndividualDirector'))),

    shareholders: (Array.isArray(getFieldValue(rawCompanyData, 'ShareholderDetails.Shareholder'))) ?
      getFieldValue(rawCompanyData, 'ShareholderDetails.Shareholder').map(shareholder => shareholdersObject(shareholder)) :
      new Array(shareholdersObject(getFieldValue(rawCompanyData, 'ShareholderDetails.Shareholder'))),

    ownership: (Array.isArray(getFieldValue(rawCompanyData, 'OwnershipBundles.OwnershipBundle'))) ?
      getFieldValue(rawCompanyData, 'OwnershipBundles.OwnershipBundle').map(ownership => ownershipObject(ownership)) :
      new Array(ownershipObject(getFieldValue(rawCompanyData, 'OwnershipBundles.OwnershipBundle')))
  }
}

function ownershipObject(ownership) {
  return {
    ownershipType: getFieldValue(ownership, 'OwnershipType.Value',''),
    NumberOfShares: getFieldValue(ownership, 'NumberOfShares.Value',''),
    shareholderName: getFieldValue(ownership, 'Owners.Owner.ShareholderName.Value',''),
  }
}

function shareholdersObject(shareholder) {
  return {
    appointmentDate: getFieldValue(shareholder, 'IndividualShareholder.AppointmentDate.Value',''),    
    lastName: getFieldValue(shareholder, 'IndividualShareholder.IndividualName.LastName.Value',''),
    firstName: getFieldValue(shareholder, 'IndividualShareholder.IndividualName.FirstName.Value',''),
    middleName: (getFieldValue(shareholder, 'IndividualShareholder.IndividualName.MiddleNames')) ? shareholder.IndividualShareholder.IndividualName.MiddleNames.Value : '',

    residentialAddress: {
      addressLine1: getFieldValue(shareholder, 'IndividualShareholder.ResidentialAddress.Line1.Value',''),
      addressLine2: getFieldValue(shareholder, 'IndividualShareholder.ResidentialAddress.Line2.Value',''),
      locality: getFieldValue(shareholder, 'IndividualShareholder.ResidentialAddress.RegionCode.Value',''),
      country: getFieldValue(shareholder, 'IndividualShareholder.ResidentialAddress.Country.Value','')
    },

    postalAddress: {
      addressLine1: getFieldValue(shareholder, 'IndividualShareholder.PostalAddress.Line1.Value',''),
      locality: getFieldValue(shareholder, 'IndividualShareholder.PostalAddress.RegionCode.Value',''),
      country: getFieldValue(shareholder, 'IndividualShareholder.PostalAddress.Country.Value','')
    }
  }
}

function directorsObject(individualDirector) {
  return {
    appointmentDate: getFieldValue(individualDirector, 'AppointmentDate.Value',''),
    lastName: getFieldValue(individualDirector, 'IndividualName.LastName.Value',''),
    firstName: getFieldValue(individualDirector, 'IndividualName.FirstName.Value',''),
    middleName: getFieldValue(individualDirector, 'IndividualName.MiddleNames.Value',''),

    residentialAddress: {
      addressLine1: getFieldValue(individualDirector, 'ResidentialAddress.Line1.Value',''),
      addressLine2: getFieldValue(individualDirector, 'ResidentialAddress.Line2.Value',''),
      locality: getFieldValue(individualDirector, 'ResidentialAddress.RegionCode.Value',''),
      country: getFieldValue(individualDirector, 'ResidentialAddress.Country.Value','')
    },

    postalAddress: {
      addressLine1: getFieldValue(individualDirector, 'PostalAddress.Line1.Value',''),
      locality: getFieldValue(individualDirector, 'PostalAddress.RegionCode.Value',''),
      country: getFieldValue(individualDirector, 'PostalAddress.Country.Value','')
    }
  }
}

module.exports = { cipaRouter, formatCompanyData};
