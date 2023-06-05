const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewStageSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  stage: {
    type: Number,
    // unique: true,
    required: true
  },
  required: {
    type: Boolean,
    required: true
  },
  actorType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  feedback: {
    positive: {
      verb: {
        type: String,
        required: true
      },
      caption: {
        type: String,
        required: true
      }
    },
    negative: {
      verb: {
        type: String,
        required: true
      },
      caption: {
        type: String,
        required: true
      }
    }
  }
});

const ReviewProcessSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  steps: [ReviewStageSchema]
});

const ServiceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  registryRef: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department"
  },
  issuanceFee: {
    type: Number,
    required: true
  },
  applicationFee: {
    type: Number,
    required: true
  },
  notifyAt: {
    type: String,
    required: true,
    default: "instant"
  },
  reviewProcess: ReviewProcessSchema
  }, { timestamps: true });

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;

