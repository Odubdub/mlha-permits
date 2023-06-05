const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  messageId: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  threadId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  sender: {
    type: Object,
    required: false
  }
}, { timestamps: true });

const Message = mongoose.model('Query', MessageSchema);
module.exports = Message;
