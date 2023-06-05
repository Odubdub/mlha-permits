import { Field } from 'formik';
import { options } from 'numeral';
import { DependancyConditions, FieldTypes } from './constants';
import { isNotValue } from './validator';

let otherFields = [];

export const StringInputFields = [
  FieldTypes.ShortText,
  FieldTypes.LongText,
  FieldTypes.OmangNumber,
  FieldTypes.Endpoint,
  FieldTypes.Hyperlink,
  FieldTypes.Email,
  FieldTypes.VehiclePlateNumber,
  FieldTypes.DynamicTextField,
  FieldTypes.PhoneNumber
];

export const ShortStringInputFields = StringInputFields.filter((sif) => sif != FieldTypes.LongText);

const dependancyConditionOptions = [
  {
    key: DependancyConditions.Equal,
    value: 'Equal'
  },
  {
    key: DependancyConditions.NotEqual,
    value: 'Not Equal'
  },
  {
    key: DependancyConditions.GreaterThan,
    value: 'Greater Than'
  },
  {
    key: DependancyConditions.LessThan,
    value: 'Less Than'
  },
  {
    key: DependancyConditions.GreaterThanOrEqual,
    value: 'Greater Than Or Equal'
  },
  {
    key: DependancyConditions.LessThanOrEqual,
    value: 'Less Than Or Equal'
  },
  {
    key: DependancyConditions.Contains,
    value: 'Contains'
  },
  {
    key: DependancyConditions.NotContains,
    value: "Doesn't Contain"
  },
  {
    key: DependancyConditions.StartsWith,
    value: 'Starts With'
  },
  {
    key: DependancyConditions.EndsWith,
    value: 'Ends With'
  },
  {
    key: DependancyConditions.IsEmpty,
    value: 'Is Empty'
  },
  {
    key: DependancyConditions.IsNotEmpty,
    value: 'Is Not Empty'
  },
  {
    key: DependancyConditions.IsTrue,
    value: 'Is True'
  },
  {
    key: DependancyConditions.IsFalse,
    value: 'Is False'
  }
];

export const getDependancyField = ({ dependancies, editingState, rowData, subfield }) => {
  const { metadata, sections } = editingState;
  if (subfield.fieldName == 'field') {
    return getSourceFieldsDependancy(sections, metadata, subfield);
  } else if (subfield.fieldName == 'condition') {
    return getSourceConditionsValues(sections, metadata, subfield, rowData);
  } else if (subfield.fieldName == 'value') {
    // Source fields
    return getComparativeValues(sections, metadata, subfield, rowData);
  } else if (subfield.fieldName == 'targetValue') {
    return getTargetValue(sections, metadata, subfield, rowData);
  } else if (subfield.fieldName == 'target') {
    return getTargetOptions(sections, metadata, subfield, rowData);
  }

  return subfield;
  // Source Value Type
};

const getSourceFieldsDependancy = (sections, metadata, subfield) => {
  // Source fields
  otherFields = [];
  sections.forEach((section) => {
    otherFields = [...otherFields, ...section.fields];
  });

  const dependancyFields = otherFields.filter(
    (field) => field.id != metadata.id && field.fieldType
  );
  const options = dependancyFields.map((field) => ({
    key: field.fieldName,
    value: field.fieldLabel
  }));

  return { ...subfield, options };
};

const getSourceConditionsValues = (sections, metadata, subfield, rowData) => {
  const sourceField = otherFields.find((field) => field.fieldName == rowData.field);
  if (!sourceField) {
    return {
      ...subfield,
      disabled: true,
      options: []
    };
  }
  let conditions = [];
  if ([FieldTypes.Number, FieldTypes.Float, FieldTypes.Currency].includes(sourceField.fieldType)) {
    conditions = [
      DependancyConditions.Equal,
      DependancyConditions.NotEqual,
      DependancyConditions.GreaterThan,
      DependancyConditions.GreaterThanOrEqual,
      DependancyConditions.LessThan,
      DependancyConditions.LessThanOrEqual
    ];
  } else if (
    [
      FieldTypes.Dropdown,
      FieldTypes.DropdownWithOther,
      FieldTypes.DynamicDropdown,
      FieldTypes.DynamicDropDownSearch
    ].includes(sourceField.fieldType)
  ) {
    conditions = [DependancyConditions.Equal, DependancyConditions.NotEqual];
  } else if ([FieldTypes.DropdownMulti, FieldTypes.CheckBoxGroup]) {
    // Array options
    conditions = [
      DependancyConditions.IsEmpty,
      DependancyConditions.IsNotEmpty,
      DependancyConditions.Contains,
      DependancyConditions.NotContains
    ];
  } else if (StringInputFields.includes(subfield.fieldType)) {
    conditions = [
      DependancyConditions.StartsWith,
      DependancyConditions.EndsWith,
      DependancyConditions.Equal,
      DependancyConditions.NotEqual
    ];
  } else {
    conditions = [DependancyConditions.Equal, DependancyConditions.NotEqual];
  }

  let options = dependancyConditionOptions.filter((condition) => {
    return conditions.includes(condition.key);
  });

  return { ...subfield, options, disabled: isNotValue(rowData.field) };
};

const getComparativeValues = (sections, metadata, subfield, rowData) => {
  const sourceField = otherFields.find((field) => field.fieldName == rowData.field);
  let options = [];
  let fieldType = subfield.fieldType;

  // Dropdown
  if (sourceField) {
    if (
      [FieldTypes.Dropdown, FieldTypes.DynamicDropdown, FieldTypes.DynamicDropDownSearch].includes(
        sourceField.fieldType
      )
    ) {
      options = sourceField.options;
      fieldType = FieldTypes.Dropdown;
    } else if (
      [FieldTypes.DropdownMulti, FieldTypes.CheckBoxGroup, FieldTypes.DataTable].includes(
        sourceField.fieldType
      )
    ) {
      options = sourceField.options;
      fieldType = FieldTypes.Dropdown;
    } else if (sourceField.fieldType == FieldTypes.SingleCheckBox) {
      options = [
        {
          key: true,
          value: 'Checked'
        },
        {
          key: false,
          value: 'Not Checked'
        }
      ];
      fieldType = FieldTypes.Dropdown;
    } else if (
      [FieldTypes.Attachment, FieldTypes.Date, FieldTypes.Time, FieldTypes.DateRange].includes(
        sourceField.fieldType
      )
    ) {
      fieldType = FieldTypes.Dropdown;
    } else {
      fieldType = sourceField.fieldType;
      options = options;
    }

    if (
      rowData.condition == DependancyConditions.Equal ||
      rowData.condition == DependancyConditions.NotEqual
    ) {
      const nullOption = options.find((option) => option.key == 'null');
      if (!nullOption) {
        options.splice(0, 0, {
          key: '$null',
          value: 'Null'
        });
      }
    }
  }

  return {
    ...subfield,
    options,
    fieldType,
    'Field Type': fieldType,
    disabled: isNotValue(rowData.condition)
  };
};

const getTargetOptions = (sections, metadata, subfield, rowData) => {
  let fieldType = subfield.fieldType;
  let mimeTypes = [];
  let options = [
    {
      key: 'disabled',
      value: 'Disabled'
    },
    {
      key: 'mandatory',
      value: 'Mandatory'
    },
    {
      key: 'fieldLabel',
      value: 'Field Label'
    },
    {
      key: 'hint',
      value: 'Hint'
    },
    {
      key: 'description',
      value: 'Description'
    }
  ];

  if (
    [
      FieldTypes.DynamicTextField,
      FieldTypes.DynamicDropDownSearch,
      FieldTypes.DynamicDropdown
    ].includes(metadata.fieldType)
  ) {
    const endpointOption = options.find((option) => option.key == 'endpoint');
    if (!endpointOption) {
      options.push({
        key: 'endpoint',
        value: 'Endpoint'
      });
    }
  }

  if (
    [
      FieldTypes.Dropdown,
      FieldTypes.DropdownMulti,
      FieldTypes.DropdownWithOther,
      FieldTypes.DynamicDropDownSearch,
      FieldTypes.DynamicDropdown
    ].includes(metadata.fieldType)
  ) {
    const optionsOption = options.find((option) => option.key == 'option');
    if (!optionsOption) {
      options.push({
        key: 'options',
        value: 'Options'
      });
    }
  }

  return {
    ...subfield,
    mimeTypes,
    options,
    fieldType,
    'Field Type': fieldType,
    disabled: isNotValue(rowData.value)
  };
};

const getTargetValue = (sections, metadata, subfield, rowData) => {
  let fieldType = subfield.fieldType;
  let mimeTypes = [];
  let options = [];
  let hint = '';
  if (rowData.target == 'options') {
    fieldType = FieldTypes.Attachment;
    mimeTypes = ['json'];
  } else if (['disabled', 'mandatory'].includes(rowData.target)) {
    fieldType = FieldTypes.Dropdown;
    options = [
      {
        key: true,
        value: 'True'
      },
      {
        key: false,
        value: 'False'
      }
    ];
  } else if (FieldTypes.Endpoint == rowData.target) {
    fieldType = FieldTypes.Endpoint;
    hint = '/endpoint';
  } else {
    // Strings
    fieldType = FieldTypes.ShortText;
  }

  return {
    ...subfield,
    mimeTypes,
    options,
    hint,
    fieldType,
    'Field Type': fieldType,
    disabled: isNotValue(rowData.target)
  };
};
