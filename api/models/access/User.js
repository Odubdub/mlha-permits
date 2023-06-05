// generate a monnoose schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var crypto = require('crypto');

const UserSchema = new Schema({
  lastName: {
    type: String,
    // required: true
  },
  foreNames: {
    type: String,
    // required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['admin', 'superadmin', 'developer']
  },
  email: {
    type: String,
    required: true
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: "Role"
  }],
  status: {
    type: String,
    required: true,
    default: 'Inactive',
    enum: ['Active', 'Inactive']
  },
  idType: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  hasSignature: {
    type: Boolean,
    default: false
  },
  signature: {
    type: String,
    required: false
  },
  department: {
    ref: "Department",
    type: Schema.Types.ObjectId
  },
  designation: {
    type: String,
    required: true
  },
  appointedBy: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  salt: {
    type: String
  },
  hashed_password: {
    type: String
  },
  registrationToken: {
    type: String
  }
}, { timestamps: true });

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hashed_password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
}

UserSchema.methods.validPassword = function(password) {
  if (!this.salt || !this.hashed_password) return false
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hashed_password === hash;
}

// activate user
UserSchema.methods.activate = function() {
  this.status = 'Active';
  this.registrationToken = null;
}

const User = mongoose.model("User", UserSchema);
module.exports = User;