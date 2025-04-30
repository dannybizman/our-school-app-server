const router = require("express").Router();
const Result = require("../models/resultModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authorizeRoles(["teacher"]), async (req, res) => {
  try {
    const result = new Result(req.body);
    const saved = await result.save();
    const populated = await Result.findById(saved._id).populate("studentId examId assignmentId testId");
    res.status(201).json({ success: true, result: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all", authorizeRoles(["teacher", "student", "parent"]), async (req, res) => {
  try {
    const results =await Result.find()
    .populate({
      path: "studentId", select: "firstName lastName avatar"
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

router.get("/:id", authorizeRoles(["teacher", "student", "parent"]), async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("studentId examId assignmentId testId");
    if (!result) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:id", authorizeRoles(["teacher"]), async (req, res) => {
  try {
    const updated = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, result: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deleted = await Result.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
