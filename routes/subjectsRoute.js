const router = require("express").Router();
const Subject = require("../models/subjectModel");
const authorizeRoles = require("../middleware/authorizeRoles");


router.post("/create", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const subject = new Subject({
      ...req.body,
      school: req.user.school,
    });

    const savedSubject = await subject.save();
    const populated = await Subject.findById(savedSubject._id).populate("school");

    res.status(201).json({ success: true, subject: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all", authorizeRoles([ "admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const subjects = await Subject.find({ school: req.user.school }).populate("school");
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id",  authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("school");
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    Subject.findByIdAndUpdate(req.params.id, req.body);
    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("school");
res.json({ success: true, subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete("/delete/:id",  authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id).populate("school");
    if (!deletedSubject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
