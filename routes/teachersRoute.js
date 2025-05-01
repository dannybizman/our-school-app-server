const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authorizeRoles = require("../middleware/authorizeRoles")
const Teacher = require("../models/teacherModel");
const cloudinary = require("cloudinary");

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 }); 
 
module.exports = (upload) => {
   // Update Teacher Profile (with avatar upload)
   router.put("/update-profile", authorizeRoles(["admin", "teacher"]), upload.single("avatar"), async (req, res) => {
     try {
       const { name, surname, phone, address, password } = req.body;
       let updatedFields = { name, surname, phone, address };
 
       // Handle avatar upload
       if (req.file) {
         const uploadResult = await new Promise((resolve, reject) => {
           cloudinary.v2.uploader.upload_stream({ folder: "teacher-avatars" }, (error, result) => {
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
 
       const updatedTeacher = await Teacher.findByIdAndUpdate(req.user.id, updatedFields, { new: true }).select("-password");
 
       res.json({ success: true, teacher: updatedTeacher });
     } catch (error) {
       res.status(500).json({ success: false, message: error.message });
     }
   });


// Teacher Login
router.post("/login",  async (req, res) => {
   try {
     const { email, password } = req.body;
     const teacher = await Teacher.findOne({ email }).populate("school") ;
 
     if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
       return res.status(400).json({ success: false, message: "Invalid credentials." });
     }
 
     const token = jwt.sign({ id: teacher._id, role: "teacher",  school: teacher.school }, process.env.JWT_SECRET, { expiresIn: "7d" });
     res.json({ success: true, token, teacher });
   } catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
 });
  
 // Get Logged-in Teacher
 router.get("/get-logged-in-teacher", authorizeRoles(["teacher"]), async (req, res) => {
   try {
     const teacher = await Teacher.findById(req.user.id).select("-password").populate("school") ;
     res.json({ success: true, teacher });
   } catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
 });


 

 // Get All Teachers
router.get("/all", authorizeRoles(["admin", "teacher", "student", "parent"]),  async (req, res) => {
  try {
    const teachers = await Teacher.find({ school: req.user.school }).select("-password").populate("school") ;
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Teacher by ID
router.get("/:id", authorizeRoles(["admin", "teacher", "student", "parent"]), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password").populate("school") ;
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });

    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Delete Teacher 
router.delete("/delete/:id", authorizeRoles(["admin"]), async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) return res.status(404).json({ success: false, message: "Teacher not found" });

    res.json({ success: true, message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
   return router;
 };
