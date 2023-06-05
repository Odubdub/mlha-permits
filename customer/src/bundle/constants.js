export const FieldTypes = {
  ShortText: 'ShortText',
  LongText: 'LongText',
  OmangNumber: 'OmangNumber',
  MaleOmangNumber: 'MaleOmangNumber',
  FemaleOmangNumber: 'FemaleOmangNumber',
  DynamicTextField: 'DynamicTextField',
  Email: 'Email',
  PhoneNumber: 'PhoneNumber',
  Number: 'Number',
  Currency: 'Currency',
  Date: 'Date',
  StartDateEndDate: 'StartDateEndDate',
  Time: 'Time',
  DateRange: 'DateRange',
  DataTable: 'DataTable',
  RadioButtonGroup: 'RadioButtonGroup',
  CheckBoxGroup: 'CheckBoxGroup',
  SingleCheckBox: 'SingleCheckBox',
  DynamicDropDownSearch: 'DynamicDropDownSearch',
  Dropdown: 'Dropdown',
  DynamicDropdown: 'DynamicDropdown',
  DropdownWithOther: 'DropdownWithOther',
  DropdownMulti: 'DropdownMulti',
  Hyperlink: 'Hyperlink',
  TableField: 'DataTable',
  Attachment: 'Attachment',
  Float: 'Float',
  Endpoint: 'Endpoint',
  VehiclePlateNumber: 'VehiclePlateNumber',
  AutoPopulate: 'AutoPopulate'
};

const CountryOptions = '$countries';
const OtherCountryOptions = '$other-countries';
const SacuCountryOptions = '$sacu-countries';
const MinistriesOptions = '$ministries';
const LocalitiesOptions = '$localities';

export const FieldTypesEnum = {
  ShortText: 0,
  LongText: 1,
  OmangNumber: 2,
  DynamicTextField: 3,
  Email: 4,
  PhoneNumber: 5,
  Number: 6,
  Currency: 7,
  Date: 8,
  StartDateEndDate: 9,
  Time: 10,
  DateRange: 11,
  DataTable: 12,
  RadioButtonGroup: 13,
  CheckBoxGroup: 14,
  SingleCheckBox: 15,
  DynamicDropDownSearch: 16,
  Dropdown: 17,
  DynamicDropdown: 18,
  DropdownWithOther: 19,
  DropdownMulti: 20,
  Hyperlink: 21,
  TableField: 12,
  Attachment: 22,
  Float: 23,
  Endpoint: 24,
  VehiclePlateNumber: 25,
  AutoPopulate: 26
};

export const WidgetType = {
  text: 0,
  chip: 1,
  paragraph: 2,
  attachment: 3,
  moreInfo: 4,
  devider: 5,
  declaration: 6,
  link: 7,
  table: 8,
  staticTable: 9,
  notes: 10,
  copyfield: 11,
  squareChip: 12
};

export const DependancyConditions = {
  Equal: 0,
  NotEqual: 1,
  GreaterThan: 2,
  LessThan: 3,
  GreaterThanOrEqual: 4,
  LessThanOrEqual: 5,
  Contains: 6,
  NotContains: 7,
  StartsWith: 8,
  EndsWith: 9,
  IsEmpty: 10,
  IsNotEmpty: 11,
  IsTrue: 12,
  IsFalse: 13,
  IsNull: 14,
  IsNotNull: 16
};

export const FormattersEnum = {
  none: 0,
  currency: 1,
  number: 2,
  date: 3,
  dateAge: 4,
  dateEstimated: 5,
  concatenated: 6,
  phone: 7,
  time: 8
};

export const Formatters = [
  {
    value: 'None',
    key: FormattersEnum.none
  },
  {
    value: 'Currency',
    key: FormattersEnum.currency
  },
  {
    value: 'Number',
    key: FormattersEnum.number
  },
  {
    value: 'Date',
    key: FormattersEnum.date
  },
  {
    value: 'Date Age',
    key: FormattersEnum.dateAge
  },
  {
    value: 'Date Estimated',
    key: FormattersEnum.dateEstimated
  },
  {
    value: 'Concatenated',
    key: FormattersEnum.phone
  },
  {
    value: 'Time',
    key: FormattersEnum.time
  }
];

export const Self = '$self';

export const Null = '$null';
