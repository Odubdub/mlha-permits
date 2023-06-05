const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
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
    },
    ministry: {
      type: Schema.Types.ObjectId,
      ref: "Ministry",
      required: true
    }
  }, { timestamps: true 
});

const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;

