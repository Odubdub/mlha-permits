import { WidgetType } from '../constants';
import { fDate, fTime, fToNow, getTimeDiff } from './DateTime';
import { fNumber } from './FormatNumber';
import phoneCodes from './PhoneCodes.json';

export const Formatters = {
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

export const formatText = ({ value, formatter, field, info }) => {
  let valueToFormat = value;
  let result = valueToFormat;

  if (Array.isArray(valueToFormat)) {
    valueToFormat = valueToFormat.join(', ');
  }

  if (typeof valueToFormat == 'boolean' && field != WidgetType.checkbox) {
    result = valueToFormat == false ? 'False' : 'True';
  } else if (formatter === Formatters.none || !formatter) {
    result = valueToFormat;
  } else if (formatter === Formatters.currency) {
    result = `P${valueToFormat}`;
  } else if (formatter === Formatters.date) {
    if (new Date(valueToFormat) !== 'Invalid Date' && !isNaN(new Date(valueToFormat))) {
      result = fDate(valueToFormat);
    }
  } else if (formatter === Formatters.number) {
    result = fNumber(valueToFormat);
  } else if (formatter === Formatters.dateAge) {
    if (new Date(valueToFormat) !== 'Invalid Date' && !isNaN(new Date(valueToFormat))) {
      result = `${fDate(valueToFormat)} | ${getTimeDiff(valueToFormat)}`;
    }
  } else if (formatter === Formatters.dateEstimated) {
    if (new Date(valueToFormat) !== 'Invalid Date' && !isNaN(new Date(valueToFormat))) {
      result = `${fDate(valueToFormat)} | ${fToNow(valueToFormat)}`;
    }
  } else if (formatter === Formatters.phone) {
    const phoneData = valueToFormat;
    const phoneCode = phoneCodes.find((phone) => phone.iso === phoneData.isoCode);
    result = phoneData.nsn;
  } else if (formatter === Formatters.time) {
    result = fTime(valueToFormat);
  } else {
    console.log('Unknown format type: ', valueToFormat, formatter);
  }

  return result;
};
