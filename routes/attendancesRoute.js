const router = require("express").Router();
const Attendance = require("../models/attendanceModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const attendance = new Attendance( {    ...req.body,
      school: req.user.school,});
    const saved = await attendance.save();
    const populated = await Attendance.findById(saved._id).populate("studentId lessonId school");
    res.status(201).json({ success: true, attendance: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/all", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const records = await Attendance.find({ school: req.user.school })
      .populate("studentId school")
      .populate({
        path: "lessonId",
        populate: {
          path: "classId",
          select: "name" // or whatever your class model name is
        }
      });

    res.json({ success: true, attendances: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/:id", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id).populate("studentId lessonId school");
    if (!record) return res.status(404).json({ success: false, message: "Attendance not found" });
    res.json({ success: true, attendance: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", authorizeRoles(["admin", "teacher", "student"]), async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("studentId lessonId school");
    if (!updated) return res.status(404).json({ success: false, message: "Attendance not found" });
    res.json({ success: true, attendance: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id).populate("studentId lessonId school");
    if (!deleted) return res.status(404).json({ success: false, message: "Attendance not found" });
    res.json({ success: true, message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
