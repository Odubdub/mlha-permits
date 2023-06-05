const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  module: {
    type: String,
    required: true
},
target: {
  type: String,
  required: true
},
  user: {
    type: Object,
    required: false
},
  action: {
    type: String,
    required: true
},
description:{
  type: String,
  required: false
},
sessionId: {
  type: String,
  required: false
},
path: {
  type: String,
  required: true
},
initiatorChain: {
  type: [String],
  required: true,
  default: []
},
  application: {
    type: String,
    required: false
},
  status: {
    type: String,
    required: false
},
meta: {
    type: Object,
    required: false
}}, { timestamps: true });

const Log = mongoose.model('log', logSchema);
module.exports = Log