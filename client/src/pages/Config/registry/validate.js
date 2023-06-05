import f405 from './405.04.json'
import f412 from './412.11.json'
import f470 from './470.03.json'
import advertising from './advertising.json'
import burial from './burial.json'
import dog_additional from './dog_additional.json'
import dog_duplicate from './dog_duplicate.json'
import export_scrap_non_ferrous from './export_scrap_non_ferrous.json'
import export_scrap_ferrous from './export_scrap_ferrous.json'
import exporter from './exporter.json'
import import_business from './import_business.json'
import import_sole_proprietor from './import_sole_proprietor.json'
import new_dog from './new_dog.json'
import noise from './noise.json'
import park from './park.json'
import { uuid } from 'uuidv4'

const allServices = [
    import_business, 
    import_sole_proprietor,
    f405, 
    f412, 
    f470, 
    advertising, 
    burial, 
    dog_additional, 
    dog_duplicate,
    export_scrap_non_ferrous, 
    export_scrap_ferrous, 
    exporter, 
    new_dog, 
    noise, 
    park
]
//function that checks if an array of objects contains objects with different fieldName
const checkDuplicates = (array, name, code) => {
    let fieldNames = array.map(obj => obj.fieldName)

    const output = {
        "status":"Pending",
        "application_id": `${Math.floor(Math.random() * (9999999999 + 1)) + 1000000000}`,
        "applictionAuthorIdNo":"175228474",
        "isPaymentRequired":true,
        "paymentStatus":"Pending",
        "code": code,
        "version":"1.0.0",
        "form": {}
    }

    let hasErrors = false

    array.forEach(obj => {

        if (obj.fieldName.toLowerCase().includes('dude')) {
            output.form[obj.fieldName] = "2022-06-20"
        } else {
            output.form[obj.fieldName] = obj.fieldLabel
        }

        const fife = fieldNames.filter(field => field === obj.fieldName)
        if (fife.length > 1) {
            console.log(fife)
            console.log(`Duplicate key in ${name} | fieldName: ${obj.fieldName}`)
            hasErrors = true
        }
    })

    if (!hasErrors){
        console.log(JSON.stringify(output, null, 2))
    }

    return false
}

export const checkAllFields = () => {
    allServices.forEach(service => {
        console.log(`Checking ${service.name}\n\n`)
        checkDuplicates(service.fields, service.name, service.code)
    })
}

const generateOutput = (submission) => {
    
    const output = []
    submission.fields.forEach(field=>{

        const row = {
            key: field.fieldName,
            desc: field.fieldLabel,
            field: 0,
            formatter: 0,
            source: 0
        }
        output.push(row)
    },[])

    return output
}

export const generateFrontendOutputs = () => {

    const allOutput = []
    
    allServices.forEach(service=>{
        const config = {}
        const fields = generateOutput(service)
        config.version = service.version
        config.code = service.code
        config.applicant = []
        config.permit = fields
        allOutput.push(config)
    })

    console.log(JSON.stringify(allOutput, null, 2))
}

export const generatePostmanOutput = () => {
    const output = {
        "data":{
           "application_id":uuid(),
           "form":{
              "title":"Mr",
              "applicantIdNo":"777719999",
              "addressLine1":"Plot 12",
              "addressLine2":"Extension 18",
              "locality":"Gabs",
              "country":"Bots",
              "phone":"76128987",
              "dogBreed":"German Sherperd",
              "licenseType":"Ordinary Dog License",
              "dogDescription":"Blue",
              "dogConviction":"No"
           },
           "status":"0",
           "profile":{
              "user_id":"777719999",
              "service_agent":"",
              "dependant":""
           },
           "payment":"",
           "service":{
              "code":"MLGRD_008_10_001",
              "version":"0.01"
           }
        }
     }
}