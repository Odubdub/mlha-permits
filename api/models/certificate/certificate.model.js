const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  bucket: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

const CertificateSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  applicationId: {
    type: String,
    required: true
  },
  crmApplicationId: {
    type: String,
    required: true
  },
  certificateFile: {
    type: FileSchema,
    required: true
  }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', CertificateSchema);
module.exports = Certificate;
