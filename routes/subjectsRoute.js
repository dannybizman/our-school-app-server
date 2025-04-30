const router = require("express").Router();
const Subject = require("../models/subjectModel");
const authorizeRoles = require("../middleware/authorizeRoles");


router.post("/create", authorizeRoles(["teacher"]), async (req, res) => {
  try {
   
    // Create and save the subject
    const subject = new Subject(req.body); 
    const savedSubject = await subject.save();

    res.status(201).json({ success: true, subject: savedSubject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all", authorizeRoles(["teacher", "student", "parent"]), async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id",  authorizeRoles(["teacher", "student", "parent"]), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:id", authorizeRoles(["teacher"]), async (req, res) => {
  try {
    Subject.findByIdAndUpdate(req.params.id, req.body);
    const updated = await Subject.findById(req.params.id);
    res.json({ success: true, subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete("/delete/:id",  authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
