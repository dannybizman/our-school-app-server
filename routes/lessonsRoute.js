const router = require("express").Router();
const Lesson = require("../models/lessonModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const lesson = new Lesson( {    ...req.body,
      school: req.user.school,});
    const savedLesson = await lesson.save();
    const populated = await Lesson.findById(savedLesson._id).populate("subjectId classId teacherId school") ;
    res.status(201).json({ success: true, lesson: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/all", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const lessons = await Lesson.find({ school: req.user.school }).populate("subjectId classId teacherId school");
    res.json({ success: true, lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("subjectId classId teacherId school");
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("subjectId classId teacherId school");
    if (!updatedLesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    res.json({ success: true, lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id).populate("subjectId classId teacherId school");
    if (!deletedLesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    res.json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
