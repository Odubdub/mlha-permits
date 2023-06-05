import { ApplicantType } from './helper';

export const isBlank = (field) => {
  return (field || '').trim().length == 0;
};

export const pluralize = (count, noun) => {
  return `${count} ${noun}${count !== 1 ? 's' : ''}`;
};

export const getApplicantName = (applicationOwner) => {
  if (applicationOwner.applicantType == ApplicantType.Individual) {
    return `${applicationOwner.details.foreNames} ${applicationOwner.details.lastName}`;
  } else {
    return `${applicationOwner.details.companyName}`;
  }
};

export const getApplicantType = (applicationOwner) => {
  if (applicationOwner.applicantType == ApplicantType.Individual) {
    return `Individual`;
  } else {
    return `Business`;
  }
};
