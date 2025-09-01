const Departments = require("../model/DeparmentModel");
const express = require("express");
const route = express.Router();
const cors = require("cors");

route.use(cors());
route.use(express.json());

const handleError = (res, error) => {
  console.log(error);
  res.status(500).json({ message: "error", error: error.message });
};
route.get("/department", async (req, res) => {
  try {
    const department = await Departments.find().populate(
      "head_doctor_id",
      "name"
    );
    res.status(200).json(department);
  } catch (err) {
    handleError(res, err);
  }
});

route.get("/department/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const department = await Departments.findById(req.params.id);
    console.log("Department data:", department);
    res.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Error fetching department", error });
  }
});

route.get("/department/search/:key", async (req, res) => {
  try {
    const key = req.params.key;
    let insensitive = new RegExp(key, "i");
    let result = await Departments.find({
      $or: [
        { name: { $regex: insensitive } },
        { description: { $regex: insensitive } },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
});

route.put("/department/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await Departments.updateOne({ _id: id }, updateData);
    if (result.modifiedCount > 0) {
      res
        .status(200)
        .json({ message: "department updated successfully", data: result });
    } else {
      res.status(404).json({ message: "no change" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

route.post("/department", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { name, description, head_doctor_id } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newDepartment = new Departments({
      name,
      description,
      head_doctor_id,
    });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Error saving department:", error);
    res.status(500).json({ message: "Server error" });
  }
});

route.delete("/department/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Departments.findByIdAndDelete(id);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = route;
