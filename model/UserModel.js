const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  gender: { type: String },
  role: { type: String, enum: ["patient", "doctor", "admin"] },
  details: { type: mongoose.Schema.Types.Mixed },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
