const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
   title: String,
   startDate: Date,
   endDate: Date,
   school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
   lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
 });
 
 module.exports = mongoose.model("Assignment", AssignmentSchema);
  