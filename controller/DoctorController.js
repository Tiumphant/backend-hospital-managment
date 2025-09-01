const Doctor = require("../model/DoctorModel");
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Error handler
const handleError = (res, error) =>
  res.status(500).json({ message: "Error", error: error.message });

/* -------------------- CREATE DOCTOR -------------------- */
router.post("/role", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, description } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({
        message: "Name, email, and password are required",
      });

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor)
      return res.status(400).json({ message: "Email already exists" });

    const doctorData = { name, email, password, description };
    if (req.file) doctorData.image = `/uploads/${req.file.filename}`;

    const doctor = await Doctor.create(doctorData);
    res.status(201).json({ message: "Doctor created", data: doctor });
  } catch (error) {
    handleError(res, error);
  }
});

/* -------------------- GET ALL DOCTORS -------------------- */
router.get("/role", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors); // returns array of doctors
  } catch (error) {
    handleError(res, error);
  }
});

/* -------------------- GET ONE DOCTOR -------------------- */
router.get("/role/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    handleError(res, error);
  }
});

/* -------------------- UPDATE DOCTOR -------------------- */
router.put("/role/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, description } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (name) doctor.name = name;
    if (email) doctor.email = email;
    if (password) doctor.password = password;
    if (description) doctor.description = description;
    if (req.file) doctor.image = `/uploads/${req.file.filename}`;

    await doctor.save();
    res.json({ message: "Doctor updated", data: doctor });
  } catch (error) {
    handleError(res, error);
  }
});

/* -------------------- DELETE DOCTOR -------------------- */

router.delete("/role/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/role/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // For demo, plain password check (use bcrypt in real app)
    if (doctor.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    // Return token or doctor info
    res.json({
      message: "Login successful",
      doctor,
      token: "dummy-token-for-now",
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

module.exports = router;
