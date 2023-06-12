require('dotenv').config();
const mongoose = require('mongoose');
const migrate = require('../helpers/migrate');
const User = require('../models/access/User');
const Applicant = require('../models/applicants/applicant.model');
const { initiateCRMUpdateTasks } = require('../routes/authority/routes/notifications.route');

const { MONGODB_DB, MONGODB_PW, MONGODB_USER, MONGODB_PORT, MONGODB_HOST } = process.env;

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const createSuperUsers = async () => {
  const superAdminsDetails = [
    {
      idType: 'omang',
      type: 'developer',
      foreNames: 'Washe',
      idNumber: '222212222',
      lastName: 'Maswibilili',
      email: 'washe@devsql.co.bw',
      designation: 'Developer'
    },
    {
      idType: 'omang',
      type: 'developer',
      foreNames: 'Tiro',
      lastName: 'Modibedi',
      idNumber: '111121111', //751213010
      email: 'tiro@devsql.co.bw',
      designation: 'Developer'
    }
  ];

  superAdminsDetails.forEach(async (supe) => {
    const user = await User.findOne({ idNumber: supe.idNumber, email: supe.email });
    if (!user) {
      const newUser = new User({
        type: supe.type,
        status: 'Active',
        department: null,
        email: supe.email,
        idType: supe.idType,
        lastName: supe.lastName,
        idNumber: supe.idNumber,
        foreNames: supe.foreNames,
        designation: supe.designation,
        registrationToken:
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      });

      newUser.setPassword('12345678');

      await newUser.save();
      console.log(`${supe.email} created`);
    }
  });
};

const dbUrl = `mongodb://${MONGODB_USER}:${MONGODB_PW}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;
console.log(dbUrl);
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbUrl, dbOptions);

    if (connection) {
      createSuperUsers();

      // Applicant.findOneAndUpdate({idNo : "227219910"},{ primaryEmailAddress:"letsibogo@pcgsoftware.co", primaryPostalAddress:"P.O. Box 400", primaryPhysicalAddress:"Plot 123, Block 9"})
      // .then((result)=>{
      // })
      // .catch((err)=>{
      //   console.log(err);
      // })

      //Migrate from previous db if needed
      // migrate();
      initiateCRMUpdateTasks();

      // Read the

      console.log(`MongoDB Connected: ${connection.connection.host}`);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
