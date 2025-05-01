const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema({
   username: { type: String, unique: true, required: true },
   firstName: {
    type: String,
    required: true, 
    trim: true,
    maxLength: 32,
  },
  lastName: {  type: String,
    required: true,
    trim: true, 
    maxLength: 32,
  },
   password: {
    type: String, 
    required: true,
    min: 6,
    max: 64,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
  },
  email: {  type: String,
    required: true,
    trim: true,
    unique: true, },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },

   phoneNumber: { type: String, unique: true, trim: true },
   address: {
    type: String,
    trim: true,
  },
  sex: { type: String, enum: ["MALE", "FEMALE"], required: true },
  birthday: {
   type: Date,
   trim: true,
 },
   createdAt: { type: Date, default: Date.now },
   students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
   role: { type: String, enum: ["parent"], default: "parent" }
 });
 
 module.exports = mongoose.model("Parent", ParentSchema);
  