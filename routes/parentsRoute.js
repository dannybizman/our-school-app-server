const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Parent = require("../models/parentModel");
const authorizeRoles = require("../middleware/authorizeRoles");



  // Update Parent Profile 
  module.exports = (upload) => {
    router.put("/update-profile", authorizeRoles(["admin", "teacher", "parent"]), upload.single("avatar"), async (req, res) => {
      try {
        const { name, surname, phone, address, password } = req.body;
        let updatedFields = { name, surname, phone, address };
  
        // Handle avatar upload
        if (req.file) {
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ folder: "parent-avatars" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }).end(req.file.buffer);
          });
  
          updatedFields.avatar = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
          };
        }
        // Handle password change 
        if (password && password.length >= 6) {
          updatedFields.password = await bcrypt.hash(password, 10);
        }
  
        const updatedParent = await Parent.findByIdAndUpdate(req.user.id, updatedFields, { new: true }).select("-password");
  
        res.json({ success: true, parent: updatedParent });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
 


// Parent Login
router.post("/login",  async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await Parent.findOne({ email }).populate("school") ;

    if (!parent || !(await bcrypt.compare(password, parent.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: parent._id, role: "parent", school: parent.school }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Logged-in Parent 
router.get("/get-logged-in-parent", authorizeRoles(["admin", "parent"]), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user.id).select("-password").populate("school") ;
    res.json({ success: true, parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Parents
router.get("/all", authorizeRoles(["admin", "parent"]), async (req, res) => {
 try {
   const parents = await Parent.find({ school: req.user.school }).select("-password").populate("school") ;
   res.json({ success: true, parents });
 } catch (error) {
   res.status(500).json({ success: false, message: error.message });
 }
});

// Get Parent by ID
router.get("/:id", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
 try {
   const parent = await Parent.findById(req.params.id).select("-password").populate("school") ;
   if (!parent) return res.status(404).json({ success: false, message: "Parent not found" });

   res.json({ success: true, parent });
 } catch (error) {
   res.status(500).json({ success: false, message: error.message });
 }
});


// Delete Parent (Admin only)
router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
 try {
   const deletedParent = await Parent.findByIdAndDelete(req.params.id);
   if (!deletedParent) return res.status(404).json({ success: false, message: "Parent not found" });

   res.json({ success: true, message: "Parent deleted successfully" });
 } catch (error) {
   res.status(500).json({ success: false, message: error.message });
 }
});


return router;
};

