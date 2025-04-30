const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema({
   username: { type: String, unique: true, required: true },
   name: String,
   surname: String,
   password: {
    type: String, 
    required: true,
    min: 6,
    max: 64,
  },
   email: { type: String, unique: true, sparse: true },
   phone: { type: String, unique: true, required: true },
   address: String,
   createdAt: { type: Date, default: Date.now },
   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
   role: { type: String, enum: ["parent"], default: "parent" }
 });
 
 module.exports = mongoose.model("Parent", ParentSchema);
  