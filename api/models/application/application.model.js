const Applicant = require("../applicants/applicant.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationFormAmmendmentsSchema = new Schema({
  allFixes: [{
    type: Object,
    required: true
  }],
  fieldsToFix: [{
    type: String,
    required: true
  }],
  returnMessage: {
    type: String,
    required: true
  }
});

const ApplicationActivitySchema = new Schema({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actor: {
    type: {
      name: {
        type: String
      },
      idNumber: {
        type: String
      },
      userObjId: {
        ref: "User",
        type: Schema.Types.ObjectId
      }
    },
    required: true
  },
  return: {
    returnedBy: {
      type: String
    },
    idNumber: {
      type: String
    },
    returnMessage:{
      type: String
    },
    returnDate: {
      type: Date
    }
  },
  details: {
    type: Schema.Types.Mixed,
    required: false
  },
}, {
  timestamps: { createdAt: 'date', updatedAt: false }
});

const ApplicationReviewStatusSchema = new Schema({
  stage: {
    type: Number,
    required: true
  },
  checked: {
    type: Boolean,
    required: true
  }
});

const ApplicationSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  application_id: {
    type: String,
    required: true
  },
  test: {
    type: Boolean,
    required: true,
    default: false
  },
  external: {
    type: Schema.Types.Mixed,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  dateIssued:{
    type: Date,
    required: false
  },
  dateRejected:{
    type: Date,
    required: false
  },
  dateRevoked:{
    type: Date,
    required: false
  },
  applicationAuthor: {
    type: Schema.Types.ObjectId,
    ref: "Applicant"
  },
  applicationOwner: {
    type: Schema.Types.ObjectId,
    ref: "Applicant",
    required: true
  },
  applicationOwnerIdNo: {
    type: String,
    required: true
  },
  applicationAuthorIdNo: {
    type: String,
    required: true
  },
  applicationFeeDetails: {
    type: {
      amount: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      ppmRef: {
        type: String,
        required: true
      },
      paymentName: {
        type: String,
        required: true
      },
      applicationRef: {
        type: String,
        required: true
      }
    },
    required: false
  },
  issuanceFeeDetails: {
    type: {
      amount: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      ppmRef: {
        type: String,
        required: true
      },
      paymentName: {
        type: String,
        required: true
      },
      applicationRef: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true,
        default: Date.now
      }
    },
    required: false
  },
  paymentDetails: {
    type: Schema.Types.Mixed,
    required: false
  },
  paymentStatus: {
    type: String,
    required: true
  },
  isPaymentRequired: {
    type: Boolean,
    required: true
  },
  applicationDetails: {
    type: Schema.Types.Mixed,
    required: true
  },
  issuanceFeeStatus: {
    type: String,
    required: true,
    default: "NOT_REQUESTED"
  },
  issuanceDetails: {
    type: Schema.Types.Mixed,
    required: true,
    default: {}
  },
  rejectionDetails: {
    type: {
      message: {
        type: String,
        required: true
      },
      reason: {
        type: String,
        required: true
      }
    },
    required: false,
  },
  certificate: {
    type: Schema.Types.ObjectId,
    ref: "Certificate"
  },
  applicationFixes: {
    type: ApplicationFormAmmendmentsSchema,
    default: null
  },
  serviceCode: {
    type: String,
    required: true
  },
  reviewProcess: {
    type: Schema.Types.Mixed,
    required: true
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  serviceConfig: {
    type: Schema.Types.ObjectId,
    ref: "ServiceConfig",
    required: true
  },
  activity: [ApplicationActivitySchema],
  reviewStatus: {
    type: ApplicationReviewStatusSchema,
    required: true,
    default: {
      stage: 0,
      checked: false
    }
  }
}, { timestamps: true });


ApplicationSchema.methods.requestIssuancePayment = (reqPaymentObj) => {
  const application = this;
  application.status = 'payment-requested';
  application.paymentDetails = reqPaymentObj;
};

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;