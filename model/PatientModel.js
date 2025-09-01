const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  number: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
});

module.exports =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
