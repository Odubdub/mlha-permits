import { DetailFieldsType } from "./DetailFieldType"

export const getStatusFields = (data) => {

    let pay = []
    if (data.isPaymentRequired){
        pay.push({
            key: "paymentStatus",
            desc: "Payment Status",
            detail: data.paymentStatus.toUpperCase(),
            type: DetailFieldsType.Chip
        })
    }
    return [
        {
            key: "status",
            desc: "Status",
            detail: data.status.toUpperCase(),
            type: DetailFieldsType.Chip
        },
        ...pay,
        {
            key: "foreNames",
            desc: "Last Action",
            detail: '#Some Action'
        },
        {
            key: "printout",
            desc: "Printout",
            detail: '#Some Action',
            link: 'localhost:3000/printout/doc?path=output/BW0000001EP.pdf',
            type: DetailFieldsType.Link
        }
    ]
}