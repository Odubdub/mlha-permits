const Service = require("../../models/authority/service.model");
const Ministry = require("../../models/authority/ministry.model");
const Department = require("../../models/authority/department.model");

const capitalise = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const ministries = [
  {
    "code": "MTI_007",
    "name":"Ministry of Investment, Trade and Industry",
    "description":"To create a conducive environment for the promotion of Investment and development of Sustainable Industries and Trade, with a view to diversifying and growing the economy, creating wealth and employment, so that there is prosperity for all"
  },
  {
    "code": "MLGRD_008",
    "name":"Ministry of Local Government and Rural Development",
    "description":"To deliver effective local governance through district development planning, development and monitoring of policies, statutes and guidelines."
  }
];

const departments = [
  {
    "code": "MTI_007_12",
    "ministryCode":"MTI_007",
    "name":"Botswana Trade Commission",
    "description":"Botswana Trade Commission (BOTC) a parastatal under the Ministry of Investment Trade and Industry"
  },
  {
    "name":"Gaborone City Council",
    "code": "MLGRD_008_10",
    "ministryCode":"MLGRD_008",
    "description":"Gaborone City Council (GCC) is a Local Authority under the Ministry of Local Government and Rural Development"
  },
  {
    "name":"Francistown City Council",
    "code": "MLGRD_008_11",
    "ministryCode":"MLGRD_008",
    "description":"Francistown City Council (FCC) is a Local Authority under the Ministry of Local Government and Rural Development"
  }
];

const services = [
  /////////////////////////////// DOG PERMIT ///////////////////////////////
  // {
  //   "version": "1.0",
  //   "issuanceFee":0,
  //   "applicationFee":0,
  //   "status": "ACTIVATED",
  //   "name": "NEW_DOG_LICENSE",
  //   "departmentCode": "MLGRD_008_10",
  //   "code": "MLGRD_008_10_001",
  //   "registryRef": "62baab5da7a5cc661f1889c3",
  //   "displayName": "Application for a new dog license",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
  //   "reviewProcessSteps": [
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-details",
  //       "feedback": {
  //         "positive": "Application details verified",
  //         "negative": "Application details not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-attachments",
  //       "feedback": {
  //         "positive": "Application attachments verified",
  //         "negative": "Application attachments not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "approve-application",
  //       "feedback": {
  //         "positive": "Application recommended for issuance",
  //         "negative": "Application not recommended for issuance"
  //       }
  //     }
  //   ]
  // },
  // {
  //   "version": "1.0",
  //   "issuanceFee":0,
  //   "applicationFee":0,
  //   "status": "ACTIVATED",
  //   "name": "DUPLICATE_DOG_LICENSE",
  //   "departmentCode": "MLGRD_008_10",
  //   "registryRef": "62baab5da7a5cc661f1889c6",
  //   "code": "MLGRD_008_10_002",
  //   "displayName": "Application for a duplicate dog license",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
  //   "reviewProcessSteps": [
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-details",
  //       "feedback": {
  //         "positive": "Application details verified",
  //         "negative": "Application details not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-attachments",
  //       "feedback": {
  //         "positive": "Application attachments verified",
  //         "negative": "Application attachments not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "approve-application",
  //       "feedback": {
  //         "positive": "Application recommended for issuance",
  //         "negative": "Application not recommended for issuance"
  //       }
  //     }
  //   ]
  // },
  // {
  //   "version": "1.0",
  //   "issuanceFee":0,
  //   "applicationFee":0,
  //   "status": "ACTIVATED",
  //   "name": "ADDITIONAL_DOG_LICENSE",
  //   "departmentCode": "MLGRD_008_10",
  //   "registryRef": "62baab5da7a5cc661f1889cb",
  //   "code": "MLGRD_008_10_007",
  //   "displayName": "Application for an additional dog license",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
  //   "reviewProcessSteps": [
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-details",
  //       "feedback": {
  //         "positive": "Application details verified",
  //         "negative": "Application details not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-attachments",
  //       "feedback": {
  //         "positive": "Application attachments verified",
  //         "negative": "Application attachments not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "approve-application",
  //       "feedback": {
  //         "positive": "Application recommended for issuance",
  //         "negative": "Application not recommended for issuance"
  //       }
  //     }
  //   ]
  // },
  /////////////////////////////// DOG PERMIT ///////////////////////////////

  /////////////////////////////// NOISE & NUISANCE ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "departmentCode": "MLGRD_008_10",
    "name": "NOISE_AND_NUISANCE_PERMIT",
    "registryRef": "62baab5da7a5cc661f1889d1",
    "code": "MLGRD_008_10_005",
    "displayName": "Application for a noise and nuisance permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application recommended for issuance",
          "negative": "Application not recommended for issuance"
        }
      }
    ]
  },
  /////////////////////////////// NOISE & NUISANCE ///////////////////////////////

  /////////////////////////////// PARKS PERMITS ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "PARK_BOOKING_PERMIT",
    "departmentCode": "MLGRD_008_10",
    "registryRef": "62baab5da7a5cc661f1889c8",
    "code": "MLGRD_008_10_003",
    "displayName": "Application for a park booking permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-payment-for-application",
        "feedback": {
          "positive": "Application payment verified",
          "negative": "Application payment not verified"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application recommended for issuance",
          "negative": "Application not recommended for issuance"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "BURIAL_PERMIT",
    "departmentCode": "MLGRD_008_10",
    "code": "MLGRD_008_10_004",
    "registryRef": "62baab5da7a5cc661f1889ce",
    "displayName": "Application for a burial permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-payment-for-application",
        "feedback": {
          "positive": "Application payment verified",
          "negative": "Application payment not verified"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application recommended for issuance",
          "negative": "Application not recommended for issuance"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "STADIUM_HIRE",
    "departmentCode": "MLGRD_008_10",
    "registryRef": "62d7721eef440ee19f415bf4",
    "code": "MLGRD_008_10_012",
    "displayName": "Application for a stadium hire permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-payment-for-application",
        "feedback": {
          "positive": "Application payment verified",
          "negative": "Application payment not verified"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application recommended for issuance",
          "negative": "Application not recommended for issuance"
        }
      }
    ]
  },
  // {
  //   "version": "1.0",
  //   "issuanceFee":0,
  //   "applicationFee":0,
  //   "status": "ACTIVATED",
  //   "name": "TREE_CUTTING",
  //   "departmentCode": "MLGRD_008_10",
  //   "registryRef": "62e78315f0cefa42a611be9b",
  //   "code": "MLGRD_008_10_010",
  //   "displayName": "Application for a tree cutting job card",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
  //   "reviewProcessSteps": [
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-details",
  //       "feedback": {
  //         "positive": "Application details verified",
  //         "negative": "Application details not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-attachments",
  //       "feedback": {
  //         "positive": "Application attachments verified",
  //         "negative": "Application attachments not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-payment-for-application",
  //       "feedback": {
  //         "positive": "Application payment verified",
  //         "negative": "Application payment not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "approve-application",
  //       "feedback": {
  //         "positive": "Application recommended for issuance",
  //         "negative": "Application not recommended for issuance"
  //       }
  //     }
  //   ]
  // },
  /////////////////////////////// PARKS PERMITS ///////////////////////////////

  /////////////////////////////// FIRE PERMITS ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "FIRE_REPORT",
    "departmentCode": "MLGRD_008_10",
    "code": "MLGRD_008_10_013",
    "registryRef": "62e78299f0cefa42a611be92",
    "displayName": "Application for a fire report request",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "write-a-statement-report",
        "feedback": {
          "positive": "Statement report written",
          "negative": "Statement report not written"
        }
      },
      {
        "actorType": "user",
        "type": "produce-a-comprehensive-report",
        "feedback": {
          "positive": "Comprehensive report produced",
          "negative": "Comprehensive report not produced"
        }
      },
      {
        "actorType": "user",
        "type": "quality-check-report",
        "feedback": {
          "positive": "Report quality checked",
          "negative": "Report quality not checked"
        }
      },
      {
        "actorType": "user",
        "type": "request-for-report-payment",
        "feedback": {
          "positive": "Report payment requested",
          "negative": "Report payment not requested"
        }
      },
      {
        "actorType": "user",
        "type": "verify-payment-for-application",
        "feedback": {
          "positive": "Application payment verified",
          "negative": "Application payment not verified"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application recommended for issuance",
          "negative": "Application not recommended for issuance"
        }
      }
    ]
  },
  // {
  //   "version": "1.0",
  //   "status": "ACTIVATED",
  //   "name": "FIRE_REQUEST",
  //   "departmentCode": "MLGRD_008_10",
  //   "code": "MLGRD_008_10_011",
  //   "registryRef": "62e788f6f0cefa42a611beb6",
  //   "displayName": "Application for a fireworks permit",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
  //   "reviewProcessSteps": [
  //     {
  //       "actorType": "user",
  //       "type": "write-acknowledgement-letter",
  //       "feedback": {
  //         "positive": "Acknowledgement letter written",
  //         "negative": "Acknowledgement letter not written"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "conduct-site-inspection",
  //       "feedback": {
  //         "positive": "Site inspection conducted",
  //         "negative": "Site inspection not conducted"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "make-a-recommendation",
  //       "feedback": {
  //         "positive": "Recommendation made",
  //         "negative": "Recommendation not made"
  //       }
  //     },
  //   ]
  // },
  /////////////////////////////// FIRE PERMITS ///////////////////////////////

  /////////////////////////////// OTHER PERMITS (TO EDIT PROCESS) ///////////////////////////////
  // {
  //   "version": "1.0",
  //   "issuanceFee":0,
  //   "applicationFee":0,
  //   "status": "ACTIVATED",
  //   "name": "ADVERTISING_PERMIT",
  //   "departmentCode": "MLGRD_008_10",
  //   "registryRef": "62c02fa0fc55b1091cc689e0",
  //   "code": "MLGRD_008_10_006",
  //   "displayName": "Application for an advertising permit",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
  //   "reviewProcessSteps": [
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-details",
  //       "feedback": {
  //         "positive": "Application details verified",
  //         "negative": "Application details not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-attachments",
  //       "feedback": {
  //         "positive": "Application attachments verified",
  //         "negative": "Application attachments not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-payment-for-application",
  //       "feedback": {
  //         "positive": "Application payment verified",
  //         "negative": "Application payment not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "approve-application",
  //       "feedback": {
  //         "positive": "Application recommended for issuance",
  //         "negative": "Application not recommended for issuance"
  //       }
  //     }
  //   ]
  // },
  // {
  //   "version": "1.0",
  //   "issuanceFee":0,
  //   "applicationFee":0,
  //   "status": "ACTIVATED",
  //   "name": "TEMPORARY_LIQOUR",
  //   "departmentCode": "MLGRD_008_10",
  //   "registryRef": "62e7830ef0cefa42a611be97",
  //   "code": "MLGRD_008_10_008",
  //   "displayName": "Application for a temporary liquor license",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
  //   "reviewProcessSteps": [
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-details",
  //       "feedback": {
  //         "positive": "Application details verified",
  //         "negative": "Application details not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-application-attachments",
  //       "feedback": {
  //         "positive": "Application attachments verified",
  //         "negative": "Application attachments not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "verify-payment-for-application",
  //       "feedback": {
  //         "positive": "Application payment verified",
  //         "negative": "Application payment not verified"
  //       }
  //     },
  //     {
  //       "actorType": "user",
  //       "type": "approve-application",
  //       "feedback": {
  //         "positive": "Application recommended for issuance",
  //         "negative": "Application not recommended for issuance"
  //       }
  //     }
  //   ]
  // },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "CLASSROOM_HIRE",
    "departmentCode": "MLGRD_008_10",
    "registryRef": "62d69500ef440ee19f41550e",
    "code": "MLGRD_008_10_009",
    "displayName": "Application for a classroom/dining hall hire permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-payment-for-application",
        "feedback": {
          "positive": "Application payment verified",
          "negative": "Application payment not verified"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application recommended for issuance",
          "negative": "Application not recommended for issuance"
        }
      }
    ]
  },
  /////////////////////////////// OTHER PERMITS (TO EDIT PROCESS) ///////////////////////////////
  

  /////////////////////////////// BOTC ///////////////////////////////

  /////////////////////////////// REBATES 1 ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "REBATES_ITEM_470_03",
    "departmentCode": "MTI_007_12",
    "registryRef": "62c02fa0fc55b1091cc689e7",
    "code": "MTI_007_12_010",
    "displayName": "Application for a rebate item 470.03 certificate",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "REBATES_ITEM_311_42",
    "departmentCode": "MTI_007_12",
    "registryRef": "62d69509ef440ee19f415516",
    "code": "MTI_007_12_014",
    "displayName": "Application for a rebate item 311.42 certificate",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "REBATES_ITEM_320_01",
    "departmentCode": "MTI_007_12",
    "registryRef": "62d6950eef440ee19f41551a",
    "code": "MTI_007_12_015",
    "displayName": "Application for a rebate item 320.01 certificate",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  /////////////////////////////// REBATES 1 ///////////////////////////////

  /////////////////////////////// REBATES 2 ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "REBATES_ITEM_412_11",
    "departmentCode": "MTI_007_12",
    "registryRef": "62baab5da7a5cc661f1889c1",
    "code": "MTI_007_12_005",
    "displayName": "Application for a rebate item 412.11 certificate",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "REBATES_ITEM_405_04",
    "departmentCode": "MTI_007_12",
    "registryRef": "62c02f9ffc55b1091cc689dd",
    "code": "MTI_007_12_007",
    "displayName": "Application for a rebate item 405.04 certificate",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  /////////////////////////////// REBATES 2 ///////////////////////////////
  
  /////////////////////////////// EXPORTS FERROUS ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":5000,
    "applicationFee":1000,
    "status": "ACTIVATED",
    "departmentCode": "MTI_007_12",
    "name": "FERROUS_SCRAP_EXPORTS_PERMIT",
    "registryRef": "62baab5ca7a5cc661f1889b3",
    "code": "MTI_007_12_001",
    "displayName": "Application for a ferrous scrap metal export permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "get-foundry-consent",
        "feedback": {
          "positive": "Foundry consent obtained",
          "negative": "Foundry consent not obtained"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      },
      {
        "actorType": "system",
        "type": "request-issuance-payment",
        "feedback": {
          "positive": "Issuance payment requested",
          "negative": "Issuance payment not requested"
        }
      }
    ]
  },
  /////////////////////////////// EXPORTS FERROUS ///////////////////////////////

  /////////////////////////////// EXPORTS NON FERROUS ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":5000,
    "applicationFee":1000,
    "status": "ACTIVATED",
    "departmentCode": "MTI_007_12",
    "name": "NON_FERROUS_EXPORTS_PERMIT",
    "registryRef": "62baab5ca7a5cc661f1889b6",
    "code": "MTI_007_12_002",
    "displayName": "Application for a non-ferrous scrap metal export permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      },
      {
        "actorType": "system",
        "type": "request-issuance-payment",
        "feedback": {
          "positive": "Issuance payment requested",
          "negative": "Issuance payment not requested"
        }
      }
    ]
  },
  /////////////////////////////// EXPORTS NON FERROUS ///////////////////////////////

  /////////////////////////////// IMPORTS PERMITS ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":100,
    "status": "ACTIVATED",
    "departmentCode": "MTI_007_12",
    "name": "IMPORTS_BUSINESS_PERMIT",
    "registryRef": "62baab5da7a5cc661f1889b9",
    "code": "MTI_007_12_003",
    "displayName": "Application for a business import permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":100,
    "status": "ACTIVATED",
    "departmentCode": "MTI_007_12",
    "name": "IMPORTS_SOLE_TRADER_PERMIT",
    "registryRef": "62baab5da7a5cc661f1889bc",
    "code": "MTI_007_12_004",
    "displayName": "Application for a sole-trader import permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  /////////////////////////////// IMPORTS PERMITS ///////////////////////////////

  /////////////////////////////// SPECIFIC IMPORTS PERMITS ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "departmentCode": "MTI_007_12",
    "name": "GENERAL_IMPORTS_PERMIT",
    "registryRef": "62c02fa0fc55b1091cc689e9",
    "code": "MTI_007_12_009",
    "displayName": "Application for an import permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "departmentCode": "MTI_007_12",
    "name": "BREAD_UNIFORM_PERMIT",
    "registryRef": "62d694eaef440ee19f415506",
    "code": "MTI_007_12_011",
    "displayName": "Application for a bread and/or uniform import permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "departmentCode": "MTI_007_12",
    "name": "MAIZE_EXTRUDED_PRODUCTS_PERMIT",
    "registryRef": "62d694f2ef440ee19f41550a",
    "code": "MTI_007_12_012",
    "displayName": "Application for a maize extruded product import permit",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Application approved",
          "negative": "Application not approved"
        }
      }
    ]
  },
  /////////////////////////////// SPECIFIC IMPORTS PERMITS ///////////////////////////////

  /////////////////////////////// EXPORTER REGISTER ///////////////////////////////
  {
    "version": "1.0",
    "issuanceFee":0,
    "applicationFee":0,
    "status": "ACTIVATED",
    "name": "EXPORTER_REGISTER",
    "departmentCode": "MTI_007_12",
    "registryRef": "62c02fa0fc55b1091cc689e5",
    "code": "MTI_007_12_008",
    "displayName": "Application to register as an exporter",
    "description": 'New service offered to citizens and non-citizens as well as non-natural persons',
    "reviewProcessSteps": [
      {
        "actorType": "user",
        "type": "verify-application-details",
        "feedback": {
          "positive": "Application details verified",
          "negative": "Application details not verified"
        }
      },
      {
        "actorType": "user",
        "type": "verify-application-attachments",
        "feedback": {
          "positive": "Application attachments verified",
          "negative": "Application attachments not verified"
        }
      },
      {
        "actorType": "user",
        "type": "site-inspection",
        "feedback": {
          "positive": "Site inspection completed",
          "negative": "Site inspection not completed"
        }
      },
      {
        "actorType": "user",
        "type": "endorse-application",
        "feedback": {
          "positive": "Application endorsed",
          "negative": "Application not endorsed"
        }
      },
      {
        "actorType": "user",
        "type": "approve-application",
        "feedback": {
          "positive": "Exporter registration approved",
          "negative": "Exporter registration not approved"
        }
      }
    ]
  },
  /////////////////////////////// EXPORTER REGISTER ///////////////////////////////
  
  // {
  //   "version": "1.0",
  //   "status": "ACTIVATED",
  //   "name": "VALIDATE_PERMIT",
  //   "code": "MTI_007_12_019",
  //   "displayName": "Validate a Permit",
  //   "registryRef": "62d69504ef440ee19f415512",
  //   "description": 'New service offered to citizens and non-citizens as well as non-natural persons'
  // },
  
];

const createMinistries = () => {
  return Promise.all(ministries.map(async (ministry) => {
    const ministryExists = await Ministry.findOne({ code: ministry.code });
    if (ministryExists) return;

    return Ministry.create(ministry);
  }));
}

const createDepartments = () => {
  return Promise.all(departments.map(async (department) => {
    const departmentExists = await Department.findOne({ code: department.code });
    if (departmentExists) return;

    const ministry = await Ministry.findOne({ code: department.ministryCode });
    department.ministry = ministry._id;
    return Department.create(department);
  }));
}

const createServices = () => {
  return Promise.all(services.map(async (service) => {
    const serviceExists = await Service.findOne({ code: service.code });
    if (serviceExists) return;

    const department = await Department.findOne({ code: service.departmentCode });

    const serviceObj = {
      name: service.name,
      code: service.code,
      version: service.version,
      department: department._id,
      displayName: service.displayName,
      description: service.description,
      registryRef: service.registryRef,
      issuanceFee: service.issuanceFee,
      applicationFee: service.applicationFee,
      reviewProcess: {
        name: `${service.name}_REVIEW_PROCESS`,
        description: 'This review is conducted by the Department outlining the process flow to review the application',
        steps: service.reviewProcessSteps.map((step, i) => {
          const stepObj = {
            stage: i + 1,
            required: true,
            type: step.type,
            actorType: step.actorType,
            name: capitalise(step.type.replace(/-/g, ' ').toLowerCase()),
            description: capitalise(step.type.replace(/-/g, ' ').toLowerCase()),
            feedback: {
              positive: {
                verb: step.feedback.positive,
                caption: step.feedback.positive
              },
              negative: {
                verb: step.feedback.negative,
                caption: step.feedback.negative
              }
            }
          };

          return stepObj;
          // return JSON.stringify(stepObj, null, 2);
        })
      }
    };

    return Service.create(serviceObj);
  }));
}

const initialiseServices = async () => {
  await createMinistries();
  await createDepartments();
  await createServices();
}

module.exports = initialiseServices;