import { DependancyConditions, Self } from './constants';
import { isNotValue } from './validator';
import countries from './constants/countries-more-details.json';

/*
// Given an array like this
const config = [
    { 'field1.fieldLevel2.fieldLevel3': 'key' },
    { 'field2.fieldLevel4.fieldLevel5': 'key2.level2' }
  ];
  
  // And an data object like this
const data = {
    field1: { fieldLevel2: { fieldLevel3: 'Tom' } },
    field2: { fieldLevel4: { fieldLevel5: 'Cat' } }
 };

// This function will use a dynamic config to transform input data into a dynamic output
const output = { key: 'Tom', key2: { level2: 'Cat' } };
*/

export const sortArrayOfObjects = (arr, propertyName, order = 'ascending') => {
  const sortedArr = arr.sort((a, b) => {
    if (a[propertyName] < b[propertyName]) {
      return -1;
    }
    if (a[propertyName] > b[propertyName]) {
      return 1;
    }
    return 0;
  });

  if (order === 'descending') {
    return sortedArr.reverse();
  }

  return sortedArr;
};

export const testConfig = [
  {
    'data.ID_NO': {
      path: 'pOmang.idType',
      default: 'PASSPORT',
      type: 'match',
      options: [
        {
          regex: '^\\d{4}[1-2]\\d{4}$',
          value: 'OMANG'
        }
      ]
    }
  },
  {
    'data.SEX': {
      path: 'pOmang.sex',
      default: 'OTHER',
      type: 'match',
      options: [
        {
          regex: '^[M]{1}$',
          value: 'MALE'
        },
        {
          regex: '^[F]{1}$',
          value: 'FEMALE'
        }
      ]
    }
  },
  { 'data.ID_NO': 'pOmang.idNo' },
  { 'data.SURNME': 'pOmang.surname' },
  { 'data.FIRST_NME': 'pOmang.names' },
  { 'data.BIRTH_DTE': 'pOmang.dob' },
  { 'data.EXPIRY_DTE': 'pOmang.exp' },
  { 'data.BIRTH_PLACE_NME': 'pOmang.placeOfBirth' }
];

// export const testConfig = [
//   {
//     'data.ID_NO': {
//       path: 'rOmang.idType',
//       default: 'PASSPORT',
//       type: 'match',
//       options: [
//         {
//           regex: '^\\d{4}[1-2]\\d{4}$',
//           value: 'OMANG'
//         }
//       ]
//     }
//   },
//   {
//     'data.SEX': {
//       path: 'rOmang.sex',
//       default: 'OTHER',
//       type: 'match',
//       options: [
//         {
//           regex: '^[M]{1}$',
//           value: 'MALE'
//         },
//         {
//           regex: '^[F]{1}$',
//           value: 'FEMALE'
//         }
//       ]
//     }
//   },
//   { 'data.ID_NO': 'rOmang.idNo' },
//   { 'data.SURNME': 'rOmang.surname' },
//   { 'data.FIRST_NME': 'rOmang.names' },
//   { 'data.BIRTH_DTE': 'rOmang.dob' },
//   { 'data.EXPIRY_DTE': 'rOmang.exp' },
//   { 'data.BIRTH_PLACE_NME': 'rOmang.placeOfBirth' }
// ];

const data = {
  success: true,
  message: 'omang found',
  source: 'NIS',
  data: {
    ID_NO: '548526718',
    SURNME: 'MASWIBILILI',
    FIRST_NME: 'ONTHATILE  WASHE',
    SEX: 'M',
    BIRTH_DTE: '1992-10-30T00:00:00.000Z',
    BIRTH_DTE_UNKNOWN: 'N',
    BIRTH_PLACE_NME: 'SELEBI PHIKWE',
    RESIDENTIAL_ADDR: 'METSIMOTLHABE  PLOT  1553 ',
    MARITAL_STATUS_DESCR: 'Single',
    MARITAL_STATUS_CDE: 'SGL',
    PERSON_STATUS: 'LIVE',
    EXPIRY_DTE: '2028-10-18T00:00:00.000Z',
    CITIZEN_STATUS_CDE: 'CITZ'
  }
};

export const transformDataObject = (data, config) => {
  const output = {};

  const getFieldValue = ({ data, path }) => {
    const parts = path.split('.');
    let value = data;

    parts.forEach((part) => {
      value = value[part];
    });

    return value;
  };

  //
  const nullCount = 0;

  config.forEach((mapping) => {
    const [keyPath, valuePath] = Object.entries(mapping)[0];

    let value = null;
    let valueParts = [];

    if (typeof valuePath === 'string') {
      value = getFieldValue({ data, path: keyPath });

      // Update null counter
      if (isNotValue(value)) {
        nullCount += 1;
      }

      valueParts = valuePath.split('.');
    } else {
      const subconfig = valuePath;

      valueParts = subconfig.path.split('.');

      if (subconfig.type === 'match') {
        value = subconfig.default || null;
        if (!subconfig.options) {
          // Set the default value
          value = subconfig.default;
        } else {
          let valueToTest = getFieldValue({ data, path: keyPath });

          // Update null counter
          if (isNotValue(valueToTest)) {
            nullCount += 1;
          }

          const options = subconfig.options || [];
          const option = options.find((opt) => {
            const regex = new RegExp(opt.regex, '');
            return regex.test(valueToTest);
          });

          // Final value of the field
          if (option) {
            value = option.value;
          } else {
            value = subconfig.default;
          }
        }
        // Add other subconfig types here...
      }
    }

    let currentOutput = output;
    valueParts.forEach((part, index) => {
      if (index === valueParts.length - 1) {
        currentOutput[part] = value;
      } else {
        if (!currentOutput[part]) {
          currentOutput[part] = {};
        }
        currentOutput = currentOutput[part];
      }
    });
  });

  if (nullCount == config.length) {
    return null;
  }

  return output;
};

const stringToRegex = (str) => {
  // Main regex
  const main = str.match(/\/(.+)\/.*/)[1];
  // Regex options
  const options = str.match(/\/.+\/(.*)/)[1];

  // Compiled regex
  return new RegExp(main, options);
};

const regex = stringToRegex('/^\\d{4}[1-2]\\d{4}$/');
// ^\d{4}[1-2]\d{4}$

// console.log(regex.test('666616666'));

export const getFieldValue = ({ data, path, defaultValue = null }) => {
  let keys;
  //Check if path contains a wildcard
  if (path.includes('%')) {
    keys = path.split('%');
    const wildcardKey = getFieldValueFromPath({ data, path: keys[1] });
    const newPath = `${keys[0]}${wildcardKey}${keys[2]}`;

    return getFieldValue({ data, path: newPath });
  } else {
    return getFieldValueFromPath({ data, path, defaultValue });
  }
};

const getFieldValueFromPath = ({ data, path, defaultValue }) => {
  const keys = path.split('.');

  let fieldData = data;
  keys.forEach((key) => {
    if (!fieldData) {
      return defaultValue;
    } else {
      fieldData = fieldData[key];
    }
  });

  return fieldData;
};

export const getDependancyValue = ({ data = {}, dependancies = [], property, value }) => {
  if (dependancies.length) {
    let dependancy = dependancies.find((dependancy) => {
      if (dependancy.target !== property) {
        return false;
      }

      // The dependancy's value
      let dependantValue;

      if (dependancy.field == Self) {
        dependantValue = value;
      } else {
        dependantValue = getFieldValue({ data, path: dependancy.field });
      }

      // Check if the conditionis met
      const condition = testCondition(
        dependantValue || null,
        dependancy.condition,
        dependancy.value || null
      );
      //,
      return condition;
    });

    if (dependancy) {
      return dependancy.targetValue;
    }
  }

  return null;
};

/*

const config = {
  name: 'name',
  age: 'age',
  'address.line1': 'line1',
  'address.line2': 'line2',
  'address.city': 'address.city'
};

const people = [
  {
    name: 'John',
    age: 20,
    address: {
      line1: '2430',
      line2: 'Kimberley',
      city: 'Gaborone'
    }
  },
  {
    name: 'Jane',
    age: 21,
    address: {
      line1: '4344',
      line2: 'Lion',
      city: 'Francistown'
    }
  }
];

Into this structure
output = [
  { name: 'John', age: 20, line1: '2430', line2: 'Kimberley', address: { city: 'Gaborone' } },
  { name: 'Jane', age: 21, line1: '4344', line2: 'Lion', address: { city: 'Gaborone' } }
];

*/
// Transfrming an array to an object to an array of custom objects

export const transformDataArray = (data, config) => {
  return data.map((item) => {
    const transformedItem = {};
    for (const [sourceKey, destKey] of Object.entries(config)) {
      const keys = sourceKey.split('.');
      let value = item;
      for (const key of keys) {
        value = value[key];
        if (value === undefined) break;
      }
      if (value !== undefined) {
        if (destKey.includes('.')) {
          const [parentKey, childKey] = destKey.split('.');
          transformedItem[parentKey] = transformedItem[parentKey] || {};
          transformedItem[parentKey][childKey] = value;
        } else {
          transformedItem[destKey] = value;
        }
      }
    }
    return transformedItem;
  });
};

const testCondition = (value, condition, compareValue) => {
  switch (condition) {
    case DependancyConditions.Equal:
      return value === compareValue;
    case DependancyConditions.NotEqual:
      return value !== compareValue;
    case DependancyConditions.GreaterThan:
      return value > compareValue;
    case DependancyConditions.LessThan:
      return value < compareValue;
    case DependancyConditions.GreaterThanOrEqual:
      return value >= compareValue;
    case DependancyConditions.LessThanOrEqual:
      return value <= compareValue;
    case DependancyConditions.Contains:
      return value.includes(compareValue);
    case DependancyConditions.NotContains:
      return !value.includes(compareValue);
    case DependancyConditions.StartsWith:
      return value.startsWith(compareValue);
    case DependancyConditions.EndsWith:
      return value.endsWith(compareValue);
    case DependancyConditions.IsEmpty:
      return (value || []).length == 0;
    case DependancyConditions.IsNotEmpty:
      return (value || []) > 0;
    case DependancyConditions.IsTrue:
      return value === true;
    case DependancyConditions.IsFalse:
      return value === false;
    default:
      return false;
  }
};

export const formatCurrency = (e) => {
  const amount = parseFloat(e.target.value);
  if (Number.isNaN(amount)) {
    return ''; // If the input is not a valid number, return an empty string
  }
  const formattedAmount = amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD', // Change this to the desired currency code
    minimumFractionDigits: 2 // Show two decimal places
  });
  return formattedAmount;
};

export const deleteKeysFromObject = (paths, obj) => {
  function deleteRecursively(path, nestedObj) {
    if (path.length === 1) {
      delete nestedObj[path[0]];
    } else {
      const currentKey = path[0];
      const remainingPath = path.slice(1);
      const nestedValue = nestedObj[currentKey];

      if (typeof nestedValue === 'object' && nestedValue !== null) {
        deleteRecursively(remainingPath, nestedValue);
        if (Object.keys(nestedValue).length === 0) {
          delete nestedObj[currentKey];
        }
      }
    }
  }

  paths.forEach((path) => {
    const keyPath = path.split('.');
    deleteRecursively(keyPath, obj);
  });
};

const Localities = [
  'Betesankwe',
  'Diabo',
  'Dipotsana',
  'Gasita',
  'Kanye',
  'Gaborone',
  'Francistown',
  'Kgomokasitwa',
  'Lefoko',
  'Lekgolobotlo',
  'Lorolwana',
  'Lotlhakane',
  'Lotlhakane West',
  'Magotlhwane',
  'Manyana',
  'Maokane',
  'Mogonye',
  'Mokhomba',
  'Molapowabojang',
  'Moshaneng',
  'Moshupa',
  'Selebi Phikwe',
  'Ntlhantlhe',
  'Pitseng',
  'Ralekgetho',
  'Ranaka',
  'Segwagwa',
  'Seherelela',
  'Selokolela',
  'Semane',
  'Sese',
  'Sesung',
  'Tlhankane',
  'Tshwaane',
  'Tsonyane',
  'Bethel',
  'Borobadilepe',
  'Digawana',
  'Dikhukhung',
  'Dinatshana',
  'Ditlharapa',
  'Gamajalela',
  'Gathwane',
  'Good Hope',
  'Hebron',
  'Kangwe',
  'Kgoro',
  'Lejwana',
  'Leporung',
  'Logagane',
  'Lorwana',
  'Mabule',
  'Madingwana',
  'Magoriapitse',
  'Makokwe',
  'Malokaganyane',
  'Marojane',
  'Metlobo',
  'Metlojane',
  'Mmakgori',
  'Mmathethe',
  'Mogojogojo',
  'Mogwalale',
  'Mokatako',
  'Mokgomane',
  'Molete',
  'Motsentshe',
  'Musi',
  'Ngwatsau',
  'Papatlo',
  'Phihitshwane',
  'Pitsana-Potokwe',
  'Pitsane Siding',
  'Pitshane molopo',
  'Rakhuna',
  'Ramatlabama',
  'Sedibeng',
  'Sekhutlane',
  'Sheep Farm',
  'Tlhareseleele',
  'Tshidilamolomo',
  'Tswaaneng',
  'Tswagare/ Lothoje/ Lokalana',
  'Tswanyaneng',
  'Itholoke',
  'Kanaku',
  'Keng',
  'Khakhea',
  'Khonkhwa',
  'Kokong',
  'Kutuku',
  'Mabutsane',
  'Mahotshwane',
  'Morwamosu',
  'Sekoma',
  'Mogobane',
  'Otse',
  'Ramotswa',
  'Ramotswa Station/Taung',
  'Tlokweng',
  'Boatlaname',
  'Dikgatlhong',
  'Ditshukudu',
  'Gabane',
  'Gakgatla',
  'Gakuto',
  'Gamodubu',
  'Hatsalatladi',
  'Kgope',
  'Kopong',
  'Kubung',
  'Kumakwane',
  'Kweneng',
  'Lentsweletau',
  'Leologane',
  'Lephephe',
  'Losilakgokong',
  'Mahetlwe',
  'Medie',
  'Metsimotlhabe',
  'Mmankgodi',
  'Mmanoko',
  'Mmatseta',
  'Mmopane',
  'Mogoditshane',
  'Mogonono',
  'Mokolodi',
  'Molepolole',
  'Ramaphatle',
  'Shadishadi',
  'Sojwe',
  'Thamaga',
  'Tloaneng',
  'Botlhapatlou',
  'Diphuduhudu',
  'Ditshegwane',
  'Dutlwe',
  'Kaudwane',
  'Khudumelapye',
  'Kotolaname',
  'Letlhakeng',
  'Maboane',
  'Malwelwe',
  'Mantshwabisi',
  'Maratswane',
  'Metsibotlhoko',
  'Monwane',
  'Moshaweng',
  'Motokwe',
  'Ngware',
  'Salajwe',
  'Serinane',
  'Sesung',
  'Sorilatholo',
  'Takatokwane',
  'Tsetseng',
  'Tswaane',
  'Artesia',
  'Bokaa',
  'Dikgonnye',
  'Dikwididi',
  'Kgomodiatshaba',
  'Khurutshe',
  'Leshibitse',
  'Mabalane',
  'Malolwane',
  'Malotwana Siding',
  'Matebeleng',
  'Mmathubudukwane',
  'Mochudi',
  'Modipane',
  'Morwa',
  'Oliphants Drift',
  'Oodi',
  'Pilane Station',
  'Ramonaka',
  'Ramotlabaki',
  'Rasesa',
  'Sikwane',
  'Diloro',
  'Dimajwe',
  'Gojwane',
  'Goo-Sekgweng',
  'Gootau',
  'Kgagodi',
  'Lecheng',
  'Lerala',
  'Lesenepole/ Matolwane',
  'Mabeleapudi',
  'Mabuo',
  'Majwanaadipitse',
  'Majwaneng',
  'Malaka',
  'Malatswai',
  'Manaledi',
  'Matlhakola',
  'Maunatlala',
  'Mmashoro',
  'Mogapi',
  'Mogapinyana',
  'Mogome',
  'Mogorosi',
  'Moiyabana',
  'Mokgware',
  'Mokhungwana',
  'Mokokwana',
  'Moremi',
  'Moreomabele',
  'Mosweu',
  'Motshegaletau',
  'Paje',
  'Palapye',
  'Radisele',
  'Ratholo',
  'Sehunou',
  'Seolwane',
  'Serowe',
  'Serule',
  'Tamasane',
  'Thabala',
  'Topisi',
  'Tshimoyapula',
  'Bonwapitse',
  'Chadibe',
  'Dibete Station',
  'Dovedale',
  'Ikongwe',
  'Kalamare',
  'Kodibeleng',
  'Kudumatse',
  'Maape',
  'Machaneng',
  'Mahalapye',
  'Makwate',
  'Matlhako',
  'Mhalapitsa',
  'Mmaphashalala',
  'Mmutlana',
  'Mokgenene',
  'Mokobeng',
  'Mokoswane',
  'Mookane',
  'Moralane',
  'Moshopha',
  'Mosolotshane',
  'Ngwapa',
  'Otse',
  'Palla Road/Dinokwe',
  'Pilikwe',
  'Poloka',
  'Ramokgonami',
  'Sefhare',
  'Seleka',
  'Shakwe',
  'Shoshong',
  'Taupye',
  'Tewane',
  'Tumasera',
  'Bobonong',
  'Damochojena',
  'Kobojango',
  'Lentswelemoriti',
  'Lepokole',
  'Mabolwe',
  'Mathathane',
  'Mmadinare',
  'Molalatau',
  'Moletemane',
  'Motlhabaneng',
  'Robelela',
  'Sefophe',
  'Semolale',
  'Tobane',
  'Tsetsebjwe',
  'Tshokwe',
  'Kedia',
  'Khwee',
  'Kumaga',
  'Letlhakane',
  'Makalamabedi',
  'Mmadikola',
  'Mmatshumo',
  'Mokoboxane',
  'Mopipi',
  'Moreomaoto',
  'Mosu',
  'Motopi',
  'Toromoja',
  'Tsienyane/Rakops',
  'Xere',
  'Xhumo',
  'Borolong',
  'Borotsi',
  'Chadibe',
  'Changate',
  'Dagwi',
  'Dukwi',
  'Goshwe',
  'Gweta',
  'Jamataka',
  'Kutamogree',
  'Lepashe',
  'Mabesekwa',
  'Mafongo / Hobona',
  'Maitengwe',
  'Makuta',
  'Mandunyane',
  'Maposa',
  'Marapong',
  'Marobela',
  'Mathangwane',
  'Matobo',
  'Matsitama',
  'Mmanxotae',
  'Mmeya',
  'Mokubilo',
  'Mosetse',
  'Nata',
  'Natale',
  'Nkange',
  'Nshakashokwe',
  'Nswazwi',
  'Sebina',
  'Semitwe',
  'Senete',
  'Sepako',
  'Shashe-Mooke',
  'Shashe/ Semotswane',
  'Tonota',
  'Tshokatshaa',
  'Tutume',
  'Zoroga',
  'Botalaote',
  'Butale',
  'Ditladi',
  'Gambule',
  'Gulubane',
  'Gungwe',
  'Jackalas 1',
  'Jackalas 2',
  'Kalakamati',
  'Kgari',
  'Letsholathebe',
  'Mabudzane',
  'Makaleng',
  'Mambo',
  'Mapoka',
  'Masingwaneng',
  'Masukwane',
  'Masunga',
  'Matenge',
  'Matopi',
  'Matshelagabedi',
  'Matsiloje',
  'Mbalambi',
  'Moroka',
  'Mosojane',
  'Mowana',
  'Mulambakwena',
  'Nlakhwane',
  'Pataya Matebele',
  'Pole',
  'Ramokgwebana',
  'Sechele',
  'Sekakangwe',
  'Senyawe',
  'Shashe Bridge',
  'Siviya',
  'Tati Siding',
  'Themashanga',
  'Toteng',
  'Tsamaya',
  'Tshesebe',
  'Vukwi',
  'Zwenshambe',
  'Bodibeng',
  'Botlhatlogo',
  'Chanoga',
  'Habu',
  'Kareng',
  'Kgakge / Makakung',
  'Komana',
  'Mababe',
  'Makalamabedi',
  'Matlapana',
  'Matsaudi / Sakapne',
  'Maun',
  'Phuduhudu',
  'Sankuyo ',
  'Sehithwa',
  'Semboyo',
  'Shorobe',
  'Toteng',
  'Tsao',
  'Etsha 1',
  'Etsha 13',
  'Etsha 6',
  'Gani',
  'Gonutsuga',
  'Gudingwa',
  'Gumare',
  'Ikoga',
  'Kajaja',
  'Kauxwhi',
  'Mogomotho',
  'Mohembo East',
  'Mohembo West',
  'Mokgacha',
  'Ngarange',
  'Nokaneng',
  'Nxamasere',
  'Nxaunxau',
  'Qangwa',
  'Samochema',
  'Sekondomboro',
  'Sepopa',
  'Seronga',
  'Shakawe',
  'Tobere',
  'Tubu',
  'Xakao',
  'Xaxa',
  'Xhauga',
  'Beetsha',
  'Chukumuchu',
  'Eretsha',
  'Kachikau',
  'Kasane',
  'Kavimba',
  'Kazungula',
  'Lesoma',
  'Muchinje/Mabele',
  'Pandamatenga',
  'Parakarungu',
  'Satau',
  'Bere',
  'Charles Hill',
  'Chobokwane',
  'Dekar',
  'East Hanahai',
  'Ghanzi',
  'Groote Laagte',
  'Kacgae',
  'Karakobis',
  'Kule',
  'Makunda',
  'Ncojane',
  'New Xade',
  'New Xanagas',
  'Qabo',
  'Tsootsha',
  'West Hanahai',
  'Bogogobo',
  'Bokspits',
  'Bray',
  'Gachibana',
  'Khisa',
  'Khuis',
  'Khwawa',
  'Kokotsha',
  'Kolonkwane',
  'Makopong',
  'Maleshe',
  'Maralaleng',
  'Maubelo',
  'Middlepits',
  'Omaweneno',
  'Phepheng/ Draaihoek',
  'Rapples Pan',
  'Struizendam',
  'Tsabong',
  'Vaalhoek',
  'Werda',
  'Hukuntsi',
  'Hunhukwe',
  'Inalegolo',
  'Kang',
  'Lehututu',
  'Lokgwabe',
  'Make',
  'Monong',
  'Ncaang',
  'Ngwatle',
  'Phuduhudu',
  'Tshane',
  'Ukwi',
  'Zutswa'
];

export const setValueToKey = ({ data, path, value }) => {
  const keys = path.split('.');
  let object = { ...data };

  let ref = object;
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      ref[keys[i]] = value;
    } else {
      if (!ref[keys[i]]) {
        ref[keys[i]] = {};
      }
      ref = ref[keys[i]];
    }
  }

  return { ...object };
};

export const getDropdownValueLabel = (value, options) => {
  if (!isNotValue(options[0]) && typeof options[0] == 'string') {
    return value;
  } else {
    const option = options.find((o) => o.key == value);
    return option ? option.value : '';
  }
};

export const getStylePropertyValue = ({ data, fieldKey, conf }) => {
  const value = getFieldValue({ data, path: fieldKey });
  if (!isNotValue(value)) {
    const target = conf.values.find((c) => c.comparative == value);
    return target ? target.value : conf.default;
  }
  return conf.default;
};

export const getAllPropertyValues = ({ data, fieldKey, conf }) => {
  const props = {};
  Object.keys(conf).forEach((key) => {
    props[key] = getStylePropertyValue({ data, fieldKey, conf: conf[key] });
  });

  return props;
};

export const testTransform = () => {
  const outpout = transformDataObject(data, testConfig);
  // console.log(Localities.map((c) => ({ key: c.toUpperCase(), value: c })));
  // console.log(outpout);
};

testTransform();

// console.log('s');
// console.log(btoa(JSON.stringify(testConfig)));
export const flattenObject = (input) => {
  const output = {};

  function flatten(obj, path = '') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newPath = path ? `${path}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
          flatten(value, newPath);
        } else {
          output[newPath] = value;
        }
      }
    }
  }

  flatten(input);
  return output;
};

const input = {
  name: 'Jon Doe',
  age: 2,
  address: {
    line1: 'Plot 5565',
    line2: 'Mbau Street',
    city: 'Seattle'
  }
};

const output = {
  name: 'Jon Doe',
  age: 2,
  'address.line1': 'Plot 5565',
  'address.line2': 'Mbau Street',
  'address.city': 'Seattle'
};
