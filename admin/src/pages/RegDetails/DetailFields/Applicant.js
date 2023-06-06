import { ApplicantType } from "src/helper"

export const getApplicantInfo = (data) => {

    if (ApplicantType.Entity == data.applicationOwner.applicantType){

        return getEntityInfo(data.applicationOwner, data)
    } else {
        return getIndividualInfo(data.applicationOwner, data)
    }
}

const getEntityInfo = (applicationOwner, data) => {

    return [
     {
         key: "applicantType",
         desc: "Applicantion Type",
         detail: `Company/Business`
     },
     {
         key: "companyName",
         desc: "Entity Name",
         detail: applicationOwner.details.companyName
     },
     {
         key: "companyRegNo",
         desc: "Registration No.",
         "infoType": "company",
         detail: applicationOwner.details.companyRegNo
     },
     {
         key: "licenseNo",
         desc: "License No.",
         detail: applicationOwner.details.licenseNo
     },
     {
         key: "tinNo",
         desc: "TIN No.",
         detail: applicationOwner.details.tinNo
     },
     {
         title:'Physical Address of Business'
     },
     {
         key: "addressLine1",
         desc: "Line 1",
         detail: data.permitDetails.addressLine1
     },
     {
         key: "addressLine2",
         desc: "Line 2",
         detail: data.permitDetails.addressLine2
     },
     {
         key: "locality",
         desc: "Locality",
         detail: data.permitDetails.locality
     },
     {
         key: "country",
         desc: "Country",
         detail: data.permitDetails.country
     },
     ]
 }

const getIndividualInfo = (applicationOwner,data) => {

    return [
        {
            key: "applicantType",
            desc: "Application Type",
            detail: `Individual`,
            correctable: false
        },
        {
            key: "foreNames",
            desc: "Forenames",
            detail: applicationOwner.details.foreNames,
            correctable: false
        },
        {
            key: "lastName",
            desc: "Surname",
            detail: applicationOwner.details.lastName,
            correctable: false
        },
        {
            key: "idType",
            desc: "Identity Type",
            detail: isOmang(applicationOwner.details.idNo) ? 'Omang' : 'Passport',
            correctable: false
        },
        {
            key: "idNo",
            desc: "Identity No.",
            detail: applicationOwner.details.idNo
        },
        {
            key:'devider1',
            title:''
        },
        {
            key: "phone",
            desc: "Phone",
            detail: applicationOwner.details.phone,
        },
        {
            key: "email",
            desc: "Email Address",
            detail: applicationOwner.details.email
        },
        {
            key: "tinNo",
            desc: "TIN Number",
            detail: applicationOwner.details.tinNo
        },
        {
            title:`Applicant's Physical Address`
        },
        {
            key: "addressLine1",
            desc: "Line 1",
            detail: data.permitDetails.addressLine1
        },
        {
            key: "addressLine2",
            desc: "Line 2",
            detail: data.permitDetails.addressLine2
        },
        {
            key: "locality",
            desc: "Locality",
            detail: data.permitDetails.locality
        },
        {
            key: "country",
            desc: "Country",
            detail: data.permitDetails.country
        },
    ]
}

export const isOmang = (id) => {
    
    return (['2', '1'].includes(id[4]) && /^\d+$/.test(id) && id.length == 9)
}