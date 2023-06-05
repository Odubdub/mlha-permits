import { fNumber } from 'src/utils/formatNumber';
import { fDate, fTime, fToNow, getTimeDiff } from 'src/utils/formatTime';
import { FieldType } from './FieldType';
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
  let result = value;

  if (typeof value == 'boolean' && field != FieldType.checkbox) {
    result = info.default || `#${info.key}: Default Not Specified#`;
  } else if (formatter === Formatters.none || !formatter) {
    result = value;
  } else if (formatter === Formatters.currency) {
    result = `P${value}`;
  } else if (formatter === Formatters.date) {
    if (new Date(value) !== 'Invalid Date' && !isNaN(new Date(value))) {
      result = fDate(value);
    }
  } else if (formatter === Formatters.number) {
    result = fNumber(value);
  } else if (formatter === Formatters.dateAge) {
    if (new Date(value) !== 'Invalid Date' && !isNaN(new Date(value))) {
      result = `${fDate(value)} | ${getTimeDiff(value)}`;
    }
  } else if (formatter === Formatters.dateEstimated) {
    if (new Date(value) !== 'Invalid Date' && !isNaN(new Date(value))) {
      result = `${fDate(value)} | ${fToNow(value)}`;
    }
  } else if (formatter === Formatters.phone) {
    const phoneData = value;
    const phoneCode = phoneCodes.find((phone) => phone.iso === phoneData.isoCode);
    result = phoneData.nsn;
  } else if (formatter === Formatters.time) {
    result = fTime(value);
  } else {
    console.log('Unknown format type: ', value, formatter);
  }

  return result;
};
