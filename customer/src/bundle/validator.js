import { FieldTypes } from './constants';
import { getDependancyValue, getFieldValue } from './DataTransformer';

export const validateRegex = ({ fieldType, value, mandatory }) => {
  const standardRegex = {
    [FieldTypes.OmangNumber]: {
      type: 'Omang Number',
      regex: /^\d{4}[1-2]\d{4}$/
    },
    [FieldTypes.FemaleOmangNumber]: {
      type: 'Female Omang Number',
      regex: /^\d{4}[2]\d{4}$/
    },
    [FieldTypes.MaleOmangNumber]: {
      type: 'Male Omang Number',
      regex: /^\d{4}[1]\d{4}$/
    },
    [FieldTypes.Email]: {
      type: 'Email',
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    [FieldTypes.PhoneNumber]: {
      type: 'Phone Number',
      regex: /^\d{7,14}$/
    },
    [FieldTypes.Number]: {
      regex: /^[-+]?\d+(\.\d+)?$/,
      type: 'Number'
    },
    [FieldTypes.Currency]: {
      regex: /^\d{1,3}(,\d{3})*(\.\d{2})?$/,
      type: 'Currency'
    },
    [FieldTypes.Time]: {
      type: 'Time',
      regex: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    [FieldTypes.Hyperlink]: {
      type: 'Link',
      regex:
        /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:\[(?:[0-9a-fA-F:]+)\]|(?:[a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(?:\:[0-9]+)?)(?:\/(?:(?:[^\s/?#]+\/)?[^\s?#]+(?:\?[^#\s]*)?)?)?(?:#[^\s]*)?$/
    },
    [FieldTypes.VehiclePlateNumber]: {
      test: 'Vehicle Registration',
      regex: /^(B\d{3}[A-Z]{3}|BX\d{6}|BDF\d{6})$/
    },
    [FieldTypes.Endpoint]: {
      type: 'Endpoint',
      regex: /^\/[\w\/]+$/
    }
  }[fieldType];

  // For ShortText use the dynamic regex
  // Check if regex string is valid first

  if ([FieldTypes.Number, FieldTypes.Float].includes(fieldType)) {
    return !isNaN(value);
  }
  // TODO: Add dynamix regex validation by setting the str to standardRegex
  if (typeof value == 'string' && standardRegex) {
    if (isBlank(value) && mandatory) {
      return false;
    } else if (!isBlank(value) && !standardRegex.regex.test(value)) {
      return false;
    } else {
      return true;
    }
  } else {
    if (isBlank(value) && mandatory) {
      return false;
    }

    return true;
  }
};

export const isBlank = (field) => {
  //if type of field is array
  if (Array.isArray(field)) {
    return field.length == 0;
  }

  if (typeof field == 'number') {
    return field > 0;
  }

  if (typeof field == 'string') {
    return field.trim().length == 0;
  }

  return isNotValue(field);
};

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

export const isNotValue = (value) => {
  return value === undefined || value === null || value === '';
};

export const isEqual = (value1, value2) => {
  // If both values are arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    // Sort both arrays to ensure consistent order
    const sorted1 = value1.sort();
    const sorted2 = value2.sort();
    // Check if both arrays have the same length
    if (sorted1.length !== sorted2.length) {
      return false;
    }
    // Check if each element in the first array exists in the second array
    for (let i = 0; i < sorted1.length; i++) {
      if (sorted2.indexOf(sorted1[i]) === -1) {
        return false;
      }
    }
    // If all elements in the first array exist in the second array, and the lengths are the same
    // then the arrays are similar
    return true;
  } else {
    // If the values are not arrays, use strict equality comparison
    return value1 === value2;
  }
};

export const validateTable = (tableField, data) => {
  let mandatory = getDependancyValue({
    data,
    dependancies: tableField.dependancies,
    property: 'mandatory'
  });

  if (mandatory === null) {
    mandatory = isNotValue(tableField.mandatory) ? false : tableField.mandatory;
  }

  const tableData = getFieldValue({ data, path: tableField.fieldName }) || [];
  if (!tableData.length && !mandatory) {
    // Table is empty and is not mandatory
    return { mandatory, isValid: true };
  } else if (!tableData.length && mandatory) {
    // Table is empty and is mandatory
    return { mandatory, isValid: false };
  } else {
    // Table has values so validate each individual field
    const values = [];
    tableField.fields.forEach((field) => {
      values.push(validateField(field, tableData));
    });

    return { mandatory, isValid: !values.includes(false) };
  }
};

export const validateField = (field, data) => {
  if (
    [FieldTypes.Dropdown, FieldTypes.DropdownMulti, FieldTypes.DropdownWithOther].includes(
      getFieldType(field)
    )
  ) {
    return validateDropdown(field, data);
  } else if (getFieldType(field) == FieldTypes.DataTable) {
    return validateTable(field, data);
  } else {
    return validateOtherField(field, data);
  }
};

const getFieldType = (field) => {
  return field.fieldType || field['Column Type'];
};

export const validateOtherField = (field, data) => {
  // Temporary fix for the issue where the type is the table
  if (Array.isArray(data)) {
    return true;
  }

  const value = getFieldValue({ data, path: field.fieldName });
  let mandatory = getDependancyValue({
    data,
    dependancies: field.dependancies,
    property: 'mandatory'
  });

  if (mandatory === null) {
    mandatory = field.mandatory;
  }

  const isValid = validateRegex({
    fieldType: getFieldType(field),
    value,
    mandatory
  });

  return { isValid, mandatory };
};

export const validateDropdown = (field, data) => {
  const value = getFieldValue({ data, path: field.fieldName });
  let mandatory = getDependancyValue({
    data,
    dependancies: field.dependancies,
    property: 'mandatory'
  });

  if (mandatory === null) {
    mandatory = field.mandatory;
  }

  if (getFieldType(field) == FieldTypes.DropdownMulti) {
    if (mandatory && (!value || !value.length)) {
      return { mandatory, isValid: false };
    }
  } else {
    if (mandatory && isNotValue(value)) {
      return { mandatory, isValid: false };
    }
  }

  return { isValid: true, mandatory };
};

export const sanitizeDropDownValues = (field, data) => {
  const value = getFieldValue({ data, path: field.fieldName });

  let options = getDependancyValue({
    data,
    dependancies: field.dependancies,
    property: 'options'
  });

  if (options === null) {
    options = field.options;
    if (typeof options == 'string') {
      if (options.includes('*')) {
        options = options.split('*');
      } else if (options.includes('%')) {
        options = options.split('%');
      } else {
        options = [options];
      }
    } else if (Array.isArray(options)) {
      options = options;
    }
  }

  // If options is an array of objects then set options value of the key else set options to the array
  if (Array.isArray(options) && options.length && isObject(options[0])) {
    options = options.map((option) => option.key);
  }

  // If value is an array then check if it is a subset of the options
  if (Array.isArray(value)) {
    return value.filter((item) => options.includes(item));
  } else {
    return options.includes(value) ? value : null;
  }
};
