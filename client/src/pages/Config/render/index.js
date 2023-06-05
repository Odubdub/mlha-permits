import S0001 from './S0001.json'
import S0002 from './S0002.json'
import S0003 from './S0003.json'
import S0004 from './S0004.json'
import S0005 from './S0005.json'
import S0006 from './S0006.json'
import S0007 from './S0007.json'
import S0008 from './S0008.json'
import S0009 from './S0009.json'
import S0010 from './S0010.json'
import S0011 from './S0011.json'
import S0012 from './S0012.json'
import S0013 from './S0013.json'
import S0014 from './S0014.json'
import S0015 from './S0015.json'
import S0016 from './S0016.json'
import S0017 from './S0017.json'
import S0018 from './S0018.json'
import S0019 from './S0019.json'
import S0020 from './S0020.json'
import S0021 from './S0021.json'
import S0022 from './S0022.json'
import S0023 from './S0023.json'
import S0024 from './S0024.json'
import S0025 from './S0025.json'
import S0026 from './S0026.json'
import S0027 from './S0027.json'
import applicant from './applicant.json'
import company from './company.json'
import { generateRendererConfig } from '../registry/output'

const serviceConfigs = [
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

export const getRendererConfig = (serviceCode, version='1.0', service, name) => {

    const config = serviceConfigs.find(serviceConfig => serviceConfig.code === serviceCode && serviceConfig.version == version)
    if (config) {
        
        const defaultApplicant = (config.applicant || [])
        const defaultOwner = (config.owner || [])

        const separator = {
            key: "",
            title:"",
            desc: "",
            field: 0,
            formatter: 0,
            source: 0
        }

        return {
                ...config, 
                applicant: [...applicant, ...(defaultApplicant.length > 0 ? [separator, ...defaultApplicant] : [])],
                owner: config.companyOwner ? [...company, ...(defaultOwner.length > 0 ? [separator, ...defaultOwner] : [])] : config.owner
            }
    } else {
        //Auto Generate Renderer Config
        return generateRendererConfig(service, name)
    }
}