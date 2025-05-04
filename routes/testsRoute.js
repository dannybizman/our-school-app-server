const router = require("express").Router();
const Test = require("../models/testModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create",  authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const test = new Test(  
  {    ...req.body,
      school: req.user.school,} );
    const saved = await test.save();
    const populated = await Test.findById(saved._id).populate("lessonId school");
    res.status(201).json({ success: true, test: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all",  authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const tests = await Test.find({ school: req.user.school }).populate({
      path: "lessonId",
      populate: [
        { path: "subjectId", select: "name" },
        { path: "teacherId", select: "firstName lastName avatar" },
        { path: "classId", select: "name" },
        {path: "school", select: "schoolName" }
      ]
    }).populate("school") ;
    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id",  authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("lessonId school");
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id",  authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("lessonId school");
    if (!updated) return res.status(404).json({ success: false, message: "Test not found" });
    res.json({ success: true, test: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id",  authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deleted = await Test.findByIdAndDelete(req.params.id).populate("lessonId school");
    if (!deleted) return res.status(404).json({ success: false, message: "Test not found" });
    res.json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
