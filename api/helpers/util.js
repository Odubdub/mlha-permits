const firstNames = [
  'Boipelo', 'Bontle', 'Dikeledi', 'Ditiro', 'Tiro', 'Washe', 'Kabo', 'Karabo', 'Kagelelo', 'Akanyang', 'Kgololo', 'Nabile', 'David', 'Phuti', 'Godiraone', 'Gofaone', 'Goitse', 'Boitumelo', 'Gorata', 'Gouta'
];

const lastNames = [
  'Ratsipo', 'Modubu', 'Modibedi', 'Mosielele', 'Agisanyang', 'Kwape', 'Kgaodi', 'Segotlo', 'Moseki', 'Tau', 'Modise', 'Moeng', 'Molefe', 'Phiri', 'Mogotsi', 'Motsumi', 'Marumo', 'Morapedi', 'Mogowa', 'Kapenda'
];

for (let index = 0; index < 20; index++) {
  console.log(Math.floor(Math.random() * 20))
}

function generateName() {
  const fullName = {};

  fullName.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  fullName.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];

  return fullName;
}

//function to check if string is blank or undefined or null
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

const isObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

// function to join 2 strings with comma, if one is undefined or null dont add comma
function joinStrings(str1, str2, join) {
  if (isBlank(str1) && !isBlank(str2)) {
    return str2;
  } else if (isBlank(str2) && !isBlank(str1)) {
    return str1;
  } else if (!isBlank(str2) && !isBlank(str1)) {
    return str1 + `${join} ` + str2;
  }

  return undefined;
}

const getFooter = (issuance) => {
  return ` \n \n Regards, \n \n ${issuance ? `**${issuance.department}.** \n\n ` : ''} > For any queries regarding your application you can contact **1Gov Support** via whatsapp on **+267 77 666 555** by selecting **Permit Services** under the services list. This will allow the next available officer to assist you.`
}

// function to generate an acronym from a string using regex
function acronym(str) {
  // \b[A-Z]*[a-z]*[A-Z]s?\d*[A-Z]*[\-\w+]\b
  return str.match(/[A-Z]*[a-z]*[A-Z]s?\d*[A-Z]*[\-\w+]/g).join('');
}

module.exports = {
  acronym,
  generateName,
  isBlank,
  joinStrings,
  isObject,
  getFooter
}