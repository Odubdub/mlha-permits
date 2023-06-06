import { ApplicantType } from "src/helper"
import { fCurrency, fNumber } from "src/utils/formatNumber"
import { fDate, fToNow } from "src/utils/formatTime"

export const getRebateFields = (data) => {

    if (ApplicantType.Entity == data.applicationOwner.applicantType){

        return getEntityFields(data.permitDetails, data)
    } else {
        return getIndividualFields(data.permitDetails, data)
    }
}

const getEntityFields = (permitDetails, data) => {

    return [
        {
            key: "originCountry",
            desc: "Country of Origin",
            detail: permitDetails.originCountry
        },
        {
            key: "productDescription",
            desc: "Goods Description",
            detail: permitDetails.productDescription
        },
        {
            key: "productDescription",
            desc: "HS Code",
            detail: permitDetails.tariffCode
        },
        {
            key: "tariffCode",
            desc: "Port of Entry",
            detail: permitDetails.tariffCode
        },
        {
            key: "entryPort",
            desc: "Quantity",
            detail: `${fNumber(permitDetails.quantity)} KG`
        },
        {
            key: "declaration1",
            desc: "First Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration2",
            desc: "Second Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration3",
            desc: "Third Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration4",
            desc: "Fourth Declaration",
            detail: 'Checked'
        }
    ]
}

const getIndividualFields = (permitDetails, data) => {

    return [
        {
            key: "originCountry",
            desc: "Country of Origin",
            detail: permitDetails.originCountry
        },
        {
            key: "productDescription",
            desc: "Goods Description",
            detail: permitDetails.productDescription
        },
        {
            key: "productDescription",
            desc: "HS Code",
            detail: permitDetails.tariffCode
        },
        {
            key: "entryPort",
            desc: "Port of Entry",
            detail: permitDetails.entryPort
        },
        {
            key: "quantity",
            desc: "Quantity",
            detail: `${fNumber(permitDetails.quantity)} KG`
        },
        {
            key: "declaration1",
            desc: "First Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration2",
            desc: "Second Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration3",
            desc: "Third Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration4",
            desc: "Fourth Declaration",
            detail: 'Checked'
        }
    ]
}

export const getExport = (permitDetails, data) => {

    return [
        {
            key: "originCountry",
            desc: "Country of Origin",
            detail: permitDetails.originCountry
        },
        {
            key: "productDescription",
            desc: "Goods Description",
            detail: permitDetails.productDescription
        },
        {
            key: "productDescription",
            desc: "HS Code",
            detail: permitDetails.tariffCode
        },
        {
            key: "tariffCode",
            desc: "Port of Entry",
            detail: permitDetails.tariffCode
        },
        {
            key: "entryPort",
            desc: "Port of Entry",
            detail: permitDetails.entryPort
        },
        {
            key: "quantity",
            desc: "Quantity",
            detail: `${fNumber(permitDetails.quantity)} KG`
        },
        {
            key: "declaration1",
            desc: "First Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration2",
            desc: "Second Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration3",
            desc: "Third Declaration",
            detail: 'Checked'
        },
        {
            key: "declaration4",
            desc: "Fourth Declaration",
            detail: 'Checked'
        }
    ]
}