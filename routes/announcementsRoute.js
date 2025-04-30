const router = require("express").Router();
const Announcement = require("../models/announcementModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create",  authorizeRoles(["teacher"]), async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    const saved = await announcement.save();
    res.status(201).json({ success: true, announcement: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}); 

router.get("/all",  authorizeRoles(["teacher", "student", "parent" ]), async (req, res) => {
  try { 
    const announcements = await Announcement.find().populate("classes");
    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id",  authorizeRoles(["teacher", "student", "parent"]), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate("classes");
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found" });
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:id",  authorizeRoles(["teacher"]), async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Announcement not found" });
    res.json({ success: true, announcement: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id",  authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Announcement not found" });
    res.json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
