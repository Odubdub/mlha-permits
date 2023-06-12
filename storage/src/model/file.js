const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  bucket: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  'original-name': {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

const FileModel = mongoose.model('YourModel', FileSchema);

module.exports = FileModel;
