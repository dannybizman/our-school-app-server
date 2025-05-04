const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
});

// Compound unique index on (school, name)
SubjectSchema.index({ school: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Subject", SubjectSchema);
