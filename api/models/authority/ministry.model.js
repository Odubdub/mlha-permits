const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MinistrySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
  }, {
    timestamps: true
  }
);

const Ministry = mongoose.model("Ministry", MinistrySchema);
module.exports = Ministry;

