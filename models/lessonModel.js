const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
   name: String,
   day: { type: String, enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], required: true },
   startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
   classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
 });
 
 module.exports = mongoose.model("Lesson", LessonSchema);
    