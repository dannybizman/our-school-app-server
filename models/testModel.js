const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
   title: String,
   startDate: Date,
   endDate: Date,
   lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
 });
 
 module.exports = mongoose.model("Test", TestSchema);
  