const { default: axios } = require("axios")
import mlgrd from './mlgrd.json'
import botc from './botc.json'
import S0001 from './S0001_Non_Ferrous.json'
import S0002 from './S0002_Ferrous.json'
import S0003 from './S0003_Import_Sole.json'
import S0004 from './S0004_Import_Business.json'
import S0005 from './S0005_Rebate_412.json'
import S0006 from './S0006_Park.json'
import S0007 from './S0007_Burial.json'
import S0008 from './S0008_New_Dog.json'
import S0009 from './S0009_Dup_Dog.json'
import S0010 from './S0010_Add_Dog.json'
import S0011 from './S0011_Noise.json'
import S0012 from './S0012_Advertising.json'
import S0013 from './S0013_Rebate_470.json'
import S0014 from './S0014_Rebate_405.json'
import S0015 from './S0015_Exporter.json'
import S0016 from './S0016_Imports_Control.json'
import S0017 from './S0017_Bread.json'
import S0018 from './S0018_Maize_Extr_Permit.json'
import S0019 from './S0019_Classroom.json'
import S0020 from './S0020_Validate.json'
import S0021 from './S0021_Rebate_311.json'
import S0022 from './S0022_Rebate_320.json'
import S0023 from './S0023_Stadium.json'
import S0024 from './S0024_Fire_Report.json'
import S0025 from './S0025_Fire_Works.json'
import S0026 from './S0026_Temp_Liqour.json'
import S0027 from './S0027_Tree_Cutting.json'
import mrg from './mrg.json'

export const pushService = (service, isRegistration=true) => {

  setError(null)

  if (isRegistration) {

    axios.post(`http://localhost:3005/services/register`, info, { "Content-Type": "application/json" })
    .then(res => {
      console.log('Success = ',res.data)
    })
    .catch(err => {
      console.log('Error = ',err)
    })
  } else {
    axios.post(`http://localhost:3005/services/registration/${service.code}`, info, { "Content-Type": "application/json" })
    .then(res => {
      console.log('Success = ',res.data)
    })
    .catch(err => {
      console.log('Error = ',err)
    })
  }
}

const getServiceInfo = (config) => {
  
  const scaffold = config.owner === 'BOTC' ? botc : mlgrd

  return {
    "code": config.code,
    "id": config.id,
    "version": config.version,
    "name": config.name,
    "displayName": config.displayName,
    "description": config.description,
    "host": '10.0.25.20',
    "port": '',
    "protocol": scaffold.protocol,
    "endpoint": '/applications',
    "notes": scaffold.notes,
    "related_services": "p_related_services",
    "supporting_services": "p_supporting_services",
    "ministries_agencies": scaffold.ministries_agencies,
    "department":  scaffold.department,
    "email":  scaffold.email,
    "phone": scaffold.phone,
    "website": scaffold.website,
    "postal": scaffold.postal,
    "physical": scaffold.physical,
    "turnaroundTime": scaffold.turnaroundTime,
    "period": scaffold.period,
    "availability": scaffold.availability,
    "escalation_level_1": "p_escalation_level_1",
    "escalation_level_2": "p_escalation_level_2",
    "escalation_level_3": "p_escalation_level_3",
    "category": scaffold.category,
    "type": scaffold.type,
    "sensitivity": scaffold.sensitivity,
    "display": true,
    "priority": scaffold.priority,
    "record": true,
    "gender": scaffold.gender,
    "maritalStatus": scaffold.marritalStatus,
    "ethnicity": scaffold.ethnicity,
    "geoArea": "p_geoArea",
    "employmentStatus": scaffold.employmentStatus,
    "incomeClass": scaffold.incomeLevel,
    "educationLevel": scaffold.educationLevel,
    "customerType": scaffold.customerType,
    "citizenship": scaffold.citizenship,
    "eIDValidation":  true,
    "ageRange":  scaffold.ageRange,
    "ServiceDeliveryMethod": scaffold.ServiceDeliveryMethod,
    "formField": config.fields || [],
    "document": true,
    "payment": {
      paymentRequired: 'Pay-nothing',
      paymentMode: scaffold.paymentMode || '',
      paymentAmount: scaffold.paymentAmount || '0.00',
      paymentName: scaffold.paymentName || '',
      paymentVote: scaffold.paymentVote || '',
      paymentEndpoint: scaffold.paymentVote || '',
      paymentMerchant: scaffold.paymentMerchant || ''
    },
    "document_info": {},
    "issuance": true,
    "issuance_info": {},
    "registeredBy": '548516718'
  }
}

export const AllServiceConfigs = [
  S0001,
  S0002,
  S0003,
  S0004,
  S0005,
  S0006,
  S0007,
  S0008,
  S0009,
  S0010,
  S0011,
  S0012,
  S0013,
  S0014,
  S0015,
  S0016,
  S0017,
  S0018,
  S0019,
  S0020,
  S0021,
  S0022,
  S0023,
  S0024,
  S0025,
  S0026,
  S0027
]

export const AllServices = AllServiceConfigs.map(config => getServiceInfo(config))

export const getServiceId = (code) => {

  const service = AllServices.find(service => service.code === code)

  return (service || {}).id
}
