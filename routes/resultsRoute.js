const router = require("express").Router();
const Result = require("../models/resultModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authorizeRoles(["admin","teacher"]), async (req, res) => {
  try {
    const result = new Result( { ...req.body,
      school: req.user.school,});
    const saved = await result.save();
    const populated = await Result.findById(saved._id).populate("studentId examId assignmentId testId school");
    res.status(201).json({ success: true, result: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const results =await Result.find({ school: req.user.school })
    .populate({
      path: "studentId", select: "firstName lastName avatar"
    })
    .populate({
      path: "school", select: "schoolName"
    })
    .populate({
      path: "examId",
      populate: { path: "subjectId" }
    })
    .populate({
      path: "assignmentId",
      populate: {
        path: "lessonId",
        populate: [
          { path: "subjectId" },
          { path: "classId" },
          { path: "teacherId" }
        ]
      }
    })
    .populate({
      path: "testId",
      populate: {
        path: "lessonId",
        populate: [
          { path: "subjectId" },
          { path: "classId" },
          { path: "teacherId" }
        ]
      }
    });  
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("studentId examId assignmentId testId school");
    if (!result) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const updated = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("school");
    if (!updated) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, result: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deleted = await Result.findByIdAndDelete(req.params.id).populate("school");
    if (!deleted) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
