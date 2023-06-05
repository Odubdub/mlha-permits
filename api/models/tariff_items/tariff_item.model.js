const mongoose = require('mongoose');
const xlsx = require('xlsx');
const { Schema } = mongoose;
const path = require('path')

// Define a schema for the tariff_items collection
const tariffItemSchema = new Schema({
  hscode: { type: String, required: true },
  description: { type: String, required: true },
});

// Create a model for the tariff_items collection
const TariffItem = mongoose.model('tariff_items', tariffItemSchema);

// Load data from the Excel file
const workbook = xlsx.readFile(path.join(__dirname,'./tariff_items_2.xlsx'));
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//const data = xlsx.utils.sheet_to_json(worksheet).filter((item) => (!['Other','other'].includes(item.description)));

const data = xlsx.utils.sheet_to_json(worksheet).filter((item) => (!(['Other','other'].includes(item.description) || item.description.length > 80 || item.description.includes('<') || item.description.includes('>'))));
const exporter = xlsx.utils.sheet_to_json(worksheet).filter((item) => (item.description.toLowerCase().includes('scrap')));

// console.log('exporter = ', exporter)
console.log(data.length);
// Check if the collection is empty
TariffItem.countDocuments((err, count) => {
  if (err) {
    console.error(err);
   } else if (count === 0) {
    // Insert the data if the collection is empty
    TariffItem.insertMany(data, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Data imported successfully!');
      }
    });
  }
});

module.exports = TariffItem
