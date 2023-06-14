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
  etag: {
    type: String
  },
  versionId: {
    type: String
  }
}, { timestamps: true });

const File = mongoose.model('File', FileSchema);
module.exports = File;