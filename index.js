require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/config.js");
const PatientController = require("./controller/PatientController.js");
const DoctorController = require("./controller/DoctorController.js");
const UserController = require("./controller/UserController.js");
const AppointmentController = require("./controller/AppointmentController.js");
const DepartmentController = require("./controller/DepartmentController.js");
const SummaryController = require("./controller/summaryController.js");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api",
  UserController,
  DoctorController,
  PatientController,
  AppointmentController,
  SummaryController,
  DepartmentController
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("This is the server");
});

console.log("🔌 Calling connectDB()...");
connectDB().then(() => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
