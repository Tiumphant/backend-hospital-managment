const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  head_doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
});

module.exports = mongoose.model("Department", DepartmentSchema);
