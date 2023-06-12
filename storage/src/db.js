const mongoose = require('mongoose');

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const dbUrl = `mongodb://permits_management_api_client:4gSrV4Supt@localhost:27017/mlha-permits`;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbUrl, dbOptions);

    if (connection) {
      console.log(`MongoDB Connected: ${connection.connection.host}`);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
