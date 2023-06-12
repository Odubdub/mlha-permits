const mongoose = require('mongoose');
const sendMessage = require('../../helpers/notifications');
const Applicant = require('../applicants/applicant.model');

const notificationSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    read: {
      type: Boolean,
      required: true,
      default: false
    },
    serviceCode: {
      type: String,
      required: true
    },
    application_id: {
      type: String,
      required: true
    },
    status_code: {
      type: String,
      required: true
    },
    form_payload: {
      type: [Object],
      default: [],
      required: true
    },
    status_alias: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    attachments: {
      type: [Object],
      required: true,
      default: []
    },
    user_id: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    dismissed: {
      type: Boolean,
      required: true,
      default: false
    },
    response_type: {
      default: 'Notification',
      type: String,
      required: true
    },
    push_payment: {
      default: {},
      type: Object,
      required: false
    },
    push_service: {
      default: String,
      type: Object,
      required: false
    },
    rich_text_message: {
      type: String,
      required: false
    },
    application_id: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

notificationSchema.post('save', function (doc) {
  Applicant.findOne({ idNo: doc.user_id })
    .then((user) => {
      console.log(user);
      sendMessage(`+267${user.primaryPhoneNumber}`, doc.message);
    })
    .catch((err) => {});
});

module.exports = mongoose.model('notification', notificationSchema);
