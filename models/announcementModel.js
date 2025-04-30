const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
   title: String,
   description: String,
   startTime: Date,
   endTime: Date,
   classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
   createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });
 
 module.exports = mongoose.model("Announcement", AnnouncementSchema); 
  