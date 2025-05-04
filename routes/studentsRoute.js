const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authorizeRoles = require("../middleware/authorizeRoles")
const Student = require("../models/studentModel");
const cloudinary = require("cloudinary");

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });



module.exports = (upload) => {
   // Update Student Profile (with avatar upload)
   router.put("/:id", authorizeRoles(["student", "admin"]),  upload.single("avatar"), async (req, res) => {
     try {
       const { name, surname, phone, address, password } = req.body;
       let updatedFields = { name, surname, phone, address };
 
       // Handle avatar upload
       if (req.file) {
         const uploadResult = await new Promise((resolve, reject) => {
           cloudinary.v2.uploader.upload_stream({ folder: "student-avatars" }, (error, result) => {
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
 
       const updatedStudent = await Student.findByIdAndUpdate(req.user.id, updatedFields, { new: true }).select("-password").populate("school");
 
       res.json({ success: true, student: updatedStudent });
     } catch (error) {
       res.status(500).json({ success: false, message: error.message });
     }
   });


   // Student Login
router.post("/login", async (req, res) => {
   try {
     const { email, password } = req.body;
     const student = await Student.findOne({ email }).populate("school");
 
     if (!student || !(await bcrypt.compare(password, student.password))) {
       return res.status(400).json({ success: false, message: "Invalid credentials." });
     }
 
     const token = jwt.sign({ id: student._id, role: "student", school: student.school }, process.env.JWT_SECRET, { expiresIn: "7d" });
     res.json({ success: true, token, student });
   } catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
 });
 
 // Get Logged-in Student
 router.get("/get-logged-in-student", authorizeRoles(["student","admin", "teacher" ]),  async (req, res) => {
   try {
     const student = await Student.findById(req.user.id).select("-password").populate("school");
     res.json({ success: true, student });
   } catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
 });

// Get All Students
router.get("/all", authorizeRoles(["teacher","student", "admin"]), async (req, res) => {
  try {
    const students = await Student.find({ school: req.user.school })
      .select("-password")
      .populate("school") 
      .populate("classId", "name gradeLevel");

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Get Student by ID
router.get("/:id", authorizeRoles(["student", "admin", "teacher"]), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password").populate("school") ;
    if (!student) return res.status(404).json({ success: false, message: "student not found" });

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Delete Student (Admin only)
router.delete("/delete/:id", authorizeRoles(["admin"]),  async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id).populate("school");
    if (!deletedStudent) return res.status(404).json({ success: false, message: "Student not found" });

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

 
   return router;
 };

