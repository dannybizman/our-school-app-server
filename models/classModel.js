const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
   name: { type: String, unique: true, required: true },
   capacity: Number,
   supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
   gradeLevel: Number,
  
 });
 
 module.exports = mongoose.model("Class", ClassSchema); 
    