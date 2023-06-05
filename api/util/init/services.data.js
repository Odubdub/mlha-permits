const ministries = [
  {
    "abbr": "MTI",
    "code": "MTI_007",
    "name": "Ministry of Trade and Industry"
  },
  {
    "abbr": "MLGRD",
    "code": "MLGRD_008",
    "name": "Ministry of Local Government and Rural Development"
  }
];

const departments = [
  {
    "abbr": "BOTC",
    "code": "MTI_007_12",
    "ministry_code": "MTI_007",
    "name": "Botswana Trade Commission"
  },
  {
    "abbr": "GCC",
    "code": "MLGRD_008_10",
    "ministryCode": "MLGRD_008",
    "name": "Gaborone City Council"
  }
]

const services = [
  {
      "registry_id": "62baab5ca7a5cc661f1889b3",
      "code": "MTI_007_12_001",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "FERROUS_SCRAP_EXPORTS_PERMIT",
      "displayName": "Application for a ferrous scrap metal export permit",
      "newCode": "MTI_007_12_001"
  },
  {
      "registry_id": "62baab5ca7a5cc661f1889b6",
      "code": "MTI_007_12_002",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "NON_FERROUS_EXPORTS_PERMIT",
      "displayName": "Application for a non-ferrous scrap metal export permit",
      "newCode": "MTI_007_12_002"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889b9",
      "code": "MTI_007_12_003",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "IMPORTS_BUSINESS_PERMIT",
      "displayName": "Application for a business import permit",
      "newCode": "MTI_007_12_003"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889bc",
      "code": "MTI_007_12_004",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "IMPORTS_SOLE_TRADER_PERMIT",
      "displayName": "Application for a sole-trader import permit",
      "newCode": "MTI_007_12_004"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889c3",
      "code": "MLGRD_008_10_001",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "NEW_DOG_LICENSE",
      "displayName": "Application for a new dog license",
      "newCode": "MLGRD_008_10_001"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889c6",
      "code": "MLGRD_008_10_002",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "DUPLICATE_DOG_LICENSE",
      "displayName": "Application for a duplicate dog license",
      "newCode": "MLGRD_008_10_002"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889c8",
      "code": "MLGRD_008_10_003",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "PARK_BOOKING_PERMIT",
      "displayName": "Application for a park booking permit",
      "newCode": "MLGRD_008_10_003"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889c1",
      "code": "MTI_007_12_005",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "REBATES_ITEM_412_11",
      "displayName": "Application for a rebate item 412.11 certificate",
      "newCode": "MTI_007_12_005"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889cb",
      "code": "MLGRD_008_10_007",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "ADDITIONAL_DOG_LICENSE",
      "displayName": "Application for an additional dog license",
      "newCode": "MLGRD_008_10_007"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889ce",
      "code": "MLGRD_008_10_004",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "BURIAL_PERMIT",
      "displayName": "Application for a burial permit",
      "newCode": "MLGRD_008_10_004"
  },
  {
      "registry_id": "62baab5da7a5cc661f1889d1",
      "code": "MLGRD_008_10_005",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "NOISE_AND_NUISANCE_PERMIT",
      "displayName": "Application for a noise and nuisance permit",
      "newCode": "MLGRD_008_10_005"
  },
  {
      "registry_id": "62c02f9ffc55b1091cc689dd",
      "code": "MTI_007_12_007",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "REBATES_ITEM_405_04",
      "displayName": "Application for a rebate item 405.04 certificate",
      "newCode": "MTI_007_12_007"
  },
  {
      "registry_id": "62c02fa0fc55b1091cc689e0",
      "code": "MLGRD_008_10_006",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "ADVERTISING_PERMIT",
      "displayName": "Application for an advertising permit",
      "newCode": "MLGRD_008_10_006"
  },
  {
      "registry_id": "62c02fa0fc55b1091cc689e5",
      "code": "MTI_007_12_008",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "EXPORTER_REGISTER",
      "displayName": "Application to register as an exporter",
      "newCode": "MTI_007_12_008"
  },
  {
      "registry_id": "62c02fa0fc55b1091cc689e9",
      "code": "MTI_007_12_009",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "IMPORTS_CONTROL_PERMIT",
      "displayName": "Application for an import permit",
      "newCode": "MTI_007_12_009"
  },
  {
      "registry_id": "62c02fa0fc55b1091cc689e7",
      "code": "MTI_007_12_010",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "REBATES_ITEM_470_03",
      "displayName": "Application for a rebate item 470.03 certificate",
      "newCode": "MTI_007_12_010"
  },
  {
      "registry_id": "62d694eaef440ee19f415506",
      "code": "MTI_007_12_011",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "BREAD_UNIFORM_PERMIT",
      "displayName": "Application for a bread and/or uniform import permit",
      "newCode": "MTI_007_12_011"
  },
  {
      "registry_id": "62d694f2ef440ee19f41550a",
      "code": "MTI_007_12_012",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "MAIZE_EXTRUDED_PRODUCTS_PERMIT",
      "displayName": "Application for a maize extruded product import permit",
      "newCode": "MTI_007_12_012"
  },
  {
      "registry_id": "62d69500ef440ee19f41550e",
      "code": "MLGRD_008_10_009",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "CLASSROOM_HIRE",
      "displayName": "Application for a classroom/dining hall hire permit",
      "newCode": "MLGRD_008_10_009"
  },
  {
      "registry_id": "62d69504ef440ee19f415512",
      "code": "MTI_007_12_019",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "VALIDATE_PERMIT",
      "displayName": "Validate a Permit",
      "newCode": "MTI_007_12_019"
  },
  {
      "registry_id": "62d69509ef440ee19f415516",
      "code": "MTI_007_12_014",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "REBATES_ITEM_311_42",
      "displayName": "Application for a rebate item 311.42 certificate",
      "newCode": "MTI_007_12_014"
  },
  {
      "registry_id": "62d6950eef440ee19f41551a",
      "code": "MTI_007_12_015",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "REBATES_ITEM_320_01",
      "displayName": "Application for a rebate item 320.01 certificate",
      "newCode": "MTI_007_12_015"
  },
  {
      "registry_id": "62d7721eef440ee19f415bf4",
      "code": "MLGRD_008_10_012",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "STADIUM_HIRE",
      "displayName": "Application for a stadium hire permit",
      "newCode": "MLGRD_008_10_012"
  },
  {
      "registry_id": "62e78299f0cefa42a611be92",
      "code": "MLGRD_008_10_013",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "FIRE_REPORT",
      "displayName": "Application for a fire report request",
      "newCode": "MLGRD_008_10_013"
  },
  {
      "registry_id": "62e7830ef0cefa42a611be97",
      "code": "MLGRD_008_10_008",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "TEMPORARY_LIQOUR",
      "displayName": "Application for a temporary liquor license",
      "newCode": "MLGRD_008_10_008"
  },
  {
      "registry_id": "62e78315f0cefa42a611be9b",
      "code": "MLGRD_008_10_010",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "TREE_CUTTING",
      "displayName": "Application for a tree cutting job card",
      "newCode": "MLGRD_008_10_010"
  },
  {
      "registry_id": "62e788f6f0cefa42a611beb6",
      "code": "MLGRD_008_10_011",
      "version": "1.0",
      "status": "ACTIVATED",
      "name": "FIRE_REQUEST",
      "displayName": "Application for a fireworks permit",
      "newCode": "MLGRD_008_10_011"
  }
]