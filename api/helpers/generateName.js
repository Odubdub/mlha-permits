const firstNames = [
  'Baemedi', 'Bontle', 'Dikeledi', 'Dikala', 'Thobo', 'Thiba', 'Kabo', 'Karabo', 'Kagelelo', 'Akanyang', 'Kgololo', 'Nabile', 'David', 'Phuti', 'Godiraone', 'Gofaone', 'Gokong', 'Kagiso', 'Goratamang', 'Goutata'
];

const lastNames = [
  'Ratsipo', 'Modubu', 'Mokgalo', 'Mosielele', 'Agisanyang', 'Kwape', 'Kgaodi', 'Segotlo', 'Moseko', 'Tau', 'Modisa', 'Moeng', 'Molete', 'Phiri', 'Mogotsinyana', 'Motsumi', 'Marumoame', 'Morapedi', 'Mokala', 'Kapenda'
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

module.exports = generateName;