// create a mongoose schema for the model Applicant
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');

const ApplicantSchema = new Schema({
  idNo: {
    type: String,
    text: true
  },
  idType: {
    type: String,
    required: true,
    enum: ['OMANG', 'PASSPORT'],
    text: true
  },
  // to delete
  idExpiryDate: {
    type: Date,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
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
  },
  primaryPhysicalAddress: {
    type: String,
    text: true
  },
  otp: {
    type: String
  },
  salt: {
    type: String
  },
  hashed_password: {
    type: String
  },
  registrationToken: {
    type: String
  }
}, {
  timestamps: true
});

ApplicantSchema.index({ idNo: 'text', idType: 'text', gender: 'text', lastName: 'text', foreNames: 'text', primaryPhoneNumber:'text', primaryEmailAddress: 'text', primaryPostalAddress: 'text'}, { caseSensitive: false });

ApplicantSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hashed_password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
}

ApplicantSchema.methods.validPassword = function(password) {
  if (!this.salt || !this.hashed_password) return false
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hashed_password === hash;
}

// activate applicant
ApplicantSchema.methods.activate = function() {
  this.status = 'Active';
  this.registrationToken = null;
}

const Applicant = mongoose.model("Applicant", ApplicantSchema);
module.exports = Applicant;
