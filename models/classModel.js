const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
   name: { type: String, unique: true, required: true },
   capacity: Number,
   school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
   supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
   gradeLevel: Number,
  
 });
 
 module.exports = mongoose.model("Class", ClassSchema); 
    