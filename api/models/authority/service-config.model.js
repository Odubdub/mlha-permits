const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceConfigSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  glCode:{
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  issuanceGlCode: {
    type: String,
    required: false
  },
  version: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  form: [{
    type: Object,
    required: true
  }],
  profile: [{
    type: String,
    required: true
  }],
  registryRef:{
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: false
  },
  registry: {
    type: Schema.Types.Mixed,
    required: true
  },
  renderer: {
    type: Schema.Types.Mixed,
    required: true
  },
  issuance: {
    type: Schema.Types.Mixed,
    required: true
  },
  issuanceFee: {
    type: Number,
    required: true
  },
  issuanceFeeService: {
    type: String,
    required: true
  },
  issuanceFeeType: {
    type: String,
    required: true,
  },
  issuanceFeeDependancy: {
    type: Object,
    required: false,
    default: {}
  },
  applicationFee: {
    type: Number,
    required: true
  },
  reviewProcessSteps: {
    type: Schema.Types.Mixed,
    required: true
  }
  }, {
    timestamps: true
  }
);

const ServiceConfig = mongoose.model("ServiceConfig", ServiceConfigSchema);
module.exports = ServiceConfig;