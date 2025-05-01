const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
   title: String,
   description: String,
   startTime: Date,
   endTime: Date,
   school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
   classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
   createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });
 
 module.exports = mongoose.model("Announcement", AnnouncementSchema); 
  