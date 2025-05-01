const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
   username: { type: String, unique: true, required: true },
   firstName: String,
   lastName: String,
   address: String,
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
   bloodType: String,
   school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },

   sex: { type: String, enum: ["MALE", "FEMALE"], required: true },
   createdAt: { type: Date, default: Date.now },
   classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
   role: { type: String, enum: ["student"], default: "student" }
 },
 { timestamps: true } 
 );
 
 module.exports = mongoose.model("Student", StudentSchema);
 