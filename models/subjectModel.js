const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
   name: { type: String, unique: true, required: true },
 });
 
 module.exports = mongoose.model("Subject", SubjectSchema);
   