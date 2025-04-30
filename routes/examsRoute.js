const router = require("express").Router();
const Exam = require("../models/examModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authorizeRoles(["teacher"]), async (req, res) => {
  try {
    const exam = new Exam(req.body);
    const savedExam = await exam.save();
    const populated = await Exam.findById(savedExam._id).populate("subjectId");
    res.status(201).json({ success: true, exam: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/all", authorizeRoles(["teacher", "student", "parent"]), async (req, res) => {
  try {
    const exams = await Exam.find().populate("subjectId");
    res.json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", authorizeRoles(["teacher", "student", "parent"]), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("subjectId");
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:id", authorizeRoles(["teacher"]), async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExam) return res.status(404).json({ success: false, message: "Exam not found" });
    res.json({ success: true, exam: updatedExam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) return res.status(404).json({ success: false, message: "Exam not found" });
    res.json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
