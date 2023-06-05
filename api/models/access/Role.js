const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
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
  permissions: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;

