// routes/summary.js
const express = require("express");
const Doctor = require("../model/DoctorModel");
const Patient = require("../model/PatientModel");
const Appointment = require("../model/AppointmentModel");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      success: true,
      summary: {
        doctors: totalDoctors,
        patients: totalPatients,
        appointments: totalAppointments,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
