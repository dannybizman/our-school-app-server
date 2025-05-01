
const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
   schoolName: String,
   admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
 },
 { timestamps: true }
 );
 
 module.exports = mongoose.model("School", SchoolSchema);