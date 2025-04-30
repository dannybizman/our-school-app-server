const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: false },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: false },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: false },
  examScore: { type: Number, default: 0 },
  testScore: { type: Number, default: 0 },
  assignmentScore: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", ResultSchema);
