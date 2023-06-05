const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  senderId:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  read:{
    type: Boolean,
    required: true,
    default: false
  },
  lastMessage:{
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true });


const Thread = mongoose.model('Thread', ThreadSchema);
module.exports = Thread;