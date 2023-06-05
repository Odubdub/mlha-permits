export const PermitRegState = {
  All: 'all',
  New: 'new',
  Pending: 'pending',
  Returned: 'returned',
  PendingIssuance: 'pending-issuance',
  PaymentRequested: 'payment-requested',
  Approved: 'issued',
  Rejected: 'rejected',
  Revoked: 'revoked'
};

export const PaymentStatus = {
  Pending: 'pending',
  Requested: 'requested',
  Approved: 'approved',
  Failed: 'failed'
};

export const ApplicantType = {
  Individual: 'IndividualApplicant',
  Entity: 'EntityApplicant'
};

export const PermitTypes = {
  Export: 'ExportPermit',
  Import: 'ImportPermit',
  Rebate: 'RebateCertificate',
  Skip: 'SkipHire',
  Advertising: 'AdvertisingPermit',
  Stadium: 'StadiumHirePermit',
  Dog: 'DogLicense',
  SpecialEvents: 'SpecialEventsPermit',
  TempLiqour: 'TemporaryLiquorLicense',
  TreeCutting: 'TreeCuttingPermit',
  BurialPermits: 'BurialPermit',
  Noise: 'NoiseNuisancePermit',
  Park: 'ParkSpaceHirePermit',
  FireReport: 'FireReportPermit',
  FireWorks: 'FireWorksPermit',
  Classroom: 'ClassroomDiningPermit'
};

export const getStatusDescription = (s) => {
  const status = s.toLowerCase();

  if (status == PermitRegState.Approved) return 'Issued';
  if (status == PermitRegState.Rejected) return 'Rejected';
  if (status == PermitRegState.Pending) return 'Pending';
  if (status == PermitRegState.Returned) return 'Returned';
  if (status == PermitRegState.Revoked) return 'Revoked';
  if (status == PermitRegState.PaymentRequested) return 'Pending Payment';
  if (status == PermitRegState.PendingIssuance) return 'Pending Issuance';
  if (status == PermitRegState.New) return 'New';
  if (status == 'approved') return 'Approved';
  if (status == 'not_requested') return 'Not Requested';
  return `#${status}`;
};

export const getStatusColor = (s) => {
  const status = s.toLowerCase();

  if (status == PermitRegState.Approved) return '#00D800';
  if (status == PermitRegState.Rejected) return '#FF0000';
  if (status == PermitRegState.Pending) return '#853C00';
  if (status == PermitRegState.Returned) return '#001EFF';
  if (status == PermitRegState.New) return '#32C5FF';
  if (status == PermitRegState.Revoked) return '#FF8C00';
  if (status == PermitRegState.PaymentRequested) return '#860086';
  if (status == PermitRegState.PendingIssuance) return '#000000';
  return `#808080`;
};

export const getFullName = (type) => {
  if (type == PermitTypes.Export) {
    return 'Export Permit';
  } else if (type == PermitTypes.Import) {
    return 'Import Permit';
  } else if (type == PermitTypes.Rebate) {
    return 'Rebate Permit';
  } else if (type == PermitTypes.Skip) {
    return 'Skip Hire Permit';
  } else if (type == PermitTypes.Advertising) {
    return 'Advertising Permit';
  } else if (type == PermitTypes.Stadium) {
    return 'Stadium Hire Permit';
  } else if (type == PermitTypes.Dog) {
    return 'Dog License';
  } else if (type == PermitTypes.SpecialEvents) {
    return 'Special Event Permit';
  } else if (type == PermitTypes.TempLiqour) {
    return 'Temporary Liquor License';
  } else if (type == PermitTypes.TreeCutting) {
    return 'Tree Cutting Service Permit';
  } else if (type == PermitTypes.BurialPermits) {
    return 'Burial Permit';
  } else if (type == PermitTypes.Noise) {
    return 'Noise & Nuisance Permit';
  } else if (type == PermitTypes.Park) {
    return 'Park & Open Space Hire';
  } else if (type == PermitTypes.FireReport) {
    return 'Fire Report Request Permit';
  } else if (type == PermitTypes.FireWorks) {
    return 'Fire Works Permit';
  } else if (type == PermitTypes.Classroom) {
    return 'Classroom & Dining Hire Permit';
  } else {
    return 'Which one is this one';
  }
};

export const isDeveloper = (userData) => {
  return ['developer'].includes(userData.type);
};

const getShortName = (type) => {
  if (type == PermitTypes.Export) {
    return 'Export';
  } else if (type == PermitTypes.Import) {
    return 'Import';
  } else if (type == PermitTypes.Rebate) {
    return 'Rebate';
  } else if (type == PermitTypes.Skip) {
    return 'Skip Hire';
  } else if (type == PermitTypes.Advertising) {
    return 'Advertising';
  } else if (type == PermitTypes.Stadium) {
    return 'Stadium Hire';
  } else if (type == PermitTypes.Dog) {
    return 'Dog License';
  } else if (type == PermitTypes.SpecialEvents) {
    return 'Special Event';
  } else if (type == PermitTypes.TempLiqour) {
    return 'Temporary Liquor';
  } else if (type == PermitTypes.TreeCutting) {
    return 'Tree Cutting Service';
  } else if (type == PermitTypes.BurialPermits) {
    return 'Burial';
  } else if (type == PermitTypes.Noise) {
    return 'Noise & Nuisance';
  } else if (type == PermitTypes.Park) {
    return 'Park & Open Space';
  } else if (type == PermitTypes.FireReport) {
    return 'Fire Report Request';
  } else if (type == PermitTypes.FireWorks) {
    return 'Fire Works';
  } else if (type == PermitTypes.Classroom) {
    return 'Classroom & Dining Hire';
  } else {
    return 'Short ##Underfined## for: ' + type;
  }
};

export const AuthorityPermits = {
  MYSC: [
    {
      type: PermitTypes.Export,
      sName: getShortName(PermitTypes.Export),
      fName: getFullName(PermitTypes.Export)
    }
  ],
  MOBE: [
    {
      type: PermitTypes.Classroom,
      sName: getShortName(PermitTypes.Classroom),
      fName: getFullName(PermitTypes.Classroom)
    }
  ],
  BOTC: [
    {
      type: PermitTypes.Import,
      sName: getShortName(PermitTypes.Import),
      fName: getFullName(PermitTypes.Import)
    },
    {
      type: PermitTypes.Rebate,
      sName: getShortName(PermitTypes.Rebate),
      fName: getFullName(PermitTypes.Rebate)
    },
    {
      type: PermitTypes.Export,
      sName: getShortName(PermitTypes.Export),
      fName: getFullName(PermitTypes.Export)
    }
  ],
  MLGRD: [
    {
      type: PermitTypes.Noise,
      sName: getShortName(PermitTypes.Noise),
      fName: getFullName(PermitTypes.Noise)
    },
    {
      type: PermitTypes.BurialPermits,
      sName: getShortName(PermitTypes.BurialPermits),
      fName: getFullName(PermitTypes.BurialPermits)
    },
    {
      type: PermitTypes.FireReport,
      sName: getShortName(PermitTypes.FireReport),
      fName: getFullName(PermitTypes.FireReport)
    },
    {
      type: PermitTypes.FireWorks,
      sName: getShortName(PermitTypes.FireWorks),
      fName: getFullName(PermitTypes.FireWorks)
    },
    {
      type: PermitTypes.Dog,
      sName: getShortName(PermitTypes.Dog),
      fName: getFullName(PermitTypes.Dog)
    },
    {
      type: PermitTypes.Park,
      sName: getShortName(PermitTypes.Park),
      fName: getFullName(PermitTypes.Park)
    },
    {
      type: PermitTypes.TreeCutting,
      sName: getShortName(PermitTypes.TreeCutting),
      fName: getFullName(PermitTypes.TreeCutting)
    },
    {
      type: PermitTypes.TempLiqour,
      sName: getShortName(PermitTypes.TempLiqour),
      fName: getFullName(PermitTypes.TempLiqour)
    }
  ]
};

export const TimePeriods = {
  alltime: 0,
  daily: 1,
  weekly: 2,
  monthly: 3,
  yearly: 4
};
