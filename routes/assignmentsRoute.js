const router = require("express").Router();
const Assignment = require("../models/assignmentModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const assignment = new Assignment( {    ...req.body,
      school: req.user.school,});
    const saved = await assignment.save();
    const populated = await Assignment.findById(saved._id).populate("lessonId");
    res.status(201).json({ success: true, assignment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const assignments = await Assignment.find({ school: req.user.school }).populate({
      path: "lessonId",
      populate: [
        { path: "subjectId", select: "name" },
        { path: "teacherId", select: "firstName lastName avatar" },
        { path: "classId", select: "name" },
        { path: "school", select: "schoolName" }
      ],
    });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate("lessonId school");
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:id", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("lessonId school");
    if (!updated) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.json({ success: true, assignment: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
