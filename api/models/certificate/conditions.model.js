const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CertificateConditionsSchema = new Schema({
  title: {
    type: String,
    required: true,
    default:'Condition'
  },
  caption: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default: false,
    required: false
  }
}, { timestamps: true });

const CertificateConditions = mongoose.model("CertificateConditions", CertificateConditionsSchema);
module.exports = CertificateConditions;