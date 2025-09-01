const express = require("express");
const Appointment = require("../model/Appointmentmodel");
const router = express.Router();

router.use(express.json());

router.get("/appointment", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient_id", "name")
      .populate("doctor_id", "name")
      .populate("department_id", "name");

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while fetching appointments",
      error: err.message,
    });
  }
});

router.get("/appointment/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient_id", "firstName lastName age gender")
      .populate("doctor_id", "name specialization")
      .populate("department_id", "name");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching appointment",
      error: err.message,
    });
  }
});

router.post("/appointment", async (req, res) => {
  try {
    let appointment = new Appointment(req.body);
    await appointment.save();

    appointment = await appointment
      .populate("patient_id", "firstName lastName")
      .populate("doctor_id", "name specialization")
      .populate("department_id", "name");

    res.status(201).json({
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create appointment",
      error: err.message,
    });
  }
});

router.put("/appointment/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("patient_id", "firstName lastName")
      .populate("doctor_id", "name specialization")
      .populate("department_id", "name");

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update appointment",
      error: err.message,
    });
  }
});

router.delete("/appointment/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment deleted successfully",
      deleted,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete appointment",
      error: err.message,
    });
  }
});

module.exports = router;
