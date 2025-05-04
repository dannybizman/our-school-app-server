const router = require("express").Router();
const Class = require("../models/classModel");
const authorizeRoles = require("../middleware/authorizeRoles");
const Teacher = require("../models/teacherModel");

// Create a Class
router.post("/create", authorizeRoles(["admin","teacher"]), async (req, res) => {
  try {
    const created = await Class.create( {    ...req.body,
      school: req.user.school,});
    const populated = await Class.findById(created._id).populate("supervisorId school");
    res.status(201).json({ success: true, class: populated }); // Fixed variable
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



// Get All Classes
router.get("/all", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const classes = await Class.find({ school: req.user.school }).populate("supervisorId school");
    res.json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}); 

// Get Class by ID
router.get("/:id", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate("supervisorId school");
    if (!classData) return res.status(404).json({ success: false, message: "Class not found" });

    res.json({ success: true, class: classData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Class
router.put("/:id", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    // Find the existing class before updating it
    const existingClass = await Class.findById(req.params.id);
    if (!existingClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("school");
    
    // If the supervisor was changed, remove class from the previous supervisor
    if (req.body.supervisorId && req.body.supervisorId !== String(existingClass.supervisorId)) {
      // Remove from old supervisor's classes
      await Teacher.findByIdAndUpdate(existingClass.supervisorId, {
        $pull: { classes: existingClass._id },
      });
      // Add to new supervisor's classes
      await Teacher.findByIdAndUpdate(req.body.supervisorId, {
        $addToSet: { classes: updatedClass._id },
      });
    }

    res.json({ success: true, class: updatedClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Delete Class
router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id).populate("supervisorId school");
    if (!deletedClass) return res.status(404).json({ success: false, message: "Class not found" });

    res.json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
