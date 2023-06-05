const Application = require("../models/application/application.model")
const { formatCompanyData } = require("../routes/validations/routes/cipa.route")
const fetchCompanyFromCipa = require("./cipa-info.helper")
const fethOmangFromEID = require("./e-id-info.helper")

const resolveOmangInfo = async (application, onComplete) => {
    
    let resolvedKeyCount = 0;

    const keys = Object.keys(application.applicationDetails)
    const resolvedKeys = Object.keys(application.external || application.meta || {})

    const keysToResolve = keys.filter(key => !resolvedKeys.includes(key) && key.substring(key.length - 4) == 'IdNo')

    keysToResolve.forEach(async key=>{

        //Check if suffix of key is "IdNo"
        //TODO: Check if this is an Omang
        const idNo = application.applicationDetails[key]

        if (idNo != null && idNo){

            try {
                const eidResponse = await fethOmangFromEID(idNo)
            if (eidResponse.status == 'error') {
                console.log('Error getting eID data')
            } else {
                console.log('Got eID data ', idNo)
                updateExternalDetails(application._id, idNo, eidResponse.data)
            }
            } catch (error) {
                console.log('Error ', 'error getting eID Data', error.message)
            } finally {
                resolvedKeyCount++
                if (resolvedKeyCount == keysToResolve.length && onComplete) onComplete()
            }
        }
    })
}

const resolveCipa = (application, onComplete) => {

    let resolvedKeyCount = 0;

    const keysToResolve = Object.keys(application.applicationDetails).filter(key => ['companyRegNo', 'businessRegNo'].includes(key))
    
    keysToResolve.forEach(async key=>{

        //Get data from Cipa
        if (['companyRegNo', 'businessRegNo'].includes(key)){

            const regNo = application.applicationDetails[key]
            
            if (regNo != null && regNo){

                try {

                    const cipaResponse = await fetchCompanyFromCipa(regNo)

                    if (cipaResponse.code == 404) {
                      console.log('Company not found')
                    } else {
                        console.log('Company found')
                        updateExternalDetails(application._id, regNo, formatCompanyData(cipaResponse))
                    }
                    
                  } catch (error) {
                    console.log('Error ', error.message)

                } finally {
                    resolvedKeyCount++
                    if (resolvedKeyCount == keysToResolve.length && onComplete) onComplete()
                }
            }
        }
    })
}

const sanitizeReferences = (application) => {

    Object.keys(application.applicationDetails).forEach(key=>{
        if (key.includes('RegNo')){
            application.applicationDetails[key] = application.applicationDetails[key].toUpperCase()
        }
    })
}

const updateExternalDetails = async (id, key, data) => {

    const existingApplication = await Application.findById(id);
    existingApplication.external = { ...(existingApplication.external || existingApplication.meta || {}), [key]: data }
    if (existingApplication){
        existingApplication.save((err, application) => {
            if (err) console.log('Added new ');
            console.log(`Resolved data from APIs for ${application._id}`);
        });
    }
}

module.exports = { resolveOmangInfo, resolveCipa, sanitizeReferences }