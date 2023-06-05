const { generateName } = require("../helpers/util");
const Applicant = require("../models/applicants/applicant.model");

generateFakeDetails = () => {
  return {
    lastName: generateName().lastName,
    foreNames: generateName().firstName,
    // set dateOfBirth to any a random date before january 1st 2004
    dateOfBirth: new Date(
      Math.floor(Math.random() * (new Date("1/1/2004").getTime() - new Date("1/1/1940").getTime())) +
      new Date("1/1/1940").getTime()
    ),
    // set placeOfBirth to capital city of Botswana
    placeOfBirth: "Gaborone",
    // set expiryDate to any a random date after tomorrow
    idExpiryDate: new Date(
      Math.floor(Math.random() * (new Date().getTime() - new Date().getTime())) +
      new Date().getTime()
    )
  }
}

async function saveApplicant(applicantAuthorData) {
  // console.log(applicantAuthorData);
  return new Promise((resolve, reject) => {
    const { idNo, gender, lastName, foreNames, nationality, dateOfBirth, countryOfBirth, primaryPhoneNumber, primaryEmailAddress, primaryPostalAddress } = applicantAuthorData;

    // console.log(idNo);
    // console.log(gender);
    // console.log(lastName);
    // console.log(foreNames);
    // console.log(nationality);

    Applicant.findOne({ idNo }).exec((err, applicant) => {
      if (err) reject(err);
      if (!applicant) {
        applicant = new Applicant({
          idNo,
          idType: "Omang",
          gender,
          lastName,
          foreNames,
          nationality,
          countryOfBirth,
          primaryPhoneNumber,
          primaryEmailAddress,
          primaryPostalAddress,
          dateOfBirth: new Date(dateOfBirth),
          placeOfBirth: "Gaborone",
          idExpiryDate: new Date(
            Math.floor(Math.random() * (new Date().getTime() - new Date().getTime())) +
            new Date().getTime()
          )
        });
        applicant.save((err, applicant) => {
          if (err) reject(err);
          // console.log(applicant);
          resolve(applicant);
        });
      } else {

        Applicant.findOneAndUpdate({ idNo }, {
          gender, 
          lastName,
          foreNames, 
          nationality, 
          dateOfBirth, 
          countryOfBirth, 
          primaryPhoneNumber, 
          primaryEmailAddress, 
          primaryPostalAddress
        })

        resolve(applicant);
      }
    });
  });
}

module.exports = saveApplicant;