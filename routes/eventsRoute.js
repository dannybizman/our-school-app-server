const router = require("express").Router();
const Event = require("../models/eventModel");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authorizeRoles(["admin","teacher"]), async (req, res) => {
  try {
    const event = new Event( {    ...req.body,
      school: req.user.school,});
    const savedEvent = await event.save();
    const populated = await Event.findById(savedEvent._id).populate("classes school");
    res.status(201).json({ success: true, event: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/all", authorizeRoles(["admin","teacher", "student", "parent"]), async (req, res) => {
  try {
    const events = await Event.find({ school: req.user.school }).populate("classes school"); 
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/:id", authorizeRoles(["admin","teacher", "student", "parent"]), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("classes school");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:id", authorizeRoles(["admin","teacher"]), async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
