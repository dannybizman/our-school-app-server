const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
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
   email: {  type: String,
    required: true,
    trim: true,
    unique: true, },
   phoneNumber: { type: String, unique: true, trim: true },
   address: {
    type: String,
    trim: true,
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
   bloodType: {
    type: String,
    trim: true,
  },
   sex: { type: String, enum: ["MALE", "FEMALE"], required: true },
   birthday: {
    type: Date,
    trim: true,
  },
   createdAt: { type: Date, default: Date.now },
   subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
   role: { type: String, enum: ["teacher"], default: "teacher" }
 });
 
 module.exports = mongoose.model("Teacher", TeacherSchema);
 
 