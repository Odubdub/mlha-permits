import { PermitTypes } from "src/helper"
import { getExportFields } from "./Exports"
import { getImportFields } from "./Import"
import { getRebateFields } from "./Rebates"

export const getPermitInfo = (data) => {

    if (data.permitModelType == PermitTypes.Export){
        return getExportFields(data)
    } else if (data.permitModelType == PermitTypes.Rebate){
        return getRebateFields(data)
    } else if (data.permitModelType == PermitTypes.Import){
        return getImportFields(data)
    }

    return [{
        key: "nothing",
        desc: "Nothing",
        detail: "Nothing"
    }]
}

// const getHeaderInfo = (data) => {
//     return [
//         {
//             key: "permitType",
//             desc: "Permit Type",
//             detail: data.permitModelType
//         },
//         {
//             key: "regID",
//             desc: "Registration Number",
//             detail: data._id
//         },
//         {
//             key: "regDate",
//             desc: "Date Registered",
//             detail: fDate(data.createdAt)
//         },
//         {
//             key: "status",
//             desc: "Status",
//             detail: data.status.toUpperCase()
//         },
//         {
//             key:'header',
//             desc:''
//         }
//     ]
// }

