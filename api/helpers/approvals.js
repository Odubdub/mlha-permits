const VERIFY_PERMIT = 'verify';
const ENDORSE_PERMIT = 'endorse';
const APPROVE_PERMIT = 'approve';

const services = [
  {
    oldName: 'NON-FERROUS-SCRAP-METAL-EXPORT-PERMIT',
    registryRef: '62baab5ca7a5cc661f1889b6',
    oldCode: 'MITI-EXPORT-002', 

    newName: 'MITI-BOTC-NON-FERROUS-SCRAP-EXPORTS-PERMIT',
    newCode: 'MTI_007_12_002',
  },
  {
    oldName: 'FERROUS-SCRAP-METAL-EXPORT-PERMIT',
    registryRef: '62baab5ca7a5cc661f1889b3',
    oldCode: 'MITI-EXPORT-001',
    
    newName: 'MITI-BOTC-FERROUS-SCRAP-EXPORTS-PERMIT',
    newCode: 'MTI_007_12_001',
  },
  {
    registryRef: '62baab5da7a5cc661f1889bc',
    oldName: 'SOLE-TRADER-IMPORT-PERMIT',
    oldCode: 'MITI-IMPORT-004',

    newName: 'MITI-BOTC-IMPORTS-SOLE-TRADER-PERMIT',
    newCode: 'MTI_007_12_004',
  },
  {
    registryRef: '62baab5da7a5cc661f1889b9',
    oldName: 'IMPORT-PERMIT-BUSINESS',
    oldCode: 'MITI-IMPORT-003',

    newName: 'MITI-BOTC-IMPORTS-BUSINESS-PERMIT',
    newCode: 'MTI_007_12_003'
  },
  {
    registryRef: '62baab5da7a5cc661f1889c1',
    oldName: 'REBATE-ITEM-412.11',
    oldCode: 'MITI-REBATE-005',

    newName: 'MITI-BOTC-REBATES-ITEM-412.11-CERTIFICATE',
    newCode: 'MTI_007_12_REBATES_ITEM_412.11_CERTIFICATE_S0005'
  },
  {
      registryRef: '62baab5da7a5cc661f1889c8',
      oldName: 'PARK-BOOKING-PERMIT',
      oldCode: 'MLGRD-PARK-001',

      newName: 'MLGRD-LA-PARK-BOOKING-PERMIT',
      newCode: 'MLGRD_008_10_003'
  },
  {
      oldName: 'BURIAL-PERMIT',
      oldCode: 'MLGRD-BURIAL-005',
      registryRef: '62baab5da7a5cc661f1889ce',

      newName: 'MLGRD-LA-BURIAL-PERMIT',
      newCode: 'MLGRD_008_10_004'
  },
  {
    oldName: 'NEW-DOG-LICENSE',
    oldCode: 'MLGRD-DOG-002',
    registryRef: '62baab5da7a5cc661f1889c3',

    newName: 'MLGRD-LA-NEW-DOG-LICENSE',
    newCode: 'MLGRD_008_10_001'
  },
  {
      oldName: 'DUPLICATE-DOG-LICENSE',
      oldCode: 'MLGRD-DOG-003',
      registryRef: '62baab5da7a5cc661f1889c6',

      newName: 'MLGRD-LA-DUPLICATE-DOG-LICENSE',
      newCode: 'MLGRD_008_10_002'
  },
  {
    oldName: 'ADDITIONAL-DOG-LICENSE',
    oldCode: 'MLGRD-DOG-004',
    registryRef: '62baab5da7a5cc661f1889cb',

    newName: 'MLGRD-LA-ADDITIONAL-DOG-LICENSE',
    newCode: 'MLGRD_008_10_007'
  },
  {
    oldName: 'NOISE-AND-NUISANCE-PERMIT',
    oldCode: 'MLGRD-NOISE-006',
    registryRef: '62baab5da7a5cc661f1889d1',

    newName: 'MLGRD-LA-NOISE-AND-NUISANCE-PERMIT',
    newCode: 'MLGRD_008_10_005'
  }
]