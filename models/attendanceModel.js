const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
   date: Date,
   present: Boolean,
   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
   lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
 });
 
 module.exports = mongoose.model("Attendance", AttendanceSchema);
 