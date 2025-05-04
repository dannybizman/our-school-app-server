const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
   name: { type: String, required: true },
   capacity: Number,
   school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
   supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
   gradeLevel: Number,
  
 });
 
// Compound unique index on (school, name)
ClassSchema.index({ school: 1, name: 1 }, { unique: true });

 module.exports = mongoose.model("Class", ClassSchema); 
    