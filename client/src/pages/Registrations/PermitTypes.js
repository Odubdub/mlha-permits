const applicationTypes = {
    MLGRD_008_10_004: {
        name: 'Burial Permit',
        filter:'burial_permit',
        shortName: 'Burial'
    },
    MLGRD_008_10_001: {
        name: 'New Dog License',
        filter:'new_dog_license',
        shortName: 'New Dog'
    },
    MTI_007_12_008: {
        name: 'Exporter Register',
        filter:'exporter_register',
        shortName: 'Exporter'
    },
    MLGRD_008_10_006: {
        name: 'Advertising Permit',
        filter:'advertising_permit',
        shortName: 'Advertising'
    },
    MLGRD_008_10_003: {
        name: 'Park Booking Permit',
        filter:'park_booking_permit',
        shortName: 'Park Booking'
    },
    MTI_007_12_003: {
        name: 'Imports Business Permit',
        filter:'imports_business',
        shortName: 'Import Business'
    },
    MLGRD_008_10_002: {
        name: 'Duplicate Dog License',
        filter:'duplicate_dog_license',
        shortName: 'Duplicate Dog'
    },
    MTI_007_12_001: {
        name: 'Ferrous Exports Permit',
        filter:'exports_ferrous',
        shortName: 'Ferrous Exports'
    },
    MLGRD_008_10_007: {
        name: 'Additional Dog License',
        filter:'additional_dog_license',
        shortName: 'Additional Dog'
    },
    MLGRD_008_10_005: {
        name: 'Noise And Nuisance Permit',
        filter:'noise_nuisance_permit',
        shortName: 'Noise And Nuisance'
    },
    MTI_007_12_004: {
        name: 'Hawkers Import Permit',
        filter:'imports_sole_trader',
        shortName: 'Hawkers Import'
    },
    MTI_007_12_010: {
        name: 'Rebate Item 470.03',
        filter:'rebates_item_470_03',
        shortName: 'Rebate Item 470.03'
    },
    MTI_007_12_007: {
        name: 'Rebate Item 405.04',
        filter:'rebates_item_405_04',
        shortName: 'Rebate Item 405.04'
    },
    MTI_007_12_005: {
        name: 'Rebate Item 412.11',
        filter:'rebates_item_412_11',
        shortName: 'Rebate Item 412.11'
    },
    MTI_007_12_002: {
        name: 'Non Ferrous Export Permit',
        filter:'exports_non_ferrous',
        shortName: 'Non Ferrous Exports'
    },
    MTI_007_12_009:{
        name: 'Import Permit(Control)',
        filter:'imports_control',
        shortName: 'Import Control(C)'
    },
    MTI_007_12_011:{
        name: 'Bread/Uniform Import Permit',
        filter:'imports_bread_uniform',
        shortName: 'Bread/Uniform'
    },
    MTI_007_12_012:{
        name: 'Maize Extruded Product Import Permit',
        filter:'maize_extruded',
        shortName: 'Maize Extruded'
    },
    MLGRD_008_10_009:{
        name: 'Classroom/Dining Hall Hire',
        filter:'classroom_permit',
        shortName: 'Classroom'
    },
    MTI_007_12_014:{
        name: 'Rebate Item 311.42 Certificate',
        filter:'rebates_item_311_42',
        shortName: 'Rebate Item 311.42'
    },
    MTI_007_12_015:{
        name: 'Rebate Item 320.01 Certificate',
        filter:'rebates_item_320_01',
        shortName: 'Rebate Item 320.01'
    },
    MLGRD_008_10_012:{
        name: 'Stadium Hire Permit',
        filter:'stadium_hire_permit',
        shortName: 'Stadium Hire'
    },
    MLGRD_008_10_013:{
        name: 'Fire Report Request',
        filter:'fire_report',
        shortName: 'Fire Report'
    },
    MLGRD_008_10_011:{
        name: 'Fireworks Permit',
        filter:'fireworks_permit',
        shortName: 'Fireworks'
    },
    MLGRD_008_10_008:{
        name: 'Temporary Liqour License',
        filter:'temporary_liquor_license',
        shortName: 'Temporary Liqour'
    },
    MLGRD_008_10_010:{
        name: 'Tree Cutting Job Card',
        filter:'tree_cutting_job_card',
        shortName: 'Tree Cutting'
    }
  }
  

  export const getShortApplicationName = (serviceCode) => {
    return ((applicationTypes[serviceCode]||{}).shortName || serviceCode)
  }

  export const getApplicationName = (serviceCode) => {
    return ((applicationTypes[serviceCode]||{}).name || 'New service, who dis?')
  }