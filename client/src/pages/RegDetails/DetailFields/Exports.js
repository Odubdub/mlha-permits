import { fCurrency, fNumber } from "src/utils/formatNumber"
import { fDate, fToNow } from "src/utils/formatTime"

export const getExportFields = (data) => {
    return [
        {
            key: 'businessInfo',
            title: "Business Information"
        },
        {
            key: "businessName",
            desc: "Business Name",
            detail: data.businessName
        },
        {
            key: "businessRegId",
            desc: "Registration ID",
            detail: data.businessRegId
        },
        {
            title: "Address"
        },
        {
            key: "addressLine1",
            desc: "Line 1",
            detail: data.addressLine1
        },
        {
            key: "addressLine2",
            desc: "Line 2",
            detail: data.addressLine2
        },
        {
            key: "locality",
            desc: "Locality",
            detail: data.locality
        },
        {
            key: "country",
            desc: "Country",
            detail: data.country
        },
        {
            title: "Exported Product Information"
        },
        {
            key: "productType",
            desc: "Product Type",
            detail: data.productType
        },
        {
            key: "productDescription",
            desc: "Description",
            detail: data.productDescription
        },
        {
            key: "tariffCode",
            desc: "Tariff Code",
            detail: data.tariffCode
        },
        {
            key: "quantity",
            desc: "Quantity",
            detail: `${fNumber(data.quantity)} KG`
        },
        {
            key: "estimatedValue",
            desc: "Estimated Value",
            detail: `P${fCurrency(data.estimatedValue)}`
        },
        {
            title:''
        },
        {
            key: "trailerRegNo",
            desc: "Trailer Reg. No.",
            detail: data.trailerRegNo
        },
        {
            key: "productExportDate",
            desc: "Export Date",
            detail: `≈ ${fDate(data.productExportDate)} | ${fToNow(data.productExportDate)}`
        },
        {
            key: "exitPort",
            desc: "Exit Port",
            detail: data.exitPort
        },
        {
            key: "licenseNo",
            desc: "License",
            detail: data.licenseNo
        }, 
        {
            key: "recipient",
            desc: "Recipient",
            detail: data.recipient
        },
        {
            title: "Attachments"
        },
        {
            key: "",
            desc: "",
            detail: 'No Attachments'
        }
    ]
}