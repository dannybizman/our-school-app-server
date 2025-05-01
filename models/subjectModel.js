const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
   name: { type: String, unique: true, required: true },
   school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
 });
 
 module.exports = mongoose.model("Subject", SubjectSchema);
   