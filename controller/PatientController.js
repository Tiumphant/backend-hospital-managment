const express = require("express");
const router = express.Router();
const multer = require("multer");
const Patient = require("../model/patientModel");

router.use(express.json());

// -------------------- Multer storage --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Make sure 'uploads' folder exists
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// -------------------- GET ALL PATIENTS --------------------
router.get("/patient", async (req, res) => {
  try {
    const patients = await Patient.find().populate(
      "assignedDoctor",
      "name email"
    );
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// -------------------- GET ONE PATIENT --------------------
router.get("/patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "assignedDoctor",
      "name email"
    );
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching patient", error: err.message });
  }
});

// -------------------- SEARCH PATIENT --------------------
router.get("/patient/search/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const regex = new RegExp(key, "i");
    const patients = await Patient.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { number: { $regex: regex } },
      ],
    }).populate("assignedDoctor", "name email");
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// -------------------- CREATE PATIENT --------------------
router.post("/patient", upload.single("image"), async (req, res) => {
  try {
    const patient = new Patient({
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    await patient.save();
    res.status(201).json({ message: "Patient created", data: patient });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// -------------------- UPDATE PATIENT --------------------
router.put("/patient/:id", upload.single("image"), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const { name, email, number, age, gender, address, assignedDoctor } =
      req.body;

    if (name) patient.name = name;
    if (email) patient.email = email;
    if (number) patient.number = number;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (address) patient.address = address;
    if (assignedDoctor) patient.assignedDoctor = assignedDoctor;
    if (req.file) patient.image = `/uploads/${req.file.filename}`;

    await patient.save();
    res.status(200).json({ message: "Patient updated", data: patient });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// -------------------- DELETE PATIENT --------------------
router.delete("/patient/:id", async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
