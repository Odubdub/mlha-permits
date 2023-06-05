const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CertificateCounterSchema = new Schema({
  count: {
    type: Number,
    required: true
  },
  suffix: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: false, updatedAt: true }
});

const CertificateCounter = mongoose.model('CertificateCounter', CertificateCounterSchema);
module.exports = CertificateCounter;