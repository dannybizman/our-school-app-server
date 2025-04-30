const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const dbConfig = require("./config/dbConfig");

// Middleware
app.use(cors());


// Increase payload size limit to 1GB for JSON and URL-encoded data
app.use(bodyParser.json({ limit: "1gb" }));
app.use(bodyParser.urlencoded({ limit: "1gb", extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 },
});

// Routes
const adminsRoute = require("./routes/adminsRoute")(upload);
const teachersRoute = require("./routes/teachersRoute")(upload);
const studentsRoute = require("./routes/studentsRoute")(upload);
const parentsRoute = require("./routes/parentsRoute");
const classRoute = require("./routes/classRoute");
const lessonsRoute = require("./routes/lessonsRoute");
const resultsRoute = require("./routes/resultsRoute");
const eventsRoute = require("./routes/eventsRoute");
const announcementsRoute = require("./routes/announcementsRoute");
const assignmentsRoute = require("./routes/assignmentsRoute");
const examsRoute = require("./routes/examsRoute");
const subjectsRoute = require("./routes/subjectsRoute");
const attendancesRoute = require("./routes/attendancesRoute");
const testsRoute = require("./routes/testsRoute");
// Apply routes
app.use("/api/admins", adminsRoute);
app.use("/api/teachers", teachersRoute);
app.use("/api/students", studentsRoute);
app.use("/api/parents", parentsRoute);
app.use("/api/class", classRoute);
app.use("/api/lessons", lessonsRoute);
app.use("/api/exams", examsRoute);
app.use("/api/results", resultsRoute);
app.use("/api/events", eventsRoute);
app.use("/api/announcements", announcementsRoute);
app.use("/api/assignments", assignmentsRoute);
app.use("/api/subjects", subjectsRoute);
app.use("/api/attendances", attendancesRoute);
app.use("/api/tests", testsRoute);

const port = process.env.PORT || 5001;


app.listen(port, () => console.log(`Node JS server listening on port ${port}`));