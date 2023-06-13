import { DataSource } from 'src/pages/RegDetails/DetailFields/DataSource';
import { FieldType } from 'src/pages/RegDetails/DetailFields/FieldType';
import { Formatters } from 'src/pages/RegDetails/DetailFields/Formatters';
import { getPseudo } from './pseudo_value';
import applicant from '../render/applicant.json';
import company from '../render/company.json';

//function that checks if an array of objects contains objects with different fieldName
export const generateOutputs = (service, form) => {
  //Append fieldNames & groupName
  let fieldNames = service.formField.map((obj) => obj.fieldName || obj.groupName);

  //Append SubfieldNames
  service.formField.forEach((obj) => {
    if (obj.groupName) {
      obj.groupFields.forEach((field) => {
        fieldNames.push(obj.groupName + field.fieldName);
      });
    }
  });

  const output = {
    reference: {
      application_id: `${Math.floor(Math.random() * (999999999999999 + 1)) + 1000000000}`,
      response_id: '',
      status: 0,
      profile: {
        first_name: 'Onthatile',
        middle_name: '',
        citizenship: 'Citizen',
        surname: 'Maswibilili',
        date_of_birth: '1992-10-30T00:00:00.000Z',
        gender: 'Male',
        country_of_birth: 'Botswana',
        nationality: 'Botswana',
        primary_phone: '+26772482827',
        primary_postal: {
          is_primary: false,
          box_number: '',
          city_town_village: ''
        },
        primary_email: 'owashe@gmail.com'
      },
      submitted_by: {
        id: '548516718',
        type: 0
      },
      service: {
        service_id: service.serviceCode,
        service_name: 'Application',
        version: service.version
      }
    },
    payload: {
      form: {},
      payment: {}
    }
  };

  let errors = {};

  service.formField.forEach((obj) => {
    if (obj.groupName != undefined) {
      //Check if group exists
      const similarFields = fieldNames.filter((field) => field === obj.groupName);
      if (similarFields.length > 1) {
        errors[obj.groupName] = 'Duplicate Group';
        console.log(`Duplicate Group: ${similarFields}`);
      }

      //Repeatable field values
      output.payload.form[obj.groupName] = [];

      //Loop 3 times to generate 3 child objects
      for (let i = 0; i < 3; i++) {
        const child = {};
        obj.groupFields.forEach((subObj) => {
          //Check if subfields have duplicates
          if (i === 0) {
            const similarFields = fieldNames.filter(
              (field) => field === obj.groupName + subObj.fieldName
            );
            if (similarFields.length > 1) {
              errors[subObj.fieldName] = 'Duplicate SubKey';
            }
          }

          //Set test value
          child[subObj.fieldName] = getPseudo(subObj, service.serviceCode);
        });

        //Set child object to array
        output.payload.form[obj.groupName].push(child);
      }
    } else {
      output.payload.form[obj.fieldName] = getPseudo(obj, service.serviceCode);

      //Check similar children
      const similarFields = fieldNames.filter((field) => field === obj.fieldName);
      if (similarFields.length > 1) {
        errors[obj.fieldName || obj.fieldName || obj.groupName] = 'Duplicate Key';
      }
    }
  });

  if (Object.keys(errors).length == 0) {
    return output;
  }

  return errors;
};

export const generateConfigOutputs = (config) => {
  //Append fieldNames & groupName
  let fieldNames = config.form.map((obj) => obj.fieldName || obj.groupName);

  //Append SubfieldNames
  config.form.forEach((obj) => {
    if (obj.groupName) {
      obj.groupFields.forEach((field) => {
        fieldNames.push(obj.groupName + field.fieldName);
      });
    }
  });

  const applicationId = `${Math.floor(Math.random() * (999999999999999 + 1)) + 1000000000}`;
  const paymentRef = `${Math.floor(Math.random() * (9999999999 + 1)) + 10000}`;

  const output = {
    reference: {
      application_id: applicationId,
      response_id: '',
      status: 0,
      profile: {
        first_name: 'Onthatile',
        middle_name: '',
        citizenship: 'Citizen',
        surname: 'Maswibilili',
        date_of_birth: '1992-10-30T00:00:00.000Z',
        gender: 'Male',
        country_of_birth: 'Botswana',
        nationality: 'Botswana',
        primary_phone: '+26772482827',
        primary_postal: {
          is_primary: false,
          box_number: '',
          city_town_village: ''
        },
        primary_email: 'owashe@gmail.com'
      },
      submitted_by: {
        id: '548516718',
        type: 0
      },
      service: {
        service_id: config.code,
        service_name: 'Application',
        version: config.version
      }
    },
    payload: {
      form: {},
      payment:
        config.applicationFee != 0
          ? {
              payment_name: 'Publication of Banns Fee',
              amount: config.applicationFee.toString(),
              status: 'SUCCESSFUL',
              payment_ref: `PPM-${paymentRef}`,
              application_ref: applicationId,
              service_code: config.code
            }
          : {}
    }
  };

  let errors = {};

  config.form.forEach((obj) => {
    if (obj.groupName != undefined) {
      //Check if group exists
      const similarFields = fieldNames.filter((field) => field === obj.groupName);
      if (similarFields.length > 1) {
        errors[obj.groupName] = 'Duplicate Group';
        console.log(`Duplicate Group: ${similarFields}`);
      }

      //Repeatable field values
      output.payload.form[obj.groupName] = [];

      //Loop 3 times to generate 3 child objects
      for (let i = 0; i < 3; i++) {
        const child = {};
        obj.groupFields.forEach((subObj) => {
          //Check if subfields have duplicates
          if (i === 0) {
            const similarFields = fieldNames.filter(
              (field) => field === obj.groupName + subObj.fieldName
            );
            if (similarFields.length > 1) {
              errors[subObj.fieldName] = 'Duplicate SubKey';
            }
          }

          //Set test value
          child[subObj.fieldName] = getPseudo(subObj, config.code);
        });

        //Set child object to array
        output.payload.form[obj.groupName].push(child);
      }
    } else {
      output.payload.form[obj.fieldName] = getPseudo(obj, config.code);

      //Check similar children
      const similarFields = fieldNames.filter((field) => field === obj.fieldName);
      if (similarFields.length > 1) {
        errors[obj.fieldName || obj.fieldName || obj.groupName] = 'Duplicate Key';
      }
    }
  });

  if (Object.keys(errors).length == 0) {
    return output;
  }

  return errors;
};

export const generateOutputFromConfig = ({ form, serviceCode, name, version }) => {
  //Append fieldNames & groupName
  let fieldNames = (form || []).map((obj) => obj.fieldName || obj.groupName);

  //Append SubfieldNames
  service.formField.forEach((obj) => {
    if (obj.groupName) {
      obj.groupFields.forEach((field) => {
        fieldNames.push(obj.groupName + field.fieldName);
      });
    }
  });

  const output = {
    data: {
      application_id: `${Math.floor(Math.random() * (999999999999999 + 1)) + 1000000000}`,
      response_id: '',
      form: {},
      status: 0,
      submitted_by: {
        user_id: '720914114',
        type: '0'
      },
      profile: {
        first_name: 'Onthatile',
        middle_name: '',
        citizenship: 'Citizen',
        surname: 'Maswibilili',
        date_of_birth: '1992-10-30T00:00:00.000Z',
        gender: 'Male',
        country_of_birth: 'Botswana',
        nationality: 'Botswana',
        primary_phone: '+26772482827',
        primary_postal: {
          is_primary: false,
          box_number: '',
          city_town_village: ''
        },
        primary_email: 'owashe@gmail.com'
      },
      submitted_by: {
        id: '548516718',
        type: 0
      },
      payment: {},
      service: {
        service_id: service.serviceCode,
        service_name: 'Application',
        version: service.version
      }
    }
  };

  let errors = {};

  service.formField.forEach((obj) => {
    if (obj.groupName != undefined) {
      //Check if group exists
      const similarFields = fieldNames.filter((field) => field === obj.groupName);
      if (similarFields.length > 1) {
        errors[obj.groupName] = 'Duplicate Group';
        console.log(`Duplicate Group: ${similarFields}`);
      }

      //Repeatable field values
      output.payload.form[obj.groupName] = [];

      //Loop 3 times to generate 3 child objects
      for (let i = 0; i < 3; i++) {
        const child = {};
        obj.groupFields.forEach((subObj) => {
          //Check if subfields have duplicates
          if (i === 0) {
            const similarFields = fieldNames.filter(
              (field) => field === obj.groupName + subObj.fieldName
            );
            if (similarFields.length > 1) {
              errors[subObj.fieldName] = 'Duplicate SubKey';
            }
          }

          //Set test value
          child[subObj.fieldName] = getPseudo(subObj, service.serviceCode);
        });

        //Set child object to array
        output.payload.form[obj.groupName].push(child);
      }
    } else {
      output.payload.form[obj.fieldName] = getPseudo(obj, service.serviceCode);

      //Check similar children
      const similarFields = fieldNames.filter((field) => field === obj.fieldName);
      if (similarFields.length > 1) {
        errors[obj.fieldName || obj.fieldName || obj.groupName] = 'Duplicate Key';
      }
    }
  });

  if (Object.keys(errors).length == 0) {
    return output;
  }

  return errors;
};

export const generateRendererConfig = (service, name) => {
  let fields = [];

  service.form.forEach((section) => {
    fields = [...fields, ...section.fields];
  });
  return {
    version: service.version,
    code: service.serviceCode,
    name: service.shortName,
    applicant: applicant,
    companyOwner: fields.map((obj) => obj.fieldName).includes('companyRegNo'),
    owner: fields.map((obj) => obj.fieldName).includes('companyRegNo') ? company : [],
    details: getApplicationFields(fields),
    details2: [],
    otherDetails: [],
    attachments: getAttachments(fields)
  };
};

const getApplicationFields = (fields) => {
  const appFields = [];
  fields.forEach((field) => {
    console.log(field.fieldName);

    //Check if string ends with 'Att'
    if (field.fieldName != undefined) {
      if (!field.fieldName.endsWith('Att') && field.fieldName != 'companyRegNo') {
        appFields.push(getField(field));
      }
    } else {
      // appFields.push(getGroupedFields(field));
    }
  });

  return appFields;
};

const getAttachments = (fields) => {
  const attachments = [];
  fields.forEach((field) => {
    if (field.fieldType == 'Attachment') {
      attachments.push(getField(field));
    }
  });

  return attachments;
};

const getField = (field) => {
  let type = FieldType.text;
  let formatter = Formatters.none;

  if (field.fieldName.toLowerCase().includes('date') || field.fieldType == 'Date') {
    type = FieldType.date;
    formatter = Formatters.date;
  } else if (field.fieldName.endsWith('Att')) {
    type = FieldType.attachment;
  } else if (['companyRegNo', 'businessRegNo'].includes(field.fieldName)) {
    type = FieldType.moreInfo;
  } else if (field.groupName != undefined) {
    return getGroupedFields(field);
  }

  if (
    field.fieldName.toLowerCase().includes('value') ||
    field.fieldLabel.toLowerCase().includes('bwp')
  ) {
    formatter = Formatters.currency;
  }

  return {
    path: `applicationDetails.${field.fieldName}`,
    desc: field.fieldLabel,
    field: type,
    formatter: formatter,
    source: DataSource.application
  };
};

const getGroupedFields = (group) => {
  const config = {
    key: `applicationDetails.${group.fieldName}`,
    desc: group.groupName,
    descInfo: group.groupName,
    tableAction: `View ${group.groupName}`,
    field: FieldType.table,
    correctable: false,
    formatter: Formatters.none,
    source: DataSource.application,
    table: {
      header: group.groupFields.map((field) => field.fieldLabel),
      columns: group.groupFields.map((field) => getField(field))
    }
  };

  return config;
};
