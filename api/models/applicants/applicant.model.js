// create a mongoose schema for the model Applicant
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicantSchema = new Schema({
  idNo: {
    type: String,
    text: true
  },
  idType: {
    type: String,
    required: true,
    enum: ['Omang', 'Passport'],
    text: true
  },
  // to delete
  idExpiryDate: {
    type: Date
  },
  // to delete
  placeOfBirth: {
    type: String
  },
  gender: {
    type: String,
    text: true
  },
  lastName: {
    type: String,
    text: true
  },
  foreNames: {
    type: String,
    text: true
  },
  nationality: {
    type: String,
    text: true
  },
  dateOfBirth: {
    type: Date
  },
  countryOfBirth: {
    type: String,
    text: true
  },
  primaryPhoneNumber: {
    type: String,
    text: true
  },
  primaryEmailAddress: {
    type: String,
    text: true
  },
  primaryPostalAddress: {
    type: String,
    text: true
  }
}, {
  timestamps: true
});

ApplicantSchema.index({ idNo: 'text', idType: 'text', gender: 'text', lastName: 'text', foreNames: 'text', primaryPhoneNumber:'text', primaryEmailAddress: 'text', primaryPostalAddress: 'text'}, { caseSensitive: false });

const Applicant = mongoose.model("Applicant", ApplicantSchema);
module.exports = Applicant;
