const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
   title: String,
   startTime: Date,
   endTime: Date,
   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
 });
 
 module.exports = mongoose.model("Exam", ExamSchema);
 